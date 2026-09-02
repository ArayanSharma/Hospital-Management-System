/**
 * Roles & Permissions Module Constants
 */

export const ROLE_FILTER_TYPES = ["All Roles", "System", "Custom"];

export const SYSTEM_MODULES = [
  "Patient",
  "Doctor",
  "Appointment",
  "Billing",
  "Pharmacy",
  "Laboratory",
  "Radiology",
  "Inventory",
  "User",
  "Role",
  "Audit Log",
];

export const MODULE_DETAILS = [
  { id: 1, name: "Patient", desc: "Patient Registration & Records", icon: "User", color: "text-emerald-600 bg-emerald-50 border-emerald-200" },
  { id: 2, name: "Doctor", desc: "Doctor Management & Profiles", icon: "UserCheck", color: "text-blue-600 bg-blue-50 border-blue-200" },
  { id: 3, name: "Appointment", desc: "Booking & Scheduling", icon: "Calendar", color: "text-purple-600 bg-purple-50 border-purple-200" },
  { id: 4, name: "Billing", desc: "Invoices, Payments & Financials", icon: "CreditCard", color: "text-amber-600 bg-amber-50 border-amber-200" },
  { id: 5, name: "Pharmacy", desc: "Medicine Stock & Sales", icon: "Pill", color: "text-teal-600 bg-teal-50 border-teal-200" },
  { id: 6, name: "Laboratory", desc: "Lab Tests & Test Reports", icon: "FlaskConical", color: "text-indigo-600 bg-indigo-50 border-indigo-200" },
  { id: 7, name: "Radiology", desc: "Scans, X-Rays & Reports", icon: "FileImage", color: "text-cyan-600 bg-cyan-50 border-cyan-200" },
  { id: 8, name: "Inventory", desc: "Stock & Items Management", icon: "Package", color: "text-orange-600 bg-orange-50 border-orange-200" },
  { id: 9, name: "User", desc: "User Accounts & Staff Access", icon: "Users", color: "text-sky-600 bg-sky-50 border-sky-200" },
  { id: 10, name: "Role", desc: "Role Creation & Permission Mgmt.", icon: "Shield", color: "text-violet-600 bg-violet-50 border-violet-200" },
  { id: 11, name: "Audit Log", desc: "System Security & Logs", icon: "FileText", color: "text-slate-600 bg-slate-100 border-slate-200" },
];

export const PERMISSION_STATUS_TYPES = [
  "Full Access",
  "Read Only",
  "Limited Access",
  "No Access",
];

export const LEGEND_ITEMS = [
  {
    type: "Full Access",
    desc: "Create, Read, Update, Delete, Manage",
    color: "text-emerald-600",
    iconBg: "bg-emerald-50 text-emerald-600 border-emerald-200",
  },
  {
    type: "Read Only",
    desc: "Read and view records",
    color: "text-blue-600",
    iconBg: "bg-blue-50 text-blue-600 border-blue-200",
  },
  {
    type: "Limited Access",
    desc: "Some actions are allowed",
    color: "text-amber-600",
    iconBg: "bg-amber-50 text-amber-600 border-amber-200",
  },
  {
    type: "No Access",
    desc: "No permissions",
    color: "text-rose-600",
    iconBg: "bg-rose-50 text-rose-600 border-rose-200",
  },
];
