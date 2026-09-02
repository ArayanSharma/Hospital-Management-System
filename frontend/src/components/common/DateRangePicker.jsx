import React, { useRef } from "react";
import { Calendar } from "lucide-react";

export default function DateRangePicker({
  fromDate,
  setFromDate,
  toDate,
  setToDate,
  fromLabel = "From Date",
  toLabel = "To Date",
  singleInput = false,
  label = "Date Range",
  placeholder = "Select date range",
}) {
  const fromInputRef = useRef(null);
  const toInputRef = useRef(null);

  const handleOpenFrom = () => {
    if (fromInputRef.current) {
      if (typeof fromInputRef.current.showPicker === "function") {
        fromInputRef.current.showPicker();
      } else {
        fromInputRef.current.focus();
      }
    }
  };

  const handleOpenTo = () => {
    if (toInputRef.current) {
      if (typeof toInputRef.current.showPicker === "function") {
        toInputRef.current.showPicker();
      } else {
        toInputRef.current.focus();
      }
    }
  };

  if (singleInput) {
    const displayValue =
      fromDate && toDate
        ? `${fromDate} - ${toDate}`
        : fromDate
        ? `From ${fromDate}`
        : placeholder;

    return (
      <div className="flex flex-col gap-1">
        {label && <label className="text-[11px] font-bold text-slate-800">{label}</label>}
        <div
          onClick={handleOpenFrom}
          className="relative w-36 lg:w-40 bg-white border border-slate-200/90 rounded-xl px-3 py-2 text-xs flex items-center justify-between cursor-pointer h-[38px] hover:border-blue-400 transition"
        >
          <span
            className={
              fromDate || toDate ? "font-bold text-slate-900 truncate" : "font-normal text-slate-400 truncate"
            }
          >
            {displayValue}
          </span>
          <Calendar className="w-3.5 h-3.5 text-blue-600 shrink-0 ml-1" />
          <input
            ref={fromInputRef}
            type="date"
            value={fromDate || ""}
            onChange={(e) => setFromDate(e.target.value)}
            className="absolute inset-0 opacity-0 pointer-events-auto cursor-pointer w-full h-full"
          />
        </div>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-3.5">
      {/* From Date */}
      <div className="flex flex-col gap-1">
        {fromLabel && <label className="text-[11px] font-bold text-slate-800">{fromLabel}</label>}
        <div
          onClick={handleOpenFrom}
          className="relative w-36 bg-white border border-slate-200/90 rounded-xl px-3 py-2 text-xs flex items-center justify-between cursor-pointer h-[38px] hover:border-blue-400 transition"
        >
          <span className={fromDate ? "font-bold text-slate-900" : "font-normal text-slate-400"}>
            {fromDate || "Select date"}
          </span>
          <Calendar className="w-3.5 h-3.5 text-blue-600 shrink-0" />
          <input
            ref={fromInputRef}
            type="date"
            value={fromDate || ""}
            onChange={(e) => setFromDate(e.target.value)}
            className="absolute inset-0 opacity-0 pointer-events-auto cursor-pointer w-full h-full"
          />
        </div>
      </div>

      {/* To Date */}
      <div className="flex flex-col gap-1">
        {toLabel && <label className="text-[11px] font-bold text-slate-800">{toLabel}</label>}
        <div
          onClick={handleOpenTo}
          className="relative w-36 bg-white border border-slate-200/90 rounded-xl px-3 py-2 text-xs flex items-center justify-between cursor-pointer h-[38px] hover:border-blue-400 transition"
        >
          <span className={toDate ? "font-bold text-slate-900" : "font-normal text-slate-400"}>
            {toDate || "Select date"}
          </span>
          <Calendar className="w-3.5 h-3.5 text-blue-600 shrink-0" />
          <input
            ref={toInputRef}
            type="date"
            value={toDate || ""}
            onChange={(e) => setToDate(e.target.value)}
            className="absolute inset-0 opacity-0 pointer-events-auto cursor-pointer w-full h-full"
          />
        </div>
      </div>
    </div>
  );
}