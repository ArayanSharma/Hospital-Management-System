import React from "react";
import { ChevronDown } from "lucide-react";

export default function FilterSelect({
  label,
  value,
  onChange,
  options = [],
  placeholder = "Select",
  minWidth = "135px",
  disabled = false,
  className = "",
}) {
  return (
    <div className="flex flex-col gap-1">
      {label && <label className="text-[11px] font-bold text-slate-800">{label}</label>}
      <div className="relative">
        <select
          value={value}
          disabled={disabled}
          onChange={onChange}
          style={{ minWidth }}
          className={`bg-white border border-slate-200/90 text-slate-900 font-semibold pl-3 pr-8 py-2 rounded-xl focus:outline-none focus:border-blue-400 appearance-none cursor-pointer text-xs h-[38px] disabled:bg-slate-50 ${className}`}
        >
          {placeholder && <option value="">{placeholder}</option>}
          {options.map((opt) => {
            const val = typeof opt === "object" ? opt.value : opt;
            const lbl = typeof opt === "object" ? opt.label : opt;
            return (
              <option key={val} value={val}>
                {lbl}
              </option>
            );
          })}
        </select>
        <ChevronDown className="w-3.5 h-3.5 text-blue-600 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
      </div>
    </div>
  );
}
