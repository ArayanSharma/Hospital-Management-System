import { useSelector } from "react-redux";

// Map navigation permission keys to Permission Matrix module names
const PERM_TO_MODULE_MAP = {
  "user:read": "User",
  "role:read": "Role",
  "permission:read": "Role",
  "patient:read": "Patient",
  "doctor:read": "Doctor",
  "department:read": "Doctor",
  "appointment:read": "Appointment",
  "opd:read": "Appointment",
  "admission:read": "IPD",
  "lab_test:read": "Laboratory",
  "radiology_test:read": "Radiology",
  "medicine:read": "Pharmacy",
  "invoice:read": "Billing",
  "insurance:read": "Billing",
  "report:read": "Audit Log",
  "audit_log:read": "Audit Log",
  "setting:read": "Role",
};

// Map navigation permission keys to actionPermissions module names
const PERM_TO_ACTION_MODULE_MAP = {
  "user:read": "User Management",
  "role:read": "User Management",
  "permission:read": "User Management",
  "patient:read": "Patient Management",
  "doctor:read": "Patient Management",
  "department:read": "Patient Management",
  "appointment:read": "OPD Management",
  "opd:read": "OPD Management",
  "admission:read": "IPD Management",
  "lab_test:read": "Laboratory",
  "radiology_test:read": "Radiology",
  "medicine:read": "Pharmacy",
  "invoice:read": "Billing & Invoicing",
  "insurance:read": "Billing & Invoicing",
  "report:read": "Reports",
  "audit_log:read": "Audit Log",
  "setting:read": "User Management",
};

// Default fallback module permissions per role if roleId object is not yet populated
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
    Billing: "No Access",
    Pharmacy: "No Access",
    Laboratory: "No Access",
    Radiology: "No Access",
    Inventory: "No Access",
    User: "Read Only",
    Role: "No Access",
    "Audit Log": "No Access",
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

export const usePermission = () => {
  const { user } = useSelector((state) => state.auth);

  const hasPermission = (permissionName) => {
    // 1. Dashboard / null permission is accessible to everyone
    if (!permissionName) return true;

    if (!user) return false;

    // 2. SUPER_ADMIN and ADMIN have access to all modules
    const roleName = (
      user?.roleId?.name ||
      user?.roleId?.roleCode ||
      user?.roleName ||
      user?.role?.name ||
      user?.role ||
      ""
    ).toUpperCase();

    if (roleName === "SUPER_ADMIN" || roleName === "SUPERADMIN" || roleName === "ADMIN") {
      return true;
    }

    // Extract modulePermissions and actionPermissions
    let modulePermissions =
      user?.roleId?.modulePermissions || user?.modulePermissions || user?.role?.modulePermissions;

    // Fallback to role-specific defaults if modulePermissions is missing or empty
    if (!modulePermissions || Object.keys(modulePermissions).length === 0) {
      modulePermissions = DEFAULT_ROLE_MODULE_PERMISSIONS[roleName] || {};
    }

    const actionPermissions =
      user?.roleId?.actionPermissions || user?.actionPermissions || user?.role?.actionPermissions || {};

    const targetModuleName = PERM_TO_MODULE_MAP[permissionName];

    // 3. Check modulePermissions
    if (targetModuleName && modulePermissions[targetModuleName] !== undefined) {
      const moduleAccess = modulePermissions[targetModuleName];
      return moduleAccess !== "No Access";
    }

    // Alternate key check for Audit Log / AuditLog
    if (permissionName === "audit_log:read" || permissionName === "report:read") {
      const auditAccess = modulePermissions["Audit Log"] || modulePermissions["AuditLog"];
      if (auditAccess !== undefined) {
        return auditAccess !== "No Access";
      }
    }

    // 4. Check actionPermissions object if present
    const actionModName = PERM_TO_ACTION_MODULE_MAP[permissionName];
    if (actionModName && actionPermissions[actionModName]) {
      const actObj = actionPermissions[actionModName];
      return !!(actObj.read || actObj.create || actObj.update || actObj.manage);
    }

    // 5. Fallback check for permissionIds array if present
    const permissions =
      user?.roleId?.permissionIds || user?.permissions || user?.roleId?.permissions || [];

    if (Array.isArray(permissions) && permissions.length > 0) {
      return permissions.some((p) => {
        if (typeof p === "string") return p === permissionName;
        return p?.name === permissionName;
      });
    }

    // 6. Strict default for non-superadmin: hide if not explicitly granted
    return false;
  };

  return { hasPermission };
};