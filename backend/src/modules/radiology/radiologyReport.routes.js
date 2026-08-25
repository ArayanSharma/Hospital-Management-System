import { Router } from "express";
import { create, finalize, getByTestId, update } from "./radiologyReport.controller.js";
import { authenticate } from "../../middleware/auth.middleware.js";
import { checkPermission } from "../../middleware/permission.middleware.js";
import { validate } from "../../middleware/validation.middleware.js";
import { createRadiologyReportSchema, updateRadiologyReportSchema } from "./radiology.validation.js";

const router = Router();

router.post(
  "/",
  authenticate,
  checkPermission("radiology_report:create"),
  validate(createRadiologyReportSchema),
  create
);
router.get("/test/:testId", authenticate, checkPermission("radiology_report:read"), getByTestId);
router.patch(
  "/:id",
  authenticate,
  checkPermission("radiology_report:update"),
  validate(updateRadiologyReportSchema),
  update
);
router.patch(
  "/:id/finalize",
  authenticate,
  checkPermission("radiology_report:update"),
  finalize
);

export default router;