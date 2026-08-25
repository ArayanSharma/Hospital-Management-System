import { Router } from "express";
import { create, getAll, getById, updateStatus } from "./radiologyTest.controller.js";
import { authenticate } from "../../middleware/auth.middleware.js";
import { checkPermission } from "../../middleware/permission.middleware.js";
import { validate } from "../../middleware/validation.middleware.js";
import { createRadiologyTestSchema, updateRadiologyTestStatusSchema } from "./radiology.validation.js";

const router = Router();

router.post(
  "/",
  authenticate,
  checkPermission("radiology_test:create"),
  validate(createRadiologyTestSchema),
  create
);
router.get("/", authenticate, checkPermission("radiology_test:read"), getAll);
router.get("/:id", authenticate, checkPermission("radiology_test:read"), getById);
router.patch(
  "/:id/status",
  authenticate,
  checkPermission("radiology_test:update"),
  validate(updateRadiologyTestStatusSchema),
  updateStatus
);

export default router;