import { Router } from "express";
import { create, finalize, getByTestId, update } from "./labReport.controller.js";
import { authenticate } from "../../middleware/auth.middleware.js";
import { checkPermission } from "../../middleware/permission.middleware.js";
import { validate } from "../../middleware/validation.middleware.js";
import { createLabReportSchema, updateLabReportSchema } from "./laboratory.validation.js";
import { uploadLabReport, handleUploadError } from "../../middleware/upload.middleware.js";

const router = Router();

router.post(
  "/",
  authenticate,
  checkPermission("lab_report:create"),
  uploadLabReport,
  handleUploadError,
  validate(createLabReportSchema),
  create
);
router.get("/test/:labTestId", authenticate, checkPermission("lab_report:read"), getByTestId);
router.patch(
  "/:id",
  authenticate,
  checkPermission("lab_report:update"),
  validate(updateLabReportSchema),
  update
);
router.patch("/:id/finalize", authenticate, checkPermission("lab_report:update"), finalize);

export default router;