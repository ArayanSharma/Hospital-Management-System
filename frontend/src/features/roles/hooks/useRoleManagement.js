import { useState, useEffect, useCallback } from "react";
import { getRolesApi, createRoleApi, updateRoleApi, deleteRoleApi } from "../services/role.api.js";
import { useDebounce } from "../../../hooks/useDebounce.js";

export function useRoleManagement() {
  const [roles, setRoles] = useState([]);
  const [overview, setOverview] = useState({ totalRoles: 11, systemRoles: 8, customRoles: 3, totalUsers: 1320 });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [activeTab, setActiveTab] = useState("roles"); // "roles", "permissions", "matrix", "audit"
  const [roleTypeFilter, setRoleTypeFilter] = useState("All Roles");
  const [moduleFilter, setModuleFilter] = useState("All Modules");
  const [search, setSearch] = useState("");
  const debouncedSearch = useDebounce(search, 300);

  const [selectedRole, setSelectedRole] = useState(null);

  // Modals
  const [addRoleOpen, setAddRoleOpen] = useState(false);
  const [editPermissionsOpen, setEditPermissionsOpen] = useState(false);
  const [editingRole, setEditingRole] = useState(null);

  const fetchRoles = useCallback(async () => {
    setLoading(true);
    try {
      const { data } = await getRolesApi({
        search: debouncedSearch || undefined,
        roleType: roleTypeFilter === "All Roles" ? undefined : roleTypeFilter,
      });

      const resData = data?.data || data;
      const fetchedRoles = resData.roles || [];
      setRoles(fetchedRoles);
      if (resData.overview) setOverview(resData.overview);

      if (fetchedRoles.length > 0 && !selectedRole) {
        setSelectedRole(fetchedRoles[0]);
      } else if (selectedRole) {
        const updated = fetchedRoles.find((r) => r._id === selectedRole._id || r.name === selectedRole.name);
        if (updated) setSelectedRole(updated);
      }
    } catch (err) {
      console.error("Error fetching roles:", err);
      setError(err.response?.data?.message || "Failed to load roles from database.");
    } finally {
      setLoading(false);
    }
  }, [roleTypeFilter, debouncedSearch]);

  useEffect(() => {
    fetchRoles();
  }, [fetchRoles]);

  const handleSelectRole = (role) => {
    setSelectedRole(role);
  };

  const handleCreateRole = async (payload) => {
    await createRoleApi(payload);
    setAddRoleOpen(false);
    fetchRoles();
  };

  const handleUpdateRolePermissions = async (roleId, payload) => {
    const updateBody =
      payload && (payload.modulePermissions || payload.actionPermissions)
        ? payload
        : { modulePermissions: payload };
    await updateRoleApi(roleId, updateBody);
    setEditPermissionsOpen(false);
    setEditingRole(null);
    fetchRoles();
  };

  const handleDeleteRole = async (role) => {
    if (role.isSystemRole || role.isProtected) {
      alert("System roles are protected and cannot be deleted.");
      return;
    }
    if (window.confirm(`Are you sure you want to delete custom role "${role.name}"?`)) {
      try {
        await deleteRoleApi(role._id);
        fetchRoles();
      } catch (err) {
        alert(err.response?.data?.message || "Failed to delete role.");
      }
    }
  };

  // Matrix State
  const [selectedMatrixRoleName, setSelectedMatrixRoleName] = useState("DOCTOR");
  const [matrixDraft, setMatrixDraft] = useState({});
  const [matrixSearch, setMatrixSearch] = useState("");
  const [savingMatrix, setSavingMatrix] = useState(false);

  // Sync selectedMatrixRoleName when roles load or change
  const activeMatrixRole = roles.find((r) => r.name === selectedMatrixRoleName) || roles[0] || selectedRole;

  useEffect(() => {
    if (activeMatrixRole) {
      setMatrixDraft(activeMatrixRole.modulePermissions || {});
    }
  }, [selectedMatrixRoleName, roles]);

  const handleSelectMatrixRole = (roleName) => {
    setSelectedMatrixRoleName(roleName);
    const target = roles.find((r) => r.name === roleName);
    if (target) {
      setSelectedRole(target);
      setMatrixDraft(target.modulePermissions || {});
    }
  };

  const handleMatrixCellEdit = (moduleName, accessLevel) => {
    setMatrixDraft((prev) => ({
      ...prev,
      [moduleName]: accessLevel,
    }));
  };

  const handleResetMatrixChanges = () => {
    if (activeMatrixRole) {
      setMatrixDraft(activeMatrixRole.modulePermissions || {});
    }
  };

  const handleSaveMatrixChanges = async () => {
    if (!activeMatrixRole || !activeMatrixRole._id) return;
    setSavingMatrix(true);
    try {
      await updateRoleApi(activeMatrixRole._id, {
        modulePermissions: matrixDraft,
      });
      await fetchRoles();
      alert(`Permissions for role "${activeMatrixRole.name}" updated successfully!`);
    } catch (err) {
      console.error("Error saving matrix changes:", err);
      alert(err.response?.data?.message || "Failed to save permission changes.");
    } finally {
      setSavingMatrix(false);
    }
  };

  const handleExportMatrix = () => {
    if (!activeMatrixRole) return;
    const permissions = matrixDraft || activeMatrixRole.modulePermissions || {};
    const rows = [
      ["Module", "Access Level"],
      ...Object.entries(permissions).map(([mod, level]) => [mod, level]),
    ];

    const csvContent =
      "data:text/csv;charset=utf-8," + rows.map((e) => e.join(",")).join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `permission_matrix_${activeMatrixRole.name.toLowerCase()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const dbPermissions = activeMatrixRole?.modulePermissions || {};
  const hasMatrixChanges = Object.keys(matrixDraft).some(
    (k) => matrixDraft[k] !== dbPermissions[k]
  );

  return {
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
    refreshData: fetchRoles,
  };
}
