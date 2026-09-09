import React from "react";
import { Printer, User, Stethoscope, HeartPulse, FileText, Pill, Building2 } from "lucide-react";
import Modal from "../../../../components/ui/Modal.jsx";

export default function OpdPrintSummaryModal({ visit, isOpen, onClose }) {
  if (!visit) return null;

  const patient = visit.patientId || {};
  const patientName = patient?.name || "Patient Record";
  const patientPhone = patient?.phone || "N/A";
  const patientUhid = patient?.patientId || patient?._id || "N/A";
  const patientAge = patient?.age ? `${patient.age} yrs` : "N/A";
  const patientGender = patient?.gender || "N/A";
  const bloodGroup = patient?.bloodGroup || "N/A";

  const doctor = visit.doctorId || {};
  const doctorName = doctor?.userId?.name || doctor?.name || "Attending Physician";
  const doctorSpec = doctor?.specialization || "General Medicine";
  const deptName = doctor?.departmentId?.name || visit.departmentId?.name || "OPD Department";

  const dateFormatted = visit.visitDate
    ? new Date(visit.visitDate).toLocaleDateString("en-GB", {
        weekday: "short",
        day: "numeric",
        month: "short",
        year: "numeric",
      })
    : new Date().toLocaleDateString();

  const timeFormatted = visit.visitDate
    ? new Date(visit.visitDate).toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
        hour12: true,
      })
    : "";

  const vitals = visit.vitals || {};
  const prescription = Array.isArray(visit.prescription) ? visit.prescription : [];

  const handlePrint = () => {
    window.print();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Print Patient OPD Summary"
      subtitle={`OPD Visit Reference #${visit.visitId || visit._id}`}
      maxWidth="max-w-3xl"
    >
      <div className="space-y-4">
        {/* Printable Action Bar inside modal (hidden during actual browser print) */}
        <div className="flex items-center justify-between p-3 bg-slate-50 border border-slate-200/80 rounded-2xl print:hidden">
          <div className="flex items-center gap-2 text-slate-600 text-xs font-semibold">
            <Printer className="w-4 h-4 text-blue-600" />
            <span>Ready for official hospital print / PDF export</span>
          </div>
          <button
            type="button"
            onClick={handlePrint}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold shadow-md shadow-blue-500/20 transition cursor-pointer flex items-center gap-2 active:scale-95"
          >
            <Printer className="w-4 h-4" />
            <span>Print Patient Summary</span>
          </button>
        </div>

        {/* ====================================================================
           PRINTABLE PATIENT SUMMARY CONTAINER (Target for @media print CSS)
           ==================================================================== */}
        <div
          id="printable-opd-summary"
          className="bg-white p-6 rounded-2xl border border-slate-200/80 text-slate-900 text-xs space-y-5 shadow-xs"
        >
          {/* 1. Hospital Letterhead Header */}
          <div className="flex items-start justify-between border-b-2 border-blue-600 pb-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-blue-600 text-white flex items-center justify-center font-black text-xl shadow-md">
                <Building2 className="w-7 h-7" />
              </div>
              <div>
                <h1 className="text-lg font-extrabold text-blue-700 uppercase tracking-tight">
                  CityCare Hospital &amp; Medical Center
                </h1>
                <p className="text-[11px] font-semibold text-slate-500">
                  123 Healthcare Boulevard, Metro City | Emergency Helpline: +91 98765 43210
                </p>
                <p className="text-[10px] text-slate-400 font-mono">GSTIN: 27AAAAA0000A1Z5 | NABH Accredited EMR System</p>
              </div>
            </div>

            <div className="text-right">
              <div className="inline-block px-3 py-1 bg-blue-50 text-blue-700 border border-blue-200 rounded-full font-black text-[11px] tracking-wider uppercase mb-1">
                OPD Patient Summary
              </div>
              <p className="text-[11px] font-bold text-slate-700 font-mono">
                {visit.visitId || visit._id}
              </p>
              <p className="text-[10px] text-slate-400 font-medium">{dateFormatted} {timeFormatted && `| ${timeFormatted}`}</p>
            </div>
          </div>

          {/* 2. Patient & Doctor Details Grid */}
          <div className="grid grid-cols-2 gap-4 bg-slate-50 p-4 rounded-xl border border-slate-200/70">
            {/* Patient Info */}
            <div className="space-y-1.5 border-r border-slate-200/80 pr-4">
              <div className="flex items-center gap-1.5 text-blue-700 font-extrabold text-[10px] uppercase tracking-wider">
                <User className="w-3.5 h-3.5" />
                <span>Patient Demographics</span>
              </div>
              <p className="font-extrabold text-slate-900 text-sm">{patientName}</p>
              <div className="grid grid-cols-2 gap-1 text-[11px] font-medium text-slate-600">
                <p><span className="font-bold text-slate-700">UHID:</span> {patientUhid}</p>
                <p><span className="font-bold text-slate-700">Age / Sex:</span> {patientAge} / {patientGender}</p>
                <p><span className="font-bold text-slate-700">Phone:</span> {patientPhone}</p>
                <p><span className="font-bold text-slate-700">Blood Group:</span> {bloodGroup}</p>
              </div>
            </div>

            {/* Doctor Info */}
            <div className="space-y-1.5 pl-2">
              <div className="flex items-center gap-1.5 text-purple-700 font-extrabold text-[10px] uppercase tracking-wider">
                <Stethoscope className="w-3.5 h-3.5" />
                <span>Consulting Doctor &amp; Dept</span>
              </div>
              <p className="font-extrabold text-slate-900 text-sm">{doctorName}</p>
              <div className="text-[11px] font-medium text-slate-600 space-y-0.5">
                <p><span className="font-bold text-slate-700">Specialization:</span> {doctorSpec}</p>
                <p><span className="font-bold text-slate-700">Department:</span> {deptName}</p>
                <p><span className="font-bold text-slate-700">Consultation Type:</span> {visit.status === "walk-in" ? "Walk-in OPD Visit" : "Scheduled Consultation"}</p>
              </div>
            </div>
          </div>

          {/* 3. Patient Vitals */}
          <div className="space-y-2">
            <div className="flex items-center gap-1.5 text-slate-700 font-extrabold text-[11px] uppercase tracking-wider border-b border-slate-200 pb-1">
              <HeartPulse className="w-4 h-4 text-rose-500" />
              <span>Recorded Vitals</span>
            </div>
            <div className="grid grid-cols-6 gap-2 text-center text-[11px]">
              <div className="p-2 bg-slate-50 border border-slate-200 rounded-lg">
                <p className="text-[10px] text-slate-400 font-bold uppercase">Temp</p>
                <p className="font-extrabold text-slate-900 mt-0.5">{vitals.temperature ? `${vitals.temperature} °F` : "-"}</p>
              </div>
              <div className="p-2 bg-slate-50 border border-slate-200 rounded-lg">
                <p className="text-[10px] text-slate-400 font-bold uppercase">BP</p>
                <p className="font-extrabold text-slate-900 mt-0.5">{vitals.bloodPressure || "-"}</p>
              </div>
              <div className="p-2 bg-slate-50 border border-slate-200 rounded-lg">
                <p className="text-[10px] text-slate-400 font-bold uppercase">Pulse</p>
                <p className="font-extrabold text-slate-900 mt-0.5">{vitals.pulse ? `${vitals.pulse} BPM` : "-"}</p>
              </div>
              <div className="p-2 bg-slate-50 border border-slate-200 rounded-lg">
                <p className="text-[10px] text-slate-400 font-bold uppercase">SpO2</p>
                <p className="font-extrabold text-slate-900 mt-0.5">{vitals.spO2 ? `${vitals.spO2} %` : "-"}</p>
              </div>
              <div className="p-2 bg-slate-50 border border-slate-200 rounded-lg">
                <p className="text-[10px] text-slate-400 font-bold uppercase">Weight</p>
                <p className="font-extrabold text-slate-900 mt-0.5">{vitals.weight ? `${vitals.weight} kg` : "-"}</p>
              </div>
              <div className="p-2 bg-slate-50 border border-slate-200 rounded-lg">
                <p className="text-[10px] text-slate-400 font-bold uppercase">Height</p>
                <p className="font-extrabold text-slate-900 mt-0.5">{vitals.height ? `${vitals.height} cm` : "-"}</p>
              </div>
            </div>
          </div>

          {/* 4. Clinical Examination & Diagnosis */}
          <div className="space-y-2">
            <div className="flex items-center gap-1.5 text-slate-700 font-extrabold text-[11px] uppercase tracking-wider border-b border-slate-200 pb-1">
              <FileText className="w-4 h-4 text-blue-600" />
              <span>Clinical Examination &amp; Diagnosis</span>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="p-3 bg-slate-50 border border-slate-200/80 rounded-xl space-y-1">
                <p className="font-bold text-slate-700 text-[10px] uppercase">Chief Complaints / Symptoms:</p>
                <p className="text-slate-800 font-medium leading-relaxed">
                  {visit.symptoms || "None reported / General consultation"}
                </p>
              </div>
              <div className="p-3 bg-blue-50/50 border border-blue-200/80 rounded-xl space-y-1">
                <p className="font-bold text-blue-700 text-[10px] uppercase">Clinical Diagnosis:</p>
                <p className="text-blue-900 font-bold leading-relaxed">
                  {visit.diagnosis || "Under Evaluation / Routine OPD"}
                </p>
              </div>
            </div>
            {visit.notes && (
              <div className="p-3 bg-slate-50 border border-slate-200/80 rounded-xl">
                <p className="font-bold text-slate-700 text-[10px] uppercase">Doctor's Advice &amp; Notes:</p>
                <p className="text-slate-800 font-medium text-[11px] leading-relaxed mt-0.5">{visit.notes}</p>
              </div>
            )}
          </div>

          {/* 5. Prescribed Medications (Rx) */}
          <div className="space-y-2">
            <div className="flex items-center gap-1.5 text-slate-700 font-extrabold text-[11px] uppercase tracking-wider border-b border-slate-200 pb-1">
              <Pill className="w-4 h-4 text-emerald-600" />
              <span>Prescribed Medications (Rx)</span>
            </div>
            {prescription.length > 0 ? (
              <table className="w-full text-left border-collapse border border-slate-200 rounded-lg overflow-hidden text-[11px]">
                <thead>
                  <tr className="bg-slate-100 text-slate-700 font-bold uppercase text-[10px]">
                    <th className="p-2 border-b border-slate-200">#</th>
                    <th className="p-2 border-b border-slate-200">Medicine Name</th>
                    <th className="p-2 border-b border-slate-200">Dosage</th>
                    <th className="p-2 border-b border-slate-200">Frequency</th>
                    <th className="p-2 border-b border-slate-200">Duration</th>
                    <th className="p-2 border-b border-slate-200">Instructions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200 font-medium">
                  {prescription.map((m, idx) => (
                    <tr key={idx} className="hover:bg-slate-50">
                      <td className="p-2 font-bold text-slate-400">{idx + 1}</td>
                      <td className="p-2 font-extrabold text-slate-900">{m.medicineName || m.name || "Medicine"}</td>
                      <td className="p-2 text-slate-700">{m.dosage || "-"}</td>
                      <td className="p-2 text-slate-700">{m.frequency || "-"}</td>
                      <td className="p-2 text-slate-700">{m.duration || "-"}</td>
                      <td className="p-2 text-slate-600">{m.instructions || "-"}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <p className="text-slate-400 italic text-[11px] p-2 bg-slate-50 border border-slate-200/80 rounded-lg">
                No prescription medications recorded for this visit.
              </p>
            )}
          </div>

          {/* 6. Signatures & Footer */}
          <div className="pt-8 flex items-end justify-between border-t border-slate-200">
            <div className="space-y-1 text-[10px] text-slate-400">
              <p className="font-semibold text-slate-600">Verification Notice:</p>
              <p>• Computer-generated OPD Summary from CityCare EMR System.</p>
              <p>• Print Date: {new Date().toLocaleString()}</p>
            </div>

            <div className="text-center space-y-1">
              <div className="w-36 border-b-2 border-slate-400 pb-1 font-serif text-slate-600 italic">
                {doctorName}
              </div>
              <p className="font-extrabold text-slate-900 text-[11px]">{doctorName}</p>
              <p className="text-[10px] font-semibold text-slate-500">Authorized Practitioner Signature</p>
            </div>
          </div>
        </div>
      </div>
    </Modal>
  );
}
