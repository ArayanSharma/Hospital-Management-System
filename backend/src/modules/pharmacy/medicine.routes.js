import { Router } from "express";
import { create, getAll, getById, update, getStats } from "./medicine.controller.js";
import { authenticate } from "../../middleware/auth.middleware.js";
import { checkPermission } from "../../middleware/permission.middleware.js";
import { validate } from "../../middleware/validation.middleware.js";
import { createMedicineSchema, updateMedicineSchema } from "./medicine.validation.js";
import { routeCache } from "../../middleware/cache.middleware.js";

const router = Router();

router.post("/", authenticate, checkPermission("medicine:create"), validate(createMedicineSchema), create);
router.get("/", authenticate, checkPermission("medicine:read"), routeCache(60, "hms:route:medicine", true), getAll);
router.get("/stats", authenticate, checkPermission("medicine:read"), routeCache(300, "hms:route:medicine", true), getStats);
router.get("/:id", authenticate, checkPermission("medicine:read"), routeCache(300, "hms:route:medicine", true), getById);
router.patch("/:id", authenticate, checkPermission("medicine:update"), validate(updateMedicineSchema), update);

export default router;