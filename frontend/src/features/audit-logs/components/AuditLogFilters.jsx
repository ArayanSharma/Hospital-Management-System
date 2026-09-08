import { Search, RotateCcw } from "lucide-react";

const ACTIONS = ["CREATE", "UPDATE", "DELETE"];

export default function AuditLogFilters({ filters, onChange }) {
  const hasActiveFilters = Boolean(
    filters.action || filters.resource || filters.startDate || filters.endDate
  );

  const handleReset = () => {
    onChange({});
  };

  return (
    <div className="bg-white border border-gray-200 rounded-xl p-4 shadow-2xs">
      <div className="flex flex-wrap items-center gap-3">
        <div className="w-40">
          <select
            value={filters.action || ""}
            onChange={(e) => onChange({ ...filters, action: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm bg-white focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 focus:outline-none"
          >
            <option value="">All Actions</option>
            {ACTIONS.map((a) => (
              <option key={a} value={a}>
                {a}
              </option>
            ))}
          </select>
        </div>

        <div className="flex-1 min-w-[200px] relative">
          <Search className="w-4 h-4 text-gray-400 absolute left-3 top-2.5" />
          <input
            type="text"
            placeholder="Filter by resource (e.g. patient, user)..."
            value={filters.resource || ""}
            onChange={(e) => onChange({ ...filters, resource: e.target.value })}
            className="w-full pl-9 pr-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 focus:outline-none"
          />
        </div>

        <div className="flex items-center gap-2">
          <input
            type="date"
            value={filters.startDate || ""}
            onChange={(e) => onChange({ ...filters, startDate: e.target.value })}
            className="px-3 py-2 border border-gray-300 rounded-lg text-sm bg-white focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 focus:outline-none"
          />
          <span className="text-xs text-gray-400 font-medium">to</span>
          <input
            type="date"
            value={filters.endDate || ""}
            onChange={(e) => onChange({ ...filters, endDate: e.target.value })}
            className="px-3 py-2 border border-gray-300 rounded-lg text-sm bg-white focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 focus:outline-none"
          />
        </div>

        {hasActiveFilters && (
          <button
            onClick={handleReset}
            className="flex items-center gap-1 px-3 py-2 text-xs font-medium text-gray-600 hover:text-gray-900 bg-gray-100 hover:bg-gray-200 rounded-lg transition cursor-pointer"
          >
            <RotateCcw className="w-3.5 h-3.5" /> Reset
          </button>
        )}
      </div>
    </div>
  );
}
