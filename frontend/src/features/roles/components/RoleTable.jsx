import React from "react";
import { Edit, Trash2, Crown, Shield } from "lucide-react";

export default function RoleTable({
  roles = [],
  loading,
  selectedRole,
  onSelectRole,
  onEditPermissions,
  onDeleteRole,
}) {
  const systemRoles = roles.filter((r) => r.roleType === "System" || r.isSystemRole);
  const customRoles = roles.filter((r) => r.roleType === "Custom" && !r.isSystemRole);

  const renderRoleRow = (r, idx) => {
    const isSelected = selectedRole && (selectedRole._id === r._id || selectedRole.name === r.name);
    const isSystem = r.roleType === "System" || r.isSystemRole;

    return (
      <tr
        key={r._id || idx}
        onClick={() => onSelectRole(r)}
        className={`transition-colors cursor-pointer ${
          isSelected ? "bg-blue-50/70 border-l-4 border-l-blue-600 font-medium" : "hover:bg-slate-50/60"
        }`}
      >
        {/* # */}
        <td className="py-3 px-3 text-center font-bold text-slate-500">{idx + 1}</td>

        {/* Role Name */}
        <td className="py-3 px-3">
          <div className="flex items-center gap-2">
            {r.name === "SUPER_ADMIN" ? (
              <Crown className="w-3.5 h-3.5 text-purple-600" />
            ) : isSystem ? (
              <Shield className="w-3.5 h-3.5 text-blue-600" />
            ) : null}
            <span className="font-extrabold text-slate-900 font-mono text-[11px]">{r.name}</span>
          </div>
        </td>

        {/* Type */}
        <td className="py-3 px-3">
          <span
            className={`px-2.5 py-0.5 rounded-md text-[10px] font-black inline-block border ${
              isSystem
                ? "bg-purple-50 text-purple-700 border-purple-200"
                : "bg-orange-50 text-orange-700 border-orange-200"
            }`}
          >
            {isSystem ? "System" : "Custom"}
          </span>
        </td>

        {/* Users */}
        <td className="py-3 px-3 font-extrabold text-slate-800 text-center sm:text-left">
          {r.userCount || 0} users
        </td>

        {/* Description */}
        <td className="py-3 px-3 text-slate-600 font-medium text-xs max-w-xs truncate">
          {r.description || "System permission role"}
        </td>

        {/* Status */}
        <td className="py-3 px-3 text-center">
          <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold bg-emerald-50 text-emerald-700 border border-emerald-200">
            Active
          </span>
        </td>

        {/* Actions */}
        <td className="py-3 px-3 text-center">
          <div className="flex items-center justify-center gap-1" onClick={(e) => e.stopPropagation()}>
            <button
              type="button"
              onClick={() => onEditPermissions(r)}
              className="p-1 rounded-lg border border-slate-200 text-blue-600 hover:bg-blue-50 transition cursor-pointer"
              title="Edit Role Permissions"
            >
              <Edit className="w-3.5 h-3.5" />
            </button>

            <button
              type="button"
              disabled={isSystem || r.isProtected}
              onClick={() => onDeleteRole(r)}
              className={`p-1 rounded-lg border ${
                isSystem || r.isProtected
                  ? "border-slate-200 text-slate-300 cursor-not-allowed"
                  : "border-slate-200 text-rose-500 hover:bg-rose-50 cursor-pointer"
              }`}
              title={isSystem ? "Protected System Role" : "Delete Custom Role"}
            >
              <Trash2 className="w-3.5 h-3.5" />
            </button>
          </div>
        </td>
      </tr>
    );
  };

  return (
    <div className="border border-slate-200/80 rounded-xl overflow-hidden bg-white">
      <table className="w-full text-left text-xs border-collapse">
        <thead>
          <tr className="bg-slate-50/80 border-b border-slate-200/80 text-[10px] font-bold text-slate-500 uppercase tracking-wider">
            <th className="py-3 px-3 w-8 text-center">#</th>
            <th className="py-3 px-3">Role Name</th>
            <th className="py-3 px-3">Type</th>
            <th className="py-3 px-3">Users</th>
            <th className="py-3 px-3">Description</th>
            <th className="py-3 px-3 text-center">Status</th>
            <th className="py-3 px-3 text-center">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100 font-medium text-slate-800">
          {loading ? (
            <tr>
              <td colSpan={7} className="py-8 text-center text-slate-400 font-medium">
                Loading system and custom roles from database...
              </td>
            </tr>
          ) : roles.length === 0 ? (
            <tr>
              <td colSpan={7} className="py-8 text-center text-slate-400 font-medium">
                No roles found matching the search filter.
              </td>
            </tr>
          ) : (
            <>
              {systemRoles.map((r, idx) => renderRoleRow(r, idx))}
              {customRoles.length > 0 && (
                <>
                  <tr className="bg-slate-100/60 border-y border-slate-200/80 font-bold text-[10px] text-slate-600 uppercase tracking-wider">
                    <td colSpan={7} className="py-2 px-3">
                      Custom Roles
                    </td>
                  </tr>
                  {customRoles.map((r, idx) => renderRoleRow(r, systemRoles.length + idx))}
                </>
              )}
            </>
          )}
        </tbody>
      </table>
    </div>
  );
}
