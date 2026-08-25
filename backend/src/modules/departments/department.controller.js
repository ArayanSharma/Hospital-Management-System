import {
  createDepartment,
  getAllDepartments,
  getDepartmentById,
  updateDepartment,
  deleteDepartment,
} from "./department.service.js";
import { successResponse } from "../../core/responses/apiResponse.js";
import { asyncHandler } from "../../utils/asyncHandler.js";
import { getRequestMeta } from "../../utils/getRequestMeta.js";

export const create = asyncHandler(async (req, res) => {
  const meta = getRequestMeta(req);
  const department = await createDepartment(req.body, req.user, meta);
  return successResponse(res, 201, "Department created successfully", department);
});

export const getAll = asyncHandler(async (req, res) => {
  const departments = await getAllDepartments(req.query);
  return successResponse(res, 200, "Departments fetched successfully", departments);
});

export const getById = asyncHandler(async (req, res) => {
  const department = await getDepartmentById(req.params.id);
  return successResponse(res, 200, "Department fetched successfully", department);
});

export const update = asyncHandler(async (req, res) => {
  const meta = getRequestMeta(req);
  const department = await updateDepartment(req.params.id, req.body, req.user, meta);
  return successResponse(res, 200, "Department updated successfully", department);
});

export const remove = asyncHandler(async (req, res) => {
  const meta = getRequestMeta(req);
  const result = await deleteDepartment(req.params.id, req.user, meta);
  return successResponse(res, 200, result.message);
});