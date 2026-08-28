import React from "react";
import { Plus } from "lucide-react";

export default function OpdVitalsTab({
  vitals,
  symptoms,
  setSymptoms,
  diagnosis,
  setDiagnosis,
  notes,
  setNotes,
}) {
  return (
    <div className="space-y-4">
      <div>
        <h4 className="text-xs font-bold text-slate-900 mb-2">Patient Vitals</h4>
        <div className="grid grid-cols-3 gap-2.5">
          <div className="bg-slate-50/70 border border-slate-200/80 rounded-xl p-2.5">
            <p className="text-[10px] text-slate-400 font-medium">Temperature (°F)</p>
            <p className="text-sm font-extrabold text-slate-900 mt-0.5">{vitals.temperature}</p>
          </div>

          <div className="bg-slate-50/70 border border-slate-200/80 rounded-xl p-2.5">
            <p className="text-[10px] text-slate-400 font-medium">Blood Pressure (mmHg)</p>
            <p className="text-sm font-extrabold text-slate-900 mt-0.5">{vitals.bloodPressure}</p>
          </div>

          <div className="bg-slate-50/70 border border-slate-200/80 rounded-xl p-2.5">
            <p className="text-[10px] text-slate-400 font-medium">Pulse Rate (BPM)</p>
            <p className="text-sm font-extrabold text-slate-900 mt-0.5">{vitals.pulse}</p>
          </div>

          <div className="bg-slate-50/70 border border-slate-200/80 rounded-xl p-2.5">
            <p className="text-[10px] text-slate-400 font-medium">Weight (kg)</p>
            <p className="text-sm font-extrabold text-slate-900 mt-0.5">{vitals.weight}</p>
          </div>

          <div className="bg-slate-50/70 border border-slate-200/80 rounded-xl p-2.5">
            <p className="text-[10px] text-slate-400 font-medium">Height (cm)</p>
            <p className="text-sm font-extrabold text-slate-900 mt-0.5">{vitals.height}</p>
          </div>

          <div className="bg-slate-50/70 border border-slate-200/80 rounded-xl p-2.5">
            <p className="text-[10px] text-slate-400 font-medium">SpO2 (%)</p>
            <p className="text-sm font-extrabold text-slate-900 mt-0.5">{vitals.spO2}</p>
          </div>
        </div>

        <button
          type="button"
          onClick={() => alert("Add More Vitals modal opened")}
          className="mt-2 text-xs font-semibold text-blue-600 hover:text-blue-700 flex items-center gap-1 cursor-pointer"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>Add More Vitals</span>
        </button>
      </div>

      {/* Symptoms & Diagnosis Section */}
      <div className="space-y-2.5 pt-1">
        <h4 className="text-xs font-bold text-slate-900">Symptoms &amp; Diagnosis</h4>

        <div className="bg-white border border-slate-200/90 rounded-xl p-2.5">
          <label className="block text-[10px] font-bold text-slate-400 uppercase mb-0.5">
            Chief Complaints / Symptoms
          </label>
          <input
            type="text"
            value={symptoms}
            onChange={(e) => setSymptoms(e.target.value)}
            className="w-full text-xs text-slate-800 font-medium focus:outline-none bg-transparent"
          />
        </div>

        <div className="bg-white border border-slate-200/90 rounded-xl p-2.5">
          <label className="block text-[10px] font-bold text-slate-400 uppercase mb-0.5">
            Diagnosis
          </label>
          <input
            type="text"
            value={diagnosis}
            onChange={(e) => setDiagnosis(e.target.value)}
            className="w-full text-xs text-slate-800 font-bold focus:outline-none bg-transparent text-blue-700"
          />
        </div>

        <div className="bg-white border border-slate-200/90 rounded-xl p-2.5">
          <label className="block text-[10px] font-bold text-slate-400 uppercase mb-0.5">
            Notes / Advice
          </label>
          <textarea
            rows={2}
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            className="w-full text-xs text-slate-800 font-medium focus:outline-none resize-none bg-transparent"
          />
        </div>
      </div>
    </div>
  );
}
