import React from "react";
import { Search, RotateCcw } from "lucide-react";
import CustomDropdown from "../../../components/ui/CustomDropdown.jsx";

export default function InventoryFilterBar({
  searchQuery,
  onSearchChange,
  categoryFilter,
  onCategoryChange,
  manufacturerFilter,
  onManufacturerChange,
  statusFilter,
  onStatusChange,
  expiryFilter,
  onExpiryChange,
  onResetFilters,
}) {
  const categoryOptions = [
    { label: "All Categories", value: "all" },
    { label: "Analgesic", value: "Analgesic" },
    { label: "Antibiotic", value: "Antibiotic" },
    { label: "Antihistamine", value: "Antihistamine" },
    { label: "Gastro", value: "Gastro" },
    { label: "Supplement", value: "Supplement" },
  ];

  const manufacturerOptions = [
    { label: "All Manufacturers", value: "all" },
    { label: "Sun Pharma", value: "Sun Pharma" },
    { label: "Cipla", value: "Cipla" },
    { label: "Dr. Reddy's", value: "Dr. Reddy's" },
    { label: "Lupin", value: "Lupin" },
    { label: "Abbott", value: "Abbott" },
  ];

  const statusOptions = [
    { label: "All Status", value: "all" },
    { label: "In Stock", value: "In Stock" },
    { label: "Low Stock", value: "Low Stock" },
    { label: "Out of Stock", value: "Out of Stock" },
    { label: "Expiring Soon", value: "Expiring Soon" },
  ];

  const expiryOptions = [
    { label: "All Expiry", value: "all" },
    { label: "Within 30 Days", value: "30" },
    { label: "Within 60 Days", value: "60" },
    { label: "Expired", value: "expired" },
  ];

  return (
    <div className="bg-white border border-slate-200/70 rounded-2xl p-3.5 shadow-2xs flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
      {/* Search Input */}
      <div className="relative flex-1 min-w-[240px]">
        <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder="Search by medicine name, batch number..."
          className="w-full pl-9 pr-4 py-2 text-xs font-medium bg-slate-50/60 border border-slate-200/80 rounded-xl text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
        />
      </div>

      {/* Dropdown Filters & Reset Button */}
      <div className="flex flex-wrap items-center gap-2.5">
        <CustomDropdown
          label="Category"
          value={categoryFilter}
          options={categoryOptions}
          onChange={onCategoryChange}
          minWidth="140px"
        />

        <CustomDropdown
          label="Manufacturer"
          value={manufacturerFilter}
          options={manufacturerOptions}
          onChange={onManufacturerChange}
          minWidth="150px"
        />

        <CustomDropdown
          label="Status"
          value={statusFilter}
          options={statusOptions}
          onChange={onStatusChange}
          minWidth="130px"
        />

        <CustomDropdown
          label="Expiry"
          value={expiryFilter}
          options={expiryOptions}
          onChange={onExpiryChange}
          minWidth="130px"
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
  );
}
