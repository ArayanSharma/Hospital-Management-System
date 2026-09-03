import React from "react";
import { Filter } from "lucide-react";
import SearchInput from "../../../components/common/SearchInput.jsx";
import CustomDropdown from "../../../components/ui/CustomDropdown.jsx";

export default function DoctorFilterBar({
  search,
  setSearch,
  departmentId,
  setDepartmentId,
  departments = [],
  specialization,
  setSpecialization,
  status,
  setStatus,
  showMoreFilters,
  setShowMoreFilters,
}) {
  return (
    <div className="bg-white border border-slate-200/80 rounded-2xl p-4 shadow-2xs space-y-3">
      <div className="flex flex-wrap items-center justify-between gap-4">
        {/* Search Input Box */}
        <SearchInput
          value={search}
          onChange={setSearch}
          placeholder="Search by Name, Specialization or Doctor ID..."
          className="flex-1 min-w-[260px]"
        />

        {/* Dropdown Filters */}
        <div className="flex flex-wrap items-center gap-3">
          <CustomDropdown
            label="Department"
            value={departmentId}
            options={[
              { value: "", label: "All Departments" },
              ...departments.map((d) => ({ value: d._id, label: d.name })),
            ]}
            onChange={setDepartmentId}
            minWidth="130px"
          />

          <CustomDropdown
            label="Specialization"
            value={specialization}
            options={[
              { value: "", label: "All Specializations" },
              { value: "Interventional Cardiologist", label: "Cardiologist" },
              { value: "Neurologist", label: "Neurologist" },
              { value: "Orthopedic Surgeon", label: "Orthopedic Surgeon" },
              { value: "Pediatrician", label: "Pediatrician" },
              { value: "General Physician", label: "General Physician" },
              { value: "Dermatologist", label: "Dermatologist" },
            ]}
            onChange={setSpecialization}
            minWidth="140px"
          />

          <CustomDropdown
            label="Status"
            value={status}
            options={[
              { value: "", label: "All" },
              { value: "active", label: "Active" },
              { value: "inactive", label: "Inactive" },
            ]}
            onChange={setStatus}
            minWidth="90px"
          />

          <button
            type="button"
            onClick={() => setShowMoreFilters(!showMoreFilters)}
            className={`group flex items-center gap-1.5 border font-semibold text-xs px-3.5 py-2 rounded-xl transition-all duration-150 cursor-pointer shadow-2xs active:scale-95 ${
              showMoreFilters || departmentId || specialization || status || search
                ? "bg-blue-600 border-blue-600 text-white shadow-blue-500/20"
                : "bg-slate-50 hover:bg-slate-100 border-slate-200 text-slate-700"
            }`}
          >
            <Filter className={`w-3.5 h-3.5 transition-transform duration-200 ${showMoreFilters ? "rotate-90" : "group-hover:scale-110"}`} />
            <span>More Filters</span>
            {(departmentId || specialization || status || search) && (
              <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse ml-0.5"></span>
            )}
          </button>
        </div>
      </div>

      {/* Active Filter Chips */}
      {showMoreFilters && (
        <div className="pt-3 border-t border-slate-100 flex flex-wrap items-center gap-2 animate-in fade-in slide-in-from-top-1 duration-200">
          <span className="text-[11px] font-bold text-slate-500 mr-1">Active Filters:</span>
          {departmentId && (
            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-lg text-[11px] font-bold bg-blue-50 text-blue-700 border border-blue-200">
              Dept: {departments.find((d) => d._id === departmentId)?.name || departmentId}
              <button type="button" onClick={() => setDepartmentId("")} className="hover:text-blue-900 font-black cursor-pointer">×</button>
            </span>
          )}
          {specialization && (
            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-lg text-[11px] font-bold bg-purple-50 text-purple-700 border border-purple-200">
              Spec: {specialization}
              <button type="button" onClick={() => setSpecialization("")} className="hover:text-purple-900 font-black cursor-pointer">×</button>
            </span>
          )}
          {status && (
            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-lg text-[11px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
              Status: {status}
              <button type="button" onClick={() => setStatus("")} className="hover:text-emerald-900 font-black cursor-pointer">×</button>
            </span>
          )}
          {search && (
            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-lg text-[11px] font-bold bg-amber-50 text-amber-700 border border-amber-200">
              Search: "{search}"
              <button type="button" onClick={() => setSearch("")} className="hover:text-amber-900 font-black cursor-pointer">×</button>
            </span>
          )}
          {!departmentId && !specialization && !status && !search && (
            <span className="text-[11px] text-slate-400 italic font-medium">No filters active. Use dropdowns above to filter doctors.</span>
          )}
        </div>
      )}
    </div>
  );
}
