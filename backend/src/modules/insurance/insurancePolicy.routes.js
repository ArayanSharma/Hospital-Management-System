import { Router } from "express";
import { create, getAll, getByPatient, getById, update } from "./insurancePolicy.controller.js";
import { authenticate } from "../../middleware/auth.middleware.js";
import { checkPermission } from "../../middleware/permission.middleware.js";
import { validate } from "../../middleware/validation.middleware.js";
import { createPolicySchema, updatePolicySchema } from "./insurance.validation.js";

const router = Router();

router.post("/", authenticate, checkPermission("insurance:create"), validate(createPolicySchema), create);
router.get("/", authenticate, checkPermission("insurance:read"), getAll);
router.get("/patient/:patientId", authenticate, checkPermission("insurance:read"), getByPatient);
router.get("/:id", authenticate, checkPermission("insurance:read"), getById);
router.patch("/:id", authenticate, checkPermission("insurance:update"), validate(updatePolicySchema), update);

export default router;