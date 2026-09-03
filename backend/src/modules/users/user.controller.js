import {
  createUser,
  getUserById,
  getUsers,
  updateUser,
  changePassword,
  deleteUser,
  exportUsersService,
} from "./user.service.js";
import { successResponse } from "../../core/responses/apiResponse.js";
import { asyncHandler } from "../../utils/asyncHandler.js";

export const create = asyncHandler(async (req, res) => {
  const user = await createUser(req.body);
  return successResponse(res, 201, "User created successfully", user);
});

export const exportCSV = asyncHandler(async (req, res) => {
  const csvData = await exportUsersService(req.query);
  const filename = `Users_Export_${new Date().toISOString().split("T")[0]}.csv`;
  res.setHeader("Content-Type", "text/csv");
  res.setHeader("Content-Disposition", `attachment; filename="${filename}"`);
  return res.status(200).send(csvData);
});

export const getById = asyncHandler(async (req, res) => {
  const user = await getUserById(req.params.id);
  return successResponse(res, 200, "User fetched successfully", user);
});

export const getAll = asyncHandler(async (req, res) => {
  const result = await getUsers(req.query);
  return successResponse(res, 200, "Users fetched successfully", result);
});

export const update = asyncHandler(async (req, res) => {
  const user = await updateUser(req.params.id, req.body);
  return successResponse(res, 200, "User updated successfully", user);
});

export const changeUserPassword = asyncHandler(async (req, res) => {
  const { oldPassword, newPassword } = req.body;
  const result = await changePassword(req.user.id, oldPassword, newPassword);
  return successResponse(res, 200, result.message);
});

export const remove = asyncHandler(async (req, res) => {
  const result = await deleteUser(req.params.id);
  return successResponse(res, 200, result.message);
});