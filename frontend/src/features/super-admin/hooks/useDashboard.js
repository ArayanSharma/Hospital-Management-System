import { useEffect, useState } from "react";
import { getDashboardStatsApi, getRecentActivityApi } from "../services/superAdmin.api.js";

export const useDashboard = () => {
  const [stats, setStats] = useState(null);
  const [activity, setActivity] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError("");
      try {
        const [statsRes, activityRes] = await Promise.all([
          getDashboardStatsApi(),
          getRecentActivityApi(10),
        ]);
        setStats(statsRes.data.data);
        setActivity(activityRes.data.data);
      } catch (err) {
        setError(err.response?.data?.message || "Failed to load dashboard");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  return { stats, activity, loading, error };
};