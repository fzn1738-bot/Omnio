import { Router, type IRouter } from "express";
import healthRouter from "./health";
import callsRouter from "./calls";
import agentsRouter from "./agents";
import leadsRouter from "./leads";
import appointmentsRouter from "./appointments";
import followUpsRouter from "./followUps";
import dashboardRouter from "./dashboard";
import alertsRouter from "./alerts";
import activityRouter from "./activity";

const router: IRouter = Router();

router.use(healthRouter);
router.use(callsRouter);
router.use(agentsRouter);
router.use(leadsRouter);
router.use(appointmentsRouter);
router.use(followUpsRouter);
router.use(dashboardRouter);
router.use(alertsRouter);
router.use(activityRouter);

export default router;
