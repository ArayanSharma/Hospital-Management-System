import React from "react";
import EmptyState from "../common/EmptyState.jsx";

export default function DiagnosesTab({ diagnoses, patient }) {
  const list = diagnoses || patient?.diagnoses || [];

  if (!list || list.length === 0) {
    return <EmptyState title="No Diagnoses Recorded" message="No active or chronic medical conditions registered for this patient." />;
  }

  return (
    <div className="space-y-4">
      <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider">
        Diagnoses & Conditions ({list.length})
      </h3>
      <div className="space-y-3 text-xs">
        {list.map((d, i) => (
          <div key={d.id || d._id || i} className="bg-slate-50 border border-slate-200 rounded-2xl p-4 space-y-2">
            <div className="flex items-center justify-between">
              <span className="font-extrabold text-sm text-slate-900">{d.diagnosis || d.condition}</span>
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-600 border border-emerald-200">
                {d.status || "Active"}
              </span>
            </div>
            {d.notes && <p className="text-slate-600">Notes: {d.notes}</p>}
            <div className="flex items-center justify-between text-[11px] text-slate-400 pt-2 border-t border-slate-200">
              <span>ICD Code: {d.icdCode || "N/A"}</span>
              <span>Diagnosed Date: {d.diagnosedDate || "N/A"}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

