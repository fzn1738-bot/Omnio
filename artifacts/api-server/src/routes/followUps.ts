import { Router, type IRouter } from "express";
import { asc, eq } from "drizzle-orm";
import { db, followUpsTable } from "@workspace/db";
import {
  ListFollowUpsQueryParams,
  UpdateFollowUpParams,
  CreateFollowUpBody,
  UpdateFollowUpBody,
} from "@workspace/api-zod";

const router: IRouter = Router();

router.get("/follow-ups", async (req, res): Promise<void> => {
  const query = ListFollowUpsQueryParams.safeParse(req.query);
  const status = query.success ? query.data.status : undefined;
  const limit = query.success ? (query.data.limit ?? 50) : 50;

  const followUps =
    status && status !== "all"
      ? await db
          .select()
          .from(followUpsTable)
          .where(eq(followUpsTable.status, status))
          .orderBy(asc(followUpsTable.scheduledAt))
          .limit(limit)
      : await db
          .select()
          .from(followUpsTable)
          .orderBy(asc(followUpsTable.scheduledAt))
          .limit(limit);

  res.json(followUps);
});

router.post("/follow-ups", async (req, res): Promise<void> => {
  const body = CreateFollowUpBody.safeParse(req.body);
  if (!body.success) {
    res.status(400).json({ error: body.error.message });
    return;
  }

  const [fu] = await db
    .insert(followUpsTable)
    .values({ ...body.data, scheduledAt: new Date(body.data.scheduledAt) })
    .returning();

  res.status(201).json(fu);
});

router.patch("/follow-ups/:id", async (req, res): Promise<void> => {
  const params = UpdateFollowUpParams.safeParse(req.params);
  if (!params.success) {
    res.status(400).json({ error: params.error.message });
    return;
  }
  const raw = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
  const id = parseInt(raw, 10);

  const body = UpdateFollowUpBody.safeParse(req.body);
  if (!body.success) {
    res.status(400).json({ error: body.error.message });
    return;
  }

  const updateData: Record<string, unknown> = { ...body.data, updatedAt: new Date() };
  if (body.data.scheduledAt) updateData.scheduledAt = new Date(body.data.scheduledAt);
  if (body.data.completedAt) updateData.completedAt = new Date(body.data.completedAt);

  const [fu] = await db
    .update(followUpsTable)
    .set(updateData)
    .where(eq(followUpsTable.id, id))
    .returning();

  if (!fu) {
    res.status(404).json({ error: "Follow-up not found" });
    return;
  }

  res.json(fu);
});

export default router;
