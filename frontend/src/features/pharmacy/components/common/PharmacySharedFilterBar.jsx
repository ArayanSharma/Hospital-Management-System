import React from "react";
import { Search, RotateCcw } from "lucide-react";

export default function PharmacySharedFilterBar({
  searchQuery,
  onSearchChange,
  searchPlaceholder = "Search...",
  dropdowns = [],
  onReset,
}) {
  return (
    <div className="bg-white border border-slate-200/80 rounded-2xl p-3.5 shadow-xs flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
      {/* Search Input */}
      <div className="relative flex-1">
        <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder={searchPlaceholder}
          className="w-full bg-slate-50 border border-slate-200/80 rounded-xl pl-9 pr-4 py-2 text-xs font-medium text-slate-800 placeholder-slate-400 focus:outline-none focus:bg-white focus:border-blue-500 transition-all"
        />
      </div>

      {/* Select Dropdowns & Reset Button */}
      <div className="flex flex-wrap items-center gap-2.5">
        {dropdowns.map((drop, idx) => (
          <select
            key={idx}
            value={drop.value}
            onChange={(e) => drop.onChange(e.target.value)}
            className="bg-slate-50 border border-slate-200/80 rounded-xl px-3 py-2 text-xs font-semibold text-slate-700 focus:outline-none focus:bg-white focus:border-blue-500 transition-all cursor-pointer"
          >
            {drop.options.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
        ))}

        {onReset && (
          <button
            type="button"
            onClick={onReset}
            className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-xl transition-all cursor-pointer"
            title="Reset Filters"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        )}
      </div>
    </div>
  );
}
