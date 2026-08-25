import { Router } from "express";
import { create, getAll, getById, addStock, update } from "./inventoryItem.controller.js";
import { authenticate } from "../../middleware/auth.middleware.js";
import { checkPermission } from "../../middleware/permission.middleware.js";
import { validate } from "../../middleware/validation.middleware.js";
import { createInventoryItemSchema, stockInSchema, updateInventoryItemSchema } from "./inventoryItem.validation.js";

const router = Router();

router.post("/", authenticate, checkPermission("inventory:create"), validate(createInventoryItemSchema), create);
router.get("/", authenticate, checkPermission("inventory:read"), getAll);
router.get("/:id", authenticate, checkPermission("inventory:read"), getById);
router.patch("/:id/stock-in", authenticate, checkPermission("inventory:update"), validate(stockInSchema), addStock);
router.patch("/:id", authenticate, checkPermission("inventory:update"), validate(updateInventoryItemSchema), update);

export default router;