import React, { useState } from "react";
import { Search, Filter, X, RotateCcw } from "lucide-react";

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
  dosageFormFilter,
  onDosageFormChange,
  gstFilter,
  onGstChange,
  onResetFilters,
}) {
  const [showMoreFilters, setShowMoreFilters] = useState(false);

  const categories = categoriesList.length > 0
    ? categoriesList
    : ["Analgesic / Antipyretic", "Antibiotic", "Antihistamine", "Anti-ulcer", "Analgesic / NSAID", "Supplement", "Antiprotozoal / Antibiotic"];

  const manufacturers = manufacturersList.length > 0
    ? manufacturersList
    : ["GSK Pharmaceuticals", "Cipla Ltd.", "Dr. Reddy's", "Sun Pharma", "Abbott", "J. B. Chemicals", "Zydus Lifesciences"];

  const hasActiveFilters =
    searchQuery ||
    categoryFilter !== "all" ||
    manufacturerFilter !== "all" ||
    statusFilter !== "all" ||
    (dosageFormFilter && dosageFormFilter !== "all") ||
    (gstFilter && gstFilter !== "all");

  return (
    <div className="bg-white border border-slate-200/80 rounded-2xl p-3.5 shadow-xs space-y-3">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-12 gap-3 items-end">
        {/* Search Bar (~4 cols) */}
        <div className="lg:col-span-5 relative">
          <label className="block text-[11px] font-semibold text-slate-500 mb-1 hidden">Search</label>
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

        {/* Category Dropdown (~2.5 cols) */}
        <div className="lg:col-span-2.5">
          <label className="block text-[11px] font-semibold text-slate-600 mb-1">Category</label>
          <select
            value={categoryFilter}
            onChange={(e) => onCategoryChange(e.target.value)}
            className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-xs font-medium text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all cursor-pointer"
          >
            <option value="all">All Categories</option>
            {categories.map((cat, idx) => (
              <option key={idx} value={cat}>
                {cat}
              </option>
            ))}
          </select>
        </div>

        {/* Manufacturer Dropdown (~2.5 cols) */}
        <div className="lg:col-span-2.5">
          <label className="block text-[11px] font-semibold text-slate-600 mb-1">Manufacturer</label>
          <select
            value={manufacturerFilter}
            onChange={(e) => onManufacturerChange(e.target.value)}
            className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-xs font-medium text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all cursor-pointer"
          >
            <option value="all">All Manufacturers</option>
            {manufacturers.map((mfg, idx) => (
              <option key={idx} value={mfg}>
                {mfg}
              </option>
            ))}
          </select>
        </div>

        {/* Status Dropdown (~2 cols) */}
        <div className="lg:col-span-2">
          <label className="block text-[11px] font-semibold text-slate-600 mb-1">Status</label>
          <select
            value={statusFilter}
            onChange={(e) => onStatusChange(e.target.value)}
            className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-xs font-medium text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all cursor-pointer"
          >
            <option value="all">All Status</option>
            <option value="Active">Active</option>
            <option value="Inactive">Inactive</option>
          </select>
        </div>

        {/* More Filters Toggle */}
        <div className="lg:col-span-12 flex items-center justify-between pt-1 border-t border-slate-100">
          <button
            type="button"
            onClick={() => setShowMoreFilters(!showMoreFilters)}
            className={`inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-lg border transition-all cursor-pointer ${
              showMoreFilters || (dosageFormFilter !== "all" || gstFilter !== "all")
                ? "bg-blue-50 border-blue-200 text-blue-600"
                : "bg-white border-slate-200 text-slate-600 hover:bg-slate-50"
            }`}
          >
            <Filter className="w-3.5 h-3.5" />
            <span>More Filters</span>
          </button>

          {hasActiveFilters && (
            <button
              type="button"
              onClick={() => {
                onResetFilters?.();
              }}
              className="text-xs font-semibold text-rose-600 hover:text-rose-700 inline-flex items-center gap-1 cursor-pointer"
            >
              <RotateCcw className="w-3 h-3" />
              <span>Reset Filters</span>
            </button>
          )}
        </div>

        {/* Expandable Advanced Filters */}
        {showMoreFilters && (
          <div className="lg:col-span-12 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 pt-2 bg-slate-50 p-3 rounded-xl border border-slate-100">
            <div>
              <label className="block text-[11px] font-semibold text-slate-600 mb-1">Dosage Form</label>
              <select
                value={dosageFormFilter || "all"}
                onChange={(e) => onDosageFormChange?.(e.target.value)}
                className="w-full bg-white border border-slate-200 rounded-lg px-2.5 py-1.5 text-xs text-slate-700 focus:outline-none"
              >
                <option value="all">All Dosage Forms</option>
                <option value="Tablet">Tablet</option>
                <option value="Capsule">Capsule</option>
                <option value="Syrup">Syrup</option>
                <option value="Chewable Tablet">Chewable Tablet</option>
                <option value="Injection">Injection</option>
              </select>
            </div>

            <div>
              <label className="block text-[11px] font-semibold text-slate-600 mb-1">GST Rate</label>
              <select
                value={gstFilter || "all"}
                onChange={(e) => onGstChange?.(e.target.value)}
                className="w-full bg-white border border-slate-200 rounded-lg px-2.5 py-1.5 text-xs text-slate-700 focus:outline-none"
              >
                <option value="all">All GST Rates</option>
                <option value="5">5% GST</option>
                <option value="12">12% GST</option>
                <option value="18">18% GST</option>
              </select>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
