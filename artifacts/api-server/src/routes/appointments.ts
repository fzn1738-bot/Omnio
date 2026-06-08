import { Router, type IRouter } from "express";
import { asc, eq } from "drizzle-orm";
import { db, appointmentsTable } from "@workspace/db";
import {
  ListAppointmentsQueryParams,
  GetAppointmentParams,
  UpdateAppointmentParams,
  DeleteAppointmentParams,
  CreateAppointmentBody,
  UpdateAppointmentBody,
} from "@workspace/api-zod";

const router: IRouter = Router();

router.get("/appointments", async (req, res): Promise<void> => {
  const query = ListAppointmentsQueryParams.safeParse(req.query);
  const status = query.success ? query.data.status : undefined;
  const limit = query.success ? (query.data.limit ?? 50) : 50;

  const appts =
    status && status !== "all"
      ? await db
          .select()
          .from(appointmentsTable)
          .where(eq(appointmentsTable.status, status))
          .orderBy(asc(appointmentsTable.scheduledAt))
          .limit(limit)
      : await db
          .select()
          .from(appointmentsTable)
          .orderBy(asc(appointmentsTable.scheduledAt))
          .limit(limit);

  res.json(appts);
});

router.post("/appointments", async (req, res): Promise<void> => {
  const body = CreateAppointmentBody.safeParse(req.body);
  if (!body.success) {
    res.status(400).json({ error: body.error.message });
    return;
  }

  const [appt] = await db
    .insert(appointmentsTable)
    .values({ ...body.data, scheduledAt: new Date(body.data.scheduledAt) })
    .returning();

  res.status(201).json(appt);
});

router.get("/appointments/:id", async (req, res): Promise<void> => {
  const params = GetAppointmentParams.safeParse(req.params);
  if (!params.success) {
    res.status(400).json({ error: params.error.message });
    return;
  }
  const raw = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
  const id = parseInt(raw, 10);

  const [appt] = await db
    .select()
    .from(appointmentsTable)
    .where(eq(appointmentsTable.id, id));

  if (!appt) {
    res.status(404).json({ error: "Appointment not found" });
    return;
  }

  res.json(appt);
});

router.patch("/appointments/:id", async (req, res): Promise<void> => {
  const params = UpdateAppointmentParams.safeParse(req.params);
  if (!params.success) {
    res.status(400).json({ error: params.error.message });
    return;
  }
  const raw = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
  const id = parseInt(raw, 10);

  const body = UpdateAppointmentBody.safeParse(req.body);
  if (!body.success) {
    res.status(400).json({ error: body.error.message });
    return;
  }

  const updateData: Record<string, unknown> = { ...body.data, updatedAt: new Date() };
  if (body.data.scheduledAt) {
    updateData.scheduledAt = new Date(body.data.scheduledAt);
  }

  const [appt] = await db
    .update(appointmentsTable)
    .set(updateData)
    .where(eq(appointmentsTable.id, id))
    .returning();

  if (!appt) {
    res.status(404).json({ error: "Appointment not found" });
    return;
  }

  res.json(appt);
});

router.delete("/appointments/:id", async (req, res): Promise<void> => {
  const params = DeleteAppointmentParams.safeParse(req.params);
  if (!params.success) {
    res.status(400).json({ error: params.error.message });
    return;
  }
  const raw = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
  const id = parseInt(raw, 10);

  const [appt] = await db
    .delete(appointmentsTable)
    .where(eq(appointmentsTable.id, id))
    .returning();

  if (!appt) {
    res.status(404).json({ error: "Appointment not found" });
    return;
  }

  res.sendStatus(204);
});

export default router;
