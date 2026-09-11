import React from "react";
import { Pill, Clock, Calendar, UserCheck, AlertCircle } from "lucide-react";
import EmptyState from "../common/EmptyState.jsx";

export default function MedicationsTab({ medications, patient }) {
  const list = medications || patient?.medications || [];

  if (!list || list.length === 0) {
    return (
      <EmptyState
        title="No Prescribed Medications"
        message="No active or past prescriptions found for this patient."
      />
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between pb-2 border-b border-slate-100">
        <h3 className="text-xs font-black text-slate-800 uppercase tracking-wider flex items-center gap-2">
          <Pill className="w-4 h-4 text-emerald-600" />
          <span>PRESCRIBED MEDICATIONS &amp; DOSAGE DETAILS ({list.length})</span>
        </h3>
        <span className="text-[11px] font-extrabold bg-emerald-50 text-emerald-700 px-3 py-1 rounded-full border border-emerald-200">
          {list.length} Active Rx
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {list.map((m, i) => (
          <div
            key={m.id || m._id || i}
            className="bg-white border border-slate-200/90 rounded-2xl p-4.5 space-y-3 shadow-2xs hover:shadow-sm transition-shadow"
          >
            {/* Header: Medicine Name & Status */}
            <div className="flex items-start justify-between gap-3">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0 border border-emerald-100">
                  <Pill className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-sm font-extrabold text-slate-900 capitalize">
                    {m.name || m.medicineName || "Prescribed Medicine"}
                  </h4>
                  <span className="inline-block mt-0.5 bg-slate-100 text-slate-700 text-[10px] font-extrabold px-2 py-0.5 rounded border border-slate-200">
                    Dosage: {m.dosage || "1 Tablet"}
                  </span>
                </div>
              </div>

              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold bg-emerald-50 text-emerald-700 border border-emerald-200 shrink-0">
                {m.status || "Active"}
              </span>
            </div>

            {/* Sub-grid: Frequency & Duration */}
            <div className="grid grid-cols-2 gap-2 text-xs bg-slate-50 p-3 rounded-xl border border-slate-100">
              <div className="flex items-center gap-2">
                <Clock className="w-3.5 h-3.5 text-blue-600 shrink-0" />
                <div>
                  <span className="text-[10px] text-slate-400 font-bold uppercase block">FREQUENCY</span>
                  <span className="font-extrabold text-slate-800">{m.frequency || "1-0-1"}</span>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <Calendar className="w-3.5 h-3.5 text-purple-600 shrink-0" />
                <div>
                  <span className="text-[10px] text-slate-400 font-bold uppercase block">DURATION</span>
                  <span className="font-extrabold text-slate-800">{m.duration || "7 Days"}</span>
                </div>
              </div>
            </div>

            {/* Special Instructions if available */}
            {m.instructions && (
              <div className="flex items-start gap-2 bg-amber-50/60 p-2.5 rounded-xl border border-amber-200/70 text-xs text-amber-900 font-medium">
                <AlertCircle className="w-3.5 h-3.5 text-amber-600 shrink-0 mt-0.5" />
                <span><strong className="font-bold text-amber-950">Instructions:</strong> {m.instructions}</span>
              </div>
            )}

            {/* Prescribing Doctor & Date */}
            <div className="flex items-center justify-between text-[11px] text-slate-500 pt-2 border-t border-slate-100">
              <span className="flex items-center gap-1">
                <UserCheck className="w-3.5 h-3.5 text-slate-400" />
                Dr. {m.prescribedBy || "Attending Physician"}
              </span>
              <span>{m.prescribedDate || "Prescribed Recently"}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
