import { useState, useEffect, useCallback } from "react";
import { getOPDVisitsApi } from "../services/opdVisit.api.js";
import { useDebounce } from "../../../hooks/useDebounce.js";

export const useOpdVisits = () => {
  const [visits, setVisits] = useState([]);
  const [stats, setStats] = useState(null);
  const [pagination, setPagination] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [selectedVisit, setSelectedVisit] = useState(null);

  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [date, setDate] = useState("");
  const [doctorId, setDoctorId] = useState("");
  const [status, setStatus] = useState("");
  const [activeTab, setActiveTab] = useState("all");

  const debouncedSearch = useDebounce(search, 400);

  const fetchVisits = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const { data } = await getOPDVisitsApi({
        page,
        limit: 10,
        search: debouncedSearch || undefined,
        date: date || undefined,
        doctorId: doctorId || undefined,
        status: status || undefined,
        tab: activeTab !== "all" ? activeTab : undefined,
      });
      const list = data.data?.visits || [];
      setVisits(list);
      setStats(data.data?.stats || null);
      setPagination(data.data?.pagination || {});

      // Keep current selected visit or auto select first record
      if (list.length > 0) {
        setSelectedVisit((prev) => {
          if (!prev) return list[0];
          const matched = list.find((v) => v._id === prev._id);
          return matched || list[0];
        });
      } else {
        setSelectedVisit(null);
      }
    } catch (err) {
      setError(err.response?.data?.message || "Failed to load OPD visits");
    } finally {
      setLoading(false);
    }
  }, [page, debouncedSearch, date, doctorId, status, activeTab]);

  useEffect(() => {
    fetchVisits();
  }, [fetchVisits]);

  useEffect(() => {
    setPage(1);
  }, [debouncedSearch, date, doctorId, status, activeTab]);

  return {
    visits,
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
    status,
    setStatus,
    activeTab,
    setActiveTab,
    selectedVisit,
    setSelectedVisit,
    refetch: fetchVisits,
  };
};
