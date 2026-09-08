import { useState, useEffect, useCallback } from "react";
import api from "../../../lib/axios.js";

export function useWards(refreshKey = 0) {
  const [wards, setWards] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchWards = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const { data } = await api.get("/wards");
      const list = Array.isArray(data.data) ? data.data : data.data?.wards || [];
      setWards(list);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to fetch wards");
      setWards([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchWards();
  }, [fetchWards, refreshKey]);

  return { wards, loading, error, refetchWards: fetchWards };
}
