import { useState, useEffect, useCallback } from "react";
import { History, Eye } from "lucide-react";
import { getAuditLogsApi } from "../services/auditLog.api.js";
import Table from "../../../components/ui/Table.jsx";
import Pagination from "../../../components/ui/Pagination.jsx";
import AuditLogFilters from "../components/AuditLogFilters.jsx";
import AuditLogDetail from "../components/AuditLogDetail.jsx";
import Loading from "../../../components/common/Loading.jsx";
import ErrorState from "../../../components/common/ErrorState.jsx";

const ACTION_BADGES = {
  CREATE: "bg-emerald-50 text-emerald-700 border-emerald-200",
  UPDATE: "bg-amber-50 text-amber-700 border-amber-200",
  DELETE: "bg-rose-50 text-rose-700 border-rose-200",
};

export default function AuditLogList() {
  const [logs, setLogs] = useState([]);
  const [pagination, setPagination] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [page, setPage] = useState(1);
  const [filters, setFilters] = useState({});
  const [selectedLog, setSelectedLog] = useState(null);

  const fetchLogs = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const { data } = await getAuditLogsApi({
        page,
        limit: 15,
        action: filters.action || undefined,
        resource: filters.resource || undefined,
        startDate: filters.startDate || undefined,
        endDate: filters.endDate || undefined,
      });
      setLogs(data.data.logs);
      setPagination(data.data.pagination);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to load audit logs");
    } finally {
      setLoading(false);
    }
  }, [page, filters]);

  useEffect(() => {
    fetchLogs();
  }, [fetchLogs]);

  const handleFilterChange = (newFilters) => {
    setFilters(newFilters);
    setPage(1);
  };

  const columns = [
    {
      key: "action",
      label: "Action",
      render: (row) => (
        <span
          className={`inline-block text-[11px] font-semibold tracking-wider px-2.5 py-0.5 rounded-full border ${
            ACTION_BADGES[row.action] || "bg-gray-100 text-gray-700 border-gray-200"
          }`}
        >
          {row.action}
        </span>
      ),
    },
    {
      key: "resource",
      label: "Resource",
      render: (row) => (
        <span className="font-medium text-gray-900 capitalize">
          {row.resource?.replace(/_/g, " ")}
        </span>
      ),
    },
    {
      key: "user",
      label: "Performed By",
      render: (row) => (
        <div>
          <p className="text-sm font-medium text-gray-900">{row.userId?.name || "System"}</p>
          <p className="text-xs text-gray-400">{row.userId?.email || "—"}</p>
        </div>
      ),
    },
    {
      key: "date",
      label: "Timestamp",
      render: (row) => (
        <span className="text-xs text-gray-600 font-mono">
          {new Date(row.createdAt).toLocaleString()}
        </span>
      ),
    },
    {
      key: "actions",
      label: "",
      render: (row) => (
        <button
          onClick={() => setSelectedLog(row)}
          className="inline-flex items-center gap-1 text-xs font-semibold text-indigo-600 hover:text-indigo-800 bg-indigo-50 hover:bg-indigo-100/70 px-2.5 py-1 rounded-md transition cursor-pointer"
        >
          <Eye className="w-3.5 h-3.5" /> View Diff
        </button>
      ),
    },
  ];

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-indigo-50 flex items-center justify-center text-indigo-600">
              <History className="w-4 h-4" />
            </div>
            <h1 className="text-xl font-semibold text-gray-900">Audit Logs</h1>
          </div>
          <p className="text-sm text-gray-500 mt-0.5">System-wide activity and security audit trail</p>
        </div>
      </div>

      <AuditLogFilters filters={filters} onChange={handleFilterChange} />

      {loading ? (
        <Loading message="Loading audit trail..." />
      ) : error ? (
        <ErrorState message={error} />
      ) : (
        <>
          <Table columns={columns} data={logs} emptyMessage="No audit logs found matching your filters" />
          <Pagination {...pagination} page={page} onPageChange={setPage} />
        </>
      )}

      <AuditLogDetail log={selectedLog} onClose={() => setSelectedLog(null)} />
    </div>
  );
}
