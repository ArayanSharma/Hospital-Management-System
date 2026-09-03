import { Router } from "express";
import { create, getAll, exportCSV, getById, update, remove } from "./patient.controller.js";
import { authenticate } from "../../middleware/auth.middleware.js";
import { checkPermission } from "../../middleware/permission.middleware.js";
import { validate } from "../../middleware/validation.middleware.js";
import { createPatientSchema, updatePatientSchema } from "./patient.validation.js";

const router = Router();

router.post(
  "/",
  authenticate,
  checkPermission("patient:create"),
  validate(createPatientSchema),
  create
);
router.get("/export", authenticate, checkPermission("patient:read"), exportCSV);
router.get("/", authenticate, checkPermission("patient:read"), getAll);
router.get("/:id", authenticate, checkPermission("patient:read"), getById);
router.patch(
  "/:id",
  authenticate,
  checkPermission("patient:update"),
  validate(updatePatientSchema),
  update
);
router.delete("/:id", authenticate, checkPermission("patient:delete"), remove);

export default router;