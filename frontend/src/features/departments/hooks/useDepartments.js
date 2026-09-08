import { useState, useEffect, useCallback } from "react";
import { getDepartmentsApi } from "../services/department.api.js";
import { useDebounce } from "../../../hooks/useDebounce.js";

export const useDepartments = () => {
  const [departments, setDepartments] = useState([]);
  const [stats, setStats] = useState(null);
  const [pagination, setPagination] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("");
  const [hodDoctorId, setHodDoctorId] = useState("");

  const debouncedSearch = useDebounce(search, 400);

  const fetchDepartments = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const { data } = await getDepartmentsApi({
        page,
        limit: 10,
        search: debouncedSearch || undefined,
        status: status || undefined,
        hodDoctorId: hodDoctorId || undefined,
      });
      setDepartments(data.data?.departments || []);
      setStats(data.data?.stats || null);
      setPagination(data.data?.pagination || {});
    } catch (err) {
      setError(err.response?.data?.message || "Failed to load departments");
    } finally {
      setLoading(false);
    }
  }, [page, debouncedSearch, status, hodDoctorId]);

  useEffect(() => {
    fetchDepartments();
  }, [fetchDepartments]);

  useEffect(() => {
    setPage(1);
  }, [debouncedSearch, status, hodDoctorId]);

  return {
    departments,
    stats,
    pagination,
    loading,
    error,
    page,
    setPage,
    search,
    setSearch,
    status,
    setStatus,
    hodDoctorId,
    setHodDoctorId,
    refetch: fetchDepartments,
  };
};
