import { Router } from "express";
import {
  create,
  getHistory,
  getSummary,
  getById,
  update,
} from "./medicalRecord.controller.js";
import { authenticate } from "../../middleware/auth.middleware.js";
import { checkPermission } from "../../middleware/permission.middleware.js";
import { validate } from "../../middleware/validation.middleware.js";
import { createMedicalRecordSchema, updateMedicalRecordSchema } from "./medicalRecord.validation.js";
import { routeCache } from "../../middleware/cache.middleware.js";

const router = Router();

router.post(
  "/",
  authenticate,
  checkPermission("medical_record:create"),
  validate(createMedicalRecordSchema),
  create
);
router.get(
  "/patient/:patientId/history",
  authenticate,
  checkPermission("medical_record:read"),
  routeCache(60, "hms:route:medrec", true),
  getHistory
);
router.get(
  "/patient/:patientId/summary",
  authenticate,
  checkPermission("medical_record:read"),
  routeCache(300, "hms:route:medrec", true),
  getSummary
);
router.get("/:id", authenticate, checkPermission("medical_record:read"), routeCache(300, "hms:route:medrec", true), getById);
router.patch(
  "/:id",
  authenticate,
  checkPermission("medical_record:update"),
  validate(updateMedicalRecordSchema),
  update
);

export default router;