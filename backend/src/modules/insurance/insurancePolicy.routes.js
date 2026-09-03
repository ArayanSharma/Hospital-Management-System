import { Router } from "express";
import {
  create,
  getAll,
  getByPatient,
  getById,
  update,
  remove,
  toggleStatusController,
  toggleArchiveController,
} from "./Insurancepolicy.controller.js";
import { authenticate } from "../../middleware/auth.middleware.js";
import { checkPermission } from "../../middleware/permission.middleware.js";

const router = Router();

router.post("/", authenticate, checkPermission("insurance:create"), create);
router.get("/", authenticate, checkPermission("insurance:read"), getAll);
router.get("/patient/:patientId", authenticate, checkPermission("insurance:read"), getByPatient);
router.get("/:id", authenticate, checkPermission("insurance:read"), getById);
router.patch("/:id", authenticate, checkPermission("insurance:update"), update);
router.delete("/:id", authenticate, checkPermission("insurance:delete"), remove);

router.patch("/:id/toggle-status", authenticate, checkPermission("insurance:update"), toggleStatusController);
router.patch("/:id/toggle-archive", authenticate, checkPermission("insurance:update"), toggleArchiveController);

export default router;