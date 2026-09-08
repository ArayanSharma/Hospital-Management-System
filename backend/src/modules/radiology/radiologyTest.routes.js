import { Router } from "express";
import { create, getAll, getById, updateStatus, remove } from "./radiologyTest.controller.js";
import { authenticate } from "../../middleware/auth.middleware.js";
import { checkPermission } from "../../middleware/permission.middleware.js";
import { validate } from "../../middleware/validation.middleware.js";
import { createRadiologyTestSchema, updateRadiologyTestStatusSchema } from "./radiology.validation.js";
import { routeCache } from "../../middleware/cache.middleware.js";

const router = Router();

router.post(
  "/",
  authenticate,
  checkPermission("radiology_test:create"),
  validate(createRadiologyTestSchema),
  create
);
router.get("/", authenticate, checkPermission("radiology_test:read"), routeCache(60, "hms:route:radiology", true), getAll);
router.get("/:id", authenticate, checkPermission("radiology_test:read"), routeCache(300, "hms:route:radiology", true), getById);
router.patch(
  "/:id",
  authenticate,
  checkPermission("radiology_test:update"),
  validate(updateRadiologyTestStatusSchema),
  updateStatus
);
router.patch(
  "/:id/status",
  authenticate,
  checkPermission("radiology_test:update"),
  validate(updateRadiologyTestStatusSchema),
  updateStatus
);
router.delete("/:id", authenticate, checkPermission("radiology_test:delete"), remove);

export default router;