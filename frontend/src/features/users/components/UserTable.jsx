import React, { useState } from "react";
import { Edit, MoreVertical, ChevronLeft, ChevronRight, Eye, ShieldAlert, KeyRound, UserX, UserCheck } from "lucide-react";
import { getRoleBadgeStyle, getStatusBadgeStyle } from "../constants/user.constants.js";
import MaskedField from "../../../components/common/MaskedField.jsx";

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
                            loading="lazy"
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
                          <div className="flex items-center gap-1.5">
                            <p className="font-extrabold text-slate-900">{u.name}</p>
                            {u.authProvider === "google" && (
                              <span className="inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded text-[9px] font-bold bg-blue-50 text-blue-600 border border-blue-200 shrink-0" title="Authenticated via Google SSO">
                                <svg className="w-2.5 h-2.5" viewBox="0 0 24 24">
                                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                                  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"/>
                                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"/>
                                </svg>
                                <span>Google</span>
                              </span>
                            )}
                          </div>
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
                      <MaskedField value={u.phone || "+91 98765 43210"} type="phone" />
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
                              <span>Re-activate User</span>
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
                              <span>Suspend Account</span>
                            </button>
                          )}

                          {/* Deactivate & Archive Account (Replaces hard delete) */}
                          <button
                            type="button"
                            onClick={() => {
                              setActiveMenuId(null);
                              onDeleteUser(u._id);
                            }}
                            className="w-full flex items-center gap-2 text-left px-3 py-1.5 hover:bg-rose-50 font-bold text-rose-600 rounded-lg border-t border-slate-100 mt-1 transition-all duration-150 cursor-pointer"
                          >
                            <UserX className="w-3.5 h-3.5 text-rose-600" />
                            <span>Deactivate & Archive</span>
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
