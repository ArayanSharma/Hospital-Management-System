import User from "../modules/users/user.model.js";
import Role from "../modules/roles/role.model.js";
import AppError from "../core/errors/AppError.js";
import { ErrorCodes } from "../core/errors/errorCodes.js";

// Mapping between backend permission resource names and frontend module names
const MODULE_NAME_MAP = {
  patient: "Patient",
  doctor: "Doctor",
  appointment: "Appointment",
  billing: "Billing",
  invoice: "Billing",
  payment: "Billing",
  pharmacy: "Pharmacy",
  medicine: "Pharmacy",
  laboratory: "Laboratory",
  lab_test: "Laboratory",
  radiology: "Radiology",
  radiology_test: "Radiology",
  inventory: "Inventory",
  user: "User",
  role: "Role",
  audit_log: "Audit Log",
  report: "Audit Log",
};

// Mapping for granular actionPermissions
const ACTION_MODULE_MAP = {
  patient: "Patient Management",
  opd: "OPD Management",
  ipd: "IPD Management",
  prescription: "Prescriptions",
  laboratory: "Laboratory",
  radiology: "Radiology",
  billing: "Billing & Invoicing",
  invoice: "Billing & Invoicing",
  pharmacy: "Pharmacy",
  user: "User Management",
  report: "Reports",
  audit_log: "Audit Log",
};

// Fallback module permissions per system role
const DEFAULT_ROLE_MODULE_PERMISSIONS = {
  SUPER_ADMIN: {
    Patient: "Full Access",
    Doctor: "Full Access",
    Appointment: "Full Access",
    Billing: "Full Access",
    Pharmacy: "Full Access",
    Laboratory: "Full Access",
    Radiology: "Full Access",
    Inventory: "Full Access",
    User: "Full Access",
    Role: "Full Access",
    "Audit Log": "Full Access",
  },
  ADMIN: {
    Patient: "Full Access",
    Doctor: "Full Access",
    Appointment: "Full Access",
    Billing: "Full Access",
    Pharmacy: "Full Access",
    Laboratory: "Full Access",
    Radiology: "Full Access",
    Inventory: "Full Access",
    User: "Full Access",
    Role: "Full Access",
    "Audit Log": "Full Access",
  },
  ACCOUNTANT: {
    Patient: "Read Only",
    Doctor: "No Access",
    Appointment: "Read Only",
    Billing: "Full Access",
    Pharmacy: "Read Only",
    Laboratory: "Read Only",
    Radiology: "Read Only",
    Inventory: "Read Only",
    User: "Read Only",
    Role: "No Access",
    "Audit Log": "Read Only",
  },
  DOCTOR: {
    Patient: "Read Only",
    Doctor: "Full Access",
    Appointment: "Full Access",
    Billing: "Read Only",
    Pharmacy: "No Access",
    Laboratory: "Read Only",
    Radiology: "Read Only",
    Inventory: "No Access",
    User: "No Access",
    Role: "No Access",
    "Audit Log": "Read Only",
  },
  NURSE: {
    Patient: "Full Access",
    Doctor: "Read Only",
    Appointment: "Full Access",
    Billing: "No Access",
    Pharmacy: "No Access",
    Laboratory: "No Access",
    Radiology: "No Access",
    Inventory: "No Access",
    User: "No Access",
    Role: "No Access",
    "Audit Log": "No Access",
  },
  RECEPTIONIST: {
    Patient: "Full Access",
    Doctor: "Read Only",
    Appointment: "Full Access",
    Billing: "Read Only",
    Pharmacy: "No Access",
    Laboratory: "No Access",
    Radiology: "No Access",
    Inventory: "No Access",
    User: "No Access",
    Role: "No Access",
    "Audit Log": "No Access",
  },
  PHARMACIST: {
    Patient: "Read Only",
    Doctor: "Read Only",
    Appointment: "No Access",
    Billing: "Full Access",
    Pharmacy: "Full Access",
    Laboratory: "No Access",
    Radiology: "No Access",
    Inventory: "Full Access",
    User: "No Access",
    Role: "No Access",
    "Audit Log": "No Access",
  },
};

export const checkPermission = (requiredPermission) => {
  return async (req, res, next) => {
    try {
      if (!req.user || !req.user.id) {
        throw new AppError("Authentication required", 401, ErrorCodes.AUTH_UNAUTHORIZED);
      }

      // Fetch user with role
      let user = await User.findById(req.user.id).populate("roleId");

      if (!user) {
        throw new AppError("User not found", 404, ErrorCodes.USER_NOT_FOUND);
      }

      // If user has no populated roleId, look up Role by roleName
      let userRole = user.roleId;
      if (!userRole && user.roleName) {
        userRole = await Role.findOne({ name: user.roleName.toUpperCase() });
      }

      const roleCode = (
        userRole?.name ||
        userRole?.roleCode ||
        user.roleName ||
        ""
      ).toUpperCase();

      // 1. SUPER_ADMIN and ADMIN always have full access
      if (roleCode === "SUPER_ADMIN" || roleCode === "ADMIN") {
        return next();
      }

      // 2. Allow dashboard access for all authenticated staff members
      if (requiredPermission === "dashboard:read" || requiredPermission.startsWith("dashboard:")) {
        return next();
      }

      // Parse required permission into resource and action (e.g. "patient:read" -> resource: "patient", action: "read")
      const [resource, action] = requiredPermission.split(":");

      // Get module name from resource (e.g. "patient" -> "Patient", "user" -> "User")
      const modName = MODULE_NAME_MAP[resource] || resource;

      // Extract modulePermissions from userRole document in DB
      let modulePermissions = userRole?.modulePermissions || {};

      // Retrieve access level for module
      let modAccess =
        modulePermissions[modName] ||
        modulePermissions[resource] ||
        modulePermissions[modName.toLowerCase()];

      // Fallback to DEFAULT_ROLE_MODULE_PERMISSIONS if missing in userRole document
      if (!modAccess && DEFAULT_ROLE_MODULE_PERMISSIONS[roleCode]) {
        modAccess = DEFAULT_ROLE_MODULE_PERMISSIONS[roleCode][modName];
      }

      if (modAccess && modAccess !== "No Access") {
        // If action is read, or access is Full Access
        if (action === "read" || modAccess === "Full Access") {
          return next();
        }
        if (modAccess === "Read Only" && action === "read") {
          return next();
        }
        if (modAccess === "Limited Access" && (action === "read" || action === "create")) {
          return next();
        }
      }

      // Check actionPermissions object if present
      const actModName = ACTION_MODULE_MAP[resource];
      const actionPermissions = userRole?.actionPermissions || {};
      if (actModName && actionPermissions[actModName]?.[action || "read"]) {
        return next();
      }

      // Check granular permissionIds array if populated
      if (userRole?.permissionIds && Array.isArray(userRole.permissionIds)) {
        const userPermissions = userRole.permissionIds.map((p) =>
          typeof p === "object" ? p.name : p.toString()
        );
        if (userPermissions.includes(requiredPermission)) {
          return next();
        }
      }

      // Otherwise deny access
      throw new AppError(
        "You don't have permission to perform this action",
        403,
        ErrorCodes.FORBIDDEN_PERMISSION
      );
    } catch (err) {
      next(err);
    }
  };
};
