import React from "react";
import { formatDate, formatTime, formatGenderAge } from "../../../utils/formatters.js";

export default function OrderPatientDetailsSidebar({ test }) {
  if (!test) return null;

  const patient = test.patientId;
  const patientName = patient?.name || "N/A";
  const patientUhid = patient?.patientId || "N/A";
  const genderAge = formatGenderAge(patient?.dateOfBirth, patient?.gender) || "N/A";
  const contactNo = patient?.phone || "N/A";
  const address = patient?.address || "N/A";

  const doctor = test.doctorId;
  const doctorName = doctor?.userId?.name || doctor?.name || "Unassigned";
  const specName = doctor?.specialization || "General";

  const visitType = test.visitType || "OPD Visit";
  const visitId = test.visitId || test.orderId || "N/A";

  const sampleCollectedOn = test.requestedAt || test.createdAt
    ? `${formatDate(test.requestedAt || test.createdAt)} ${formatTime(test.requestedAt || test.createdAt)}`
    : "N/A";
  const sampleType = test.sampleType || "Blood";
  const clinicalNotes = test.clinicalNotes || "No clinical notes specified.";

  return (
    <div className="space-y-4">
      {/* Box 1: Order & Patient Details */}
      <div className="bg-white border border-slate-200/80 rounded-2xl p-4 shadow-2xs space-y-3">
        <h4 className="text-xs font-bold text-slate-900 border-b border-slate-100 pb-2">
          Order &amp; Patient Details
        </h4>
        <div className="grid grid-cols-2 gap-y-2.5 gap-x-3 text-xs">
          <div>
            <p className="text-[10px] text-slate-400 font-medium">Patient Name</p>
            <p className="font-bold text-slate-900">{patientName}</p>
          </div>
          <div>
            <p className="text-[10px] text-slate-400 font-medium">Visit Type</p>
            <p className="font-bold text-slate-900">{visitType}</p>
          </div>

          <div>
            <p className="text-[10px] text-slate-400 font-medium">Patient ID</p>
            <p className="font-mono font-bold text-slate-900">{patientUhid}</p>
          </div>
          <div>
            <p className="text-[10px] text-slate-400 font-medium">Visit / Admission ID</p>
            <p className="font-mono font-bold text-slate-900">{visitId}</p>
          </div>

          <div>
            <p className="text-[10px] text-slate-400 font-medium">Age / Gender</p>
            <p className="font-semibold text-slate-800">{genderAge}</p>
          </div>
          <div>
            <p className="text-[10px] text-slate-400 font-medium">Contact No.</p>
            <p className="font-semibold text-slate-800">{contactNo}</p>
          </div>

          <div>
            <p className="text-[10px] text-slate-400 font-medium">Doctor</p>
            <p className="font-bold text-slate-900">Dr. {doctorName.replace(/^Dr\.\s*/i, "")} ({specName})</p>
          </div>
          <div>
            <p className="text-[10px] text-slate-400 font-medium">Address</p>
            <p className="font-semibold text-slate-800">{address}</p>
          </div>
        </div>
      </div>

      {/* Box 2: Sample & Collection Details */}
      <div className="bg-white border border-slate-200/80 rounded-2xl p-4 shadow-2xs space-y-3">
        <h4 className="text-xs font-bold text-slate-900 border-b border-slate-100 pb-2">
          Sample &amp; Collection Details
        </h4>
        <div className="grid grid-cols-2 gap-y-2.5 gap-x-3 text-xs">
          <div>
            <p className="text-[10px] text-slate-400 font-medium">Sample Collected On</p>
            <p className="font-bold text-slate-900">{sampleCollectedOn}</p>
          </div>
          <div>
            <p className="text-[10px] text-slate-400 font-medium">Collected By</p>
            <p className="font-bold text-slate-900">{test.checkedBy || "Lab Technician"}</p>
          </div>

          <div>
            <p className="text-[10px] text-slate-400 font-medium">Sample Type</p>
            <p className="font-bold text-slate-900">{sampleType}</p>
          </div>
          <div>
            <p className="text-[10px] text-slate-400 font-medium">Sample Condition</p>
            <p className="font-bold text-emerald-600">Good</p>
          </div>
        </div>
      </div>

      {/* Box 3: Clinical Notes / Instructions */}
      <div className="bg-white border border-slate-200/80 rounded-2xl p-4 shadow-2xs space-y-2">
        <h4 className="text-xs font-bold text-slate-900 border-b border-slate-100 pb-2">
          Clinical Notes / Instructions
        </h4>
        <div className="border border-slate-200/80 rounded-xl p-3 bg-slate-50/40 text-xs text-slate-600 leading-relaxed whitespace-pre-line">
          {clinicalNotes}
        </div>
      </div>
    </div>
  );
}
