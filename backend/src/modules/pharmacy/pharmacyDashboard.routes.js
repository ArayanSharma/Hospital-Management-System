import { Router } from "express";
import {
  getDashboardSummary,
  getInventoryStats,
  getSalesStats,
  getSupplierStats,
  getStockStatus,
  getRecentStockIn,
  getTopSelling,
  getLowStock,
  getExpiringSoon,
} from "./pharmacyDashboard.controller.js";
import { authenticate } from "../../middleware/auth.middleware.js";

const router = Router();

// Routes for pharmacy dashboard, inventory, sales & suppliers data
router.get("/dashboard", authenticate, getDashboardSummary);
router.get("/inventory/stats", authenticate, getInventoryStats);
router.get("/sales/stats", authenticate, getSalesStats);
router.get("/suppliers/stats", authenticate, getSupplierStats);
router.get("/stock-status", authenticate, getStockStatus);
router.get("/recent-stock-in", authenticate, getRecentStockIn);
router.get("/top-selling", authenticate, getTopSelling);
router.get("/low-stock", authenticate, getLowStock);
router.get("/expiring-soon", authenticate, getExpiringSoon);

export default router;
