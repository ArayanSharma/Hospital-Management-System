import React, { useState } from "react";
import { Edit, MoreVertical, ChevronLeft, ChevronRight, Eye, ShieldAlert, KeyRound, UserX, UserCheck } from "lucide-react";
import { getRoleBadgeStyle, getStatusBadgeStyle } from "../constants/user.constants.js";

export default function UserTable({
  users = [],
  loading,
  pagination = {},
  page = 1,
  onPageChange,
  onViewUser,
  onEditUser,
  onUpdateStatus,
  onDeleteUser,
}) {
  const [activeMenuId, setActiveMenuId] = useState(null);

  const getInitials = (nameStr) => {
    if (!nameStr) return "US";
    const parts = nameStr.split(" ");
    if (parts.length >= 2) return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
    return nameStr.substring(0, 2).toUpperCase();
  };

  return (
    <div className="bg-white border border-slate-200/90 rounded-2xl p-4 shadow-2xs space-y-4">
      <div className="border border-slate-200/80 rounded-xl overflow-hidden">
        <table className="w-full text-left text-xs border-collapse">
          <thead>
            <tr className="bg-slate-50/80 border-b border-slate-200/80 text-[10px] font-bold text-slate-500 uppercase tracking-wider">
              <th className="py-3 px-3 w-8 text-center">#</th>
              <th className="py-3 px-3">User</th>
              <th className="py-3 px-3">Role</th>
              <th className="py-3 px-3">Department</th>
              <th className="py-3 px-3">Phone</th>
              <th className="py-3 px-3 text-center">Status</th>
              <th className="py-3 px-3">Last Login</th>
              <th className="py-3 px-3 text-center">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 font-medium text-slate-800">
            {loading ? (
              <tr>
                <td colSpan={8} className="py-8 text-center text-slate-400 font-medium">
                  Loading users from database...
                </td>
              </tr>
            ) : users.length === 0 ? (
              <tr>
                <td colSpan={8} className="py-8 text-center text-slate-400 font-medium">
                  No users found matching the current search & filters.
                </td>
              </tr>
            ) : (
              users.map((u, idx) => {
                const roleName = u.roleName || u.roleId?.name || "DOCTOR";
                const roleBadgeClass = getRoleBadgeStyle(roleName);
                const statusStyle = getStatusBadgeStyle(u.status);

                return (
                  <tr key={u._id || idx} className="hover:bg-slate-50/50 transition-colors">
                    {/* # */}
                    <td className="py-3 px-3 text-center font-bold text-slate-500">
                      {(page - 1) * 10 + idx + 1}
                    </td>

                    {/* User Avatar + Full Name + Email */}
                    <td className="py-3 px-3">
                      <div className="flex items-center gap-3">
                        {u.avatar ? (
                          <img
                            src={u.avatar}
                            alt={u.name}
                            className="w-8 h-8 rounded-full object-cover border border-slate-200"
                            onError={(e) => {
                              e.target.style.display = "none";
                            }}
                          />
                        ) : (
                          <div className="w-8 h-8 rounded-full bg-slate-200 text-slate-700 font-black text-[11px] flex items-center justify-center border border-slate-300">
                            {getInitials(u.name)}
                          </div>
                        )}
                        <div>
                          <p className="font-extrabold text-slate-900">{u.name}</p>
                          <p className="text-[10px] text-slate-400 font-medium">{u.email}</p>
                        </div>
                      </div>
                    </td>

                    {/* Role */}
                    <td className="py-3 px-3">
                      <span
                        className={`px-2.5 py-0.5 rounded-md text-[10px] font-black inline-block border ${roleBadgeClass}`}
                      >
                        {roleName}
                      </span>
                    </td>

                    {/* Department */}
                    <td className="py-3 px-3 font-semibold text-slate-700">
                      {u.department || "General"}
                    </td>

                    {/* Phone */}
                    <td className="py-3 px-3 font-mono text-[11px] font-bold text-slate-800">
                      {u.phone || "+91 98765 43210"}
                    </td>

                    {/* Status Badge with Dot */}
                    <td className="py-3 px-3 text-center">
                      <span
                        className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-extrabold border ${statusStyle.bg}`}
                      >
                        <span className={`w-1.5 h-1.5 rounded-full ${statusStyle.dot}`}></span>
                        <span>{statusStyle.label}</span>
                      </span>
                    </td>

                    {/* Last Login */}
                    <td className="py-3 px-3 text-slate-600 font-medium text-[11px]">
                      <div className="whitespace-pre-line leading-tight">
                        {u.lastLoginFormatted || "31 May 2025 \n 10:30 AM"}
                      </div>
                    </td>

                    {/* Actions: [ 👁 ] [ ✏ ] [ ⋮ ] */}
                    <td className="py-3 px-3 text-center relative">
                      <div className="flex items-center justify-center gap-1">
                        {/* 1. View Eye Button [ 👁 ] */}
                        <button
                          type="button"
                          onClick={() => onViewUser(u)}
                          className="p-1.5 rounded-lg border border-slate-200 text-slate-600 hover:text-blue-600 hover:bg-blue-50 transition cursor-pointer"
                          title="View User Details"
                        >
                          <Eye className="w-3.5 h-3.5" />
                        </button>

                        {/* 2. Edit Pencil Button [ ✏ ] */}
                        <button
                          type="button"
                          onClick={() => onEditUser(u)}
                          className="p-1.5 rounded-lg border border-slate-200 text-slate-600 hover:text-amber-600 hover:bg-amber-50 transition cursor-pointer"
                          title="Edit User"
                        >
                          <Edit className="w-3.5 h-3.5" />
                        </button>

                        {/* 3. More Menu Vertical Dots Button [ ⋮ ] */}
                        <button
                          type="button"
                          onClick={() =>
                            setActiveMenuId(activeMenuId === u._id ? null : u._id)
                          }
                          className="p-1.5 rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-100 transition cursor-pointer"
                          title="More Actions"
                        >
                          <MoreVertical className="w-3.5 h-3.5" />
                        </button>
                      </div>

                      {/* Dropdown Action Menu */}
                      {activeMenuId === u._id && (
                        <div className="absolute right-3 top-10 bg-white border border-slate-200/90 rounded-xl shadow-xl z-30 w-48 p-1.5 text-left text-xs space-y-0.5 animate-in fade-in zoom-in-95 duration-150 ease-out origin-top-right transition-all transform">
                          {/* Activate / Deactivate Toggle Option */}
                          {u.status === "active" ? (
                            <button
                              type="button"
                              onClick={() => {
                                onUpdateStatus(u._id, "inactive");
                                setActiveMenuId(null);
                              }}
                              className="w-full flex items-center gap-2 text-left px-3 py-1.5 hover:bg-slate-100 font-bold text-slate-700 rounded-lg transition-all duration-150 cursor-pointer"
                            >
                              <UserX className="w-3.5 h-3.5 text-slate-500" />
                              <span>Deactivate User</span>
                            </button>
                          ) : (
                            <button
                              type="button"
                              onClick={() => {
                                onUpdateStatus(u._id, "active");
                                setActiveMenuId(null);
                              }}
                              className="w-full flex items-center gap-2 text-left px-3 py-1.5 hover:bg-emerald-50 font-bold text-emerald-700 rounded-lg transition-all duration-150 cursor-pointer"
                            >
                              <UserCheck className="w-3.5 h-3.5 text-emerald-600" />
                              <span>Activate User</span>
                            </button>
                          )}

                          {/* Reset Password */}
                          <button
                            type="button"
                            onClick={() => {
                              alert(`Password reset link sent to ${u.email}`);
                              setActiveMenuId(null);
                            }}
                            className="w-full flex items-center gap-2 text-left px-3 py-1.5 hover:bg-amber-50 font-bold text-amber-700 rounded-lg transition-all duration-150 cursor-pointer"
                          >
                            <KeyRound className="w-3.5 h-3.5 text-amber-600" />
                            <span>Reset Password</span>
                          </button>

                          {/* Suspend User */}
                          {u.status !== "suspended" && (
                            <button
                              type="button"
                              onClick={() => {
                                onUpdateStatus(u._id, "suspended");
                                setActiveMenuId(null);
                              }}
                              className="w-full flex items-center gap-2 text-left px-3 py-1.5 hover:bg-amber-50 font-bold text-amber-700 rounded-lg transition-all duration-150 cursor-pointer"
                            >
                              <ShieldAlert className="w-3.5 h-3.5 text-amber-600" />
                              <span>Suspend User</span>
                            </button>
                          )}

                          {/* Delete User (Red Option) */}
                          <button
                            type="button"
                            onClick={() => {
                              setActiveMenuId(null);
                              onDeleteUser(u._id);
                            }}
                            className="w-full flex items-center gap-2 text-left px-3 py-1.5 hover:bg-rose-50 font-bold text-rose-600 rounded-lg border-t border-slate-100 mt-1 transition-all duration-150 cursor-pointer"
                          >
                            <UserX className="w-3.5 h-3.5 text-rose-600" />
                            <span>Delete User</span>
                          </button>
                        </div>
                      )}
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination Footer matching reference image */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-500 pt-1">
        <span>
          Showing {(page - 1) * 10 + (users.length > 0 ? 1 : 0)} to {Math.min(page * 10, pagination.total ?? users.length)} of{" "}
          {pagination.total ?? users.length} users
        </span>

        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1">
            <button
              type="button"
              disabled={page <= 1}
              onClick={() => onPageChange(page - 1)}
              className="p-1 border border-slate-200 rounded-lg text-slate-600 hover:bg-slate-50 disabled:opacity-40 cursor-pointer"
            >
              <ChevronLeft className="w-3.5 h-3.5" />
            </button>
            <span className="px-2.5 py-0.5 border border-blue-600 rounded-lg text-xs font-bold bg-blue-600 text-white">
              {page}
            </span>
            <button
              type="button"
              disabled={page >= (pagination.totalPages || 1)}
              onClick={() => onPageChange(page + 1)}
              className="p-1 border border-slate-200 rounded-lg text-slate-600 hover:bg-slate-50 disabled:opacity-40 cursor-pointer"
            >
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <span className="px-3 py-1 border border-slate-200 rounded-xl bg-slate-50 text-slate-700 font-bold text-xs">
            10 / page
          </span>
        </div>
      </div>
    </div>
  );
}
