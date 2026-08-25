import Permission from "./permission.model.js";
import AppError from "../../core/errors/AppError.js";
import { ErrorCodes } from "../../core/errors/errorCodes.js";

export const createPermission = async (data) => {
  const { name, resource, action, description } = data;

  const existing = await Permission.findOne({ resource, action });
  if (existing) {
    throw new AppError(
      "Permission with this resource and action already exists",
      409,
      ErrorCodes.VALIDATION_ERROR
    );
  }

  const permission = await Permission.create({ name, resource, action, description });
  return permission;
};

export const getAllPermissions = async () => {
  return Permission.find().sort({ resource: 1, action: 1 });
};

export const getPermissionsByResource = async (resource) => {
  return Permission.find({ resource: resource.toLowerCase() });
};

export const deletePermission = async (id) => {
  const permission = await Permission.findById(id);
  if (!permission) {
    throw new AppError("Permission not found", 404, ErrorCodes.NOT_FOUND);
  }
  await permission.deleteOne();
  return { message: "Permission deleted successfully" };
};