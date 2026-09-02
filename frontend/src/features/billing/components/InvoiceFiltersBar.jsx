import React from "react";
import { Search, Calendar, Filter } from "lucide-react";

export default function InvoiceFiltersBar({
  search,
  setSearch,
  statusFilter,
  setStatusFilter,
  departmentFilter,
  setDepartmentFilter,
  dateRange,
  setDateRange,
  onApplyFilters,
}) {
  return (
    <div className="bg-white border border-slate-200/80 rounded-2xl p-3.5 shadow-2xs flex flex-wrap items-center justify-between gap-3">
      {/* Search Bar & Dropdowns Group */}
      <div className="flex flex-wrap items-center gap-3 flex-1">
        {/* Search Input */}
        <div className="relative min-w-[260px] flex-1 max-w-md">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by invoice ID, patient name, mobile..."
            className="w-full pl-9 pr-3 py-2 bg-slate-50/60 border border-slate-200 rounded-xl text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:border-blue-500 focus:bg-white transition"
          />
        </div>

        {/* Status Dropdown */}
        <div className="flex flex-col">
          <label className="text-[10px] font-bold text-slate-400 mb-0.5 ml-1">Status</label>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="bg-slate-50/60 border border-slate-200 rounded-xl px-3 py-1.5 text-xs font-semibold text-slate-700 focus:outline-none focus:border-blue-500 focus:bg-white transition h-[34px] cursor-pointer"
          >
            <option value="all">All Statuses</option>
            <option value="paid">Paid</option>
            <option value="partially-paid">Partially Paid</option>
            <option value="unpaid">Unpaid</option>
            <option value="cancelled">Cancelled</option>
          </select>
        </div>

        {/* Department Dropdown */}
        <div className="flex flex-col">
          <label className="text-[10px] font-bold text-slate-400 mb-0.5 ml-1">Department</label>
          <select
            value={departmentFilter}
            onChange={(e) => setDepartmentFilter(e.target.value)}
            className="bg-slate-50/60 border border-slate-200 rounded-xl px-3 py-1.5 text-xs font-semibold text-slate-700 focus:outline-none focus:border-blue-500 focus:bg-white transition h-[34px] cursor-pointer"
          >
            <option value="all">All Departments</option>
            <option value="OPD">OPD</option>
            <option value="IPD">IPD</option>
            <option value="Lab">Lab</option>
            <option value="Radiology">Radiology</option>
            <option value="Pharmacy">Pharmacy</option>
            <option value="Surgery">Surgery</option>
            <option value="Room">Room Stay</option>
          </select>
        </div>

        {/* Date Range Picker Display */}
        <div className="flex flex-col">
          <label className="text-[10px] font-bold text-slate-400 mb-0.5 ml-1">Date Range</label>
          <div className="flex items-center justify-between gap-2 bg-slate-50/60 border border-slate-200 rounded-xl px-3 py-1.5 text-xs font-medium text-slate-700 h-[34px] cursor-pointer hover:border-slate-300">
            <span>{dateRange || "01 May 2025 - 31 May 2025"}</span>
            <Calendar className="w-3.5 h-3.5 text-slate-400" />
          </div>
        </div>
      </div>

      {/* Right Filters Button */}
      <button
        type="button"
        onClick={onApplyFilters}
        className="flex items-center gap-1.5 px-3.5 py-2 bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 font-semibold text-xs rounded-xl shadow-2xs transition cursor-pointer shrink-0 self-end"
      >
        <Filter className="w-3.5 h-3.5 text-blue-600" />
        <span>Filters</span>
      </button>
    </div>
  );
}
