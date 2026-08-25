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

const router = Router();

router.get("/patient-registration", authenticate, checkPermission("report:read"), patientRegistration);
router.get("/appointments", authenticate, checkPermission("report:read"), appointments);
router.get("/revenue", authenticate, checkPermission("report:read"), revenue);
router.get("/pharmacy-sales", authenticate, checkPermission("report:read"), pharmacySales);
router.get("/occupancy", authenticate, checkPermission("report:read"), occupancy);

export default router;