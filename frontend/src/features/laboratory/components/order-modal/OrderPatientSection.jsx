import React from "react";
import { User, Plus } from "lucide-react";
import PatientAutocomplete from "../../../../components/common/PatientAutocomplete.jsx";

export default function OrderPatientSection({
  selectedPatientId,
  onPatientSelect,
  patientDetails,
  onNewPatientClick,
}) {
  return (
    <div className="space-y-3">
      <div className="flex items-center gap-2 text-slate-900 font-bold text-xs">
        <User className="w-4 h-4 text-blue-600" />
        <span>Patient Information</span>
      </div>

      <div className="space-y-3 pl-1">
        {/* Patient Search + New Patient Button */}
        <div>
          <label className="block text-[11px] font-bold text-slate-700 mb-1">
            Patient <span className="text-rose-500">*</span>
          </label>
          <div className="flex items-center gap-2">
            <div className="flex-1">
              <PatientAutocomplete
                value={selectedPatientId}
                onChange={onPatientSelect}
                placeholder="Search patient by name, ID or mobile no."
              />
            </div>
            <button
              type="button"
              onClick={onNewPatientClick}
              className="px-3.5 py-2 rounded-xl bg-blue-50 border border-blue-200 text-blue-600 hover:bg-blue-100 font-bold text-xs cursor-pointer flex items-center gap-1 shrink-0"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>New Patient</span>
            </button>
          </div>
        </div>

        {/* 3 Fields Row: Age/Gender | Patient ID | Contact No */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div>
            <label className="block text-[11px] font-bold text-slate-700 mb-1">Age / Gender</label>
            <input
              type="text"
              readOnly
              value={patientDetails.ageGender}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-semibold text-slate-800 focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-[11px] font-bold text-slate-700 mb-1">Patient ID</label>
            <input
              type="text"
              readOnly
              value={patientDetails.patientId}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-mono font-bold text-slate-800 focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-[11px] font-bold text-slate-700 mb-1">Contact No.</label>
            <input
              type="text"
              readOnly
              value={patientDetails.phone}
              placeholder="Enter contact number"
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-semibold text-slate-800 focus:outline-none"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
