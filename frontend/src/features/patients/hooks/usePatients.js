import { useState, useEffect, useCallback } from "react";
import { getPatientsApi } from "../services/patient.api.js";
import { useDebounce } from "../../../hooks/useDebounce.js";

export const usePatients = () => {
  const [patients, setPatients] = useState([]);
  const [stats, setStats] = useState(null);
  const [pagination, setPagination] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("");
  const [gender, setGender] = useState("");
  const [bloodGroup, setBloodGroup] = useState("");

  const debouncedSearch = useDebounce(search, 400);

  const fetchPatients = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const { data } = await getPatientsApi({
        page,
        limit: 10,
        search: debouncedSearch || undefined,
        status: status || undefined,
        gender: gender || undefined,
        bloodGroup: bloodGroup || undefined,
      });
      setPatients(data.data?.patients || []);
      setStats(data.data?.stats || null);
      setPagination(data.data?.pagination || {});
    } catch (err) {
      setError(err.response?.data?.message || "Failed to load patients");
    } finally {
      setLoading(false);
    }
  }, [page, debouncedSearch, status, gender, bloodGroup]);

  useEffect(() => {
    fetchPatients();
  }, [fetchPatients]);

  useEffect(() => {
    setPage(1);
  }, [debouncedSearch, status, gender, bloodGroup]);

  return {
    patients,
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
    gender,
    setGender,
    bloodGroup,
    setBloodGroup,
    refetch: fetchPatients,
  };
};