import React from "react";

export default function VitalsTab({ vitals }) {
  return (
    <div className="space-y-6">
      <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider">
        Vitals Metrics & Recording History
      </h3>
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 text-center">
          <span className="text-xs text-slate-400 font-bold">Blood Pressure</span>
          <p className="text-lg font-black text-slate-900 mt-1">{vitals?.bloodPressure || "120/80 mmHg"}</p>
        </div>
        <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 text-center">
          <span className="text-xs text-slate-400 font-bold">Heart Rate</span>
          <p className="text-lg font-black text-slate-900 mt-1">{vitals?.heartRate || "72 bpm"}</p>
        </div>
        <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 text-center">
          <span className="text-xs text-slate-400 font-bold">Temperature</span>
          <p className="text-lg font-black text-slate-900 mt-1">{vitals?.temperature || "98.6 °F"}</p>
        </div>
        <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 text-center">
          <span className="text-xs text-slate-400 font-bold">SpO2 Oxygen</span>
          <p className="text-lg font-black text-slate-900 mt-1">{vitals?.spO2 || "99%"}</p>
        </div>
      </div>
    </div>
  );
}
