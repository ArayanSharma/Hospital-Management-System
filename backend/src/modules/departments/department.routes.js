import { Router } from "express";
import { create, getAll, getById, update, remove } from "./department.controller.js";
import { authenticate } from "../../middleware/auth.middleware.js";
import { checkPermission } from "../../middleware/permission.middleware.js";
import { validate } from "../../middleware/validation.middleware.js";
import { routeCache } from "../../middleware/cache.middleware.js";
import { createDepartmentSchema, updateDepartmentSchema } from "./department.validation.js";

const router = Router();

router.post(
  "/",
  authenticate,
  checkPermission("department:create"),
  validate(createDepartmentSchema),
  create
);
router.get("/", authenticate, checkPermission("department:read"), routeCache(300, "hms:route:depts", true), getAll);
router.get("/:id", authenticate, checkPermission("department:read"), routeCache(600, "hms:route:depts", true), getById);
router.patch(
  "/:id",
  authenticate,
  checkPermission("department:update"),
  validate(updateDepartmentSchema),
  update
);
router.delete("/:id", authenticate, checkPermission("department:delete"), remove);

export default router;