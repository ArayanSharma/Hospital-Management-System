import { Router } from "express";
import { create, getAll, getByResource, remove } from "./permission.controller.js";
import { authenticate } from "../../middleware/auth.middleware.js";
import { checkPermission } from "../../middleware/permission.middleware.js";
import { validate } from "../../middleware/validation.middleware.js";
import {
  createPermissionSchema,
  getByResourceSchema,
  deletePermissionSchema,
} from "./permission.validation.js";
import { routeCache } from "../../middleware/cache.middleware.js";

const router = Router();

router.post(
  "/",
  authenticate,
  checkPermission("permission:create"),
  validate(createPermissionSchema),
  create
);
router.get("/", authenticate, checkPermission("permission:read"), routeCache(300, "hms:route:perm", true), getAll);
router.get(
  "/resource/:resource",
  authenticate,
  checkPermission("permission:read"),
  validate(getByResourceSchema),
  routeCache(300, "hms:route:perm", true),
  getByResource
);
router.delete(
  "/:id",
  authenticate,
  checkPermission("permission:delete"),
  validate(deletePermissionSchema),
  remove
);

export default router;