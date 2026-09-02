import React from "react";
import { Search, Calendar, Filter, ChevronDown } from "lucide-react";

export default function SalesFilterBar({
  searchQuery,
  onSearchChange,
  saleTypeFilter,
  onSaleTypeChange,
  paymentStatusFilter,
  onPaymentStatusChange,
  patientTypeFilter,
  onPatientTypeChange,
  onResetFilters,
}) {
  return (
    <div className="bg-white border border-slate-200/70 rounded-2xl p-3.5 shadow-xs flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
      {/* Main Search Input */}
      <div className="relative flex-1 min-w-[240px]">
        <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder="Search by invoice no., patient name, mobile..."
          className="w-full pl-9 pr-4 py-2 text-xs font-medium bg-slate-50/60 border border-slate-200/80 rounded-xl text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
        />
      </div>

      {/* Filter Options */}
      <div className="flex flex-wrap items-center gap-2.5">
        {/* Date Range Picker */}
        <div className="flex items-center gap-1.5">
          <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider hidden lg:inline">Date Range</span>
          <button
            type="button"
            className="flex items-center gap-2 bg-slate-50/60 border border-slate-200/80 rounded-xl px-3 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-100/70 transition-all cursor-pointer"
          >
            <Calendar className="w-3.5 h-3.5 text-slate-400" />
            <span>26 May 2026 - Today</span>
            <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
          </button>
        </div>

        {/* Sale Type */}
        <div className="flex items-center gap-1.5">
          <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider hidden lg:inline">Sale Type</span>
          <select
            value={saleTypeFilter}
            onChange={(e) => onSaleTypeChange(e.target.value)}
            className="bg-slate-50/60 border border-slate-200/80 rounded-xl px-3 py-2 text-xs font-semibold text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all cursor-pointer"
          >
            <option value="all">All Types</option>
            <option value="OPD">OPD</option>
            <option value="IPD">IPD</option>
            <option value="Walk-in">Walk-in</option>
          </select>
        </div>

        {/* Payment Status */}
        <div className="flex items-center gap-1.5">
          <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider hidden lg:inline">Payment Status</span>
          <select
            value={paymentStatusFilter}
            onChange={(e) => onPaymentStatusChange(e.target.value)}
            className="bg-slate-50/60 border border-slate-200/80 rounded-xl px-3 py-2 text-xs font-semibold text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all cursor-pointer"
          >
            <option value="all">All Status</option>
            <option value="Paid">Paid</option>
            <option value="Pending">Pending</option>
            <option value="Unpaid">Unpaid</option>
          </select>
        </div>

        {/* Patient Type */}
        <div className="flex items-center gap-1.5">
          <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider hidden lg:inline">Patient Type</span>
          <select
            value={patientTypeFilter}
            onChange={(e) => onPatientTypeChange(e.target.value)}
            className="bg-slate-50/60 border border-slate-200/80 rounded-xl px-3 py-2 text-xs font-semibold text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all cursor-pointer"
          >
            <option value="all">All</option>
            <option value="registered">Registered Patient</option>
            <option value="walk_in">Walk-in Customer</option>
          </select>
        </div>

        {/* Filters Button */}
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
