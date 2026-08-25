import { Router } from "express";
import { create, getAll, getById, update, remove, updatePhoto } from "./doctor.controller.js";
import { authenticate } from "../../middleware/auth.middleware.js";
import { checkPermission } from "../../middleware/permission.middleware.js";
import { validate } from "../../middleware/validation.middleware.js";
import { createDoctorSchema, updateDoctorSchema } from "./doctor.validation.js";
import { uploadProfilePhoto, handleUploadError } from "../../middleware/upload.middleware.js";

const router = Router();

router.post(
  "/",
  authenticate,
  checkPermission("doctor:create"),
  validate(createDoctorSchema),
  create
);
router.get("/", authenticate, checkPermission("doctor:read"), getAll);
router.get("/:id", authenticate, checkPermission("doctor:read"), getById);
router.patch(
  "/:id",
  authenticate,
  checkPermission("doctor:update"),
  validate(updateDoctorSchema),
  update
);
router.patch(
  "/:id/photo",
  authenticate,
  checkPermission("doctor:update"),
  uploadProfilePhoto,
  handleUploadError,
  updatePhoto
);
router.delete("/:id", authenticate, checkPermission("doctor:delete"), remove);

export default router;