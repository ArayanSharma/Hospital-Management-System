import React from "react";
import { Filter } from "lucide-react";

export default function FilterButton({ onClick, label = "Filters", className = "" }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`bg-white border border-slate-200/90 text-blue-600 font-bold px-4 py-2 rounded-xl hover:bg-slate-50 transition cursor-pointer flex items-center gap-1.5 shadow-2xs text-xs h-[38px] ${className}`}
    >
      <Filter className="w-3.5 h-3.5 text-blue-600" />
      <span>{label}</span>
    </button>
  );
}
