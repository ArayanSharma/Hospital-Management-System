import React from "react";
import SearchInput from "../../../components/common/SearchInput.jsx";
import FilterSelect from "../../../components/common/FilterSelect.jsx";
import DateRangePicker from "../../../components/common/DateRangePicker.jsx";
import FilterButton from "../../../components/common/FilterButton.jsx";

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
    { value: "pending", label: "Pending" },
    { value: "sample-collected", label: "Sample Collected" },
    { value: "completed", label: "Completed" },
    { value: "cancelled", label: "Cancelled" },
  ];

  const priorityOptions = [
    { value: "routine", label: "Routine" },
    { value: "urgent", label: "Urgent" },
    { value: "emergency", label: "Emergency" },
  ];

  return (
    <div className="bg-white border border-slate-200/80 rounded-2xl p-4 shadow-2xs flex flex-col lg:flex-row lg:items-end justify-between gap-3 text-xs">
      {/* Search Input Box (Wider width to match reference image) */}
      <div className="w-full lg:w-96 xl:w-[420px] shrink-0 flex items-end">
        <SearchInput
          value={search}
          onChange={setSearch}
          placeholder="Search by Patient Name, ID or Order ID..."
          className="w-full"
        />
      </div>

      {/* Filter Controls Row: Status | Priority | From Date | To Date | Filters Button */}
      <div className="flex flex-wrap items-end gap-3.5">
        <FilterSelect
          label="Status"
          value={status}
          onChange={(e) => setStatus(e.target.value)}
          placeholder="All Status"
          options={statusOptions}
          minWidth="135px"
        />

        <FilterSelect
          label="Priority"
          value={priority}
          onChange={(e) => setPriority(e.target.value)}
          placeholder="All Priority"
          options={priorityOptions}
          minWidth="135px"
        />

        <DateRangePicker
          fromDate={fromDate}
          setFromDate={setFromDate}
          toDate={toDate}
          setToDate={setToDate}
        />

        <FilterButton />
      </div>
    </div>
  );
}
