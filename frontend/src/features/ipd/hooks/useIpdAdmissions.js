import { useState, useEffect, useCallback } from "react";
import { getAdmissionsApi } from "../../admissions/services/admission.api.js";
import { useDebounce } from "../../../hooks/useDebounce.js";

export const useIpdAdmissions = () => {
  const [admissions, setAdmissions] = useState([]);
  const [stats, setStats] = useState(null);
  const [pagination, setPagination] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [selectedBed, setSelectedBed] = useState(null);
  const [selectedAdmission, setSelectedAdmission] = useState(null);

  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [date, setDate] = useState("");
  const [wardId, setWardId] = useState("");
  const [doctorId, setDoctorId] = useState("");
  const [status, setStatus] = useState("");
  const [activeTab, setActiveTab] = useState("bed-overview");

  const debouncedSearch = useDebounce(search, 400);

  const fetchAdmissions = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const { data } = await getAdmissionsApi({
        page,
        limit: 10,
        search: debouncedSearch || undefined,
        date: date || undefined,
        wardId: wardId || undefined,
        doctorId: doctorId || undefined,
        status: status || undefined,
      });
      setAdmissions(data.data?.admissions || []);
      setStats(data.data?.stats || null);
      setPagination(data.data?.pagination || {});
    } catch (err) {
      setError(err.response?.data?.message || "Failed to load IPD admissions");
    } finally {
      setLoading(false);
    }
  }, [page, debouncedSearch, date, wardId, doctorId, status]);

  useEffect(() => {
    fetchAdmissions();
  }, [fetchAdmissions]);

  useEffect(() => {
    setPage(1);
  }, [debouncedSearch, date, wardId, doctorId, status]);

  return {
    admissions,
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
    wardId,
    setWardId,
    doctorId,
    setDoctorId,
    status,
    setStatus,
    activeTab,
    setActiveTab,
    selectedBed,
    setSelectedBed,
    selectedAdmission,
    setSelectedAdmission,
    refetch: fetchAdmissions,
  };
};
