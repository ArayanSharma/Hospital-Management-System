import { Router } from "express";
import {
  create,
  getAll,
  getById,
  updateStatus,
  updateClaim,
  addNote,
  uploadDocument,
} from "./insuranceClaim.controller.js";
import { authenticate } from "../../middleware/auth.middleware.js";
import { checkPermission } from "../../middleware/permission.middleware.js";
import { routeCache } from "../../middleware/cache.middleware.js";

const router = Router();

router.post("/", authenticate, checkPermission("insurance:create"), create);
router.get("/", authenticate, checkPermission("insurance:read"), routeCache(60, "hms:route:claims", true), getAll);
router.get("/:id", authenticate, checkPermission("insurance:read"), routeCache(300, "hms:route:claims", true), getById);

router.put("/:id", authenticate, checkPermission("insurance:update"), updateClaim);
router.patch("/:id/status", authenticate, checkPermission("insurance:update"), updateStatus);
router.post("/:id/notes", authenticate, checkPermission("insurance:update"), addNote);
router.post("/:id/documents", authenticate, checkPermission("insurance:update"), uploadDocument);

export default router;