import { Router } from "express";
import {
  create,
  getAll,
  getById,
  update,
  remove,
  payOutstandingController,
  toggleStatusController,
  toggleArchiveController,
  sendPurchaseOrderController,
} from "./supplier.controller.js";
import { authenticate } from "../../middleware/auth.middleware.js";
import { checkPermission } from "../../middleware/permission.middleware.js";
import { routeCache } from "../../middleware/cache.middleware.js";

const router = Router();

router.post("/", authenticate, checkPermission("supplier:create"), create);
router.get("/", authenticate, checkPermission("supplier:read"), routeCache(60, "hms:route:supplier", true), getAll);
router.get("/:id", authenticate, checkPermission("supplier:read"), routeCache(300, "hms:route:supplier", true), getById);
router.put("/:id", authenticate, checkPermission("supplier:update"), update);
router.delete("/:id", authenticate, checkPermission("supplier:delete"), remove);

router.post("/:id/pay-outstanding", authenticate, checkPermission("supplier:update"), payOutstandingController);
router.post("/:id/send-po", authenticate, checkPermission("supplier:update"), sendPurchaseOrderController);
router.patch("/:id/toggle-status", authenticate, checkPermission("supplier:update"), toggleStatusController);
router.patch("/:id/toggle-archive", authenticate, checkPermission("supplier:update"), toggleArchiveController);

export default router;