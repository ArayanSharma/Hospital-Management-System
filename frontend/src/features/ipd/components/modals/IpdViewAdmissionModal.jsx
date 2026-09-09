import React from "react";
import Modal from "../../../../components/ui/Modal.jsx";
import { User, Stethoscope, BedDouble, Calendar, FileText, Activity, Printer, Building2 } from "lucide-react";
import { formatDate, formatTime } from "../../../../utils/formatters.js";

export default function IpdViewAdmissionModal({ admission, isOpen, onClose }) {
  if (!isOpen || !admission) return null;

  const admissionIdNo = admission.admissionId || admission._id || "ADM-N/A";
  const patient = admission.patientId;
  const patientName = patient?.name || admission.patientName || "N/A";
  const patientPhone = patient?.phone || admission.patientPhone || "N/A";
  const patientUhid = patient?.patientId || patient?._id || admission.uhid || "N/A";
  const patientAge = patient?.age || admission.age || "N/A";
  const patientGender = patient?.gender || admission.gender || "N/A";

  const doctor = admission.doctorId;
  const rawDoctorName = doctor?.userId?.name || doctor?.name || admission.doctorName || "Physician";
  const doctorName = rawDoctorName.startsWith("Dr.") ? rawDoctorName : `Dr. ${rawDoctorName}`;
  const specName = doctor?.specialization || doctor?.departmentId?.name || "Inpatient Care";

  const wardName = admission.wardId?.name || admission.wardName || "IPD Ward";
  const bedNumber = admission.bedId?.bedNumber || admission.bedNumber || "N/A";
  const isDischarged = (admission.status || "").toLowerCase() === "discharged";
  const statusStr = (admission.status || "Admitted").toUpperCase();
  const admissionDateStr = admission.admissionDate ? `${formatDate(admission.admissionDate)} ${formatTime(admission.admissionDate)}` : "N/A";
  const dischargeDateStr = admission.dischargeDate ? `${formatDate(admission.dischargeDate)} ${formatTime(admission.dischargeDate)}` : "N/A";
  const dailyRentVal = admission.dailyRent !== undefined ? Number(admission.dailyRent) : null;
  const diagnosisStr = admission.diagnosis || admission.provisionalDiagnosis || admission.reason || "N/A";
  const notesStr = admission.notes || admission.clinicalNotes || "N/A";

  const handlePrint = () => {
    window.print();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="IPD Inpatient Admission Overview"
      subtitle={`Admission Reference #${admissionIdNo}`}
      maxWidth="max-w-3xl"
    >
      <div className="space-y-4 text-xs text-slate-700 font-medium">
        {/* Printable Action Bar (Hidden during print) */}
        <div className="flex items-center justify-between p-3 bg-slate-50 border border-slate-200/80 rounded-2xl print:hidden">
          <div className="flex items-center gap-2 text-slate-600 text-xs font-semibold">
            <Printer className="w-4 h-4 text-blue-600" />
            <span>Ready to print official Inpatient IPD Admission Summary Sheet</span>
          </div>
          <button
            type="button"
            onClick={handlePrint}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold shadow-md shadow-blue-500/20 transition cursor-pointer flex items-center gap-2 active:scale-95"
          >
            <Printer className="w-4 h-4" />
            <span>Print Admission Summary</span>
          </button>
        </div>

        {/* PRINTABLE CONTAINER (Target for @media print CSS) */}
        <div
          id="printable-ipd-admission"
          className="bg-white p-6 rounded-2xl border border-slate-200/80 text-slate-900 text-xs space-y-5 shadow-xs"
        >
          {/* Hospital Letterhead Header */}
          <div className="flex items-start justify-between border-b-2 border-blue-600 pb-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-blue-600 text-white flex items-center justify-center font-black text-xl shadow-md">
                <Building2 className="w-7 h-7" />
              </div>
              <div>
                <h1 className="text-lg font-extrabold text-blue-700 uppercase tracking-tight">
                  CityCare Hospital &amp; Medical Research Center
                </h1>
                <p className="text-[11px] font-semibold text-slate-500">
                  Inpatient Department (IPD) — Bed &amp; Ward Allotment
                </p>
                <p className="text-[10px] text-slate-400 font-mono">
                  Admission ID: {admissionIdNo}
                </p>
              </div>
            </div>

            <div className="text-right">
              <div className="inline-block px-3 py-1 bg-blue-50 text-blue-700 border border-blue-200 rounded-full font-black text-[11px] tracking-wider uppercase mb-1">
                Inpatient Admission Summary
              </div>
              <p className="text-[11px] font-bold text-slate-700 font-mono">{admissionIdNo}</p>
              <p className="text-[10px] text-slate-400 font-medium">{admissionDateStr}</p>
            </div>
          </div>

          {/* Section 1: Patient Demographics & Attending Doctor Grid */}
          <div className="grid grid-cols-2 gap-4 bg-slate-50 p-4 rounded-xl border border-slate-200/70 text-xs">
            {/* Patient Details */}
            <div className="space-y-1 border-r border-slate-200/80 pr-4">
              <div className="flex items-center gap-1.5 text-blue-700 font-extrabold text-[10px] uppercase tracking-wider">
                <User className="w-3.5 h-3.5" />
                <span>Admitted Patient Information</span>
              </div>
              <p className="font-extrabold text-slate-900 text-sm">{patientName}</p>
              <div className="space-y-0.5 text-[11px] font-medium text-slate-600">
                <p><span className="font-bold text-slate-700">Patient UHID:</span> {patientUhid}</p>
                <p><span className="font-bold text-slate-700">Age / Gender:</span> {patientAge} Y / {patientGender}</p>
                <p><span className="font-bold text-slate-700">Contact Phone:</span> {patientPhone}</p>
              </div>
            </div>

            {/* Doctor Information */}
            <div className="space-y-1 pl-2">
              <div className="flex items-center gap-1.5 text-purple-700 font-extrabold text-[10px] uppercase tracking-wider">
                <Stethoscope className="w-3.5 h-3.5" />
                <span>Attending Physician</span>
              </div>
              <p className="font-extrabold text-slate-900 text-sm">{doctorName}</p>
              <div className="space-y-0.5 text-[11px] font-medium text-slate-600">
                <p><span className="font-bold text-slate-700">Specialization:</span> {specName}</p>
                <p><span className="font-bold text-slate-700">Admission Status:</span> <span className={`font-extrabold ${isDischarged ? "text-slate-600" : "text-emerald-600"}`}>{statusStr}</span></p>
                {dailyRentVal !== null && <p><span className="font-bold text-slate-700">Daily Bed Rent:</span> ₹ {dailyRentVal.toFixed(2)} / day</p>}
              </div>
            </div>
          </div>

          {/* Section 2: Ward & Bed Allocation */}
          <div>
            <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-2.5 flex items-center gap-1.5 border-b border-slate-200 pb-1">
              <BedDouble className="w-4 h-4 text-blue-600" />
              <span>Inpatient Ward &amp; Bed Allotment</span>
            </h3>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3.5 bg-blue-50/40 p-3.5 rounded-xl border border-blue-200/60">
              <div>
                <p className="text-[11px] text-slate-400 font-semibold mb-0.5">Assigned Ward</p>
                <p className="font-extrabold text-blue-800 text-sm">{wardName}</p>
              </div>
              <div>
                <p className="text-[11px] text-slate-400 font-semibold mb-0.5">Bed Number</p>
                <p className="font-extrabold text-slate-900 text-sm">{bedNumber}</p>
              </div>
              <div>
                <p className="text-[11px] text-slate-400 font-semibold mb-0.5">Admission Timestamp</p>
                <p className="font-bold text-slate-800">{admissionDateStr}</p>
              </div>
              {isDischarged && (
                <div>
                  <p className="text-[11px] text-slate-400 font-semibold mb-0.5">Discharge Timestamp</p>
                  <p className="font-bold text-slate-800">{dischargeDateStr}</p>
                </div>
              )}
            </div>
          </div>

          {/* Section 3: Clinical Diagnosis & Medical Notes */}
          <div>
            <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-2.5 flex items-center gap-1.5 border-b border-slate-200 pb-1">
              <Activity className="w-4 h-4 text-slate-600" />
              <span>Provisional Diagnosis &amp; Clinical Notes</span>
            </h3>
            <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-xl space-y-2">
              <div>
                <span className="font-extrabold text-slate-800 text-xs">Primary Diagnosis:</span>
                <p className="text-slate-700 text-xs mt-0.5 font-medium leading-relaxed">{diagnosisStr}</p>
              </div>
              {notesStr !== "N/A" && (
                <div className="pt-2 border-t border-slate-200">
                  <span className="font-extrabold text-slate-800 text-xs">Physician Clinical Instructions:</span>
                  <p className="text-slate-600 text-xs mt-0.5 leading-relaxed">{notesStr}</p>
                </div>
              )}
              {isDischarged && admission.dischargeSummary && (
                <div className="pt-2 border-t border-slate-200">
                  <span className="font-extrabold text-emerald-800 text-xs">Discharge Summary:</span>
                  <p className="text-slate-700 text-xs mt-0.5 leading-relaxed">{admission.dischargeSummary}</p>
                </div>
              )}
            </div>
          </div>

          {/* Section 4: Signatures */}
          <div className="pt-8 flex items-end justify-between border-t border-slate-200">
            <div className="space-y-0.5 text-[10px] text-slate-400">
              <p className="font-semibold text-slate-600">Statutory Record:</p>
              <p>• Official IPD record generated via CityCare Hospital EMR System.</p>
              <p>• Printed on {new Date().toLocaleString()}</p>
            </div>

            <div className="text-center space-y-1">
              <div className="w-36 border-b-2 border-slate-400 pb-1 font-serif text-slate-600 italic">
                {doctorName}
              </div>
              <p className="font-extrabold text-slate-900 text-[10px]">Attending Physician Signature</p>
              <p className="text-[10px] font-semibold text-slate-500">CityCare IPD Admissions Counter</p>
            </div>
          </div>
        </div>

        {/* Footer Close Button */}
        <div className="pt-2 flex justify-end print:hidden">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold transition cursor-pointer"
          >
            Close
          </button>
        </div>
      </div>
    </Modal>
  );
}
