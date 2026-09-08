import {
  LayoutDashboard,
  Users,
  Shield,
  KeyRound,
  UserRound,
  Stethoscope,
  Building2,
  CalendarDays,
  ClipboardList,
  Bed,
  FlaskConical,
  Scan,
  Pill,
  Package,
  ShoppingCart,
  Truck,
  Receipt,
  History,
  FileBarChart,
  Settings,
} from "lucide-react";

export const navigationItems = [
  // Overview
  { label: "Dashboard", path: "/", icon: LayoutDashboard, permission: null },

  // Administration
  { label: "Users", path: "/users", icon: Users, permission: "user:read" },
  { label: "Roles", path: "/roles", icon: Shield, permission: "role:read" },
  { label: "Permissions", path: "/roles?tab=matrix", icon: KeyRound, permission: "permission:read" },

  // Hospital
  { label: "Patients", path: "/patients", icon: UserRound, permission: "patient:read" },
  { label: "Doctors", path: "/doctors", icon: Stethoscope, permission: "doctor:read" },
  { label: "Departments", path: "/departments", icon: Building2, permission: "department:read" },
  { label: "Appointments", path: "/appointments", icon: CalendarDays, permission: "appointment:read" },
  { label: "OPD Visits", path: "/opd-visits", icon: ClipboardList, permission: "opd:read" },
  { label: "IPD", path: "/ipd", icon: Bed, permission: "admission:read" },
  { label: "Laboratory", path: "/laboratory", icon: FlaskConical, permission: "lab_test:read" },
  { label: "Radiology", path: "/radiology", icon: Scan, permission: "radiology_test:read" },

  // Operations
  {
    label: "Pharmacy",
    path: "/pharmacy",
    icon: Pill,
    permission: "medicine:read",
    hasSub: true,
    subItems: [
      { label: "Overview", path: "/pharmacy", icon: LayoutDashboard },
      { label: "Medicines", path: "/pharmacy/medicines", icon: Pill },
      { label: "Inventory", path: "/pharmacy/inventory", icon: Package },
      { label: "Sales", path: "/pharmacy/sales", icon: ShoppingCart },
      { label: "Suppliers", path: "/pharmacy/suppliers", icon: Truck },
    ],
  },
  { label: "Billing", path: "/billing", icon: Receipt, permission: "invoice:read" },
  { label: "Insurance", path: "/insurance", icon: Shield, permission: "insurance:read" },

  // System
  { label: "Reports", path: "/reports", icon: FileBarChart, permission: "report:read" },
  { label: "Audit Logs", path: "/audit-logs", icon: History, permission: "audit_log:read" },
  { label: "Settings", path: "/settings", icon: Settings, permission: "setting:read" },
];