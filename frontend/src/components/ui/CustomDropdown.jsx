import React, { useState, useRef, useEffect } from "react";
import { ChevronDown, Check } from "lucide-react";

/**
 * Senior Architect Level Custom UI Dropdown Component
 * Supports both horizontal filter bar inline style and full-width form input style!
 */
export default function CustomDropdown({
  label,
  value,
  options = [],
  onChange,
  minWidth = "120px",
  icon: Icon,
  alignRight = false,
  direction = "down", // "down" | "up"
  fullWidth = false,
  className = "",
  placeholder = "Select option",
}) {
  const [isOpen, setIsOpen] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (ref.current && !ref.current.contains(e.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const formattedOptions = options.map((opt) =>
    typeof opt === "object" && opt !== null ? opt : { label: String(opt), value: opt }
  );

  const selectedOpt =
    formattedOptions.find((o) => o.value === value || o.label === value) ||
    (value ? { label: String(value), value } : formattedOptions[0] || { label: placeholder, value: "" });

  if (fullWidth) {
    return (
      <div className={`space-y-1.5 w-full ${className}`} ref={ref}>
        {label && <label className="block font-bold text-slate-700 text-xs">{label}</label>}
        <div className="relative w-full">
          <button
            type="button"
            onClick={() => setIsOpen(!isOpen)}
            className={`w-full flex items-center justify-between p-2.5 bg-white hover:bg-slate-50 border rounded-xl text-xs font-semibold text-slate-800 transition-all duration-200 cursor-pointer shadow-2xs ${
              isOpen ? "border-blue-500 ring-2 ring-blue-500/10" : "border-slate-200"
            }`}
          >
            <div className="flex items-center gap-2 min-w-0">
              {Icon && <Icon className="w-4 h-4 text-blue-600 shrink-0" />}
              <span className="truncate">{selectedOpt.label}</span>
            </div>
            <ChevronDown
              className={`w-4 h-4 text-slate-500 shrink-0 transition-transform duration-300 ease-in-out ${
                isOpen ? "rotate-180 text-blue-600" : "rotate-0"
              }`}
            />
          </button>

          {isOpen && (
            <div className={`absolute w-full bg-white border border-slate-200/90 rounded-xl shadow-xl z-50 p-1 text-xs space-y-0.5 max-h-56 overflow-y-auto animate-in fade-in zoom-in-95 duration-150 ease-out left-0 ${
              direction === "up" ? "bottom-full mb-1.5 origin-bottom-left" : "mt-1.5 origin-top-left"
            }`}>
              {formattedOptions.map((opt) => {
                const isSelected = value === opt.value || value === opt.label;
                return (
                  <button
                    key={opt.value}
                    type="button"
                    onClick={() => {
                      onChange(opt.value);
                      setIsOpen(false);
                    }}
                    className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-left font-semibold transition-colors duration-150 cursor-pointer ${
                      isSelected
                        ? "bg-blue-50 text-blue-700 font-bold"
                        : "text-slate-700 hover:bg-slate-50 hover:text-slate-900"
                    }`}
                  >
                    <span className="truncate">{opt.label}</span>
                    {isSelected && <Check className="w-3.5 h-3.5 text-blue-600 shrink-0" />}
                  </button>
                );
              })}
            </div>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className={`flex items-center gap-2 ${className}`}>
      {label && <span className="text-xs font-semibold text-slate-600 shrink-0">{label}</span>}
      <div className="relative inline-block text-left" ref={ref}>
        <button
          type="button"
          onClick={() => setIsOpen(!isOpen)}
          style={{ minWidth }}
          className={`flex items-center justify-between gap-2 px-3 py-1.5 bg-slate-50 hover:bg-slate-100/90 border rounded-xl text-xs font-bold text-slate-800 transition-all duration-200 cursor-pointer shadow-2xs ${
            isOpen ? "border-blue-500 ring-2 ring-blue-500/10 bg-white" : "border-slate-200/90"
          }`}
        >
          <div className="flex items-center gap-1.5 min-w-0">
            {Icon && <Icon className="w-3.5 h-3.5 text-blue-600 shrink-0" />}
            <span className="truncate">{selectedOpt.label}</span>
          </div>
          <ChevronDown
            className={`w-3.5 h-3.5 shrink-0 transition-transform duration-300 ease-in-out ${
              isOpen ? "rotate-180 text-blue-600" : "rotate-0 text-slate-400"
            }`}
          />
        </button>

        {isOpen && (
          <div
            className={`absolute min-w-[130px] bg-white border border-slate-200/90 rounded-xl shadow-xl z-50 p-1 text-xs space-y-0.5 animate-in fade-in zoom-in-95 duration-150 ease-out ${
              alignRight ? "right-0" : "left-0"
            } ${
              direction === "up" ? "bottom-full mb-1.5 origin-bottom-left" : "mt-1.5 origin-top-left"
            }`}
          >
            {formattedOptions.map((opt) => {
              const isSelected = value === opt.value || value === opt.label;
              return (
                <button
                  key={opt.value}
                  type="button"
                  onClick={() => {
                    onChange(opt.value);
                    setIsOpen(false);
                  }}
                  className={`w-full flex items-center justify-between px-2.5 py-1.5 rounded-lg text-left font-semibold transition-colors duration-150 cursor-pointer ${
                    isSelected
                      ? "bg-blue-50 text-blue-700 font-bold"
                      : "text-slate-700 hover:bg-slate-50 hover:text-slate-900"
                  }`}
                >
                  <span className="truncate">{opt.label}</span>
                  {isSelected && <Check className="w-3.5 h-3.5 text-blue-600 shrink-0" />}
                </button>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
