/**
 * User Management Constants & Color Schemes
 */

export const USER_ROLES = [
  "All Roles",
  "DOCTOR",
  "NURSE",
  "RECEPTIONIST",
  "PHARMACIST",
  "ACCOUNTANT",
  "ADMIN",
];

export const USER_STATUSES = [
  "All Status",
  "Active",
  "Inactive",
  "Suspended",
  "Blocked",
];

export const USER_DEPARTMENTS = [
  "All Departments",
  "Cardiology",
  "General Ward",
  "Front Office",
  "Pharmacy",
  "Accounts",
  "Administration",
  "ICU",
  "Orthopedics",
  "Pediatrics",
  "Radiology",
];

export const getRoleBadgeStyle = (roleName) => {
  const r = String(roleName || "").toUpperCase();
  switch (r) {
    case "DOCTOR":
      return "bg-blue-50 text-blue-700 border-blue-200";
    case "NURSE":
      return "bg-purple-50 text-purple-700 border-purple-200";
    case "RECEPTIONIST":
      return "bg-orange-50 text-orange-700 border-orange-200";
    case "PHARMACIST":
      return "bg-emerald-50 text-emerald-700 border-emerald-200";
    case "ACCOUNTANT":
      return "bg-amber-50 text-amber-700 border-amber-200";
    case "ADMIN":
    case "SUPER_ADMIN":
      return "bg-slate-100 text-slate-800 border-slate-300";
    default:
      return "bg-slate-50 text-slate-700 border-slate-200";
  }
};

export const getStatusBadgeStyle = (status) => {
  const s = String(status || "").toLowerCase();
  switch (s) {
    case "active":
      return {
        bg: "bg-emerald-50 text-emerald-700 border-emerald-200",
        dot: "bg-emerald-500",
        label: "Active",
      };
    case "inactive":
      return {
        bg: "bg-slate-100 text-slate-600 border-slate-200",
        dot: "bg-slate-400",
        label: "Inactive",
      };
    case "suspended":
      return {
        bg: "bg-amber-50 text-amber-700 border-amber-200",
        dot: "bg-amber-500",
        label: "Suspended",
      };
    case "blocked":
      return {
        bg: "bg-rose-50 text-rose-700 border-rose-200",
        dot: "bg-rose-500",
        label: "Blocked",
      };
    default:
      return {
        bg: "bg-slate-50 text-slate-700 border-slate-200",
        dot: "bg-slate-400",
        label: status || "Active",
      };
  }
};
