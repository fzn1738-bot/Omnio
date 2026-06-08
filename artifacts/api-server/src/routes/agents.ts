import { Router, type IRouter } from "express";
import { eq } from "drizzle-orm";
import { db, agentsTable } from "@workspace/db";
import {
  ListAgentsQueryParams,
  GetAgentParams,
  UpdateAgentParams,
  UpdateAgentBody,
} from "@workspace/api-zod";

const router: IRouter = Router();

router.get("/agents", async (req, res): Promise<void> => {
  const query = ListAgentsQueryParams.safeParse(req.query);
  const tier = query.success ? query.data.tier : undefined;

  let q = db.select().from(agentsTable);
  const agents =
    tier && tier !== "all"
      ? await db.select().from(agentsTable).where(eq(agentsTable.tier, tier))
      : await db.select().from(agentsTable);

  res.json(agents);
});

router.get("/agents/:id", async (req, res): Promise<void> => {
  const params = GetAgentParams.safeParse(req.params);
  if (!params.success) {
    res.status(400).json({ error: params.error.message });
    return;
  }
  const raw = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
  const id = parseInt(raw, 10);

  const [agent] = await db
    .select()
    .from(agentsTable)
    .where(eq(agentsTable.id, id));

  if (!agent) {
    res.status(404).json({ error: "Agent not found" });
    return;
  }

  res.json(agent);
});

router.patch("/agents/:id", async (req, res): Promise<void> => {
  const params = UpdateAgentParams.safeParse(req.params);
  if (!params.success) {
    res.status(400).json({ error: params.error.message });
    return;
  }
  const raw = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
  const id = parseInt(raw, 10);

  const body = UpdateAgentBody.safeParse(req.body);
  if (!body.success) {
    res.status(400).json({ error: body.error.message });
    return;
  }

  const updateData: Record<string, unknown> = {};
  if (body.data.isActive !== undefined) updateData.isActive = body.data.isActive;
  if (body.data.status !== undefined) updateData.status = body.data.status;

  const [agent] = await db
    .update(agentsTable)
    .set(updateData)
    .where(eq(agentsTable.id, id))
    .returning();

  if (!agent) {
    res.status(404).json({ error: "Agent not found" });
    return;
  }

  res.json(agent);
});

export default router;
