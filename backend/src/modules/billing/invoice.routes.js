import { Router } from "express";
import {
  create,
  getAll,
  getById,
  cancel,
  voidInvoiceController,
  refundInvoiceController,
  getNextNumber,
  getPatientEncounters,
  getCatalog,
} from "./invoice.controller.js";
import { authenticate } from "../../middleware/auth.middleware.js";
import { checkPermission } from "../../middleware/permission.middleware.js";
import { validate } from "../../middleware/validation.middleware.js";
import { routeCache } from "../../middleware/cache.middleware.js";
import { createInvoiceSchema } from "./invoice.validation.js";

const router = Router();

router.get("/next-number", authenticate, routeCache(10, "hms:route:invoice:nextnum", true), getNextNumber);
router.get("/patient-encounters/:patientId", authenticate, routeCache(60, "hms:route:invoice:enc", true), getPatientEncounters);
router.get("/catalog", authenticate, routeCache(300, "hms:route:catalog", false), getCatalog);

router.post("/", authenticate, checkPermission("invoice:create"), validate(createInvoiceSchema), create);
router.get("/", authenticate, checkPermission("invoice:read"), routeCache(60, "hms:route:invoices", true), getAll);
router.get("/:id", authenticate, checkPermission("invoice:read"), routeCache(300, "hms:route:invoices", true), getById);
router.patch("/:id/cancel", authenticate, checkPermission("invoice:update"), cancel);
router.patch("/:id/void", authenticate, checkPermission("invoice:update"), voidInvoiceController);
router.post("/:id/refund", authenticate, checkPermission("invoice:update"), refundInvoiceController);

export default router;