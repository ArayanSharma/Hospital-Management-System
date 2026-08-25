import { getAuditLogs, getAuditLogsByResourceId } from "./audit-log.service.js";
import { successResponse } from "../../core/responses/apiResponse.js";
import { asyncHandler } from "../../utils/asyncHandler.js";

export const getAll = asyncHandler(async (req, res) => {
  const result = await getAuditLogs(req.query);
  return successResponse(res, 200, "Audit logs fetched successfully", result);
});

export const getByResourceId = asyncHandler(async (req, res) => {
  const logs = await getAuditLogsByResourceId(req.params.resourceId);
  return successResponse(res, 200, "Audit logs fetched successfully", logs);
});