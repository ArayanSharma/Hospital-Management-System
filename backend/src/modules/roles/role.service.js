import Role from "./role.model.js";
import Permission from "../permissions/permission.model.js";
import AppError from "../../core/errors/AppError.js";
import { ErrorCodes } from "../../core/errors/errorCodes.js";

export const createRole = async (data) => {
  const { name, description, permissionIds = [] } = data;

  const existing = await Role.findOne({ name: name.toUpperCase() });
  if (existing) {
    throw new AppError("Role already exists", 409, ErrorCodes.VALIDATION_ERROR);
  }

  if (permissionIds.length > 0) {
    const validPermissions = await Permission.find({ _id: { $in: permissionIds } });
    if (validPermissions.length !== permissionIds.length) {
      throw new AppError(
        "One or more permission IDs are invalid",
        400,
        ErrorCodes.VALIDATION_ERROR
      );
    }
  }

  const role = await Role.create({
    name: name.toUpperCase(),
    description,
    permissionIds,
  });

  return role;
};

export const getAllRoles = async () => {
  return Role.find().populate("permissionIds", "name resource action");
};

export const getRoleById = async (id) => {
  const role = await Role.findById(id).populate("permissionIds", "name resource action");
  if (!role) {
    throw new AppError("Role not found", 404, ErrorCodes.NOT_FOUND);
  }
  return role;
};

export const updateRolePermissions = async (id, permissionIds) => {
  const role = await Role.findById(id);
  if (!role) {
    throw new AppError("Role not found", 404, ErrorCodes.NOT_FOUND);
  }

  if (role.isSystemRole) {
    throw new AppError(
      "Cannot modify system role permissions",
      403,
      ErrorCodes.FORBIDDEN_ROLE
    );
  }

  const validPermissions = await Permission.find({ _id: { $in: permissionIds } });
  if (validPermissions.length !== permissionIds.length) {
    throw new AppError(
      "One or more permission IDs are invalid",
      400,
      ErrorCodes.VALIDATION_ERROR
    );
  }

  role.permissionIds = permissionIds;
  await role.save();
  return role;
};

export const deleteRole = async (id) => {
  const role = await Role.findById(id);
  if (!role) {
    throw new AppError("Role not found", 404, ErrorCodes.NOT_FOUND);
  }

  if (role.isSystemRole) {
    throw new AppError("System role cannot be deleted", 403, ErrorCodes.FORBIDDEN_ROLE);
  }

  await role.deleteOne();
  return { message: "Role deleted successfully" };
};