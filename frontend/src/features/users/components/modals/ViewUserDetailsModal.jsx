import React from "react";
import {
  X,
  User,
  Shield,
  Building2,
  Phone,
  Mail,
  Calendar,
  Clock,
  Key,
  Lock,
  CheckCircle2,
  AlertTriangle,
  Edit,
  ShieldCheck,
  UserCheck,
  UserX,
  FileText,
  BadgeCheck
} from "lucide-react";
import { getRoleBadgeStyle, getStatusBadgeStyle } from "../../constants/user.constants.js";
import MaskedField from "../../../../components/common/MaskedField.jsx";

export default function ViewUserDetailsModal({
  isOpen,
  onClose,
  user,
  onEdit,
  onUpdateStatus,
}) {
  if (!isOpen || !user) return null;

  const roleName = user.roleName || user.roleId?.name || "DOCTOR";
  const roleBadgeClass = getRoleBadgeStyle(roleName);
  const statusStyle = getStatusBadgeStyle(user.status);

  const getInitials = (nameStr) => {
    if (!nameStr) return "US";
    const parts = nameStr.split(" ");
    if (parts.length >= 2) return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
    return nameStr.substring(0, 2).toUpperCase();
  };

  const getRolePermissionsSummary = (role) => {
    switch (role?.toUpperCase()) {
      case "SUPER ADMIN":
      case "ADMIN":
        return [
          "Full System Management & Settings",
          "Manage All Users, Roles & Permissions",
          "Access Financial & Revenue Reports",
          "Audit Trail & Log Inspection",
          "Department & Staff Allocation",
        ];
      case "DOCTOR":
        return [
          "View & Update Assigned Patient Records",
          "Create Prescriptions & Medical Notes",
          "Schedule & Approve Appointments",
          "Order Diagnostic Lab Tests",
          "Access Clinical Dashboard",
        ];
      case "NURSE":
        return [
          "Record Patient Vitals & Daily Logs",
          "View Patient Medical History",
          "Manage In-Patient Ward Beds",
          "Administer Medications",
        ];
      case "RECEPTIONIST":
        return [
          "Patient Registration & Check-in",
          "Appointment Booking & Rescheduling",
          "Basic Patient Demographic Search",
          "Queue & Waiting Area Management",
        ];
      case "ACCOUNTANT":
        return [
          "Patient Invoicing & Billing Records",
          "Payment Processing (Cash/Card/Insurance)",
          "Financial Summary & Revenue Reports",
          "Refunds & Discharges Processing",
        ];
      case "LAB TECHNICIAN":
        return [
          "Upload & Processing of Test Results",
          "Manage Diagnostic Lab Queue",
          "Print Lab Reports & Verification",
        ];
      case "PHARMACIST":
        return [
          "Manage Pharmacy Drug Inventory",
          "Dispense Prescriptions to Patients",
          "Stock Alert & Expiry Tracking",
        ];
      case "PATIENT":
        return [
          "View Own Medical History & Records",
          "Book Doctor Appointments Online",
          "Download Prescriptions & Lab Tests",
          "View Billing Invoices",
        ];
      default:
        return ["Standard Module Access", "View Personal Profile"];
    }
  };

  return (
    <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center z-50 p-4 animate-in fade-in duration-150">
      <div className="bg-white border border-slate-200/90 rounded-2xl max-w-3xl w-full shadow-2xl flex flex-col max-h-[90vh] overflow-hidden text-xs text-slate-800">
        
        {/* Modal Top Header Banner */}
        <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-blue-950 px-6 py-5 text-white shrink-0 relative overflow-hidden">
          {/* Subtle Accent Glow Pattern */}
          <div className="absolute right-0 top-0 translate-x-8 -translate-y-8 w-40 h-40 bg-blue-500/10 rounded-full blur-2xl pointer-events-none"></div>

          <div className="flex items-start justify-between gap-4 relative z-10">
            <div className="flex items-center gap-4">
              {/* User Avatar */}
              {user.avatar ? (
                <img
                  src={user.avatar}
                  alt={user.name}
                  className="w-14 h-14 rounded-full object-cover border-2 border-white/30 shadow-md"
                />
              ) : (
                <div className="w-14 h-14 rounded-full bg-blue-600 text-white font-black text-lg flex items-center justify-center border-2 border-white/30 shadow-md">
                  {getInitials(user.name)}
                </div>
              )}

              <div className="space-y-1">
                <div className="flex items-center gap-2 flex-wrap">
                  <h2 className="text-lg font-black text-white tracking-tight">{user.name}</h2>
                  <span className={`px-2.5 py-0.5 rounded-md text-[10px] font-black uppercase border ${roleBadgeClass}`}>
                    {roleName}
                  </span>
                  <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold border ${statusStyle.bg}`}>
                    <span className={`w-1.5 h-1.5 rounded-full ${statusStyle.dot}`}></span>
                    <span>{statusStyle.label}</span>
                  </span>
                </div>

                <div className="flex items-center gap-3 text-slate-300 text-xs font-medium flex-wrap">
                  <span className="flex items-center gap-1">
                    <Mail className="w-3.5 h-3.5 text-blue-400" />
                    <span>{user.email}</span>
                  </span>
                  <span>•</span>
                  <span className="flex items-center gap-1">
                    <Building2 className="w-3.5 h-3.5 text-blue-400" />
                    <span>{user.department || "General"}</span>
                  </span>
                  {user.authProvider === "google" && (
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-white/10 text-blue-200 border border-white/20 text-[10px] font-bold">
                      <BadgeCheck className="w-3 h-3 text-blue-400" />
                      <span>Google SSO</span>
                    </span>
                  )}
                </div>
              </div>
            </div>

            {/* Close Button */}
            <button
              type="button"
              onClick={onClose}
              className="p-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-slate-300 hover:text-white transition cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto space-y-5 flex-1 bg-slate-50/40">
          
          {/* Top Quick Stats Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="bg-white p-3 rounded-xl border border-slate-200/80 shadow-2xs space-y-1">
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">User ID</p>
              <p className="font-mono text-xs font-black text-slate-800 truncate" title={user._id}>
                {user._id ? `#${user._id.substring(user._id.length - 8)}` : "USR-1092"}
              </p>
            </div>

            <div className="bg-white p-3 rounded-xl border border-slate-200/80 shadow-2xs space-y-1">
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Phone</p>
              <div className="font-mono text-xs font-black text-slate-800">
                <MaskedField value={user.phone || "+91 98765 43210"} type="phone" />
              </div>
            </div>

            <div className="bg-white p-3 rounded-xl border border-slate-200/80 shadow-2xs space-y-1">
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Department</p>
              <p className="font-bold text-xs text-slate-800 truncate">
                {user.department || "General"}
              </p>
            </div>

            <div className="bg-white p-3 rounded-xl border border-slate-200/80 shadow-2xs space-y-1">
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Last Login</p>
              <p className="font-semibold text-[11px] text-slate-700">
                {user.lastLoginFormatted || "31 May 2025, 10:30 AM"}
              </p>
            </div>
          </div>

          {/* Section 1: Detailed Profile & Account Details */}
          <div className="bg-white border border-slate-200/90 rounded-2xl p-4 shadow-2xs space-y-3">
            <div className="flex items-center gap-2 border-b border-slate-100 pb-2.5">
              <User className="w-4 h-4 text-blue-600" />
              <h3 className="text-xs font-extrabold text-slate-900 tracking-wide">Account & System Profile</h3>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2.5">
                <div className="flex items-center justify-between py-1 border-b border-slate-100">
                  <span className="text-slate-500 font-semibold text-[11px]">Full Name:</span>
                  <span className="font-bold text-slate-800">{user.name}</span>
                </div>

                <div className="flex items-center justify-between py-1 border-b border-slate-100">
                  <span className="text-slate-500 font-semibold text-[11px]">Email Address:</span>
                  <span className="font-bold text-slate-800">{user.email}</span>
                </div>

                <div className="flex items-center justify-between py-1 border-b border-slate-100">
                  <span className="text-slate-500 font-semibold text-[11px]">Username:</span>
                  <span className="font-mono font-bold text-blue-600 bg-blue-50 px-2 py-0.5 rounded text-[11px]">
                    {user.username || user.email?.split("@")[0] || "user"}
                  </span>
                </div>

                <div className="flex items-center justify-between py-1 border-b border-slate-100">
                  <span className="text-slate-500 font-semibold text-[11px]">Gender & DOB:</span>
                  <span className="font-bold text-slate-800">
                    {user.gender || "Not Specified"} {user.dateOfBirth ? `(${user.dateOfBirth})` : ""}
                  </span>
                </div>
              </div>

              <div className="space-y-2.5">
                <div className="flex items-center justify-between py-1 border-b border-slate-100">
                  <span className="text-slate-500 font-semibold text-[11px]">Assigned Role:</span>
                  <span className="font-black text-slate-900">{roleName}</span>
                </div>

                <div className="flex items-center justify-between py-1 border-b border-slate-100">
                  <span className="text-slate-500 font-semibold text-[11px]">Designation:</span>
                  <span className="font-bold text-slate-800">{user.designation || user.roleName || "Staff Member"}</span>
                </div>

                <div className="flex items-center justify-between py-1 border-b border-slate-100">
                  <span className="text-slate-500 font-semibold text-[11px]">Email Verification:</span>
                  <span className="inline-flex items-center gap-1 text-emerald-600 font-bold text-[11px]">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>{user.emailVerified || "Verified"}</span>
                  </span>
                </div>

                <div className="flex items-center justify-between py-1 border-b border-slate-100">
                  <span className="text-slate-500 font-semibold text-[11px]">Force Password Change:</span>
                  <span className={`font-bold text-[11px] ${user.forcePasswordChange ? "text-amber-600" : "text-slate-600"}`}>
                    {user.forcePasswordChange ? "Enabled (Required)" : "Disabled"}
                  </span>
                </div>
              </div>
            </div>

            {user.notes && (
              <div className="pt-2 border-t border-slate-100">
                <p className="text-[11px] font-bold text-slate-500 mb-1">Administrative Notes:</p>
                <div className="p-2.5 bg-slate-50 rounded-xl border border-slate-200/80 text-xs font-medium text-slate-700 italic">
                  "{user.notes}"
                </div>
              </div>
            )}
          </div>

          {/* Section 2: Role Permissions & Privileges */}
          <div className="bg-white border border-slate-200/90 rounded-2xl p-4 shadow-2xs space-y-3">
            <div className="flex items-center gap-2 border-b border-slate-100 pb-2.5">
              <ShieldCheck className="w-4 h-4 text-blue-600" />
              <h3 className="text-xs font-extrabold text-slate-900 tracking-wide">
                Role Privileges & Module Access ({roleName})
              </h3>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs font-medium">
              {getRolePermissionsSummary(roleName).map((perm, idx) => (
                <div key={idx} className="flex items-center gap-2 p-2 rounded-xl bg-slate-50/80 border border-slate-200/60 text-slate-700">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                  <span className="font-semibold text-[11px]">{perm}</span>
                </div>
              ))}
            </div>
          </div>

        </div>

        {/* Footer Actions */}
        <div className="px-6 py-4 bg-white border-t border-slate-200/80 flex flex-col sm:flex-row items-center justify-between gap-3 shrink-0">
          <div className="flex items-center gap-2">
            {user.status === "active" ? (
              <button
                type="button"
                onClick={() => {
                  onUpdateStatus(user._id, "inactive");
                  onClose();
                }}
                className="flex items-center gap-1.5 px-3 py-1.5 bg-amber-50 hover:bg-amber-100 border border-amber-200 text-amber-800 font-bold text-xs rounded-xl transition cursor-pointer"
              >
                <UserX className="w-3.5 h-3.5" />
                <span>Deactivate Account</span>
              </button>
            ) : (
              <button
                type="button"
                onClick={() => {
                  onUpdateStatus(user._id, "active");
                  onClose();
                }}
                className="flex items-center gap-1.5 px-3 py-1.5 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 text-emerald-800 font-bold text-xs rounded-xl transition cursor-pointer"
              >
                <UserCheck className="w-3.5 h-3.5" />
                <span>Activate Account</span>
              </button>
            )}
          </div>

          <div className="flex items-center gap-2.5">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-white border border-slate-200 hover:bg-slate-100 text-slate-700 font-bold text-xs rounded-xl shadow-2xs transition cursor-pointer"
            >
              Close
            </button>
            <button
              type="button"
              onClick={() => {
                onClose();
                if (onEdit) onEdit(user);
              }}
              className="flex items-center gap-1.5 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-xl shadow-xs transition cursor-pointer"
            >
              <Edit className="w-3.5 h-3.5" />
              <span>Edit User Profile</span>
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}
