import { useState, useEffect, useCallback } from "react";
import { getUsersApi, createUserApi, updateUserApi, deleteUserApi } from "../services/user.api.js";
import { useDebounce } from "../../../hooks/useDebounce.js";

export function useUserManagement() {
  const [users, setUsers] = useState([]);
  const [pagination, setPagination] = useState({ total: 0, page: 1, limit: 10, totalPages: 1 });
  const [counts, setCounts] = useState({ total: 0, active: 0, inactive: 0, suspended: 0, blocked: 0 });
  const [roleDistribution, setRoleDistribution] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [activeTab, setActiveTab] = useState("all");
  const [roleFilter, setRoleFilter] = useState("All Roles");
  const [statusFilter, setStatusFilter] = useState("All Status");
  const [departmentFilter, setDepartmentFilter] = useState("All Departments");
  const [search, setSearch] = useState("");
  const debouncedSearch = useDebounce(search, 300);

  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);

  // Modals Control
  const [addUserOpen, setAddUserOpen] = useState(false);
  const [userDetailsOpen, setUserDetailsOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);

  const fetchUsers = useCallback(async () => {
    setLoading(true);
    try {
      let finalStatus = statusFilter === "All Status" ? "" : statusFilter;
      if (activeTab !== "all") {
        finalStatus = activeTab;
      }

      const { data } = await getUsersApi({
        page,
        limit,
        status: finalStatus || undefined,
        role: roleFilter === "All Roles" ? undefined : roleFilter,
        department: departmentFilter === "All Departments" ? undefined : departmentFilter,
        search: debouncedSearch || undefined,
      });

      const resData = data?.data || data;
      setUsers(resData.users || []);
      if (resData.pagination) setPagination(resData.pagination);
      if (resData.counts) setCounts(resData.counts);
      if (resData.roleDistribution) setRoleDistribution(resData.roleDistribution);
    } catch (err) {
      console.error("Error fetching users:", err);
      setError(err.response?.data?.message || "Failed to load users from database.");
    } finally {
      setLoading(false);
    }
  }, [page, limit, activeTab, roleFilter, statusFilter, departmentFilter, debouncedSearch]);

  useEffect(() => {
    setPage(1);
  }, [roleFilter, statusFilter, departmentFilter, debouncedSearch]);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  const handleTabChange = (tabKey) => {
    setActiveTab(tabKey);
    setPage(1);
  };

  const handleResetFilters = () => {
    setActiveTab("all");
    setRoleFilter("All Roles");
    setStatusFilter("All Status");
    setDepartmentFilter("All Departments");
    setSearch("");
    setPage(1);
  };

  const handleAddUserSubmit = async (payload) => {
    if (selectedUser) {
      await updateUserApi(selectedUser._id, payload);
    } else {
      await createUserApi(payload);
    }
    setAddUserOpen(false);
    setSelectedUser(null);
    fetchUsers();
  };

  const handleUpdateStatus = async (userId, newStatus) => {
    await updateUserApi(userId, { status: newStatus });
    fetchUsers();
  };

  const handleDeleteUser = async (userId) => {
    if (window.confirm("Are you sure you want to deactivate this user?")) {
      await deleteUserApi(userId);
      fetchUsers();
    }
  };

  return {
    users,
    pagination,
    counts,
    roleDistribution,
    loading,
    error,
    page,
    setPage,
    limit,
    setLimit,

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
    userDetailsOpen,
    setUserDetailsOpen,
    selectedUser,
    setSelectedUser,

    handleAddUserSubmit,
    handleUpdateStatus,
    handleDeleteUser,
    refreshData: fetchUsers,
  };
}
