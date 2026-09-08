import { Router } from "express";
import { createStockIn, getAllStockIn, getStockInDetail } from "./stockIn.controller.js";
import { authenticate } from "../../middleware/auth.middleware.js";
import { routeCache } from "../../middleware/cache.middleware.js";

const router = Router();

router.post("/", authenticate, createStockIn);
router.get("/", authenticate, routeCache(60, "hms:route:stockin", true), getAllStockIn);
router.get("/:id", authenticate, routeCache(300, "hms:route:stockin", true), getStockInDetail);

export default router;
