import { Router, type IRouter } from "express";
import { desc, eq } from "drizzle-orm";
import { db, leadsTable } from "@workspace/db";
import {
  ListLeadsQueryParams,
  GetLeadParams,
  UpdateLeadParams,
  CreateLeadBody,
  UpdateLeadBody,
} from "@workspace/api-zod";

const router: IRouter = Router();

router.get("/leads", async (req, res): Promise<void> => {
  const query = ListLeadsQueryParams.safeParse(req.query);
  const status = query.success ? query.data.status : undefined;
  const limit = query.success ? (query.data.limit ?? 50) : 50;

  const leads =
    status && status !== "all"
      ? await db
          .select()
          .from(leadsTable)
          .where(eq(leadsTable.status, status))
          .orderBy(desc(leadsTable.createdAt))
          .limit(limit)
      : await db
          .select()
          .from(leadsTable)
          .orderBy(desc(leadsTable.createdAt))
          .limit(limit);

  res.json(leads);
});

router.post("/leads", async (req, res): Promise<void> => {
  const body = CreateLeadBody.safeParse(req.body);
  if (!body.success) {
    res.status(400).json({ error: body.error.message });
    return;
  }

  const [lead] = await db.insert(leadsTable).values(body.data).returning();
  res.status(201).json(lead);
});

router.get("/leads/:id", async (req, res): Promise<void> => {
  const params = GetLeadParams.safeParse(req.params);
  if (!params.success) {
    res.status(400).json({ error: params.error.message });
    return;
  }
  const raw = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
  const id = parseInt(raw, 10);

  const [lead] = await db
    .select()
    .from(leadsTable)
    .where(eq(leadsTable.id, id));

  if (!lead) {
    res.status(404).json({ error: "Lead not found" });
    return;
  }

  res.json(lead);
});

router.patch("/leads/:id", async (req, res): Promise<void> => {
  const params = UpdateLeadParams.safeParse(req.params);
  if (!params.success) {
    res.status(400).json({ error: params.error.message });
    return;
  }
  const raw = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
  const id = parseInt(raw, 10);

  const body = UpdateLeadBody.safeParse(req.body);
  if (!body.success) {
    res.status(400).json({ error: body.error.message });
    return;
  }

  const [lead] = await db
    .update(leadsTable)
    .set({ ...body.data, updatedAt: new Date() })
    .where(eq(leadsTable.id, id))
    .returning();

  if (!lead) {
    res.status(404).json({ error: "Lead not found" });
    return;
  }

  res.json(lead);
});

export default router;
