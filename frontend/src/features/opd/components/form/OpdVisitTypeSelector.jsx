import React from "react";

export default function OpdVisitTypeSelector({ visitType, setVisitType }) {
  return (
    <div className="space-y-1.5">
      <p className="text-xs font-bold text-blue-700 uppercase tracking-wider">
        1. Visit Type
      </p>
      <div className="grid grid-cols-2 gap-3">
        <div
          onClick={() => setVisitType("walk-in")}
          className={`p-3 rounded-xl border transition cursor-pointer flex items-center gap-3 ${
            visitType === "walk-in"
              ? "bg-blue-50/50 border-blue-600 shadow-2xs"
              : "bg-white border-slate-200 hover:border-slate-300"
          }`}
        >
          <div
            className={`w-4 h-4 rounded-full border flex items-center justify-center ${
              visitType === "walk-in" ? "border-blue-600 bg-blue-600" : "border-slate-300"
            }`}
          >
            {visitType === "walk-in" && <div className="w-1.5 h-1.5 rounded-full bg-white" />}
          </div>
          <div>
            <h4 className="text-xs font-bold text-slate-900">Walk-in Patient</h4>
            <p className="text-[10px] text-slate-400">Create visit for a walk-in patient</p>
          </div>
        </div>

        <div
          onClick={() => setVisitType("appointment")}
          className={`p-3 rounded-xl border transition cursor-pointer flex items-center gap-3 ${
            visitType === "appointment"
              ? "bg-blue-50/50 border-blue-600 shadow-2xs"
              : "bg-white border-slate-200 hover:border-slate-300"
          }`}
        >
          <div
            className={`w-4 h-4 rounded-full border flex items-center justify-center ${
              visitType === "appointment" ? "border-blue-600 bg-blue-600" : "border-slate-300"
            }`}
          >
            {visitType === "appointment" && <div className="w-1.5 h-1.5 rounded-full bg-white" />}
          </div>
          <div>
            <h4 className="text-xs font-bold text-slate-900">From Appointment</h4>
            <p className="text-[10px] text-slate-400">Convert scheduled appointment to OPD visit</p>
          </div>
        </div>
      </div>
    </div>
  );
}
