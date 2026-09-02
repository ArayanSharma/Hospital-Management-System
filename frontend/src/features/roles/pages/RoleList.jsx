import React, { useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { Plus, Search, Edit3 } from "lucide-react";
import { useRoleManagement } from "../hooks/useRoleManagement.js";
import { ROLE_FILTER_TYPES } from "../constants/role.constants.js";
import RoleTable from "../components/RoleTable.jsx";
import PermissionMatrix from "../components/PermissionMatrix.jsx";
import RoleSidebarWidgets from "../components/RoleSidebarWidgets.jsx";
import AddRoleModal from "../components/modals/AddRoleModal.jsx";
import EditPermissionsModal from "../components/modals/EditPermissionsModal.jsx";
import AuditLogList from "../../audit-logs/pages/AuditLogList.jsx";

export default function RoleList() {
  const [searchParams, setSearchParams] = useSearchParams();
  const tabParam = searchParams.get("tab");

  const {
    roles,
    overview,
    loading,
    error,
    activeTab,
    setActiveTab,

    roleTypeFilter,
    setRoleTypeFilter,
    moduleFilter,
    setModuleFilter,
    search,
    setSearch,

    selectedRole,
    handleSelectRole,

    // Matrix properties
    selectedMatrixRoleName,
    activeMatrixRole,
    matrixDraft,
    matrixSearch,
    setMatrixSearch,
    hasMatrixChanges,
    savingMatrix,
    handleSelectMatrixRole,
    handleMatrixCellEdit,
    handleResetMatrixChanges,
    handleSaveMatrixChanges,
    handleExportMatrix,

    addRoleOpen,
    setAddRoleOpen,
    editPermissionsOpen,
    setEditPermissionsOpen,
    editingRole,
    setEditingRole,

    handleCreateRole,
    handleUpdateRolePermissions,
    handleDeleteRole,
  } = useRoleManagement();

  // Sync activeTab with URL parameter ?tab=
  useEffect(() => {
    if (tabParam === "matrix" || tabParam === "permissions") {
      setActiveTab("matrix");
    } else if (tabParam === "audit") {
      setActiveTab("audit");
    } else {
      setActiveTab("roles");
    }
  }, [tabParam]);

  const handleTabClick = (tabName) => {
    setActiveTab(tabName);
    setSearchParams({ tab: tabName });
  };

  return (
    <div className="space-y-6 min-h-screen flex flex-col justify-between">
      <div className="space-y-4">
        {/* Breadcrumb matching Screenshot */}
        <div className="flex items-center gap-1.5 text-xs text-slate-400 font-semibold">
          <span className="hover:text-slate-600 transition cursor-pointer">Dashboard</span>
          <span>&gt;</span>
          <span className="text-slate-700 font-extrabold">Roles &amp; Permissions</span>
        </div>

        {/* Page Header Bar matching Screenshot */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-xl font-black text-slate-900 tracking-tight">
              Roles &amp; Permissions (RBAC)
            </h1>
            <p className="text-xs text-slate-500 font-medium mt-0.5">
              Manage system roles and set module-wise access permissions
            </p>
          </div>

          <div className="flex items-center gap-2.5 self-start sm:self-auto">
            <button
              type="button"
              onClick={() => setAddRoleOpen(true)}
              className="flex items-center gap-1.5 px-4 py-2 bg-white hover:bg-slate-50 border border-slate-200 text-slate-700 font-bold text-xs rounded-xl shadow-2xs transition cursor-pointer"
            >
              <Plus className="w-4 h-4 text-blue-600" />
              <span>+ Add Role</span>
            </button>

            <button
              type="button"
              onClick={() => {
                setEditingRole(activeMatrixRole || selectedRole);
                setEditPermissionsOpen(true);
              }}
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-xl shadow-xs transition cursor-pointer"
            >
              <Edit3 className="w-4 h-4" />
              <span>Edit Permissions</span>
            </button>
          </div>
        </div>

        {/* 3 Top Tabs Bar (Roles, Permission Matrix, Audit Logs) */}
        <div className="flex items-center gap-6 border-b border-slate-200/80 px-1 text-xs font-bold pt-1">
          <button
            type="button"
            onClick={() => handleTabClick("roles")}
            className={`py-2.5 transition relative cursor-pointer ${
              activeTab === "roles" ? "text-blue-600 font-black" : "text-slate-500 hover:text-slate-800"
            }`}
          >
            <span>Roles</span>
            {activeTab === "roles" && (
              <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-600 rounded-full"></span>
            )}
          </button>

          <button
            type="button"
            onClick={() => handleTabClick("matrix")}
            className={`py-2.5 transition relative cursor-pointer ${
              activeTab === "matrix" ? "text-blue-600 font-black" : "text-slate-500 hover:text-slate-800"
            }`}
          >
            <span>Permission Matrix</span>
            {activeTab === "matrix" && (
              <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-600 rounded-full"></span>
            )}
          </button>

          <button
            type="button"
            onClick={() => handleTabClick("audit")}
            className={`py-2.5 transition relative cursor-pointer ${
              activeTab === "audit" ? "text-blue-600 font-black" : "text-slate-500 hover:text-slate-800"
            }`}
          >
            <span>Audit Logs</span>
            {activeTab === "audit" && (
              <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-600 rounded-full"></span>
            )}
          </button>
        </div>

        {/* TAB 1: PERMISSION MATRIX VIEW (ACTIVE) */}
        {activeTab === "matrix" && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
            {/* LEFT COLUMN: Main Interactive Permission Matrix Card */}
            <div className="lg:col-span-8">
              <PermissionMatrix
                roles={roles}
                selectedRoleName={selectedMatrixRoleName}
                onSelectRole={handleSelectMatrixRole}
                matrixDraft={matrixDraft}
                matrixSearch={matrixSearch}
                onSearchChange={setMatrixSearch}
                onCellClick={handleMatrixCellEdit}
                onResetChanges={handleResetMatrixChanges}
                onSaveChanges={handleSaveMatrixChanges}
                onExportMatrix={handleExportMatrix}
                hasChanges={hasMatrixChanges}
                saving={savingMatrix}
              />
            </div>

            {/* RIGHT COLUMN: 3 Cards (Selected Role, Legend, Backend Actions) */}
            <div className="lg:col-span-4">
              <RoleSidebarWidgets
                overview={overview}
                selectedRole={activeMatrixRole || selectedRole}
                activeTab="matrix"
                onOpenAddRole={() => setAddRoleOpen(true)}
                onOpenEditPermissions={(r) => {
                  setEditingRole(r || activeMatrixRole || selectedRole);
                  setEditPermissionsOpen(true);
                }}
              />
            </div>
          </div>
        )}

        {/* TAB 2: ROLES LIST VIEW */}
        {activeTab === "roles" && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
            <div className="lg:col-span-8 space-y-5">
              <div className="bg-white border border-slate-200/90 rounded-2xl p-4 shadow-2xs space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-3">
                  <div>
                    <h2 className="text-sm font-bold text-slate-900">System &amp; Custom Roles</h2>
                    <p className="text-xs text-slate-500 font-medium">
                      View and manage all system and custom roles in the database.
                    </p>
                  </div>

                  <button
                    type="button"
                    onClick={() => setAddRoleOpen(true)}
                    className="flex items-center gap-1.5 px-3.5 py-1.5 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-xl shadow-xs transition cursor-pointer self-start sm:self-auto"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>+ Add Role</span>
                  </button>
                </div>

                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div className="relative flex-1 max-w-sm">
                    <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                    <input
                      type="text"
                      value={search}
                      onChange={(e) => setSearch(e.target.value)}
                      placeholder="Search roles..."
                      className="w-full pl-8 pr-3 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:border-blue-500"
                    />
                  </div>

                  <select
                    value={roleTypeFilter}
                    onChange={(e) => setRoleTypeFilter(e.target.value)}
                    className="bg-slate-50 border border-slate-200 rounded-xl px-3 py-1.5 text-xs font-bold text-slate-700 focus:outline-none focus:border-blue-500 cursor-pointer self-start sm:self-auto"
                  >
                    {ROLE_FILTER_TYPES.map((t) => (
                      <option key={t} value={t}>
                        {t}
                      </option>
                    ))}
                  </select>
                </div>

                <RoleTable
                  roles={roles}
                  loading={loading}
                  selectedRole={selectedRole}
                  onSelectRole={handleSelectRole}
                  onEditPermissions={(r) => {
                    setEditingRole(r);
                    setEditPermissionsOpen(true);
                  }}
                  onDeleteRole={handleDeleteRole}
                />
              </div>
            </div>

            <div className="lg:col-span-4">
              <RoleSidebarWidgets
                overview={overview}
                selectedRole={selectedRole}
                activeTab="roles"
                onOpenAddRole={() => setAddRoleOpen(true)}
                onOpenEditPermissions={(r) => {
                  setEditingRole(r || selectedRole);
                  setEditPermissionsOpen(true);
                }}
              />
            </div>
          </div>
        )}



        {/* TAB 4: AUDIT LOGS VIEW */}
        {activeTab === "audit" && (
          <div className="bg-white border border-slate-200/90 rounded-2xl p-5 shadow-2xs">
            <AuditLogList />
          </div>
        )}
      </div>

      {/* Modals */}
      <AddRoleModal
        isOpen={addRoleOpen}
        onClose={() => setAddRoleOpen(false)}
        onSubmit={handleCreateRole}
      />

      <EditPermissionsModal
        isOpen={editPermissionsOpen}
        onClose={() => {
          setEditPermissionsOpen(false);
          setEditingRole(null);
        }}
        onSubmit={handleUpdateRolePermissions}
        role={editingRole}
      />

      {/* Footer */}
      <div className="pt-6 border-t border-slate-200/80 text-center text-xs text-slate-400 font-medium">
        © 2025 CityCare Hospital Management System. All rights reserved.
      </div>
    </div>
  );
}