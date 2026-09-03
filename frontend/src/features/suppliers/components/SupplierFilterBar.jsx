import React from "react";
import { Search, Filter } from "lucide-react";
import CustomDropdown from "../../../components/ui/CustomDropdown.jsx";

export default function SupplierFilterBar({
  searchQuery,
  onSearchChange,
  statusFilter,
  onStatusChange,
  categoryFilter,
  onCategoryChange,
  locationFilter,
  onLocationChange,
  onResetFilters,
}) {
  return (
    <div className="bg-white border border-slate-200/80 rounded-2xl p-3.5 shadow-xs flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
      {/* Search Input */}
      <div className="relative flex-1 min-w-[240px]">
        <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder="Search by supplier name, contact person, phone..."
          className="w-full pl-9 pr-4 py-2 text-xs font-medium bg-slate-50/60 border border-slate-200/80 rounded-xl text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
        />
      </div>

      {/* Filter Custom Dropdowns */}
      <div className="flex flex-wrap items-center gap-2.5">
        {/* Status */}
        <CustomDropdown
          value={statusFilter}
          options={[
            { label: "All Status", value: "all" },
            { label: "Active", value: "active" },
            { label: "Inactive", value: "inactive" },
            { label: "Archived", value: "archived" },
          ]}
          onChange={onStatusChange}
          minWidth="120px"
        />

        {/* Category */}
        <CustomDropdown
          value={categoryFilter}
          options={[
            { label: "All Categories", value: "all" },
            { label: "Pharmaceuticals", value: "Pharmaceuticals" },
            { label: "Surgical", value: "Surgical" },
            { label: "Equipment", value: "Equipment" },
          ]}
          onChange={onCategoryChange}
          minWidth="145px"
        />

        {/* Location */}
        <CustomDropdown
          value={locationFilter}
          options={[
            { label: "All Locations", value: "all" },
            { label: "Mumbai", value: "Mumbai" },
            { label: "Ahmedabad", value: "Ahmedabad" },
            { label: "Delhi", value: "Delhi" },
            { label: "Bengaluru", value: "Bengaluru" },
          ]}
          onChange={onLocationChange}
          minWidth="130px"
        />

        {/* Filter Reset Button */}
        <button
          type="button"
          onClick={onResetFilters}
          className="flex items-center gap-1.5 bg-slate-50 border border-slate-200 hover:bg-slate-100 rounded-xl px-3 py-2 text-xs font-bold text-slate-600 transition-colors cursor-pointer"
        >
          <Filter className="w-3.5 h-3.5 text-slate-500" />
          <span>Reset Filters</span>
        </button>
      </div>
    </div>
  );
}
