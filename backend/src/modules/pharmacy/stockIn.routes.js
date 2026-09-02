import { Router } from "express";
import { createStockIn, getAllStockIn, getStockInDetail } from "./stockIn.controller.js";
import { authenticate } from "../../middleware/auth.middleware.js";

const router = Router();

router.post("/", authenticate, createStockIn);
router.get("/", authenticate, getAllStockIn);
router.get("/:id", authenticate, getStockInDetail);

export default router;
