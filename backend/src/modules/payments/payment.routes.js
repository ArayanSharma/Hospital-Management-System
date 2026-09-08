import { Router } from "express";
import { create, getAll, getByInvoice, getById } from "./payment.controller.js";
import { authenticate } from "../../middleware/auth.middleware.js";
import { checkPermission } from "../../middleware/permission.middleware.js";
import { validate } from "../../middleware/validation.middleware.js";
import { createPaymentSchema } from "./payment.validation.js";
import { routeCache } from "../../middleware/cache.middleware.js";

const router = Router();

router.post("/", authenticate, checkPermission("payment:create"), validate(createPaymentSchema), create);
router.get("/", authenticate, checkPermission("payment:read"), routeCache(60, "hms:route:payment", true), getAll);
router.get("/invoice/:invoiceId", authenticate, checkPermission("payment:read"), routeCache(300, "hms:route:payment", true), getByInvoice);
router.get("/:id", authenticate, checkPermission("payment:read"), routeCache(300, "hms:route:payment", true), getById);

export default router;