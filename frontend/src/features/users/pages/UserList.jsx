import React, { useState } from "react";
import { Plus, Search, RotateCcw, SlidersHorizontal, Shield, FileText, Lock, RefreshCw, Download } from "lucide-react";
import { useUserManagement } from "../hooks/useUserManagement.js";
import { exportUsersApi } from "../services/user.api.js";
import { USER_ROLES, USER_STATUSES, USER_DEPARTMENTS } from "../constants/user.constants.js";
import UserTable from "../components/UserTable.jsx";
import UserSidebarWidgets from "../components/UserSidebarWidgets.jsx";
import AddUserModal from "../components/modals/AddUserModal.jsx";
import CustomDropdown from "../../../components/ui/CustomDropdown.jsx";
import { downloadFileBlob } from "../../../utils/downloadBlob.js";

export default function UserList() {
  const {
    users,
    pagination,
    counts,
    roleDistribution,
    loading,
    error,
    page,
    setPage,

    activeTab,
    handleTabChange,

    roleFilter,
    setRoleFilter,
    statusFilter,
    setStatusFilter,
    departmentFilter,
    setDepartmentFilter,
    search,
    setSearch,
    handleResetFilters,

    addUserOpen,
    setAddUserOpen,
    selectedUser,
    setSelectedUser,

    handleAddUserSubmit,
    handleUpdateStatus,
    handleDeleteUser,
  } = useUserManagement();

  const [showAdvancedFilters, setShowAdvancedFilters] = useState(false);
  const [exporting, setExporting] = useState(false);

  const handleExportCSV = async () => {
    setExporting(true);
    try {
      const response = await exportUsersApi({
        role: roleFilter,
        status: statusFilter,
        department: departmentFilter,
        search,
      });
      downloadFileBlob(response.data, `Users_Export_${new Date().toISOString().split("T")[0]}.csv`);
    } catch (err) {
      alert("Failed to export user records from backend server.");
    } finally {
      setExporting(false);
    }
  };

  return (
    <div className="space-y-6 min-h-screen flex flex-col justify-between">
      <div className="space-y-5">
        {/* Page Header Bar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-xl font-bold text-slate-900 tracking-tight">User Management</h1>
            <p className="text-xs text-slate-500 font-medium">
              Manage hospital staff, users and their access permissions.
            </p>
          </div>

          <div className="flex items-center gap-2.5 self-start sm:self-auto">
            {/* Export CSV Button (Backend Controlled Stream) */}
            <button
              type="button"
              onClick={handleExportCSV}
              disabled={exporting}
              className="group flex items-center gap-1.5 px-3 py-2 bg-white hover:bg-slate-50 border border-slate-200 text-slate-700 font-bold text-xs rounded-xl shadow-2xs transition-all duration-150 cursor-pointer active:scale-95 disabled:opacity-50"
              title="Export Users Data to CSV from Backend"
            >
              <Download className={`w-3.5 h-3.5 text-slate-500 transition-transform duration-200 ${exporting ? "animate-bounce text-blue-600" : "group-hover:translate-y-0.5"}`} />
              <span>{exporting ? "Exporting..." : "Export"}</span>
            </button>

            <button
              type="button"
              onClick={() => {
                setSelectedUser(null);
                setAddUserOpen(true);
              }}
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-xl shadow-xs transition cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>Add New User</span>
            </button>
          </div>
        </div>

        {/* Search + Filter Panel Box */}
        <div className="bg-white border border-slate-200/90 rounded-2xl p-4 shadow-2xs space-y-3">
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search users by name, email or phone..."
              className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:border-blue-500"
            />
          </div>

          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="flex flex-wrap items-center gap-2.5">
              {/* All Roles Dropdown */}
              <CustomDropdown
                value={roleFilter}
                options={USER_ROLES}
                onChange={setRoleFilter}
                minWidth="140px"
              />

              {/* All Status Dropdown */}
              <CustomDropdown
                value={statusFilter}
                options={USER_STATUSES}
                onChange={setStatusFilter}
                minWidth="130px"
              />

              {/* All Departments Dropdown */}
              <CustomDropdown
                value={departmentFilter}
                options={USER_DEPARTMENTS}
                onChange={setDepartmentFilter}
                minWidth="160px"
              />
            </div>

            <div className="flex items-center gap-2">
              {/* Reset Button with smooth spin icon animation */}
              <button
                type="button"
                onClick={() => {
                  handleResetFilters();
                  setShowAdvancedFilters(false);
                }}
                className="group flex items-center gap-1.5 px-3 py-1.5 bg-slate-50 hover:bg-slate-100 border border-slate-200 text-slate-700 font-bold text-xs rounded-xl transition-all duration-150 cursor-pointer shadow-2xs active:scale-95"
                title="Reset all filters"
              >
                <RotateCcw className="w-3.5 h-3.5 text-slate-500 group-hover:-rotate-180 transition-transform duration-300 ease-out" />
                <span>Reset</span>
              </button>

              {/* Filters Toggle Button with Active Badge */}
              <button
                type="button"
                onClick={() => setShowAdvancedFilters(!showAdvancedFilters)}
                className={`group flex items-center gap-1.5 px-3 py-1.5 border font-bold text-xs rounded-xl transition-all duration-150 cursor-pointer shadow-2xs active:scale-95 ${
                  showAdvancedFilters || (roleFilter !== "All Roles" || statusFilter !== "All Status" || departmentFilter !== "All Departments" || search)
                    ? "bg-blue-600 border-blue-600 text-white shadow-blue-500/20"
                    : "bg-blue-50 hover:bg-blue-100 border-blue-200 text-blue-700"
                }`}
              >
                <SlidersHorizontal className={`w-3.5 h-3.5 transition-transform duration-200 ${showAdvancedFilters ? "rotate-90" : "group-hover:scale-110"}`} />
                <span>Filters</span>
                {(roleFilter !== "All Roles" || statusFilter !== "All Status" || departmentFilter !== "All Departments" || search) && (
                  <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse ml-0.5"></span>
                )}
              </button>
            </div>
          </div>

          {/* Expandable Advanced Quick Filter Chips Bar */}
          {showAdvancedFilters && (
            <div className="pt-3 border-t border-slate-100 flex flex-wrap items-center gap-2 animate-in fade-in slide-in-from-top-1 duration-200">
              <span className="text-[11px] font-bold text-slate-500 mr-1">Active Filters:</span>
              
              {roleFilter !== "All Roles" && (
                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-lg text-[11px] font-bold bg-blue-50 text-blue-700 border border-blue-200">
                  Role: {roleFilter}
                  <button type="button" onClick={() => setRoleFilter("All Roles")} className="hover:text-blue-900 font-black">×</button>
                </span>
              )}

              {statusFilter !== "All Status" && (
                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-lg text-[11px] font-bold bg-purple-50 text-purple-700 border border-purple-200">
                  Status: {statusFilter}
                  <button type="button" onClick={() => setStatusFilter("All Status")} className="hover:text-purple-900 font-black">×</button>
                </span>
              )}

              {departmentFilter !== "All Departments" && (
                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-lg text-[11px] font-bold bg-amber-50 text-amber-700 border border-amber-200">
                  Dept: {departmentFilter}
                  <button type="button" onClick={() => setDepartmentFilter("All Departments")} className="hover:text-amber-900 font-black">×</button>
                </span>
              )}

              {search && (
                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-lg text-[11px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                  Search: "{search}"
                  <button type="button" onClick={() => setSearch("")} className="hover:text-emerald-900 font-black">×</button>
                </span>
              )}

              {roleFilter === "All Roles" && statusFilter === "All Status" && departmentFilter === "All Departments" && !search && (
                <span className="text-[11px] text-slate-400 italic font-medium">No filters active. Use dropdowns above to filter users.</span>
              )}
            </div>
          )}
        </div>

        {/* 2-Column Main Layout Split */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
          {/* LEFT COLUMN: Status Tabs + User Table */}
          <div className="lg:col-span-8 space-y-4">
            {/* 5 Status Tabs Bar */}
            <div className="flex items-center gap-6 border-b border-slate-200/80 px-2 text-xs font-bold overflow-x-auto">
              <button
                type="button"
                onClick={() => handleTabChange("all")}
                className={`py-2.5 transition relative cursor-pointer ${
                  activeTab === "all" ? "text-blue-600 font-black" : "text-slate-500 hover:text-slate-800"
                }`}
              >
                <span>All Users ({counts.total ?? 0})</span>
                {activeTab === "all" && (
                  <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-600 rounded-full"></span>
                )}
              </button>

              <button
                type="button"
                onClick={() => handleTabChange("active")}
                className={`py-2.5 transition relative cursor-pointer ${
                  activeTab === "active" ? "text-blue-600 font-black" : "text-slate-500 hover:text-slate-800"
                }`}
              >
                <span>Active ({counts.active ?? 0})</span>
                {activeTab === "active" && (
                  <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-600 rounded-full"></span>
                )}
              </button>

              <button
                type="button"
                onClick={() => handleTabChange("inactive")}
                className={`py-2.5 transition relative cursor-pointer ${
                  activeTab === "inactive" ? "text-blue-600 font-black" : "text-slate-500 hover:text-slate-800"
                }`}
              >
                <span>Inactive ({counts.inactive ?? 0})</span>
                {activeTab === "inactive" && (
                  <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-600 rounded-full"></span>
                )}
              </button>

              <button
                type="button"
                onClick={() => handleTabChange("suspended")}
                className={`py-2.5 transition relative cursor-pointer ${
                  activeTab === "suspended" ? "text-blue-600 font-black" : "text-slate-500 hover:text-slate-800"
                }`}
              >
                <span>Suspended ({counts.suspended ?? 0})</span>
                {activeTab === "suspended" && (
                  <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-600 rounded-full"></span>
                )}
              </button>

              <button
                type="button"
                onClick={() => handleTabChange("blocked")}
                className={`py-2.5 transition relative cursor-pointer ${
                  activeTab === "blocked" ? "text-blue-600 font-black" : "text-slate-500 hover:text-slate-800"
                }`}
              >
                <span>Blocked ({counts.blocked ?? 0})</span>
                {activeTab === "blocked" && (
                  <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-600 rounded-full"></span>
                )}
              </button>
            </div>

            {/* 8-Column User Table */}
            <UserTable
              users={users}
              loading={loading}
              pagination={pagination}
              page={page}
              onPageChange={setPage}
              onViewUser={(u) => alert(`Viewing details for ${u.name}`)}
              onEditUser={(u) => {
                setSelectedUser(u);
                setAddUserOpen(true);
              }}
              onUpdateStatus={handleUpdateStatus}
              onDeleteUser={handleDeleteUser}
            />

            {/* Bottom Security Info Card */}
            <div className="grid grid-cols-1 sm:grid-cols-4 gap-3 bg-white border border-slate-200/90 rounded-2xl p-4 shadow-2xs text-xs">
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center shrink-0 border border-blue-200">
                  <Shield className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="font-extrabold text-slate-900">Secure Access</h4>
                  <p className="text-[10px] text-slate-500 font-medium leading-tight">
                    Role-based access control ensures data security
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center shrink-0 border border-blue-200">
                  <FileText className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="font-extrabold text-slate-900">Audit Ready</h4>
                  <p className="text-[10px] text-slate-500 font-medium leading-tight">
                    All changes are logged in audit trail
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center shrink-0 border border-blue-200">
                  <Lock className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="font-extrabold text-slate-900">Password Security</h4>
                  <p className="text-[10px] text-slate-500 font-medium leading-tight">
                    Strong password encryption keeps accounts safe
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center shrink-0 border border-blue-200">
                  <RefreshCw className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="font-extrabold text-slate-900">Session Management</h4>
                  <p className="text-[10px] text-slate-500 font-medium leading-tight">
                    JWT based sessions with automatic timeout
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* RIGHT SIDEBAR COLUMN: 3 Widgets */}
          <div className="lg:col-span-4">
            <UserSidebarWidgets
              counts={counts}
              roleDistribution={roleDistribution}
              users={users}
            />
          </div>
        </div>
      </div>

      {/* Modal Dialog */}
      <AddUserModal
        isOpen={addUserOpen}
        onClose={() => setAddUserOpen(false)}
        onSubmit={handleAddUserSubmit}
        editingUser={selectedUser}
      />

      <div className="pt-6 border-t border-slate-200/80 text-center text-xs text-slate-400 font-medium">
        © 2025 CityCare Hospital Management System. All rights reserved.
      </div>
    </div>
  );
}