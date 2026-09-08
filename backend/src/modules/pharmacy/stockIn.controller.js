import { createStockInTransaction, getAllStockInTransactions, getStockInById } from "./stockIn.service.js";
import { successResponse } from "../../core/responses/apiResponse.js";
import { asyncHandler } from "../../utils/asyncHandler.js";
import { getRequestMeta } from "../../utils/getRequestMeta.js";

export const createStockIn = asyncHandler(async (req, res) => {
  const meta = getRequestMeta(req);
  const stockInRecord = await createStockInTransaction(req.body, req.user, meta);
  return successResponse(res, 201, "Stock In transaction saved successfully", stockInRecord);
});

export const getAllStockIn = asyncHandler(async (req, res) => {
  const data = await getAllStockInTransactions(req.query);
  return successResponse(res, 200, "Stock In transactions fetched successfully", data);
});

export const getStockInDetail = asyncHandler(async (req, res) => {
  const record = await getStockInById(req.params.id);
  return successResponse(res, 200, "Stock In transaction details fetched successfully", record);
});
