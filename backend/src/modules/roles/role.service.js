import Role from "./role.model.js";
import AppError from "../../core/errors/AppError.js";

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
  try {
    for (const r of sampleRoles) {
      const existing = await Role.findOne({ name: r.name });
      if (!existing) {
        await Role.create(r);
      }
    }
  } catch (err) {
    console.error("Error seeding sample roles:", err);
  }
};

export const createRoleService = async (data) => {
  await ensureSampleRoles();
  const existing = await Role.findOne({ name: data.name.toUpperCase() });
  if (existing) throw new AppError("Role with this name already exists", 400);

  const isSys = data.roleType === "System";

  const role = await Role.create({
    name: data.name.toUpperCase(),
    roleCode: data.roleCode ? data.roleCode.toUpperCase() : data.name.toUpperCase(),
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
  return role;
};

export const getRoleByIdService = async (id) => {
  const role = await Role.findById(id).populate("permissionIds");
  if (!role) throw new AppError("Role not found", 404);
  return role;
};

export const getAllRolesService = async (params = {}) => {
  await ensureSampleRoles();
  const { search, roleType, status } = params;
  const query = {};

  if (roleType && roleType !== "All Roles") {
    query.roleType = roleType;
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

  const roles = await Role.find(query).sort({ isSystemRole: -1, createdAt: 1 });
  const allRoles = await Role.find();

  const totalRoles = allRoles.length;
  const systemRolesCount = allRoles.filter((r) => r.roleType === "System" || r.isSystemRole).length;
  const customRolesCount = allRoles.filter((r) => r.roleType === "Custom" && !r.isSystemRole).length;
  const totalUsersCount = allRoles.reduce((sum, r) => sum + (r.userCount || 0), 0);

  return {
    roles,
    overview: {
      totalRoles,
      systemRoles: systemRolesCount,
      customRoles: customRolesCount,
      totalUsers: totalUsersCount,
    },
  };
};

export const updateRoleService = async (id, data) => {
  const role = await Role.findById(id);
  if (!role) throw new AppError("Role not found", 404);

  if (role.isProtected && data.name && data.name !== role.name) {
    throw new AppError("System role names are protected and cannot be modified", 400);
  }

  if (data.name) role.name = data.name.toUpperCase();
  if (data.roleCode) role.roleCode = data.roleCode.toUpperCase();
  if (data.description !== undefined) role.description = data.description;
  if (data.status !== undefined) role.status = data.status;
  if (data.parentRole !== undefined) role.parentRole = data.parentRole;
  if (data.maxUsers !== undefined) role.maxUsers = data.maxUsers ? Number(data.maxUsers) : null;
  if (data.modulePermissions !== undefined) role.modulePermissions = data.modulePermissions;
  if (data.actionPermissions !== undefined) role.actionPermissions = data.actionPermissions;
  if (data.permissionIds !== undefined) role.permissionIds = data.permissionIds;

  await role.save();
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
  return { message: "Role deleted successfully" };
};

export const createRole = createRoleService;
export const getAllRoles = getAllRolesService;
export const getRoleById = getRoleByIdService;
export const updateRole = updateRoleService;
export const updateRolePermissions = async (id, permissionIds) => updateRoleService(id, { permissionIds });
export const deleteRole = deleteRoleService;