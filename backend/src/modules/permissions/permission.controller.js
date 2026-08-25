import {
  createPermission,
  getAllPermissions,
  getPermissionsByResource,
  deletePermission,
} from "./permission.service.js";
import { successResponse } from "../../core/responses/apiResponse.js";
import { asyncHandler } from "../../utils/asyncHandler.js";

export const create = asyncHandler(async (req, res) => {
  const permission = await createPermission(req.body);
  return successResponse(res, 201, "Permission created successfully", permission);
});

export const getAll = asyncHandler(async (req, res) => {
  const permissions = await getAllPermissions();
  return successResponse(res, 200, "Permissions fetched successfully", permissions);
});

export const getByResource = asyncHandler(async (req, res) => {
  const permissions = await getPermissionsByResource(req.params.resource);
  return successResponse(res, 200, "Permissions fetched successfully", permissions);
});

export const remove = asyncHandler(async (req, res) => {
  const result = await deletePermission(req.params.id);
  return successResponse(res, 200, result.message);
});