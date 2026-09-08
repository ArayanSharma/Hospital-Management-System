import { Router } from "express";
import { create, getAll, getById, updateStatus } from "./labTest.controller.js";
import { authenticate } from "../../middleware/auth.middleware.js";
import { checkPermission } from "../../middleware/permission.middleware.js";
import { validate } from "../../middleware/validation.middleware.js";
import { createLabTestSchema, updateLabTestStatusSchema } from "./laboratory.validation.js";
import { routeCache } from "../../middleware/cache.middleware.js";

const router = Router();

router.post("/", authenticate, checkPermission("lab_test:create"), validate(createLabTestSchema), create);
router.get("/", authenticate, checkPermission("lab_test:read"), routeCache(60, "hms:route:lab", true), getAll);
router.get("/:id", authenticate, checkPermission("lab_test:read"), routeCache(300, "hms:route:lab", true), getById);
router.patch(
  "/:id",
  authenticate,
  checkPermission("lab_test:update"),
  validate(updateLabTestStatusSchema),
  updateStatus
);
router.patch(
  "/:id/status",
  authenticate,
  checkPermission("lab_test:update"),
  validate(updateLabTestStatusSchema),
  updateStatus
);

export default router;