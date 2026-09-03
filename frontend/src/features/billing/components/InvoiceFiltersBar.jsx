import React, { useState, useRef, useEffect } from "react";
import { Search, Calendar, RotateCcw, X, Check } from "lucide-react";
import CustomDropdown from "../../../components/ui/CustomDropdown.jsx";

export default function InvoiceFiltersBar({
  search,
  setSearch,
  statusFilter,
  setStatusFilter,
  departmentFilter,
  setDepartmentFilter,
  dateRange,
  setDateRange,
  onApplyFilters,
}) {
  const [isResetting, setIsResetting] = useState(false);
  const [isDatePickerOpen, setIsDatePickerOpen] = useState(false);

  // Start & End date inputs (empty by default until selected)
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [selectedPreset, setSelectedPreset] = useState("");

  const datePickerRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (datePickerRef.current && !datePickerRef.current.contains(e.target)) {
        setIsDatePickerOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const formatDateLabel = (startStr, endStr) => {
    if (!startStr || !endStr) return "";
    const startObj = new Date(startStr);
    const endObj = new Date(endStr);
    const startFmt = startObj.toLocaleDateString("en-IN", { day: "2-digit", month: "short" });
    const endFmt = endObj.toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" });
    return `${startFmt} - ${endFmt}`;
  };

  const applyCustomDateRange = (sDate, eDate, presetName) => {
    setStartDate(sDate);
    setEndDate(eDate);
    if (presetName) setSelectedPreset(presetName);

    const formattedLabel = formatDateLabel(sDate, eDate);
    setDateRange?.(formattedLabel);
    onApplyFilters?.();
  };

  const handlePresetSelect = (presetKey) => {
    const today = new Date();
    let sDate = "";
    let eDate = today.toISOString().split("T")[0];

    if (presetKey === "Today") {
      sDate = eDate;
    } else if (presetKey === "This Week") {
      const firstDayOfWeek = new Date(today.setDate(today.getDate() - today.getDay()));
      sDate = firstDayOfWeek.toISOString().split("T")[0];
      eDate = new Date().toISOString().split("T")[0];
    } else if (presetKey === "This Month") {
      const firstDayOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
      sDate = firstDayOfMonth.toISOString().split("T")[0];
      eDate = new Date(today.getFullYear(), today.getMonth() + 1, 0).toISOString().split("T")[0];
    } else if (presetKey === "Last Month") {
      const firstDayLastMonth = new Date(today.getFullYear(), today.getMonth() - 1, 1);
      const lastDayLastMonth = new Date(today.getFullYear(), today.getMonth(), 0);
      sDate = firstDayLastMonth.toISOString().split("T")[0];
      eDate = lastDayLastMonth.toISOString().split("T")[0];
    } else if (presetKey === "All Time") {
      sDate = "";
      eDate = "";
      setDateRange?.("");
      setSelectedPreset("");
      setIsDatePickerOpen(false);
      onApplyFilters?.();
      return;
    }

    applyCustomDateRange(sDate, eDate, presetKey);
    setIsDatePickerOpen(false);
  };

  const handleClearDateRange = (e) => {
    e.stopPropagation();
    setDateRange?.("");
    setStartDate("");
    setEndDate("");
    setSelectedPreset("");
    onApplyFilters?.();
  };

  const handleReset = () => {
    setIsResetting(true);
    setSearch("");
    setStatusFilter("all");
    setDepartmentFilter("all");
    setDateRange?.("");
    setSelectedPreset("");
    setStartDate("");
    setEndDate("");
    onApplyFilters?.();
    setTimeout(() => setIsResetting(false), 500);
  };

  return (
    <div className="bg-white border border-slate-200/80 rounded-2xl p-3.5 shadow-2xs relative z-30 animate-in fade-in slide-in-from-top-1 duration-200 ease-out">
      <div className="flex flex-wrap lg:flex-nowrap items-center justify-between gap-2.5">
        {/* 1. Search Bar with Focus Glow */}
        <div className="flex-1 min-w-[200px] relative group">
          <Search className="w-4 h-4 text-slate-400 group-focus-within:text-blue-600 transition-colors duration-200 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by invoice ID, patient name, phone..."
            className="w-full bg-slate-50 border border-slate-200/90 rounded-xl pl-9 pr-8 py-2 text-xs font-medium text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/25 focus:border-blue-500 focus:bg-white transition-all duration-200 shadow-2xs"
          />
          {search && (
            <button
              type="button"
              onClick={() => setSearch("")}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-700 active:scale-90 transition-all cursor-pointer"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        {/* 2. Status Dropdown */}
        <div className="transition-transform duration-150 hover:-translate-y-0.5">
          <CustomDropdown
            value={statusFilter}
            options={[
              { label: "All Statuses", value: "all" },
              { label: "Paid", value: "paid" },
              { label: "Partially Paid", value: "partially-paid" },
              { label: "Unpaid", value: "unpaid" },
              { label: "Cancelled", value: "cancelled" },
            ]}
            onChange={setStatusFilter}
            minWidth="125px"
          />
        </div>

        {/* 3. Department Dropdown */}
        <div className="transition-transform duration-150 hover:-translate-y-0.5">
          <CustomDropdown
            value={departmentFilter}
            options={[
              { label: "All Departments", value: "all" },
              { label: "OPD", value: "OPD" },
              { label: "IPD", value: "IPD" },
              { label: "Lab", value: "Lab" },
              { label: "Radiology", value: "Radiology" },
              { label: "Pharmacy", value: "Pharmacy" },
              { label: "Surgery", value: "Surgery" },
            ]}
            onChange={setDepartmentFilter}
            minWidth="135px"
          />
        </div>

        {/* 4. Real Interactive Date Range Picker Popover (Empty State Until Selected) */}
        <div className="relative inline-block text-left" ref={datePickerRef}>
          <button
            type="button"
            onClick={() => setIsDatePickerOpen(!isDatePickerOpen)}
            className={`flex items-center gap-2 border rounded-xl px-3 py-2 text-xs font-semibold whitespace-nowrap shrink-0 cursor-pointer transition-all duration-200 active:scale-[0.98] shadow-2xs hover:shadow-xs group ${
              dateRange
                ? "bg-blue-50/90 text-blue-700 border-blue-200 font-bold"
                : "bg-slate-50 text-slate-400 hover:text-slate-600 border-slate-200/90"
            }`}
          >
            <Calendar className={`w-3.5 h-3.5 shrink-0 transition-colors duration-200 ${dateRange ? "text-blue-600" : "text-slate-400 group-hover:text-slate-600"}`} />
            <span>{dateRange || "Select Date Range"}</span>
            {dateRange && (
              <span
                onClick={handleClearDateRange}
                className="p-0.5 hover:bg-blue-100 rounded-md text-blue-500 hover:text-rose-600 transition-colors ml-0.5 cursor-pointer"
                title="Clear Date Filter"
              >
                <X className="w-3 h-3 stroke-[2.5]" />
              </span>
            )}
          </button>

          {/* Interactive Date Range Popover */}
          {isDatePickerOpen && (
            <div className="absolute right-0 mt-2 w-72 bg-white border border-slate-200/90 rounded-2xl shadow-xl z-50 p-4 space-y-3 text-xs animate-in fade-in zoom-in-95 duration-150 ease-out">
              <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                <span className="font-bold text-slate-900 text-xs">Filter by Date Range</span>
                <button
                  type="button"
                  onClick={() => setIsDatePickerOpen(false)}
                  className="text-slate-400 hover:text-slate-600"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>

              {/* Presets Grid */}
              <div className="grid grid-cols-2 gap-1.5">
                {["Today", "This Week", "This Month", "Last Month", "All Time"].map((preset) => (
                  <button
                    key={preset}
                    type="button"
                    onClick={() => handlePresetSelect(preset)}
                    className={`px-2.5 py-1.5 rounded-lg text-[11px] font-semibold text-left transition-all ${
                      selectedPreset === preset
                        ? "bg-blue-50 text-blue-600 font-bold border border-blue-200"
                        : "bg-slate-50 text-slate-700 hover:bg-slate-100"
                    }`}
                  >
                    {preset}
                  </button>
                ))}
              </div>

              {/* Custom Date Inputs */}
              <div className="space-y-2 pt-2 border-t border-slate-100">
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Custom Range</p>
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block text-[10px] font-semibold text-slate-500 mb-0.5">Start Date</label>
                    <input
                      type="date"
                      value={startDate}
                      onChange={(e) => setStartDate(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-200 rounded-lg px-2 py-1 text-[11px] font-bold text-slate-800 focus:outline-none focus:border-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-semibold text-slate-500 mb-0.5">End Date</label>
                    <input
                      type="date"
                      value={endDate}
                      onChange={(e) => setEndDate(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-200 rounded-lg px-2 py-1 text-[11px] font-bold text-slate-800 focus:outline-none focus:border-blue-500"
                    />
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => {
                    if (startDate && endDate) {
                      applyCustomDateRange(startDate, endDate, "Custom");
                    }
                    setIsDatePickerOpen(false);
                  }}
                  className="w-full mt-2 py-1.5 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-lg text-xs transition cursor-pointer flex items-center justify-center gap-1"
                >
                  <Check className="w-3.5 h-3.5" />
                  <span>Apply Date Filter</span>
                </button>
              </div>
            </div>
          )}
        </div>

        {/* 5. Far-Right Reset Filters Button */}
        <button
          type="button"
          onClick={handleReset}
          className="flex items-center gap-1.5 px-3 py-2 bg-slate-50 border border-slate-200/90 hover:bg-slate-100 hover:border-slate-300 text-slate-700 font-bold text-xs rounded-xl transition-all duration-200 active:scale-95 cursor-pointer shrink-0 whitespace-nowrap shadow-2xs hover:shadow-xs"
        >
          <RotateCcw className={`w-3.5 h-3.5 text-slate-500 transition-transform duration-500 ease-in-out ${isResetting ? "-rotate-180 text-blue-600" : ""}`} />
          <span>Reset</span>
        </button>
      </div>
    </div>
  );
}
