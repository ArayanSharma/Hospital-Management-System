import React from "react";
import { AlertTriangle, HeartPulse, Stethoscope } from "lucide-react";
import EmptyState from "../common/EmptyState.jsx";

export default function OverviewTab({ patient, data }) {
  const patientData = patient || data?.patient;
  const severeAllergies = (patientData?.allergies || data?.allergies || []).filter(
    (a) => a.severity === "Severe"
  );

  const vitals = patientData?.vitals || data?.vitals || {};
  const diagnoses = patientData?.diagnoses || data?.diagnoses || [];

  return (
    <div className="space-y-5">
      <h3 className="text-xs font-black text-slate-800 uppercase tracking-wider">
        PATIENT OVERVIEW & CLINICAL SUMMARY
      </h3>

      {/* Severe Allergy Warning Banner if applicable */}
      {severeAllergies.length > 0 && (
        <div className="p-4 bg-rose-50 border border-rose-200 rounded-2xl flex items-center gap-3 text-xs text-rose-800">
          <AlertTriangle className="w-5 h-5 text-rose-600 shrink-0" />
          <div>
            <p className="font-extrabold">SEVERE ALLERGY WARNING</p>
            <p className="text-rose-700">
              Patient has severe allergic reaction to: {severeAllergies.map((a) => a.allergyName || a.allergen).join(", ")}
            </p>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {/* Vitals Summary Card */}
        <div className="bg-white border border-slate-200/90 rounded-2xl p-5 space-y-4 shadow-2xs">
          <h4 className="text-xs font-black text-slate-800 uppercase tracking-wider flex items-center gap-2">
            <HeartPulse className="w-4 h-4 text-rose-500" />
            <span>LATEST VITAL SIGNS</span>
          </h4>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
            <div className="bg-slate-50 p-3 rounded-xl border border-slate-100">
              <span className="text-[10px] text-slate-400 font-extrabold">BP</span>
              <p className="font-extrabold text-slate-900 mt-1">{vitals.bloodPressure || "120/80 mmHg"}</p>
            </div>
            <div className="bg-slate-50 p-3 rounded-xl border border-slate-100">
              <span className="text-[10px] text-slate-400 font-extrabold">PULSE</span>
              <p className="font-extrabold text-slate-900 mt-1">{vitals.heartRate || "72 bpm"}</p>
            </div>
            <div className="bg-slate-50 p-3 rounded-xl border border-slate-100">
              <span className="text-[10px] text-slate-400 font-extrabold">TEMP</span>
              <p className="font-extrabold text-slate-900 mt-1">{vitals.temperature || "98.6 °F"}</p>
            </div>
            <div className="bg-slate-50 p-3 rounded-xl border border-slate-100">
              <span className="text-[10px] text-slate-400 font-extrabold">SPO2</span>
              <p className="font-extrabold text-slate-900 mt-1">{vitals.spO2 || "99%"}</p>
            </div>
          </div>
        </div>

        {/* Active Conditions Card */}
        <div className="bg-white border border-slate-200/90 rounded-2xl p-5 space-y-4 shadow-2xs">
          <h4 className="text-xs font-black text-slate-800 uppercase tracking-wider flex items-center gap-2">
            <Stethoscope className="w-4 h-4 text-blue-600" />
            <span>ACTIVE DIAGNOSES</span>
          </h4>
          {diagnoses.length > 0 ? (
            <div className="space-y-2 text-xs">
              {diagnoses.map((d, i) => (
                <div key={d.id || i} className="flex items-center justify-between bg-slate-50 p-3 rounded-xl border border-slate-100">
                  <div>
                    <span className="font-bold text-slate-900">{d.diagnosis || d.condition}</span>
                    {d.icdCode && <span className="text-[10px] text-slate-400 font-mono ml-2">{d.icdCode}</span>}
                  </div>
                  <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold bg-blue-50 text-blue-700 border border-blue-200">
                    {d.status || "Active"}
                  </span>
                </div>
              ))}
            </div>
          ) : (
            <EmptyState title="No Active Diagnoses" message="No active clinical conditions registered for this patient." />
          )}
        </div>
      </div>
    </div>
  );
}

