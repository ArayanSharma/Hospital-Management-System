import { useEffect, useState, useCallback } from "react";
import { getDashboardStatsApi, getRecentActivityApi } from "../services/superAdmin.api.js";

export const useDashboard = (filters = {}) => {
  const [stats, setStats] = useState(null);
  const [activity, setActivity] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchData = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const [statsRes, activityRes] = await Promise.all([
        getDashboardStatsApi(filters),
        getRecentActivityApi(10),
      ]);
      setStats(statsRes.data.data);
      setActivity(activityRes.data.data);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to load dashboard");
    } finally {
      setLoading(false);
    }
  }, [JSON.stringify(filters)]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return { stats, activity, loading, error, refetch: fetchData };
};