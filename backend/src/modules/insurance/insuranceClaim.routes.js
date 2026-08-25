import { Router } from "express";
import { create, getAll, getById, updateStatus } from "./insuranceClaim.controller.js";
import { authenticate } from "../../middleware/auth.middleware.js";
import { checkPermission } from "../../middleware/permission.middleware.js";
import { validate } from "../../middleware/validation.middleware.js";
import { createClaimSchema, updateClaimStatusSchema } from "./insurance.validation.js";
import { uploadInsuranceDocuments, handleUploadError } from "../../middleware/upload.middleware.js";

const router = Router();

router.post(
  "/",
  authenticate,
  checkPermission("insurance:create"),
  uploadInsuranceDocuments,
  handleUploadError,
  validate(createClaimSchema),
  create
);
router.get("/", authenticate, checkPermission("insurance:read"), getAll);
router.get("/:id", authenticate, checkPermission("insurance:read"), getById);
router.patch(
  "/:id/status",
  authenticate,
  checkPermission("insurance:update"),
  validate(updateClaimStatusSchema),
  updateStatus
);

export default router;