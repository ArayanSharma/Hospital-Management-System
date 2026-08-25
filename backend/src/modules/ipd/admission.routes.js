import { Router } from "express";
import { create, getAll, getById, update, discharge } from "./admission.controller.js";
import { authenticate } from "../../middleware/auth.middleware.js";
import { checkPermission } from "../../middleware/permission.middleware.js";
import { validate } from "../../middleware/validation.middleware.js";
import { createAdmissionSchema, updateAdmissionSchema, dischargeSchema } from "./admission.validation.js";

const router = Router();

router.post("/", authenticate, checkPermission("admission:create"), validate(createAdmissionSchema), create);
router.get("/", authenticate, checkPermission("admission:read"), getAll);
router.get("/:id", authenticate, checkPermission("admission:read"), getById);
router.patch("/:id", authenticate, checkPermission("admission:update"), validate(updateAdmissionSchema), update);
router.patch(
  "/:id/discharge",
  authenticate,
  checkPermission("admission:update"),
  validate(dischargeSchema),
  discharge
);

export default router;