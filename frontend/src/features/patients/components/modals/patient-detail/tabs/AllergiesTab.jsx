import React from "react";
import EmptyState from "../common/EmptyState.jsx";

export default function AllergiesTab({ allergies, patient }) {
  const list = allergies || patient?.allergies || [];

  if (!list || list.length === 0) {
    return <EmptyState title="No Known Allergies" message="No allergic reactions recorded for this patient." />;
  }

  return (
    <div className="space-y-4">
      <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider">
        Recorded Patient Allergies ({list.length})
      </h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {list.map((alg, i) => (
          <div key={alg.id || alg._id || i} className="bg-slate-50 border border-slate-200 rounded-2xl p-4 space-y-2 text-xs">
            <div className="flex items-center justify-between">
              <span className="font-extrabold text-sm text-slate-900">{alg.allergyName || alg.allergen}</span>
              <span
                className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                  alg.severity === "Severe"
                    ? "bg-rose-50 text-rose-600 border border-rose-200"
                    : "bg-amber-50 text-amber-600 border border-amber-200"
                }`}
              >
                {alg.severity || "Moderate"} Severity
              </span>
            </div>
            {alg.reaction && <p className="text-slate-600">Reaction: {alg.reaction}</p>}
            <div className="flex items-center justify-between text-[11px] text-slate-400 pt-2 border-t border-slate-200">
              <span>Recorded Date: {alg.recordedDate || "N/A"}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

