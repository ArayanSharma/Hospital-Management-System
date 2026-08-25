import { Router } from "express";
import { create, getAll, getAvailable, getById, updateStatus } from "./bed.controller.js";
import { authenticate } from "../../middleware/auth.middleware.js";
import { checkPermission } from "../../middleware/permission.middleware.js";
import { validate } from "../../middleware/validation.middleware.js";
import { createBedSchema, updateBedStatusSchema } from "./bed.validation.js";

const router = Router();

router.post("/", authenticate, checkPermission("bed:create"), validate(createBedSchema), create);
router.get("/", authenticate, checkPermission("bed:read"), getAll);
router.get("/available", authenticate, checkPermission("bed:read"), getAvailable);
router.get("/:id", authenticate, checkPermission("bed:read"), getById);
router.patch(
  "/:id/status",
  authenticate,
  checkPermission("bed:update"),
  validate(updateBedStatusSchema),
  updateStatus
);

export default router;