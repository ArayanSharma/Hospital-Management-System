import { getMyNotifications, markAsRead, markAllAsRead } from "./notification.service.js";
import { successResponse } from "../../core/responses/apiResponse.js";
import { asyncHandler } from "../../utils/asyncHandler.js";

export const getMine = asyncHandler(async (req, res) => {
  const result = await getMyNotifications(req.user.id, req.query);
  return successResponse(res, 200, "Notifications fetched successfully", result);
});

export const markRead = asyncHandler(async (req, res) => {
  const notification = await markAsRead(req.params.id, req.user.id);
  return successResponse(res, 200, "Notification marked as read", notification);
});

export const markAllRead = asyncHandler(async (req, res) => {
  const result = await markAllAsRead(req.user.id);
  return successResponse(res, 200, result.message);
});