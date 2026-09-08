import { useState, useEffect, useCallback } from "react";
import { getDoctorsApi } from "../services/doctor.api.js";
import { useDebounce } from "../../../hooks/useDebounce.js";

export const useDoctors = () => {
  const [doctors, setDoctors] = useState([]);
  const [stats, setStats] = useState(null);
  const [pagination, setPagination] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [departmentId, setDepartmentId] = useState("");
  const [specialization, setSpecialization] = useState("");
  const [status, setStatus] = useState("");

  const debouncedSearch = useDebounce(search, 400);

  const fetchDoctors = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const { data } = await getDoctorsApi({
        page,
        limit: 10,
        search: debouncedSearch || undefined,
        departmentId: departmentId || undefined,
        specialization: specialization || undefined,
        status: status || undefined,
      });
      setDoctors(data.data?.doctors || []);
      setStats(data.data?.stats || null);
      setPagination(data.data?.pagination || {});
    } catch (err) {
      setError(err.response?.data?.message || "Failed to load doctors");
    } finally {
      setLoading(false);
    }
  }, [page, debouncedSearch, departmentId, specialization, status]);

  useEffect(() => {
    fetchDoctors();
  }, [fetchDoctors]);

  useEffect(() => {
    setPage(1);
  }, [debouncedSearch, departmentId, specialization, status]);

  return {
    doctors,
    stats,
    pagination,
    loading,
    error,
    page,
    setPage,
    search,
    setSearch,
    departmentId,
    setDepartmentId,
    specialization,
    setSpecialization,
    status,
    setStatus,
    refetch: fetchDoctors,
  };
};