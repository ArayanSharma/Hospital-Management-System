import {
  createPharmacySale,
  getAllPharmacySales,
  getPharmacySaleById,
  markSaleAsPaid,
} from "./pharmacySale.service.js";
import { successResponse } from "../../core/responses/apiResponse.js";
import { asyncHandler } from "../../utils/asyncHandler.js";
import { getRequestMeta } from "../../utils/getRequestMeta.js";

export const create = asyncHandler(async (req, res) => {
  const meta = getRequestMeta(req);
  const sale = await createPharmacySale(req.body, req.user, meta);
  return successResponse(res, 201, "Pharmacy sale recorded successfully", sale);
});

export const getAll = asyncHandler(async (req, res) => {
  const result = await getAllPharmacySales(req.query);
  return successResponse(res, 200, "Pharmacy sales fetched successfully", result);
});

export const getById = asyncHandler(async (req, res) => {
  const sale = await getPharmacySaleById(req.params.id);
  return successResponse(res, 200, "Pharmacy sale fetched successfully", sale);
});

export const markPaid = asyncHandler(async (req, res) => {
  const meta = getRequestMeta(req);
  const sale = await markSaleAsPaid(req.params.id, req.user, meta);
  return successResponse(res, 200, "Sale marked as paid", sale);
});