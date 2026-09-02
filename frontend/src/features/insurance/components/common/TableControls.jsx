import React from "react";
import { Search, Plus } from "lucide-react";

export default function TableControls({
  title,
  subtitle,
  statusFilter,
  onStatusFilterChange,
  statusOptions = [],
  searchQuery,
  onSearchChange,
  searchPlaceholder = "Search...",
  actionButtonText,
  onActionButtonClick,
}) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
      <div>
        <h2 className="text-sm font-bold text-slate-900">{title}</h2>
        {subtitle && <p className="text-xs text-slate-500 font-medium">{subtitle}</p>}
      </div>

      <div className="flex flex-wrap items-center gap-2">
        {/* Status Filter Dropdown */}
        {statusOptions.length > 0 && (
          <select
            value={statusFilter}
            onChange={(e) => onStatusFilterChange(e.target.value)}
            className="bg-slate-50 border border-slate-200 rounded-xl px-3 py-1.5 text-xs font-bold text-slate-700 focus:outline-none focus:border-blue-500 cursor-pointer"
          >
            {statusOptions.map((st) => (
              <option key={st} value={st}>
                {st}
              </option>
            ))}
          </select>
        )}

        {/* Search Bar */}
        <div className="relative">
          <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder={searchPlaceholder}
            className="pl-8 pr-3 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:border-blue-500 w-60 sm:w-64"
          />
        </div>

        {/* Action Button */}
        {actionButtonText && (
          <button
            type="button"
            onClick={onActionButtonClick}
            className="flex items-center gap-1.5 px-3.5 py-1.5 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-xl shadow-xs transition cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>{actionButtonText}</span>
          </button>
        )}
      </div>
    </div>
  );
}
