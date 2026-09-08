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
import { routeCache } from "../../middleware/cache.middleware.js";

const router = Router();

// Routes for pharmacy dashboard, inventory, sales & suppliers data with Redis route caching
router.get("/dashboard", authenticate, routeCache(120, "hms:route:pharmacy:dash", true), getDashboardSummary);
router.get("/inventory/stats", authenticate, routeCache(120, "hms:route:pharmacy:dash", true), getInventoryStats);
router.get("/sales/stats", authenticate, routeCache(120, "hms:route:pharmacy:dash", true), getSalesStats);
router.get("/suppliers/stats", authenticate, routeCache(120, "hms:route:pharmacy:dash", true), getSupplierStats);
router.get("/stock-status", authenticate, routeCache(60, "hms:route:pharmacy:dash", true), getStockStatus);
router.get("/recent-stock-in", authenticate, routeCache(60, "hms:route:pharmacy:dash", true), getRecentStockIn);
router.get("/top-selling", authenticate, routeCache(300, "hms:route:pharmacy:dash", true), getTopSelling);
router.get("/low-stock", authenticate, routeCache(60, "hms:route:pharmacy:dash", true), getLowStock);
router.get("/expiring-soon", authenticate, routeCache(300, "hms:route:pharmacy:dash", true), getExpiringSoon);

export default router;
