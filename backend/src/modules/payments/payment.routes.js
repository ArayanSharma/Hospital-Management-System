import { Router } from "express";
import { create, getAll, getByInvoice, getById } from "./payment.controller.js";
import { authenticate } from "../../middleware/auth.middleware.js";
import { checkPermission } from "../../middleware/permission.middleware.js";
import { validate } from "../../middleware/validation.middleware.js";
import { createPaymentSchema } from "./payment.validation.js";

const router = Router();

router.post("/", authenticate, checkPermission("payment:create"), validate(createPaymentSchema), create);
router.get("/", authenticate, checkPermission("payment:read"), getAll);
router.get("/invoice/:invoiceId", authenticate, checkPermission("payment:read"), getByInvoice);
router.get("/:id", authenticate, checkPermission("payment:read"), getById);

export default router;