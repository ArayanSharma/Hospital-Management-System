import React from "react";
import SearchInput from "../../../components/common/SearchInput.jsx";
import FilterSelect from "../../../components/common/FilterSelect.jsx";
import DateRangePicker from "../../../components/common/DateRangePicker.jsx";
import FilterButton from "../../../components/common/FilterButton.jsx";

export default function RadiologyFiltersBar({
  search,
  setSearch,
  status,
  setStatus,
  modality,
  setModality,
  priority,
  setPriority,
  fromDate,
  setFromDate,
  toDate,
  setToDate,
}) {
  const statusOptions = [
    { value: "pending", label: "Pending" },
    { value: "scheduled", label: "Scheduled" },
    { value: "in-progress", label: "In-Progress" },
    { value: "completed", label: "Completed" },
    { value: "cancelled", label: "Cancelled" },
  ];

  const modalityOptions = [
    { value: "x-ray", label: "X-Ray" },
    { value: "mri", label: "MRI Scan" },
    { value: "ct", label: "CT Scan" },
    { value: "ultrasound", label: "Ultrasound (USG)" },
    { value: "mammography", label: "Mammography" },
    { value: "pet", label: "PET Scan" },
    { value: "ecg", label: "ECG" },
  ];

  const priorityOptions = [
    { value: "routine", label: "Routine" },
    { value: "urgent", label: "Urgent" },
    { value: "emergency", label: "Emergency" },
  ];

  return (
    <div className="bg-white border border-slate-200/80 rounded-2xl p-4 shadow-2xs flex flex-row items-end gap-2.5 overflow-x-auto text-xs">
      {/* Search Input Box */}
      <div className="flex-1 min-w-[200px] shrink-0 flex items-end">
        <SearchInput
          value={search}
          onChange={setSearch}
          placeholder="Search by Patient Name, Order ID, or Mobile No..."
          className="w-full"
        />
      </div>

      {/* Filter Controls: Status | Modality | Priority | Date Range | Filters Button */}
      <div className="shrink-0 flex items-end gap-2.5">
        <FilterSelect
          label="Status"
          value={status}
          onChange={(e) => setStatus(e.target.value)}
          placeholder="All Status"
          options={statusOptions}
          minWidth="110px"
        />

        <FilterSelect
          label="Modality"
          value={modality}
          onChange={(e) => setModality(e.target.value)}
          placeholder="All Modality"
          options={modalityOptions}
          minWidth="115px"
        />

        <FilterSelect
          label="Priority"
          value={priority}
          onChange={(e) => setPriority(e.target.value)}
          placeholder="All Priority"
          options={priorityOptions}
          minWidth="110px"
        />

        <DateRangePicker
          singleInput={true}
          label="Date Range"
          placeholder="Select date range"
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
