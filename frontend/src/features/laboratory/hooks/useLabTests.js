import { useState, useEffect, useCallback } from "react";
import { getLabTestsApi } from "../services/labTest.api.js";

export function useLabTests() {
  const [tests, setTests] = useState([]);
  const [stats, setStats] = useState(null);
  const [pagination, setPagination] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Search & Filters State
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("");
  const [priority, setPriority] = useState("");
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");

  // Selection & Active Item State
  const [selectedTest, setSelectedTest] = useState(null);

  const fetchLabTests = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const params = {
        page,
        limit: 10,
        search: search || undefined,
        status: status || undefined,
        priority: priority || undefined,
        fromDate: fromDate || undefined,
        toDate: toDate || undefined,
      };

      const { data } = await getLabTestsApi(params);
      const testList = data.data?.tests || [];
      const testStats = data.data?.stats || null;
      const pageMeta = data.data?.pagination || {};

      setTests(testList);
      setStats(testStats);
      setPagination(pageMeta);

      if (testList.length > 0) {
        setSelectedTest((prev) => {
          if (!prev) return testList[0];
          const exists = testList.find((t) => t._id === prev._id);
          return exists || testList[0];
        });
      } else {
        setSelectedTest(null);
      }
    } catch (err) {
      setError(err.response?.data?.message || "Failed to load laboratory tests");
      setTests([]);
    } finally {
      setLoading(false);
    }
  }, [page, search, status, priority, fromDate, toDate]);

  useEffect(() => {
    fetchLabTests();
  }, [fetchLabTests]);

  return {
    tests,
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
    priority,
    setPriority,
    fromDate,
    setFromDate,
    toDate,
    setToDate,
    selectedTest,
    setSelectedTest,
    refetch: fetchLabTests,
  };
}
