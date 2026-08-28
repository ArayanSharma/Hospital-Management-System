import React from "react";

export default function OpdClinicalNotesTab({
  symptoms,
  setSymptoms,
  diagnosis,
  setDiagnosis,
  notes,
  setNotes,
}) {
  return (
    <div className="space-y-3">
      <div>
        <label className="block text-xs font-bold text-slate-700 mb-1">Chief Complaints</label>
        <textarea
          rows={2}
          value={symptoms}
          onChange={(e) => setSymptoms(e.target.value)}
          className="w-full border border-slate-200 rounded-xl p-2.5 text-xs text-slate-800 focus:outline-none"
        />
      </div>
      <div>
        <label className="block text-xs font-bold text-slate-700 mb-1">Clinical Assessment</label>
        <textarea
          rows={2}
          value={diagnosis}
          onChange={(e) => setDiagnosis(e.target.value)}
          className="w-full border border-slate-200 rounded-xl p-2.5 text-xs text-slate-800 focus:outline-none"
        />
      </div>
      <div>
        <label className="block text-xs font-bold text-slate-700 mb-1">Additional Notes</label>
        <textarea
          rows={2}
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          className="w-full border border-slate-200 rounded-xl p-2.5 text-xs text-slate-800 focus:outline-none"
        />
      </div>
    </div>
  );
}
