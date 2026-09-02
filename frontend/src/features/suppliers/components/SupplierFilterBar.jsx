import React from "react";
import { Search, Filter } from "lucide-react";

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
    <div className="bg-white border border-slate-200/70 rounded-2xl p-3.5 shadow-xs flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
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

      {/* Filter Dropdowns */}
      <div className="flex flex-wrap items-center gap-2.5">
        {/* Status */}
        <div className="flex items-center gap-1.5">
          <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider hidden lg:inline">Status</span>
          <select
            value={statusFilter}
            onChange={(e) => onStatusChange(e.target.value)}
            className="bg-slate-50/60 border border-slate-200/80 rounded-xl px-3 py-2 text-xs font-semibold text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all cursor-pointer"
          >
            <option value="all">All Status</option>
            <option value="Active">Active</option>
            <option value="Inactive">Inactive</option>
            <option value="Blocked">Blocked</option>
          </select>
        </div>

        {/* Category */}
        <div className="flex items-center gap-1.5">
          <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider hidden lg:inline">Category</span>
          <select
            value={categoryFilter}
            onChange={(e) => onCategoryChange(e.target.value)}
            className="bg-slate-50/60 border border-slate-200/80 rounded-xl px-3 py-2 text-xs font-semibold text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all cursor-pointer"
          >
            <option value="all">All Categories</option>
            <option value="Pharmaceuticals">Pharmaceuticals</option>
            <option value="Surgical">Surgical</option>
            <option value="Equipment">Equipment</option>
            <option value="Others">Others</option>
          </select>
        </div>

        {/* Location */}
        <div className="flex items-center gap-1.5">
          <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider hidden lg:inline">Location</span>
          <select
            value={locationFilter}
            onChange={(e) => onLocationChange(e.target.value)}
            className="bg-slate-50/60 border border-slate-200/80 rounded-xl px-3 py-2 text-xs font-semibold text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all cursor-pointer"
          >
            <option value="all">All Locations</option>
            <option value="Delhi">Delhi</option>
            <option value="Mumbai">Mumbai</option>
            <option value="Bangalore">Bangalore</option>
            <option value="Chennai">Chennai</option>
            <option value="Ahmedabad">Ahmedabad</option>
            <option value="Kolkata">Kolkata</option>
            <option value="Hyderabad">Hyderabad</option>
            <option value="Pune">Pune</option>
            <option value="Lucknow">Lucknow</option>
            <option value="Jaipur">Jaipur</option>
          </select>
        </div>

        {/* Filter Reset Button */}
        <button
          type="button"
          onClick={onResetFilters}
          className="flex items-center gap-1.5 bg-slate-50/60 border border-slate-200/80 hover:bg-slate-100 rounded-xl px-3 py-2 text-xs font-semibold text-slate-700 transition-colors cursor-pointer"
        >
          <Filter className="w-3.5 h-3.5 text-slate-500" />
          <span>Filters</span>
        </button>
      </div>
    </div>
  );
}
