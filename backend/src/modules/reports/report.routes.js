import { Router } from "express";
import {
  patientRegistration,
  appointments,
  revenue,
  pharmacySales,
  occupancy,
} from "./report.controller.js";
import { authenticate } from "../../middleware/auth.middleware.js";
import { checkPermission } from "../../middleware/permission.middleware.js";
import { routeCache } from "../../middleware/cache.middleware.js";

const router = Router();

router.get("/patient-registration", authenticate, checkPermission("report:read"), routeCache(300, "hms:route:report", true), patientRegistration);
router.get("/appointments", authenticate, checkPermission("report:read"), routeCache(300, "hms:route:report", true), appointments);
router.get("/revenue", authenticate, checkPermission("report:read"), routeCache(300, "hms:route:report", true), revenue);
router.get("/pharmacy-sales", authenticate, checkPermission("report:read"), routeCache(300, "hms:route:report", true), pharmacySales);
router.get("/occupancy", authenticate, checkPermission("report:read"), routeCache(300, "hms:route:report", true), occupancy);

export default router;