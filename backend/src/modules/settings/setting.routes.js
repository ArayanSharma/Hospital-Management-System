import { Router } from "express";
import { get, update, updateLogo } from "./setting.controller.js";
import { authenticate } from "../../middleware/auth.middleware.js";
import { checkPermission } from "../../middleware/permission.middleware.js";
import { validate } from "../../middleware/validation.middleware.js";
import { updateSettingSchema } from "./setting.validation.js";
import { uploadHospitalLogo, handleUploadError } from "../../middleware/upload.middleware.js";

const router = Router();

router.get("/", authenticate, checkPermission("setting:read"), get);
router.patch("/", authenticate, checkPermission("setting:update"), validate(updateSettingSchema), update);
router.patch(
  "/logo",
  authenticate,
  checkPermission("setting:update"),
  uploadHospitalLogo,
  handleUploadError,
  updateLogo
);

export default router;