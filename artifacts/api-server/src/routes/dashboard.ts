import { Router, type IRouter } from "express";
import { gte, eq, and, count } from "drizzle-orm";
import { db, callsTable, leadsTable, appointmentsTable, followUpsTable, alertsTable, agentsTable } from "@workspace/db";
import { GetDashboardSummaryQueryParams } from "@workspace/api-zod";

const router: IRouter = Router();

router.get("/dashboard/summary", async (req, res): Promise<void> => {
  const query = GetDashboardSummaryQueryParams.safeParse(req.query);
  const days = query.success ? (query.data.days ?? 30) : 30;

  const since = new Date();
  since.setDate(since.getDate() - days);

  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 1);

  const [calls, convertedLeads, todayAppts, pendingFUs, activeAlertsList, agents] = await Promise.all([
    db.select().from(callsTable).where(gte(callsTable.createdAt, since)),
    db.select().from(leadsTable).where(eq(leadsTable.status, "converted")),
    db.select().from(appointmentsTable).where(
      and(gte(appointmentsTable.scheduledAt, today), eq(appointmentsTable.status, "scheduled"))
    ),
    db.select().from(followUpsTable).where(eq(followUpsTable.status, "pending")),
    db.select().from(alertsTable).where(eq(alertsTable.dismissed, false)),
    db.select().from(agentsTable),
  ]);

  const totalCalls = calls.length;
  const completed = calls.filter((c) => c.status === "completed");
  const withSentiment = calls.filter((c) => c.sentiment !== null);
  const sentimentScore = withSentiment.length > 0
    ? withSentiment.reduce((s, c) => s + (c.sentiment ?? 0), 0) / withSentiment.length
    : 0;

  const revenueOnHours = completed.filter((c) => {
    const h = new Date(c.createdAt).getHours();
    return h >= 9 && h < 17;
  }).length * 89;
  const revenueAfterHours = completed.filter((c) => {
    const h = new Date(c.createdAt).getHours();
    return h < 9 || h >= 17;
  }).length * 89;

  const timeSavedMinutes = Math.floor(totalCalls * 4.2);

  const activeAgents = agents.filter((a) => a.status === "active" || a.status === "idle").length;
  const agentHealth = agents.length > 0 ? (activeAgents / agents.length) * 100 : 100;

  res.json({
    totalCalls,
    revenueOnHours,
    revenueAfterHours,
    sentimentScore: Math.round(sentimentScore * 1000) / 1000,
    timeSavedMinutes,
    activeAlerts: activeAlertsList.length,
    scheduledToday: todayAppts.length,
    pendingFollowUps: pendingFUs.length,
    convertedLeads: convertedLeads.length,
    agentHealth: Math.round(agentHealth * 10) / 10,
  });
});

export default router;
