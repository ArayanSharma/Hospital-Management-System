import React from "react";
import { RotateCcw } from "lucide-react";
import SearchInput from "../../../components/common/SearchInput.jsx";
import FilterSelect from "../../../components/common/FilterSelect.jsx";
import FilterButton from "../../../components/common/FilterButton.jsx";

export default function IpdFiltersBar({
  search,
  setSearch,
  wardId,
  setWardId,
  doctorId,
  setDoctorId,
  status,
  setStatus,
  date,
  setDate,
  dateLabel = "Date",
  doctorList = [],
  wardList = [],
  placeholder = "Search by Patient Name, ID, or UHID...",
}) {
  const wardOptions = wardList.map((w) => ({ value: w._id, label: w.name }));
  const doctorOptions = doctorList.map((doc) => ({
    value: doc._id,
    label: `Dr. ${doc.userId?.name || doc.name}`,
  }));
  const statusOptions = [
    { value: "admitted", label: "Admitted" },
    { value: "discharged", label: "Discharged" },
  ];

  const hasActiveFilters = Boolean(wardId || doctorId || status || date || search);

  const handleReset = () => {
    if (setWardId) setWardId("");
    if (setDoctorId) setDoctorId("");
    if (setStatus) setStatus("");
    if (setDate) setDate("");
    if (setSearch) setSearch("");
  };

  return (
    <div className="bg-white border border-slate-200/80 rounded-2xl p-3.5 shadow-2xs flex flex-wrap items-center justify-between gap-3 text-xs">
      {/* Search Input Box */}
      <SearchInput
        value={search}
        onChange={setSearch}
        placeholder={placeholder}
        className="w-full sm:w-80"
      />

      <div className="flex flex-wrap items-center gap-2.5">
        <FilterSelect
          value={wardId}
          onChange={(e) => setWardId(e.target.value)}
          placeholder="All Wards"
          options={wardOptions}
        />

        <FilterSelect
          value={doctorId}
          onChange={(e) => setDoctorId(e.target.value)}
          placeholder="All Doctors"
          options={doctorOptions}
        />

        <FilterSelect
          value={status}
          onChange={(e) => setStatus(e.target.value)}
          placeholder="All Status"
          options={statusOptions}
        />

        {/* Date Input */}
        <div className="flex items-center gap-1.5">
          <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className="bg-slate-50 border border-slate-200/90 text-slate-800 font-semibold px-3 py-2 rounded-xl focus:outline-none cursor-pointer text-xs"
          />
        </div>

        <button
          type="button"
          onClick={handleReset}
          disabled={!hasActiveFilters}
          title={hasActiveFilters ? "Reset all active filters" : "No active filters to reset"}
          className={`px-3 py-2 rounded-xl border font-semibold flex items-center gap-1.5 transition-all duration-200 text-xs cursor-pointer ${
            hasActiveFilters
              ? "border-blue-300 bg-blue-50 text-blue-600 hover:bg-blue-100 hover:border-blue-400 shadow-2xs"
              : "border-slate-200 bg-slate-50 text-slate-400 opacity-60 cursor-not-allowed"
          }`}
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span>Reset</span>
        </button>
      </div>
    </div>
  );
}
