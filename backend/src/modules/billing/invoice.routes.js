import { Router } from "express";
import { create, getAll, getById, cancel } from "./invoice.controller.js";
import { authenticate } from "../../middleware/auth.middleware.js";
import { checkPermission } from "../../middleware/permission.middleware.js";
import { validate } from "../../middleware/validation.middleware.js";
import { createInvoiceSchema } from "./invoice.validation.js";

const router = Router();

router.post("/", authenticate, checkPermission("invoice:create"), validate(createInvoiceSchema), create);
router.get("/", authenticate, checkPermission("invoice:read"), getAll);
router.get("/:id", authenticate, checkPermission("invoice:read"), getById);
router.patch("/:id/cancel", authenticate, checkPermission("invoice:update"), cancel);

export default router;