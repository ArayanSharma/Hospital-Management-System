import React from "react";
import { RotateCcw, Filter } from "lucide-react";
import SearchInput from "../../../components/common/SearchInput.jsx";
import CustomDropdown from "../../../components/ui/CustomDropdown.jsx";

export default function LabFiltersBar({
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
}) {
  const statusOptions = [
    { value: "", label: "All Status" },
    { value: "pending", label: "Pending" },
    { value: "sample-collected", label: "Sample Collected" },
    { value: "completed", label: "Completed" },
    { value: "cancelled", label: "Cancelled" },
  ];

  const priorityOptions = [
    { value: "", label: "All Priority" },
    { value: "routine", label: "Routine" },
    { value: "urgent", label: "Urgent" },
    { value: "emergency", label: "Emergency" },
  ];

  const handleResetFilters = () => {
    setSearch("");
    setStatus("");
    setPriority("");
    setFromDate("");
    setToDate("");
  };

  const hasActiveFilters = Boolean(search || status || priority || fromDate || toDate);

  return (
    <div className="bg-white border border-slate-200/80 rounded-2xl p-4 shadow-2xs flex flex-col lg:flex-row lg:items-center justify-between gap-3 text-xs">
      {/* Search Input Box */}
      <div className="w-full lg:w-80 xl:w-[350px] shrink-0">
        <SearchInput
          value={search}
          onChange={setSearch}
          placeholder="Search by Patient Name, ID or Order ID..."
          className="w-full"
        />
      </div>

      {/* Filter Controls Row: Status | Priority | From Date | To Date | Reset Filters Button */}
      <div className="flex flex-wrap items-center gap-3">
        <CustomDropdown
          label="Status"
          value={status}
          options={statusOptions}
          onChange={setStatus}
          minWidth="130px"
        />

        <CustomDropdown
          label="Priority"
          value={priority}
          options={priorityOptions}
          onChange={setPriority}
          minWidth="125px"
        />

        <div className="flex items-center gap-1.5">
          <span className="text-xs font-semibold text-slate-600 shrink-0">From Date</span>
          <input
            type="date"
            value={fromDate}
            onChange={(e) => setFromDate(e.target.value)}
            className="bg-slate-50 hover:bg-slate-100/90 border border-slate-200/90 text-slate-800 text-xs font-bold px-3 py-1.5 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 cursor-pointer shadow-2xs"
          />
        </div>

        <div className="flex items-center gap-1.5">
          <span className="text-xs font-semibold text-slate-600 shrink-0">To Date</span>
          <input
            type="date"
            value={toDate}
            onChange={(e) => setToDate(e.target.value)}
            className="bg-slate-50 hover:bg-slate-100/90 border border-slate-200/90 text-slate-800 text-xs font-bold px-3 py-1.5 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 cursor-pointer shadow-2xs"
          />
        </div>

        {/* Far Right Reset Filters Button */}
        <button
          type="button"
          onClick={handleResetFilters}
          className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl border text-xs font-semibold transition cursor-pointer shadow-2xs ${
            hasActiveFilters
              ? "bg-blue-50 hover:bg-blue-100 border-blue-200 text-blue-600 font-bold"
              : "bg-slate-50 hover:bg-slate-100 border-slate-200 text-slate-600"
          }`}
          title="Reset All Filters"
        >
          <Filter className="w-3.5 h-3.5 text-blue-600 shrink-0" />
          <span>Reset Filters</span>
        </button>
      </div>
    </div>
  );
}
