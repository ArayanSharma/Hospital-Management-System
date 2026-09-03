import React from "react";
import { Search, X, RotateCcw } from "lucide-react";
import CustomDropdown from "../../../components/ui/CustomDropdown.jsx";

export default function MedicineFilterBar({
  searchQuery,
  onSearchChange,
  categoryFilter,
  onCategoryChange,
  manufacturerFilter,
  onManufacturerChange,
  statusFilter,
  onStatusChange,
  categoriesList = [],
  manufacturersList = [],
  onResetFilters,
}) {
  const categoryOptions = [
    { label: "All Categories", value: "all" },
    ...categoriesList.map((c) => ({ label: c, value: c })),
  ];

  const manufacturerOptions = [
    { label: "All Manufacturers", value: "all" },
    ...manufacturersList.map((m) => ({ label: m, value: m })),
  ];

  const statusOptions = [
    { label: "All Status", value: "all" },
    { label: "Active", value: "Active" },
    { label: "Inactive", value: "Inactive" },
  ];

  return (
    <div className="bg-white border border-slate-200/80 rounded-2xl p-3.5 shadow-2xs space-y-3">
      <div className="flex flex-wrap lg:flex-nowrap items-center justify-between gap-3">
        {/* Search Bar */}
        <div className="flex-1 min-w-[240px] relative">
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              placeholder="Search by medicine name, brand name, code..."
              className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-9 pr-8 py-2 text-xs font-medium text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => onSearchChange("")}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        </div>

        {/* Dynamic Filter Dropdowns & Far-Right Reset Button */}
        <div className="flex flex-wrap items-center gap-2.5">
          {/* Dynamic Category Dropdown */}
          <CustomDropdown
            label="Category"
            value={categoryFilter}
            options={categoryOptions}
            onChange={onCategoryChange}
            minWidth="160px"
          />

          {/* Dynamic Manufacturer Dropdown */}
          <CustomDropdown
            label="Manufacturer"
            value={manufacturerFilter}
            options={manufacturerOptions}
            onChange={onManufacturerChange}
            minWidth="160px"
          />

          {/* Status Dropdown */}
          <CustomDropdown
            label="Status"
            value={statusFilter}
            options={statusOptions}
            onChange={onStatusChange}
            minWidth="120px"
          />

          {/* Far-Right [ Reset Filters ] Button */}
          <button
            type="button"
            onClick={onResetFilters}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-slate-100 hover:bg-rose-50 hover:text-rose-600 text-slate-700 font-bold text-xs border border-slate-200 transition cursor-pointer shrink-0"
            title="Reset All Filters"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset Filters</span>
          </button>
        </div>
      </div>
    </div>
  );
}
