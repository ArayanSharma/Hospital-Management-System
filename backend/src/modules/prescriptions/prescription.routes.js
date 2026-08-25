import { Router } from "express";
import { create, getAll, getById, getByVisit, update } from "./prescription.controller.js";
import { authenticate } from "../../middleware/auth.middleware.js";
import { checkPermission } from "../../middleware/permission.middleware.js";
import { validate } from "../../middleware/validation.middleware.js";
import { createPrescriptionSchema, updatePrescriptionSchema } from "./prescription.validation.js";

const router = Router();

router.post(
  "/",
  authenticate,
  checkPermission("prescription:create"),
  validate(createPrescriptionSchema),
  create
);
router.get("/", authenticate, checkPermission("prescription:read"), getAll);
router.get("/visit/:visitId", authenticate, checkPermission("prescription:read"), getByVisit);
router.get("/:id", authenticate, checkPermission("prescription:read"), getById);
router.patch(
  "/:id",
  authenticate,
  checkPermission("prescription:update"),
  validate(updatePrescriptionSchema),
  update
);

export default router;