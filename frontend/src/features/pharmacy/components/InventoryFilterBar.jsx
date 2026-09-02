import React from "react";
import { Search } from "lucide-react";

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
          placeholder="Search by medicine name, batch number..."
          className="w-full pl-9 pr-4 py-2 text-xs font-medium bg-slate-50/60 border border-slate-200/80 rounded-xl text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
        />
      </div>

      {/* Dropdown Filters */}
      <div className="flex flex-wrap items-center gap-2.5">
        {/* Category */}
        <div className="flex items-center gap-1.5">
          <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider hidden lg:inline">Category</span>
          <select
            value={categoryFilter}
            onChange={(e) => onCategoryChange(e.target.value)}
            className="bg-slate-50/60 border border-slate-200/80 rounded-xl px-3 py-2 text-xs font-semibold text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all cursor-pointer"
          >
            <option value="all">All Categories</option>
            <option value="Analgesic">Analgesic</option>
            <option value="Antibiotic">Antibiotic</option>
            <option value="Antihistamine">Antihistamine</option>
            <option value="Gastro">Gastro</option>
            <option value="Supplement">Supplement</option>
          </select>
        </div>

        {/* Manufacturer */}
        <div className="flex items-center gap-1.5">
          <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider hidden lg:inline">Manufacturer</span>
          <select
            value={manufacturerFilter}
            onChange={(e) => onManufacturerChange(e.target.value)}
            className="bg-slate-50/60 border border-slate-200/80 rounded-xl px-3 py-2 text-xs font-semibold text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all cursor-pointer"
          >
            <option value="all">All Manufacturers</option>
            <option value="Sun Pharma">Sun Pharma</option>
            <option value="Cipla">Cipla</option>
            <option value="Dr. Reddy's">Dr. Reddy's</option>
            <option value="Lupin">Lupin</option>
            <option value="Alkem">Alkem</option>
            <option value="Abbott">Abbott</option>
            <option value="Torrent">Torrent</option>
            <option value="Zydus">Zydus</option>
            <option value="Dabur">Dabur</option>
          </select>
        </div>

        {/* Status */}
        <div className="flex items-center gap-1.5">
          <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider hidden lg:inline">Status</span>
          <select
            value={statusFilter}
            onChange={(e) => onStatusChange(e.target.value)}
            className="bg-slate-50/60 border border-slate-200/80 rounded-xl px-3 py-2 text-xs font-semibold text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all cursor-pointer"
          >
            <option value="all">All Status</option>
            <option value="In Stock">In Stock</option>
            <option value="Low Stock">Low Stock</option>
            <option value="Out of Stock">Out of Stock</option>
            <option value="Expiring Soon">Expiring Soon</option>
          </select>
        </div>

        {/* Expiry */}
        <div className="flex items-center gap-1.5">
          <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider hidden lg:inline">Expiry</span>
          <select
            value={expiryFilter}
            onChange={(e) => onExpiryChange(e.target.value)}
            className="bg-slate-50/60 border border-slate-200/80 rounded-xl px-3 py-2 text-xs font-semibold text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all cursor-pointer"
          >
            <option value="all">All</option>
            <option value="30">Within 30 Days</option>
            <option value="60">Within 60 Days</option>
            <option value="expired">Expired</option>
          </select>
        </div>
      </div>
    </div>
  );
}
