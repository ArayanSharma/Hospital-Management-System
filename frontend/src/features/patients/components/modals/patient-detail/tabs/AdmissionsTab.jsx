import React from "react";
import EmptyState from "../common/EmptyState.jsx";

export default function AdmissionsTab({ admissions, patient }) {
  const list = admissions || patient?.admissions || [];

  if (!list || list.length === 0) {
    return <EmptyState title="No IPD Admissions" message="No inpatient hospitalization records found for this patient." />;
  }

  return (
    <div className="space-y-4">
      <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider">
        IPD Hospitalization History ({list.length})
      </h3>
      {list.map((adm, i) => (
        <div key={adm._id || adm.id || i} className="bg-slate-50 border border-slate-200 rounded-2xl p-5 space-y-3 text-xs">
          <div className="flex items-center justify-between">
            <span className="font-extrabold text-sm text-slate-900">{adm.ward || "Super Specialty Ward"}</span>
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-purple-50 text-purple-600 border border-purple-200">
              {adm.status || adm.dischargeStatus || "Discharged"}
            </span>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-slate-600 pt-2 border-t border-slate-200">
            <div>
              <span className="text-[10px] text-slate-400 font-bold uppercase">Room & Bed</span>
              <p className="font-extrabold text-slate-800 mt-0.5">{adm.room || "Bed"} ({adm.bed || "N/A"})</p>
            </div>
            <div>
              <span className="text-[10px] text-slate-400 font-bold uppercase">Admitted Date</span>
              <p className="font-extrabold text-slate-800 mt-0.5">
                {adm.admissionDate ? new Date(adm.admissionDate).toLocaleDateString("en-GB") : "N/A"}
              </p>
            </div>
            <div>
              <span className="text-[10px] text-slate-400 font-bold uppercase">Discharged Date</span>
              <p className="font-extrabold text-slate-800 mt-0.5">
                {adm.dischargeDate ? new Date(adm.dischargeDate).toLocaleDateString("en-GB") : "Active"}
              </p>
            </div>
            <div>
              <span className="text-[10px] text-slate-400 font-bold uppercase">Length of Stay</span>
              <p className="font-extrabold text-slate-800 mt-0.5">{adm.lengthOfStay || "N/A"}</p>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

