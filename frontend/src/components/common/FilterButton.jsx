import React from "react";
import { RotateCcw, Filter } from "lucide-react";

export default function FilterButton({
  onClick,
  onReset,
  hasActiveFilters = false,
  label = "Reset",
  className = "",
  variant = "reset",
}) {
  const handleClick = onReset || onClick;
  const isReset = variant === "reset" || Boolean(onReset);

  if (isReset) {
    return (
      <button
        type="button"
        onClick={handleClick}
        disabled={!hasActiveFilters}
        title={hasActiveFilters ? "Reset all active filters" : "No active filters to reset"}
        className={`h-[38px] px-3.5 rounded-xl border font-extrabold text-xs flex items-center justify-center gap-1.5 transition-all duration-200 cursor-pointer shrink-0 ${
          hasActiveFilters
            ? "border-blue-300 bg-blue-50 text-blue-600 hover:bg-blue-100 hover:border-blue-400 active:scale-95 shadow-2xs"
            : "border-slate-200 bg-slate-50 text-slate-400 opacity-60 cursor-not-allowed"
        } ${className}`}
      >
        <RotateCcw className={`w-3.5 h-3.5 ${hasActiveFilters ? "stroke-[2.5]" : ""}`} />
        <span>{label}</span>
      </button>
    );
  }

  return (
    <button
      type="button"
      onClick={handleClick}
      className={`bg-white border border-slate-200/90 text-blue-600 font-bold px-4 py-2 rounded-xl hover:bg-slate-50 transition cursor-pointer flex items-center gap-1.5 shadow-2xs text-xs h-[38px] shrink-0 ${className}`}
    >
      <Filter className="w-3.5 h-3.5 text-blue-600" />
      <span>{label}</span>
    </button>
  );
}
