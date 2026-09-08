import { Router } from "express";
import { create, getAll, getById, update, updatePermissions, remove } from "./role.controller.js";
import { authenticate } from "../../middleware/auth.middleware.js";
import { checkPermission } from "../../middleware/permission.middleware.js";
import { validate } from "../../middleware/validation.middleware.js";
import {
  createRoleSchema,
  updateRolePermissionsSchema,
  roleIdParamSchema,
} from "./role.validation.js";
import { routeCache } from "../../middleware/cache.middleware.js";

const router = Router();

router.post(
  "/",
  authenticate,
  checkPermission("role:create"),
  validate(createRoleSchema),
  create
);
router.get("/", authenticate, checkPermission("role:read"), routeCache(60, "hms:route:role", true), getAll);
router.get(
  "/:id",
  authenticate,
  checkPermission("role:read"),
  validate(roleIdParamSchema),
  routeCache(300, "hms:route:role", true),
  getById
);
router.patch(
  "/:id",
  authenticate,
  checkPermission("role:update"),
  validate(updateRolePermissionsSchema),
  update
);
router.patch(
  "/:id/permissions",
  authenticate,
  checkPermission("role:update"),
  validate(updateRolePermissionsSchema),
  updatePermissions
);
router.delete(
  "/:id",
  authenticate,
  checkPermission("role:delete"),
  validate(roleIdParamSchema),
  remove
);

export default router;