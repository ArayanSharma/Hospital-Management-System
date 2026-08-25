import {
  createInventoryItem,
  getAllInventoryItems,
  getInventoryItemById,
  stockIn,
  updateInventoryItem,
} from "./inventoryItem.service.js";
import { successResponse } from "../../core/responses/apiResponse.js";
import { asyncHandler } from "../../utils/asyncHandler.js";
import { getRequestMeta } from "../../utils/getRequestMeta.js";

export const create = asyncHandler(async (req, res) => {
  const meta = getRequestMeta(req);
  const item = await createInventoryItem(req.body, req.user, meta);
  return successResponse(res, 201, "Inventory item created successfully", item);
});

export const getAll = asyncHandler(async (req, res) => {
  const result = await getAllInventoryItems(req.query);
  return successResponse(res, 200, "Inventory items fetched successfully", result);
});

export const getById = asyncHandler(async (req, res) => {
  const item = await getInventoryItemById(req.params.id);
  return successResponse(res, 200, "Inventory item fetched successfully", item);
});

export const addStock = asyncHandler(async (req, res) => {
  const meta = getRequestMeta(req);
  const item = await stockIn(req.params.id, req.body.quantity, req.user, meta);
  return successResponse(res, 200, "Stock added successfully", item);
});

export const update = asyncHandler(async (req, res) => {
  const meta = getRequestMeta(req);
  const item = await updateInventoryItem(req.params.id, req.body, req.user, meta);
  return successResponse(res, 200, "Inventory item updated successfully", item);
});