import express from "express";
import {
  adjustStockController,
  getStockHistoryController,
  setReorderLevelController,
  archiveBatchController,
  restoreBatchController,
  quarantineBatchController,
} from "./inventory.controller.js";

const router = express.Router();

router.patch("/:id/adjust", adjustStockController);
router.get("/:id/history", getStockHistoryController);
router.patch("/:id/reorder-level", setReorderLevelController);
router.patch("/:id/archive", archiveBatchController);
router.patch("/:id/restore", restoreBatchController);
router.patch("/:id/quarantine", quarantineBatchController);

export default router;
