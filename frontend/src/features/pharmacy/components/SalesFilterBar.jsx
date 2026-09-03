import React from "react";
import { Search, RotateCcw } from "lucide-react";
import CustomDropdown from "../../../components/ui/CustomDropdown.jsx";

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
  const saleTypeOptions = [
    { label: "All Types", value: "all" },
    { label: "OPD Visit", value: "OPD" },
    { label: "IPD Admission", value: "IPD" },
    { label: "Walk-in Customer", value: "Walk-in" },
  ];

  const paymentStatusOptions = [
    { label: "All Status", value: "all" },
    { label: "Paid", value: "Paid" },
    { label: "Pending", value: "Pending" },
    { label: "Unpaid", value: "Unpaid" },
  ];

  const patientTypeOptions = [
    { label: "All Patients", value: "all" },
    { label: "Registered Patient", value: "registered" },
    { label: "Walk-in Customer", value: "walk_in" },
  ];

  return (
    <div className="bg-white border border-slate-200/70 rounded-2xl p-3.5 shadow-2xs flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
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

      {/* Filter Dropdowns & Far-Right Reset Button */}
      <div className="flex flex-wrap items-center gap-2.5">
        <CustomDropdown
          label="Sale Type"
          value={saleTypeFilter}
          options={saleTypeOptions}
          onChange={onSaleTypeChange}
          minWidth="130px"
        />

        <CustomDropdown
          label="Payment"
          value={paymentStatusFilter}
          options={paymentStatusOptions}
          onChange={onPaymentStatusChange}
          minWidth="120px"
        />

        <CustomDropdown
          label="Patient"
          value={patientTypeFilter}
          options={patientTypeOptions}
          onChange={onPatientTypeChange}
          minWidth="140px"
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
