import React from "react";
import { User, Lock } from "lucide-react";
import PatientAutocomplete from "../../../../components/common/PatientAutocomplete.jsx";

export default function ClaimPatientPolicySection({
  patientId,
  uhid,
  selectedPolicyNum,
  providerName,
  policyNumber,
  tpaName,
  policyValidity,
  policyStatus,
  policies = [],
  onPatientSelect,
  onPolicySelect,
}) {
  return (
    <div className="bg-white border border-slate-200/80 rounded-2xl p-4 shadow-2xs space-y-3">
      <div className="flex items-center gap-2 border-b border-slate-100 pb-2.5">
        <User className="w-4 h-4 text-blue-600" />
        <h3 className="text-xs font-extrabold text-blue-700 tracking-wide">
          1. Patient & Policy Information
        </h3>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
        {/* Patient */}
        <div className="sm:col-span-1 space-y-1">
          <label className="text-[11px] font-bold text-slate-700">
            Patient <span className="text-rose-500">*</span>
          </label>
          <PatientAutocomplete value={patientId} onChange={onPatientSelect} />
        </div>

        {/* UHID */}
        <div className="space-y-1">
          <div className="flex items-center justify-between">
            <label className="text-[11px] font-bold text-slate-700">UHID</label>
            <Lock className="w-2.5 h-2.5 text-slate-400" />
          </div>
          <input
            type="text"
            readOnly
            value={uhid}
            placeholder="Auto-filled UHID"
            className="w-full bg-slate-100 border border-slate-200 rounded-xl px-3 py-1.5 text-xs font-mono font-bold text-slate-700 cursor-not-allowed"
          />
        </div>

        {/* Policy Dropdown */}
        <div className="space-y-1">
          <label className="text-[11px] font-bold text-slate-700">
            Policy <span className="text-rose-500">*</span>
          </label>
          <select
            value={selectedPolicyNum}
            onChange={(e) => onPolicySelect(e.target.value)}
            className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-1.5 text-xs font-bold text-slate-800 focus:outline-none focus:border-blue-500 cursor-pointer h-[34px]"
          >
            <option value="">-- Select Active Policy --</option>
            {policies.map((p) => (
              <option key={p._id || p.policyNumber} value={p.policyNumber}>
                {p.policyNumber} - {p.providerName}
              </option>
            ))}
          </select>
        </div>

        {/* Policy Status Badge */}
        <div className="space-y-1 flex flex-col justify-center">
          <label className="text-[11px] font-bold text-slate-700">Policy Status</label>
          <div>
            <span className="px-3 py-1 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200 inline-block">
              {policyStatus}
            </span>
          </div>
        </div>

        {/* Provider */}
        <div className="space-y-1">
          <label className="text-[11px] font-bold text-slate-700">
            TPA / Insurance Provider <span className="text-rose-500">*</span>
          </label>
          <input
            type="text"
            readOnly
            value={providerName}
            placeholder="Provider Name"
            className="w-full bg-slate-100 border border-slate-200 rounded-xl px-3 py-1.5 text-xs font-bold text-slate-800 cursor-not-allowed"
          />
        </div>

        {/* Policy Number */}
        <div className="space-y-1">
          <label className="text-[11px] font-bold text-slate-700">
            Policy Number <span className="text-rose-500">*</span>
          </label>
          <input
            type="text"
            readOnly
            value={policyNumber}
            placeholder="Policy Number"
            className="w-full bg-slate-100 border border-slate-200 rounded-xl px-3 py-1.5 text-xs font-mono font-bold text-slate-800 cursor-not-allowed"
          />
        </div>

        {/* TPA Name */}
        <div className="space-y-1">
          <label className="text-[11px] font-bold text-slate-700">TPA Name</label>
          <input
            type="text"
            readOnly
            value={tpaName}
            placeholder="TPA Name"
            className="w-full bg-slate-100 border border-slate-200 rounded-xl px-3 py-1.5 text-xs font-bold text-slate-800 cursor-not-allowed"
          />
        </div>

        {/* Policy Validity */}
        <div className="space-y-1">
          <label className="text-[11px] font-bold text-slate-700">Policy Validity</label>
          <input
            type="text"
            readOnly
            value={policyValidity}
            placeholder="Validity Period"
            className="w-full bg-slate-100 border border-slate-200 rounded-xl px-3 py-1.5 text-xs text-slate-700 cursor-not-allowed"
          />
        </div>
      </div>
    </div>
  );
}
