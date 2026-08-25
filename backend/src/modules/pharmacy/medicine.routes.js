import { Router } from "express";
import { create, getAll, getById, update } from "./medicine.controller.js";
import { authenticate } from "../../middleware/auth.middleware.js";
import { checkPermission } from "../../middleware/permission.middleware.js";
import { validate } from "../../middleware/validation.middleware.js";
import { createMedicineSchema, updateMedicineSchema } from "./medicine.validation.js";

const router = Router();

router.post("/", authenticate, checkPermission("medicine:create"), validate(createMedicineSchema), create);
router.get("/", authenticate, checkPermission("medicine:read"), getAll);
router.get("/:id", authenticate, checkPermission("medicine:read"), getById);
router.patch("/:id", authenticate, checkPermission("medicine:update"), validate(updateMedicineSchema), update);

export default router;