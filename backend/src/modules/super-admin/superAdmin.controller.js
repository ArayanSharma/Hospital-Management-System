import { getDashboardStats, getRecentActivity } from "./superAdmin.service.js";
import { successResponse } from "../../core/responses/apiResponse.js";
import { asyncHandler } from "../../utils/asyncHandler.js";

export const dashboard = asyncHandler(async (req, res) => {
  const stats = await getDashboardStats(req.query);
  return successResponse(res, 200, "Dashboard stats fetched successfully", stats);
});

export const activity = asyncHandler(async (req, res) => {
  const limit = parseInt(req.query.limit) || 20;
  const feed = await getRecentActivity(limit);
  return successResponse(res, 200, "Recent activity fetched successfully", feed);
});