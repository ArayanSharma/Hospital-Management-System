import React from "react";
import { Filter } from "lucide-react";
import SearchInput from "../../../components/common/SearchInput.jsx";
import CustomDropdown from "../../../components/ui/CustomDropdown.jsx";

export default function DepartmentFilterBar({
  search,
  setSearch,
  status,
  setStatus,
  hodDoctorId,
  setHodDoctorId,
  doctorList = [],
  showMoreFilters,
  setShowMoreFilters,
}) {
  const hodOptions = [
    { value: "", label: "All HODs" },
    ...doctorList.map((doc) => ({
      value: doc._id,
      label: doc.userId?.name || doc.name,
    })),
  ];

  const statusOptions = [
    { value: "", label: "All" },
    { value: "active", label: "Active" },
    { value: "inactive", label: "Inactive" },
  ];

  return (
    <div className="bg-white border border-slate-200/80 rounded-2xl p-4 shadow-2xs space-y-3">
      <div className="flex flex-wrap items-center justify-between gap-4">
        {/* Main Search Input Box */}
        <SearchInput
          value={search}
          onChange={setSearch}
          placeholder="Search by Department Name, Code or HOD..."
          className="flex-1 min-w-[260px]"
        />

        {/* Custom Dropdown Filters */}
        <div className="flex flex-wrap items-center gap-3">
          <CustomDropdown
            label="Status"
            value={status}
            options={statusOptions}
            onChange={setStatus}
            minWidth="95px"
          />

          <CustomDropdown
            label="HOD Doctor"
            value={hodDoctorId}
            options={hodOptions}
            onChange={setHodDoctorId}
            minWidth="140px"
          />

          <button
            type="button"
            onClick={() => setShowMoreFilters(!showMoreFilters)}
            className={`group flex items-center gap-1.5 border font-semibold text-xs px-3.5 py-2 rounded-xl transition-all duration-150 cursor-pointer shadow-2xs active:scale-95 ${
              showMoreFilters || status || hodDoctorId || search
                ? "bg-blue-600 border-blue-600 text-white shadow-blue-500/20"
                : "bg-slate-50 hover:bg-slate-100 border-slate-200 text-slate-700"
            }`}
          >
            <Filter className={`w-3.5 h-3.5 transition-transform duration-200 ${showMoreFilters ? "rotate-90" : "group-hover:scale-110"}`} />
            <span>More Filters</span>
            {(status || hodDoctorId || search) && (
              <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse ml-0.5"></span>
            )}
          </button>
        </div>
      </div>

      {/* Active Filter Chips */}
      {showMoreFilters && (
        <div className="pt-3 border-t border-slate-100 flex flex-wrap items-center gap-2 animate-in fade-in slide-in-from-top-1 duration-200">
          <span className="text-[11px] font-bold text-slate-500 mr-1">Active Filters:</span>
          {status && (
            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-lg text-[11px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
              Status: {status}
              <button type="button" onClick={() => setStatus("")} className="hover:text-emerald-900 font-black cursor-pointer">×</button>
            </span>
          )}
          {hodDoctorId && (
            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-lg text-[11px] font-bold bg-purple-50 text-purple-700 border border-purple-200">
              HOD: {doctorList.find((d) => d._id === hodDoctorId)?.userId?.name || doctorList.find((d) => d._id === hodDoctorId)?.name || hodDoctorId}
              <button type="button" onClick={() => setHodDoctorId("")} className="hover:text-purple-900 font-black cursor-pointer">×</button>
            </span>
          )}
          {search && (
            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-lg text-[11px] font-bold bg-amber-50 text-amber-700 border border-amber-200">
              Search: "{search}"
              <button type="button" onClick={() => setSearch("")} className="hover:text-amber-900 font-black cursor-pointer">×</button>
            </span>
          )}
          {!status && !hodDoctorId && !search && (
            <span className="text-[11px] text-slate-400 italic font-medium">No filters active. Use dropdowns above to filter departments.</span>
          )}
        </div>
      )}
    </div>
  );
}
