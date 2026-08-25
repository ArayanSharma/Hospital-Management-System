import { Router } from "express";
import { create, getAll, getById, markPaid } from "./pharmacySale.controller.js";
import { authenticate } from "../../middleware/auth.middleware.js";
import { checkPermission } from "../../middleware/permission.middleware.js";
import { validate } from "../../middleware/validation.middleware.js";
import { createPharmacySaleSchema } from "./pharmacySale.validation.js";

const router = Router();

router.post(
  "/",
  authenticate,
  checkPermission("pharmacy_sale:create"),
  validate(createPharmacySaleSchema),
  create
);
router.get("/", authenticate, checkPermission("pharmacy_sale:read"), getAll);
router.get("/:id", authenticate, checkPermission("pharmacy_sale:read"), getById);
router.patch("/:id/mark-paid", authenticate, checkPermission("pharmacy_sale:update"), markPaid);

export default router;