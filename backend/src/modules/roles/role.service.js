import Role from "./role.model.js";
import User from "../users/user.model.js";
import AppError from "../../core/errors/AppError.js";
import { getOrSetCache, invalidatePattern, delCache, acquireLock, releaseLock } from "../../utils/redisCache.js";

const DEFAULT_SUPER_ADMIN_ACTIONS = {
  "Patient Management": { create: true, read: true, update: true, delete: true, manage: true },
  "OPD Management": { create: true, read: true, update: true, delete: true, manage: true },
  "IPD Management": { create: true, read: true, update: true, delete: true, manage: true },
  "Prescriptions": { create: true, read: true, update: true, delete: true, manage: true },
  "Laboratory": { create: true, read: true, update: true, delete: true, manage: true },
  "Radiology": { create: true, read: true, update: true, delete: true, manage: true },
  "Billing & Invoicing": { create: true, read: true, update: true, delete: true, manage: true },
  "Pharmacy": { create: true, read: true, update: true, delete: true, manage: true },
  "Inventory / Store": { create: true, read: true, update: true, delete: true, manage: true },
  "User Management": { create: true, read: true, update: true, delete: true, manage: true },
  "Reports": { create: true, read: true, update: true, delete: true, manage: true },
  "Audit Log": { create: true, read: true, update: true, delete: true, manage: true },
};

export const ensureSampleRoles = async () => {
  // Handled natively via DB or seed script
};

export const createRoleService = async (data) => {
  const roleName = data.name ? data.name.toUpperCase().trim() : "";
  const lockKey = `hms:lock:role:${roleName}`;
  const hasLock = await acquireLock(lockKey, 5);
  if (!hasLock) {
    throw new AppError("A role with this name is currently being created", 400);
  }

  try {
    const existing = await Role.findOne({ name: roleName });
    if (existing) throw new AppError("Role with this name already exists", 400);

    const isSys = data.roleType === "System";

    const role = await Role.create({
      name: roleName,
      roleCode: data.roleCode ? data.roleCode.toUpperCase().trim() : roleName,
      roleType: data.roleType || "Custom",
      description: data.description || "",
      isSystemRole: isSys,
      isProtected: isSys,
      status: data.status || "active",
      parentRole: data.parentRole || "",
      maxUsers: data.maxUsers ? Number(data.maxUsers) : null,
      modulePermissions: data.modulePermissions || {},
      actionPermissions: data.actionPermissions || {},
    });

    await invalidatePattern("hms:role:*");
    await invalidatePattern("hms:perm:*");
    await invalidatePattern("hms:route:role*");

    return role;
  } finally {
    await releaseLock(lockKey);
  }
};

export const getRoleByIdService = async (id) => {
  const role = await Role.findById(id).populate("permissionIds");
  if (!role) throw new AppError("Role not found", 404);
  const roleObj = role.toObject();
  const countByName = await User.countDocuments({ roleName: role.name });
  const countById = await User.countDocuments({ roleId: role._id });
  const userCount = Math.max(countByName, countById);

  return {
    ...roleObj,
    userCount,
    usersCount: userCount,
  };
};

export const getAllRolesService = async (params = {}) => {
  const { search, roleType, status } = params;
  const query = {};

  if (roleType && roleType.toLowerCase() !== "all roles" && roleType.toLowerCase() !== "all") {
    if (roleType.toLowerCase() === "system") {
      query.$or = [{ roleType: new RegExp("system", "i") }, { isSystemRole: true }];
    } else if (roleType.toLowerCase() === "custom") {
      query.$or = [{ roleType: new RegExp("custom", "i") }, { isSystemRole: false }, { isSystemRole: { $exists: false } }];
    } else {
      query.roleType = new RegExp(roleType.trim(), "i");
    }
  }
  if (status) {
    query.status = status;
  }
  if (search) {
    query.$or = [
      { name: new RegExp(search, "i") },
      { roleCode: new RegExp(search, "i") },
      { description: new RegExp(search, "i") },
    ];
  }

  const [roles, allRoles, userCountsByName, userCountsById, totalUsers] = await Promise.all([
    Role.find(query).sort({ isSystemRole: -1, createdAt: 1 }),
    Role.find(),
    User.aggregate([{ $group: { _id: "$roleName", count: { $sum: 1 } } }]),
    User.aggregate([{ $group: { _id: "$roleId", count: { $sum: 1 } } }]),
    User.countDocuments(),
  ]);

  const userCountMap = {};
  userCountsByName.forEach((item) => {
    if (item._id) {
      userCountMap[String(item._id).toUpperCase()] = item.count;
    }
  });

  userCountsById.forEach((item) => {
    if (item._id) {
      userCountMap[String(item._id)] = item.count;
    }
  });

  const formattedRoles = roles.map((r) => {
    const roleObj = r.toObject();
    const countByName = userCountMap[roleObj.name.toUpperCase()] || 0;
    const countById = userCountMap[String(roleObj._id)] || 0;
    const userCount = Math.max(countByName, countById);

    return {
      ...roleObj,
      userCount,
      usersCount: userCount,
    };
  });

  const totalRoles = allRoles.length;
  const systemRolesCount = allRoles.filter((r) => r.roleType === "System" || r.isSystemRole).length;
  const customRolesCount = allRoles.filter((r) => r.roleType === "Custom" && !r.isSystemRole).length;

  return {
    roles: formattedRoles,
    overview: {
      totalRoles,
      systemRoles: systemRolesCount,
      customRoles: customRolesCount,
      totalUsers,
    },
  };
};

export const updateRoleService = async (id, data) => {
  const role = await Role.findById(id);
  if (!role) throw new AppError("Role not found", 404);

  if (role.isProtected && data.name && data.name.toUpperCase().trim() !== role.name) {
    throw new AppError("System role names are protected and cannot be modified", 400);
  }

  if (data.name) role.name = data.name.toUpperCase().trim();
  if (data.roleCode) role.roleCode = data.roleCode.toUpperCase().trim();
  if (data.description !== undefined) role.description = data.description;
  if (data.status !== undefined) role.status = data.status;
  if (data.parentRole !== undefined) role.parentRole = data.parentRole;
  if (data.maxUsers !== undefined) role.maxUsers = data.maxUsers ? Number(data.maxUsers) : null;
  if (data.modulePermissions !== undefined) role.modulePermissions = data.modulePermissions;
  if (data.actionPermissions !== undefined) role.actionPermissions = data.actionPermissions;
  if (data.permissionIds !== undefined) role.permissionIds = data.permissionIds;

  await role.save();

  await delCache(`hms:role:detail:${id}`);
  await invalidatePattern("hms:role:*");
  await invalidatePattern("hms:perm:*");
  await invalidatePattern("hms:route:role*");

  return role;
};

export const deleteRoleService = async (id) => {
  const role = await Role.findById(id);
  if (!role) throw new AppError("Role not found", 404);

  if (role.isSystemRole || role.isProtected) {
    throw new AppError("System roles are protected and cannot be deleted", 400);
  }

  if (role.userCount > 0) {
    throw new AppError(`Cannot delete role currently assigned to ${role.userCount} users`, 400);
  }

  await Role.findByIdAndDelete(id);

  await delCache(`hms:role:detail:${id}`);
  await invalidatePattern("hms:role:*");
  await invalidatePattern("hms:perm:*");
  await invalidatePattern("hms:route:role*");

  return { message: "Role deleted successfully" };
};

export const createRole = createRoleService;
export const getAllRoles = getAllRolesService;
export const getRoleById = getRoleByIdService;
export const updateRole = updateRoleService;
export const updateRolePermissions = async (id, permissionIds) => updateRoleService(id, { permissionIds });
export const deleteRole = deleteRoleService;