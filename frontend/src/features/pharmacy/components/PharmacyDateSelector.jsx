import React, { useState } from "react";
import { Calendar, ChevronDown, Check } from "lucide-react";

const DATE_OPTIONS = [
  { label: "26 May 2026 - Today", value: "today" },
  { label: "Last 7 Days", value: "7days" },
  { label: "This Month (May 2026)", value: "this_month" },
  { label: "Last Month", value: "last_month" },
  { label: "Custom Range...", value: "custom" },
];

export default function PharmacyDateSelector({ selectedRange, onSelectRange }) {
  const [isOpen, setIsOpen] = useState(false);
  const [currentLabel, setCurrentLabel] = useState("26 May 2026 - Today");

  const handleSelect = (option) => {
    setCurrentLabel(option.label);
    if (onSelectRange) onSelectRange(option.value);
    setIsOpen(false);
  };

  return (
    <div className="relative">
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2.5 bg-white border border-slate-200 hover:border-slate-300 rounded-xl px-4 py-2 text-sm font-medium text-slate-700 shadow-xs transition-all cursor-pointer focus:outline-none focus:ring-2 focus:ring-blue-500/20"
        aria-expanded={isOpen}
      >
        <Calendar className="w-4 h-4 text-slate-500" />
        <span>{currentLabel}</span>
        <ChevronDown className={`w-4 h-4 text-slate-400 transition-transform duration-200 ${isOpen ? "rotate-180" : ""}`} />
      </button>

      {isOpen && (
        <>
          <div className="fixed inset-0 z-10" onClick={() => setIsOpen(false)} />
          <div className="absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-lg border border-slate-100 py-1.5 z-20 animate-in fade-in slide-in-from-top-2 duration-150">
            {DATE_OPTIONS.map((option) => (
              <button
                key={option.value}
                onClick={() => handleSelect(option)}
                className={`w-full text-left px-4 py-2 text-sm flex items-center justify-between transition-colors cursor-pointer ${
                  currentLabel === option.label
                    ? "bg-blue-50/70 text-blue-600 font-semibold"
                    : "text-slate-700 hover:bg-slate-50"
                }`}
              >
                <span>{option.label}</span>
                {currentLabel === option.label && <Check className="w-4 h-4 text-blue-600" />}
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
