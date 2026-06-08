import { Router, type IRouter } from "express";
import { desc, eq } from "drizzle-orm";
import { db, alertsTable } from "@workspace/db";
import { DismissAlertParams, DismissAlertBody } from "@workspace/api-zod";

const router: IRouter = Router();

router.get("/alerts", async (req, res): Promise<void> => {
  const alerts = await db
    .select()
    .from(alertsTable)
    .orderBy(desc(alertsTable.createdAt));

  res.json(alerts);
});

router.patch("/alerts/:id/dismiss", async (req, res): Promise<void> => {
  const params = DismissAlertParams.safeParse(req.params);
  if (!params.success) {
    res.status(400).json({ error: params.error.message });
    return;
  }
  const raw = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
  const id = parseInt(raw, 10);

  const [alert] = await db
    .update(alertsTable)
    .set({ dismissed: true })
    .where(eq(alertsTable.id, id))
    .returning();

  if (!alert) {
    res.status(404).json({ error: "Alert not found" });
    return;
  }

  res.json(alert);
});

export default router;
