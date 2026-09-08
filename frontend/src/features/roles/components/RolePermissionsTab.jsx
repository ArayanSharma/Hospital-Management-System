import React from "react";
import { ArrowLeft, Save, Shield, CheckCircle2, Eye, Edit3, XCircle } from "lucide-react";
import { MODULE_DETAILS, PERMISSION_STATUS_TYPES } from "../constants/role.constants.js";

/**
 * RolePermissionsTab - Compact, Production-Grade Role Permission Editor
 * Refactored to adhere to DRY and YAGNI principles.
 */
export default function RolePermissionsTab({
  selectedRole,
  matrixDraft = {},
  onCellClick,
  onBackToRoles,
  onSavePermissions,
  saving = false,
}) {
  const roleName = selectedRole?.name || "ROLE";

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-slate-900">Role Permissions: {roleName}</h1>
          <p className="text-xs text-slate-500">Configure access levels for each module.</p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={onBackToRoles}
            className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-lg transition flex items-center gap-1 cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" /> Back
          </button>
          <button
            onClick={onSavePermissions}
            disabled={saving}
            className="px-4 py-1.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-lg transition flex items-center gap-1 cursor-pointer disabled:opacity-50"
          >
            <Save className="w-4 h-4" /> {saving ? "Saving..." : "Save"}
          </button>
        </div>
      </div>

      {/* Permissions Grid */}
      <div className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-xs">
        <table className="w-full text-xs text-left">
          <thead className="bg-slate-50 border-b border-slate-200 text-[10px] uppercase font-bold text-slate-500">
            <tr>
              <th className="py-3 px-4">Module</th>
              {PERMISSION_STATUS_TYPES.map((status) => (
                <th key={status} className="py-3 px-3 text-center">
                  {status}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 font-medium">
            {MODULE_DETAILS.map((mod) => {
              const currentStatus = matrixDraft[mod.name] || "No Access";
              return (
                <tr key={mod.id} className="hover:bg-slate-50">
                  <td className="py-2.5 px-4 font-bold text-slate-800">{mod.name}</td>
                  {PERMISSION_STATUS_TYPES.map((status) => (
                    <td
                      key={status}
                      onClick={() => onCellClick(mod.name, status)}
                      className="py-2.5 px-3 text-center cursor-pointer hover:bg-blue-50/50"
                    >
                      <input
                        type="radio"
                        name={`perm-${mod.id}`}
                        checked={currentStatus === status}
                        onChange={() => onCellClick(mod.name, status)}
                        className="cursor-pointer text-blue-600"
                      />
                    </td>
                  ))}
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
