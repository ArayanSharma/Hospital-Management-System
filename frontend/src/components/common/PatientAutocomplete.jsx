import React, { useState, useRef, useEffect } from "react";
import { usePatientSearch } from "../../hooks/usePatientSearch.js";
import { Search, User } from "lucide-react";

export default function PatientAutocomplete({ value, onChange, error }) {
  const [query, setQuery] = useState("");
  const [showDropdown, setShowDropdown] = useState(false);
  const { patients, loading } = usePatientSearch(query);
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setShowDropdown(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSelect = (patient) => {
    const displayStr = `${patient.name} (${patient.patientId || patient.uhid || "UHID"})`;
    setQuery(displayStr);
    onChange(patient._id, displayStr);
    setShowDropdown(false);
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <div className="relative">
        <input
          type="text"
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            setShowDropdown(true);
            if (!e.target.value) onChange("", "");
          }}
          onFocus={() => setShowDropdown(true)}
          placeholder="Type patient name or phone..."
          className="w-full pl-8 pr-3 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:border-blue-500 font-medium"
        />
        <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
      </div>

      {showDropdown && (
        <div className="absolute z-50 w-full mt-1 bg-white border border-slate-200 rounded-xl shadow-xl max-h-52 overflow-y-auto divide-y divide-slate-100 text-xs">
          {loading ? (
            <p className="px-3 py-2 text-xs text-slate-400 font-medium">Searching database...</p>
          ) : !patients || patients.length === 0 ? (
            <p className="px-3 py-2 text-xs text-slate-400 font-medium">No patients found</p>
          ) : (
            patients.map((p) => (
              <button
                key={p._id || p.patientId}
                type="button"
                onClick={() => handleSelect(p)}
                className="w-full text-left px-3 py-2 hover:bg-blue-50/70 transition flex items-center justify-between cursor-pointer"
              >
                <div className="flex items-center gap-2">
                  <User className="w-3.5 h-3.5 text-blue-600" />
                  <div>
                    <p className="font-bold text-slate-900">{p.name}</p>
                    <p className="text-[10px] font-mono text-blue-600 font-semibold">
                      {p.patientId || p.uhid || "UHID"}
                    </p>
                  </div>
                </div>
                <span className="text-[10px] text-slate-500 font-medium">{p.phone}</span>
              </button>
            ))
          )}
        </div>
      )}

      {error && <p className="text-xs text-rose-600 mt-1 font-medium">{error}</p>}
    </div>
  );
}