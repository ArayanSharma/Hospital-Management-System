import { useState } from "react";
import { usePatientSearch } from "../../hooks/usePatientSearch.js";

export default function PatientAutocomplete({ value, onChange, error }) {
  const [query, setQuery] = useState("");
  const [showDropdown, setShowDropdown] = useState(false);
  const { patients, loading } = usePatientSearch(query);

  const handleSelect = (patient) => {
    onChange(patient._id, patient.name);
    setQuery(patient.name);
    setShowDropdown(false);
  };

  return (
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
        className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
      />

      {showDropdown && query.length >= 2 && (
        <div className="absolute z-10 w-full mt-1 bg-white border border-gray-200 rounded-md shadow-lg max-h-48 overflow-y-auto">
          {loading ? (
            <p className="px-3 py-2 text-sm text-gray-400">Searching...</p>
          ) : !patients || patients.length === 0 ? (
            <p className="px-3 py-2 text-sm text-gray-400">No patients found</p>
          ) : (
            patients.map((p) => (
              <button
                key={p._id}
                type="button"
                onClick={() => handleSelect(p)}
                className="w-full text-left px-3 py-2 text-sm hover:bg-gray-50 flex justify-between"
              >
                <span>{p.name}</span>
                <span className="text-gray-400">{p.phone}</span>
              </button>
            ))
          )}
        </div>
      )}

      {error && <p className="text-xs text-red-600 mt-1">{error}</p>}
    </div>
  );
}