import {
  createRole,
  getAllRoles,
  getRoleById,
  updateRolePermissions,
  deleteRole,
} from "./role.service.js";
import { successResponse } from "../../core/responses/apiResponse.js";
import { asyncHandler } from "../../utils/asyncHandler.js";

export const create = asyncHandler(async (req, res) => {
  const role = await createRole(req.body);
  return successResponse(res, 201, "Role created successfully", role);
});

export const getAll = asyncHandler(async (req, res) => {
  const roles = await getAllRoles();
  return successResponse(res, 200, "Roles fetched successfully", roles);
});

export const getById = asyncHandler(async (req, res) => {
  const role = await getRoleById(req.params.id);
  return successResponse(res, 200, "Role fetched successfully", role);
});

export const updatePermissions = asyncHandler(async (req, res) => {
  const { permissionIds } = req.body;
  const role = await updateRolePermissions(req.params.id, permissionIds);
  return successResponse(res, 200, "Role permissions updated successfully", role);
});

export const remove = asyncHandler(async (req, res) => {
  const result = await deleteRole(req.params.id);
  return successResponse(res, 200, result.message);
});