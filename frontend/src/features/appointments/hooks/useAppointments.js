import { useState, useEffect, useCallback } from "react";
import { getAppointmentsApi } from "../services/appointment.api.js";
import { useDebounce } from "../../../hooks/useDebounce.js";

export const useAppointments = () => {
  const [appointments, setAppointments] = useState([]);
  const [stats, setStats] = useState(null);
  const [pagination, setPagination] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [date, setDate] = useState("");
  const [doctorId, setDoctorId] = useState("");
  const [departmentId, setDepartmentId] = useState("");
  const [status, setStatus] = useState("");
  const [activeTab, setActiveTab] = useState("all");

  const debouncedSearch = useDebounce(search, 400);

  const fetchAppointments = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const { data } = await getAppointmentsApi({
        page,
        limit: 10,
        search: debouncedSearch || undefined,
        date: date || undefined,
        doctorId: doctorId || undefined,
        departmentId: departmentId || undefined,
        status: status || undefined,
        tab: activeTab !== "all" ? activeTab : undefined,
      });
      setAppointments(data.data?.appointments || []);
      setStats(data.data?.stats || null);
      setPagination(data.data?.pagination || {});
    } catch (err) {
      setError(err.response?.data?.message || "Failed to load appointments");
    } finally {
      setLoading(false);
    }
  }, [page, debouncedSearch, date, doctorId, departmentId, status, activeTab]);

  useEffect(() => {
    fetchAppointments();
  }, [fetchAppointments]);

  useEffect(() => {
    setPage(1);
  }, [debouncedSearch, date, doctorId, departmentId, status, activeTab]);

  return {
    appointments,
    stats,
    pagination,
    loading,
    error,
    page,
    setPage,
    search,
    setSearch,
    date,
    setDate,
    doctorId,
    setDoctorId,
    departmentId,
    setDepartmentId,
    status,
    setStatus,
    activeTab,
    setActiveTab,
    refetch: fetchAppointments,
  };
};
