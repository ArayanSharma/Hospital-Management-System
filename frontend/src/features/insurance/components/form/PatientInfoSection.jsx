import React from "react";
import { User, Calendar, Lock } from "lucide-react";
import PatientAutocomplete from "../../../../components/common/PatientAutocomplete.jsx";

export default function PatientInfoSection({
  patientId,
  uhid,
  dateOfBirth,
  setDateOfBirth,
  mobileNumber,
  setMobileNumber,
  onPatientSelect,
}) {
  return (
    <div className="bg-white border border-slate-200/80 rounded-2xl p-4 shadow-2xs space-y-3">
      <div className="flex items-center gap-2 border-b border-slate-100 pb-2.5">
        <User className="w-4 h-4 text-blue-600" />
        <h3 className="text-xs font-extrabold text-blue-700 tracking-wide">
          1. Patient Information
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
            <label className="text-[11px] font-bold text-slate-700">UHID (Auto)</label>
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

        {/* Date of Birth */}
        <div className="space-y-1">
          <label className="text-[11px] font-bold text-slate-700">Date of Birth</label>
          <div className="relative">
            <input
              type="text"
              value={dateOfBirth}
              onChange={(e) => setDateOfBirth(e.target.value)}
              placeholder="e.g. 16 Aug 1990"
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-1.5 text-xs text-slate-800 focus:outline-none focus:border-blue-500 pr-8"
            />
            <Calendar className="w-3.5 h-3.5 text-slate-400 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          </div>
        </div>

        {/* Mobile Number */}
        <div className="space-y-1">
          <label className="text-[11px] font-bold text-slate-700">Mobile Number</label>
          <input
            type="text"
            value={mobileNumber}
            onChange={(e) => setMobileNumber(e.target.value)}
            placeholder="e.g. 9876543210"
            className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-1.5 text-xs text-slate-800 focus:outline-none focus:border-blue-500"
          />
        </div>
      </div>
    </div>
  );
}
