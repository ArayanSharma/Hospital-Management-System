import { Router } from "express";
import { create, getAll, getById, update, remove } from "./supplier.controller.js";
import { authenticate } from "../../middleware/auth.middleware.js";
import { checkPermission } from "../../middleware/permission.middleware.js";
import { validate } from "../../middleware/validation.middleware.js";
import { createSupplierSchema, updateSupplierSchema } from "./supplier.validation.js";

const router = Router();

router.post("/", authenticate, checkPermission("supplier:create"), validate(createSupplierSchema), create);
router.get("/", authenticate, checkPermission("supplier:read"), getAll);
router.get("/:id", authenticate, checkPermission("supplier:read"), getById);
router.patch("/:id", authenticate, checkPermission("supplier:update"), validate(updateSupplierSchema), update);
router.delete("/:id", authenticate, checkPermission("supplier:delete"), remove);

export default router;