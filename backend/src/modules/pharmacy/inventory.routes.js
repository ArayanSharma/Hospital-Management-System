import express from "express";
import {
  adjustStockController,
  getStockHistoryController,
  setReorderLevelController,
  archiveBatchController,
  restoreBatchController,
  quarantineBatchController,
} from "./inventory.controller.js";
import { getInventoryStats } from "./pharmacyDashboard.controller.js";
import { authenticate } from "../../middleware/auth.middleware.js";
import { routeCache } from "../../middleware/cache.middleware.js";

const router = express.Router();

router.get("/stats", authenticate, routeCache(60, "hms:route:inventory:stats", true), getInventoryStats);
router.patch("/:id/adjust", authenticate, adjustStockController);
router.get("/:id/history", authenticate, routeCache(60, "hms:route:inventory", true), getStockHistoryController);
router.patch("/:id/reorder-level", authenticate, setReorderLevelController);
router.patch("/:id/archive", authenticate, archiveBatchController);
router.patch("/:id/restore", authenticate, restoreBatchController);
router.patch("/:id/quarantine", authenticate, quarantineBatchController);

export default router;
