import React from "react";
import EmptyState from "../common/EmptyState.jsx";

export default function MedicalHistoryTab({ timeline, patient }) {
  const list = timeline || patient?.medicalHistoryTimeline || patient?.medicalHistory || [];

  if (!list || list.length === 0) {
    return <EmptyState title="No Medical History" message="No previous consultations or clinical history recorded for this patient." />;
  }

  return (
    <div className="space-y-6">
      <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider">
        Chronological Medical History Timeline ({list.length})
      </h3>

      <div className="relative border-l-2 border-slate-200 ml-4 space-y-6">
        {list.map((item, i) => (
          <div key={item.id || item._id || i} className="relative pl-6">
            <div className="absolute -left-[9px] top-1 w-4 h-4 rounded-full bg-blue-600 border-2 border-white ring-4 ring-blue-50"></div>
            <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 space-y-1.5">
              <div className="flex items-center justify-between">
                <span className="text-xs font-extrabold text-blue-600 uppercase tracking-wider">
                  {item.eventType || item.type || "Consultation"}
                </span>
                <span className="text-[11px] font-medium text-slate-400 font-mono">
                  {item.date || "N/A"}
                </span>
              </div>
              <p className="text-xs font-bold text-slate-900">{item.description || item.diagnosis || item.notes}</p>
              <div className="flex items-center justify-between text-[11px] text-slate-500 pt-1 border-t border-slate-200/60">
                <span>Attending: {item.doctor || "Physician"} ({item.department || "General OPD"})</span>
                {item.ref && <span className="font-mono text-slate-400">Ref: {item.ref}</span>}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

