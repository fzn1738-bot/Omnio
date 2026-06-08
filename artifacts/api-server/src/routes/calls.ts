import { Router, type IRouter } from "express";
import { desc, eq, gte, sql } from "drizzle-orm";
import { db, callsTable } from "@workspace/db";
import {
  ListCallsQueryParams,
  GetCallParams,
  GetCallStatsQueryParams,
} from "@workspace/api-zod";

const router: IRouter = Router();

router.get("/calls/stats", async (req, res): Promise<void> => {
  const query = GetCallStatsQueryParams.safeParse(req.query);
  const days = query.success ? (query.data.days ?? 30) : 30;

  const since = new Date();
  since.setDate(since.getDate() - days);

  const calls = await db
    .select()
    .from(callsTable)
    .where(gte(callsTable.createdAt, since))
    .orderBy(desc(callsTable.createdAt));

  const totalCalls = calls.length;
  const inbound = calls.filter((c) => c.direction === "inbound").length;
  const outbound = calls.filter((c) => c.direction === "outbound").length;
  const completed = calls.filter((c) => c.status === "completed");
  const avgDuration =
    completed.length > 0
      ? completed.reduce((s, c) => s + (c.duration ?? 0), 0) / completed.length
      : 0;
  const avgSentiment =
    calls.filter((c) => c.sentiment !== null).length > 0
      ? calls
          .filter((c) => c.sentiment !== null)
          .reduce((s, c) => s + (c.sentiment ?? 0), 0) /
        calls.filter((c) => c.sentiment !== null).length
      : 0;
  const timeSaved = Math.floor(totalCalls * 4.2);
  const revenueOnHours = completed.filter((c) => {
    const h = new Date(c.createdAt).getHours();
    return h >= 9 && h < 17;
  }).length * 89;
  const revenueAfterHours = completed.filter((c) => {
    const h = new Date(c.createdAt).getHours();
    return h < 9 || h >= 17;
  }).length * 89;
  const completionRate = totalCalls > 0 ? (completed.length / totalCalls) * 100 : 0;

  // Group by day
  const dayMap = new Map<string, { inbound: number; outbound: number }>();
  for (const c of calls) {
    const d = c.createdAt.toISOString().slice(0, 10);
    if (!dayMap.has(d)) dayMap.set(d, { inbound: 0, outbound: 0 });
    const entry = dayMap.get(d)!;
    if (c.direction === "inbound") entry.inbound++;
    else entry.outbound++;
  }
  const callsByDay = Array.from(dayMap.entries())
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([date, v]) => ({ date, ...v }));

  // Outcomes
  const outcomeMap = new Map<string, number>();
  for (const c of calls) {
    const o = c.outcome ?? "unknown";
    outcomeMap.set(o, (outcomeMap.get(o) ?? 0) + 1);
  }
  const topOutcomes = Array.from(outcomeMap.entries())
    .sort(([, a], [, b]) => b - a)
    .slice(0, 5)
    .map(([label, count]) => ({
      label,
      count,
      percentage: totalCalls > 0 ? (count / totalCalls) * 100 : 0,
    }));

  // Call types
  const typeMap = new Map<string, number>();
  for (const c of calls) {
    const t = c.agentType ?? "Voice Agent";
    typeMap.set(t, (typeMap.get(t) ?? 0) + 1);
  }
  const callTypes = Array.from(typeMap.entries())
    .sort(([, a], [, b]) => b - a)
    .map(([label, count]) => ({ label, count, percentage: null }));

  // Drop-off reasons
  const missed = calls.filter(
    (c) => c.status === "missed" || c.status === "voicemail"
  );
  const dropOffReasons = [
    {
      label: "Successfully Handled",
      count: completed.length,
      percentage: totalCalls > 0 ? (completed.length / totalCalls) * 100 : 0,
    },
    {
      label: "Preferred a Human Agent",
      count: calls.filter((c) => c.status === "transferred").length,
      percentage:
        totalCalls > 0
          ? (calls.filter((c) => c.status === "transferred").length / totalCalls) * 100
          : 0,
    },
    {
      label: "Missed / Voicemail",
      count: missed.length,
      percentage: totalCalls > 0 ? (missed.length / totalCalls) * 100 : 0,
    },
  ];

  res.json({
    totalCalls,
    inbound,
    outbound,
    avgDuration,
    avgSentiment,
    timeSaved,
    revenueOnHours,
    revenueAfterHours,
    completionRate,
    callsByDay,
    topOutcomes,
    callTypes,
    dropOffReasons,
  });
});

router.get("/calls", async (req, res): Promise<void> => {
  const query = ListCallsQueryParams.safeParse(req.query);
  const limit = query.success ? (query.data.limit ?? 50) : 50;

  const calls = await db
    .select()
    .from(callsTable)
    .orderBy(desc(callsTable.createdAt))
    .limit(limit);

  res.json(calls);
});

router.get("/calls/:id", async (req, res): Promise<void> => {
  const params = GetCallParams.safeParse(req.params);
  if (!params.success) {
    res.status(400).json({ error: params.error.message });
    return;
  }
  const raw = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
  const id = parseInt(raw, 10);

  const [call] = await db
    .select()
    .from(callsTable)
    .where(eq(callsTable.id, id));

  if (!call) {
    res.status(404).json({ error: "Call not found" });
    return;
  }

  res.json(call);
});

export default router;
