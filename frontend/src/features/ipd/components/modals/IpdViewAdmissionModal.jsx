import React from "react";
import Modal from "../../../../components/ui/Modal.jsx";
import { User, Stethoscope, BedDouble, Calendar, FileText, Activity } from "lucide-react";
import { formatDate, formatTime } from "../../../../utils/formatters.js";

export default function IpdViewAdmissionModal({ admission, isOpen, onClose }) {
  if (!admission) return null;

  const patient = admission.patientId;
  const patientName = patient?.name || "Patient";
  const patientUhid = patient?.patientId || "PAT-000123";
  const patientPhone = patient?.phone || "N/A";

  const doctor = admission.doctorId;
  const doctorName = doctor?.userId?.name || doctor?.name || "Dr. Doctor";
  const specName = doctor?.specialization || "General Physician";

  const wardName = admission.wardId?.name || "Ward";
  const bedNumber = admission.bedId?.bedNumber || "N/A";

  const isDischarged = admission.status === "discharged";

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="IPD Admission Overview"
      subtitle={`Admission Reference #${admission.admissionId || admission._id}`}
      maxWidth="max-w-2xl"
    >
      <div className="space-y-4 text-xs">
        {/* Top Status Card */}
        <div className="flex items-center justify-between p-4 bg-slate-50 border border-slate-200/80 rounded-2xl">
          <div className="flex items-center gap-3.5">
            <div className="w-11 h-11 rounded-2xl bg-blue-50 text-blue-600 border border-blue-100 flex items-center justify-center font-bold shrink-0">
              <BedDouble className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h4 className="text-base font-extrabold text-slate-900">{wardName}</h4>
                <span className="text-slate-500 font-mono font-bold">({bedNumber})</span>
              </div>
              <p className="text-[11px] font-semibold text-slate-500 mt-0.5">
                Admitted Date: <span className="text-slate-800 font-bold">{formatDate(admission.admissionDate)}</span> ({formatTime(admission.admissionDate)})
              </p>
            </div>
          </div>

          <span
            className={`px-3 py-1 rounded-full text-xs font-extrabold capitalize ${
              isDischarged
                ? "bg-slate-100 text-slate-600 border border-slate-200"
                : "bg-emerald-50 text-emerald-600 border border-emerald-200"
            }`}
          >
            {admission.status}
          </span>
        </div>

        {/* Patient & Doctor Info Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {/* Patient Details */}
          <div className="p-4 bg-white border border-slate-200/80 rounded-2xl space-y-1.5 shadow-2xs">
            <div className="flex items-center gap-1.5 text-slate-400 font-extrabold text-[10px] uppercase tracking-wider">
              <User className="w-3.5 h-3.5 text-blue-600" />
              <span>Admitted Patient</span>
            </div>
            <p className="font-extrabold text-slate-900 text-sm pt-0.5">{patientName}</p>
            <p className="text-[11px] font-semibold text-slate-500">UHID: {patientUhid}</p>
            <p className="text-[11px] text-slate-400">Phone: {patientPhone}</p>
          </div>

          {/* Attending Doctor */}
          <div className="p-4 bg-white border border-slate-200/80 rounded-2xl space-y-1.5 shadow-2xs">
            <div className="flex items-center gap-1.5 text-slate-400 font-extrabold text-[10px] uppercase tracking-wider">
              <Stethoscope className="w-3.5 h-3.5 text-purple-600" />
              <span>Attending Doctor</span>
            </div>
            <p className="font-extrabold text-slate-900 text-sm pt-0.5">{doctorName}</p>
            <p className="text-[11px] text-purple-700 font-semibold">{specName}</p>
            <p className="text-[11px] text-slate-400">Daily Rent: ₹{admission.dailyRent || 1500}</p>
          </div>
        </div>

        {/* Diagnosis & Medical Notes */}
        <div className="p-4 bg-white border border-slate-200/80 rounded-2xl space-y-2 shadow-2xs">
          <div className="flex items-center gap-1.5 text-slate-400 font-extrabold text-[10px] uppercase tracking-wider">
            <Activity className="w-3.5 h-3.5 text-slate-600" />
            <span>Diagnosis &amp; Reason for Admission</span>
          </div>
          <p className="font-semibold text-slate-800 leading-relaxed pt-0.5">
            {admission.diagnosis || admission.provisionalDiagnosis || admission.reason || "Routine IPD Admission & Treatment"}
          </p>
          {admission.notes && (
            <div className="pt-2 border-t border-slate-100 text-[11px] text-slate-500">
              <span className="font-bold text-slate-700">Clinical Notes:</span> {admission.notes}
            </div>
          )}
          {isDischarged && admission.dischargeSummary && (
            <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl mt-2">
              <p className="font-bold text-slate-800 text-[11px]">Discharge Summary:</p>
              <p className="text-slate-600 text-xs mt-0.5">{admission.dischargeSummary}</p>
            </div>
          )}
        </div>
      </div>
    </Modal>
  );
}
