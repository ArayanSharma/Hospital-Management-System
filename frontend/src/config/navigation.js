import {
  LayoutDashboard,
  Users,
  Shield,
  KeyRound,
  UserRound,
  Stethoscope,
  Building2,
  CalendarDays,
  Pill,
  Receipt,
  FileBarChart,
  Settings,
} from "lucide-react";

export const navigationItems = [
  { label: "Dashboard", path: "/", icon: LayoutDashboard, permission: null },
  { label: "Users", path: "/users", icon: Users, permission: "user:read" },
  { label: "Roles", path: "/roles", icon: Shield, permission: "role:read" },
  { label: "Permissions", path: "/permissions", icon: KeyRound, permission: "permission:read" },
  { label: "Patients", path: "/patients", icon: UserRound, permission: "patient:read" },
  { label: "Doctors", path: "/doctors", icon: Stethoscope, permission: "doctor:read" },
  { label: "Departments", path: "/departments", icon: Building2, permission: "department:read" },
  { label: "Appointments", path: "/appointments", icon: CalendarDays, permission: "appointment:read" },
  { label: "Pharmacy", path: "/pharmacy", icon: Pill, permission: "medicine:read" },
  { label: "Billing", path: "/billing", icon: Receipt, permission: "invoice:read" },
  { label: "Reports", path: "/reports", icon: FileBarChart, permission: "report:read" },
  { label: "Settings", path: "/settings", icon: Settings, permission: "setting:read" },
];