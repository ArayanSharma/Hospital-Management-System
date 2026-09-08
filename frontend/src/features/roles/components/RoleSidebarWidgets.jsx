import React from "react";
import {
  Users,
  Shield,
  Lock,
  Settings,
  Plus,
  LayoutGrid,
  Download,
  Crown,
  CheckCircle2,
  Eye,
  Edit3,
  XCircle,
  UserCheck,
} from "lucide-react";
import { LEGEND_ITEMS } from "../constants/role.constants.js";

export default function RoleSidebarWidgets({
  overview = {},
  selectedRole,
  activeTab = "roles",
  onOpenAddRole,
  onOpenEditPermissions,
}) {
  const isSystem = selectedRole?.roleType === "System" || selectedRole?.isSystemRole;

  // Matrix-specific Sidebar layout matching screenshot
  if (activeTab === "matrix") {
    return (
      <div className="space-y-4">
        {/* 1. Selected Role Card */}
        <div className="bg-white border border-slate-200/90 rounded-2xl p-4 shadow-2xs space-y-3">
          <h3 className="text-xs font-extrabold text-slate-900 tracking-wide border-b border-slate-100 pb-2">
            Selected Role
          </h3>

          <div className="space-y-3 text-xs">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center shrink-0 border border-blue-100">
                <UserCheck className="w-4 h-4" />
              </div>
              <div className="flex items-center gap-2">
                <h4 className="font-extrabold text-slate-900 font-mono text-sm tracking-tight">
                  {selectedRole?.name || "DOCTOR"}
                </h4>
                <span className="px-2 py-0.5 rounded-md text-[9px] font-black bg-purple-50 text-purple-700 border border-purple-200">
                  {isSystem ? "System Role" : "Custom Role"}
                </span>
              </div>
            </div>

            <div>
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-0.5">
                Description
              </p>
              <p className="text-[11px] text-slate-600 font-medium leading-relaxed">
                {selectedRole?.description || "Access to OPD/IPD, prescriptions, medical records and reports."}
              </p>
            </div>

            <div className="grid grid-cols-2 gap-3 pt-2 border-t border-slate-100">
              <div>
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                  Total Users
                </p>
                <p className="text-sm font-black text-slate-900 mt-0.5">
                  {selectedRole?.userCount || 18}
                </p>
              </div>

              <div>
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                  Status
                </p>
                <div className="mt-0.5">
                  <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[10px] font-extrabold bg-emerald-50 text-emerald-700 border border-emerald-200">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                    <span>Active</span>
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* 2. Access Level Legend Card */}
        <div className="bg-white border border-slate-200/90 rounded-2xl p-4 shadow-2xs space-y-3">
          <h3 className="text-xs font-extrabold text-slate-900 tracking-wide border-b border-slate-100 pb-2">
            Access Level Legend
          </h3>

          <div className="space-y-3 text-xs">
            <div className="flex items-start gap-2.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
              <div>
                <h4 className="text-[11px] font-black text-slate-900 leading-snug">Full Access</h4>
                <p className="text-[10px] text-slate-500 font-medium leading-tight">
                  Create, Read, Update, Delete, Manage
                </p>
              </div>
            </div>

            <div className="flex items-start gap-2.5">
              <Eye className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
              <div>
                <h4 className="text-[11px] font-black text-slate-900 leading-snug">Read Only</h4>
                <p className="text-[10px] text-slate-500 font-medium leading-tight">
                  View and read data only
                </p>
              </div>
            </div>

            <div className="flex items-start gap-2.5">
              <Edit3 className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
              <div>
                <h4 className="text-[11px] font-black text-slate-900 leading-snug">Limited Access</h4>
                <p className="text-[10px] text-slate-500 font-medium leading-tight">
                  Some specific actions allowed
                </p>
              </div>
            </div>

            <div className="flex items-start gap-2.5">
              <XCircle className="w-4 h-4 text-rose-500 shrink-0 mt-0.5" />
              <div>
                <h4 className="text-[11px] font-black text-slate-900 leading-snug">No Access</h4>
                <p className="text-[10px] text-slate-500 font-medium leading-tight">
                  No permissions
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* 3. Backend Actions (Per Module) Card */}
        <div className="bg-white border border-slate-200/90 rounded-2xl p-4 shadow-2xs space-y-3">
          <h3 className="text-xs font-extrabold text-slate-900 tracking-wide border-b border-slate-100 pb-2">
            Backend Actions (Per Module)
          </h3>

          <div className="space-y-2 text-xs font-medium">
            <div className="flex items-center gap-2.5">
              <span className="px-2 py-0.5 rounded bg-slate-100 text-slate-700 font-mono text-[10px] font-bold border border-slate-200 min-w-[50px] text-center">
                create
              </span>
              <span className="text-[11px] text-slate-600">Create new records</span>
            </div>

            <div className="flex items-center gap-2.5">
              <span className="px-2 py-0.5 rounded bg-slate-100 text-slate-700 font-mono text-[10px] font-bold border border-slate-200 min-w-[50px] text-center">
                read
              </span>
              <span className="text-[11px] text-slate-600">View or fetch records</span>
            </div>

            <div className="flex items-center gap-2.5">
              <span className="px-2 py-0.5 rounded bg-slate-100 text-slate-700 font-mono text-[10px] font-bold border border-slate-200 min-w-[50px] text-center">
                update
              </span>
              <span className="text-[11px] text-slate-600">Update existing records</span>
            </div>

            <div className="flex items-center gap-2.5">
              <span className="px-2 py-0.5 rounded bg-slate-100 text-slate-700 font-mono text-[10px] font-bold border border-slate-200 min-w-[50px] text-center">
                delete
              </span>
              <span className="text-[11px] text-slate-600">Delete or deactivate records</span>
            </div>

            <div className="flex items-center gap-2.5">
              <span className="px-2 py-0.5 rounded bg-slate-100 text-slate-700 font-mono text-[10px] font-bold border border-slate-200 min-w-[50px] text-center">
                manage
              </span>
              <span className="text-[11px] text-slate-600">Full module management</span>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Standard Roles Sidebar Layout
  return (
    <div className="space-y-4">
      {/* Card 1: Role Overview */}
      <div className="bg-white border border-slate-200/90 rounded-2xl p-4 shadow-2xs space-y-3">
        <h3 className="text-xs font-extrabold text-slate-900 tracking-wide border-b border-slate-100 pb-2">
          Role Overview
        </h3>

        <div className="grid grid-cols-2 gap-3">
          <div className="p-3 bg-blue-50/50 border border-blue-100 rounded-xl flex items-center justify-between">
            <div>
              <p className="text-xl font-black text-slate-900">{overview.totalRoles ?? 0}</p>
              <p className="text-[10px] font-bold text-slate-500">Total Roles</p>
            </div>
            <div className="w-7 h-7 rounded-lg bg-blue-100 text-blue-600 flex items-center justify-center">
              <Users className="w-4 h-4" />
            </div>
          </div>

          <div className="p-3 bg-purple-50/50 border border-purple-100 rounded-xl flex items-center justify-between">
            <div>
              <p className="text-xl font-black text-slate-900">{overview.systemRoles ?? 0}</p>
              <p className="text-[10px] font-bold text-slate-500">System Roles</p>
            </div>
            <div className="w-7 h-7 rounded-lg bg-purple-100 text-purple-600 flex items-center justify-center">
              <Shield className="w-4 h-4" />
            </div>
          </div>

          <div className="p-3 bg-orange-50/50 border border-orange-100 rounded-xl flex items-center justify-between">
            <div>
              <p className="text-xl font-black text-slate-900">{overview.customRoles ?? 0}</p>
              <p className="text-[10px] font-bold text-slate-500">Custom Roles</p>
            </div>
            <div className="w-7 h-7 rounded-lg bg-orange-100 text-orange-600 flex items-center justify-center">
              <Users className="w-4 h-4" />
            </div>
          </div>

          <div className="p-3 bg-emerald-50/50 border border-emerald-100 rounded-xl flex items-center justify-between">
            <div>
              <p className="text-xl font-black text-slate-900">
                {(overview.totalUsers ?? 0).toLocaleString()}
              </p>
              <p className="text-[10px] font-bold text-slate-500">Total Users</p>
            </div>
            <div className="w-7 h-7 rounded-lg bg-emerald-100 text-emerald-600 flex items-center justify-center">
              <Users className="w-4 h-4" />
            </div>
          </div>
        </div>

        <button
          type="button"
          onClick={() => alert("Role Hierarchy Tree View")}
          className="w-full flex items-center justify-center gap-1.5 py-2 bg-slate-50 hover:bg-slate-100 border border-slate-200 text-slate-700 font-bold text-xs rounded-xl transition cursor-pointer"
        >
          <LayoutGrid className="w-3.5 h-3.5" />
          <span>View Role Hierarchy</span>
        </button>
      </div>

      {/* Card 2: Selected Role */}
      <div className="bg-white border border-slate-200/90 rounded-2xl p-4 shadow-2xs space-y-3">
        <h3 className="text-xs font-extrabold text-slate-900 tracking-wide border-b border-slate-100 pb-2">
          Selected Role
        </h3>

        {selectedRole ? (
          <div className="space-y-3 text-xs">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-purple-100 text-purple-700 flex items-center justify-center shrink-0">
                {selectedRole.name === "SUPER_ADMIN" ? (
                  <Crown className="w-4 h-4" />
                ) : (
                  <Shield className="w-4 h-4" />
                )}
              </div>
              <div>
                <h4 className="font-black text-slate-900 font-mono text-sm">{selectedRole.name}</h4>
                <span
                  className={`px-2 py-0.5 rounded-md text-[9px] font-black inline-block border ${
                    isSystem
                      ? "bg-purple-50 text-purple-700 border-purple-200"
                      : "bg-orange-50 text-orange-700 border-orange-200"
                  }`}
                >
                  {isSystem ? "System Role" : "Custom Role"}
                </span>
              </div>
            </div>

            <p className="text-[11px] text-slate-600 font-medium leading-relaxed">
              {selectedRole.description || "Has full access to all modules, settings and system configuration."}
            </p>

            <div className="space-y-1.5 pt-1 border-t border-slate-100 text-[11px]">
              <div className="flex items-center justify-between">
                <span className="text-slate-500 font-medium">Users</span>
                <span className="font-bold text-slate-800">{selectedRole.userCount || 0}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-500 font-medium">Status</span>
                <span className="px-2 py-0.5 rounded-full text-[9px] font-extrabold bg-emerald-50 text-emerald-700 border border-emerald-200">
                  ● Active
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-500 font-medium">Cannot be deleted</span>
                <span className="px-2 py-0.5 rounded-md text-[9px] font-extrabold bg-slate-100 text-slate-700 border border-slate-200 flex items-center gap-1">
                  <Lock className="w-2.5 h-2.5" />
                  <span>Protected</span>
                </span>
              </div>
            </div>

            <button
              type="button"
              onClick={() => onOpenEditPermissions(selectedRole)}
              className="w-full flex items-center justify-center gap-1.5 py-2 bg-blue-50 hover:bg-blue-100 border border-blue-200 text-blue-700 font-bold text-xs rounded-xl transition cursor-pointer"
            >
              <Settings className="w-3.5 h-3.5" />
              <span>Edit Role Permissions</span>
            </button>
          </div>
        ) : (
          <p className="text-xs text-slate-400 font-medium py-4 text-center">
            Select a role from the table to inspect details.
          </p>
        )}
      </div>

      {/* Card 3: Quick Actions */}
      <div className="bg-white border border-slate-200/90 rounded-2xl p-4 shadow-2xs space-y-3">
        <h3 className="text-xs font-extrabold text-slate-900 tracking-wide border-b border-slate-100 pb-2">
          Quick Actions
        </h3>

        <div className="space-y-2 text-xs">
          <button
            type="button"
            onClick={onOpenAddRole}
            className="w-full flex items-center gap-3 p-2.5 rounded-xl border border-slate-200 hover:bg-slate-50 transition text-left cursor-pointer"
          >
            <div className="w-7 h-7 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
              <Plus className="w-4 h-4" />
            </div>
            <div>
              <p className="font-extrabold text-slate-900 text-[11px]">Add New Role</p>
              <p className="text-[10px] text-slate-400 font-medium">Create a custom role</p>
            </div>
          </button>

          <button
            type="button"
            onClick={() => onOpenEditPermissions(selectedRole)}
            className="w-full flex items-center gap-3 p-2.5 rounded-xl border border-slate-200 hover:bg-slate-50 transition text-left cursor-pointer"
          >
            <div className="w-7 h-7 rounded-lg bg-purple-50 text-purple-600 flex items-center justify-center shrink-0">
              <LayoutGrid className="w-4 h-4" />
            </div>
            <div>
              <p className="font-extrabold text-slate-900 text-[11px]">Permission Matrix</p>
              <p className="text-[10px] text-slate-400 font-medium">Manage role permissions</p>
            </div>
          </button>

          <button
            type="button"
            onClick={() => alert("Downloading Roles & Permissions export...")}
            className="w-full flex items-center gap-3 p-2.5 rounded-xl border border-slate-200 hover:bg-slate-50 transition text-left cursor-pointer"
          >
            <div className="w-7 h-7 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center shrink-0">
              <Download className="w-4 h-4" />
            </div>
            <div>
              <p className="font-extrabold text-slate-900 text-[11px]">Export Roles</p>
              <p className="text-[10px] text-slate-400 font-medium">Download roles and permissions</p>
            </div>
          </button>
        </div>
      </div>

      {/* Card 4: Permissions Legend */}
      <div className="bg-white border border-slate-200/90 rounded-2xl p-4 shadow-2xs space-y-3">
        <h3 className="text-xs font-extrabold text-slate-900 tracking-wide border-b border-slate-100 pb-2">
          Permissions Legend
        </h3>

        <div className="space-y-2.5 text-xs">
          {LEGEND_ITEMS.map((item) => (
            <div key={item.type} className="flex items-start gap-2.5">
              <div className="shrink-0 mt-0.5">
                {item.type === "Full Access" && <CheckCircle2 className="w-4 h-4 text-emerald-600" />}
                {item.type === "Read Only" && <Eye className="w-4 h-4 text-blue-600" />}
                {item.type === "Limited Access" && <Edit3 className="w-4 h-4 text-amber-600" />}
                {item.type === "No Access" && <XCircle className="w-4 h-4 text-rose-500" />}
              </div>
              <div>
                <h4 className="text-[11px] font-extrabold text-slate-900 leading-snug">{item.type}</h4>
                <p className="text-[10px] text-slate-400 font-medium leading-tight">{item.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
