import Permission from "./permission.model.js";
import AppError from "../../core/errors/AppError.js";
import { ErrorCodes } from "../../core/errors/errorCodes.js";
import { getOrSetCache, invalidatePattern, delCache, acquireLock, releaseLock } from "../../utils/redisCache.js";

export const createPermission = async (data) => {
  const { name, resource, action, description } = data;

  const sanitizedResource = resource ? resource.toLowerCase().trim() : "";
  const sanitizedAction = action ? action.toLowerCase().trim() : "";

  const lockKey = `hms:lock:perm:${sanitizedResource}:${sanitizedAction}`;
  const hasLock = await acquireLock(lockKey, 5);
  if (!hasLock) {
    throw new AppError("A permission entry for this resource and action is currently being created", 409, ErrorCodes.VALIDATION_ERROR);
  }

  try {
    const existing = await Permission.findOne({ resource: sanitizedResource, action: sanitizedAction });
    if (existing) {
      throw new AppError(
        "Permission with this resource and action already exists",
        409,
        ErrorCodes.VALIDATION_ERROR
      );
    }

    const permission = await Permission.create({
      name: name?.trim() || `${sanitizedResource}:${sanitizedAction}`,
      resource: sanitizedResource,
      action: sanitizedAction,
      description: description?.trim() || "",
    });

    await invalidatePattern("hms:perm:*");
    await invalidatePattern("hms:route:perm*");

    return permission;
  } finally {
    await releaseLock(lockKey);
  }
};

export const getAllPermissions = async () => {
  const { data: permissions } = await getOrSetCache(
    "hms:perm:all",
    () => Permission.find().sort({ resource: 1, action: 1 }),
    600
  );
  return permissions;
};

export const getPermissionsByResource = async (resource) => {
  const sanitizedResource = resource.toLowerCase().trim();
  const { data: permissions } = await getOrSetCache(
    `hms:perm:res:${sanitizedResource}`,
    () => Permission.find({ resource: sanitizedResource }),
    600
  );
  return permissions;
};

export const deletePermission = async (id) => {
  const permission = await Permission.findById(id);
  if (!permission) {
    throw new AppError("Permission not found", 404, ErrorCodes.NOT_FOUND);
  }

  await permission.deleteOne();

  await delCache("hms:perm:all");
  await delCache(`hms:perm:res:${permission.resource}`);
  await invalidatePattern("hms:perm:*");
  await invalidatePattern("hms:route:perm*");

  return { message: "Permission deleted successfully" };
};