import { Router } from "express";
import {
  create,
  getAll,
  getById,
  update,
  changeStatus,
} from "./appointment.controller.js";
import { authenticate } from "../../middleware/auth.middleware.js";
import { checkPermission } from "../../middleware/permission.middleware.js";
import { validate } from "../../middleware/validation.middleware.js";
import {
  createAppointmentSchema,
  updateAppointmentSchema,
  changeStatusSchema,
} from "./appointment.validation.js";

const router = Router();

router.post(
  "/",
  authenticate,
  checkPermission("appointment:create"),
  validate(createAppointmentSchema),
  create
);
router.get("/", authenticate, checkPermission("appointment:read"), getAll);
router.get("/:id", authenticate, checkPermission("appointment:read"), getById);
router.patch(
  "/:id",
  authenticate,
  checkPermission("appointment:update"),
  validate(updateAppointmentSchema),
  update
);
router.patch(
  "/:id/status",
  authenticate,
  checkPermission("appointment:update"),
  validate(changeStatusSchema),
  changeStatus
);

export default router;