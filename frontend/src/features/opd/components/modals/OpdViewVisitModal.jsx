import React from "react";
import { User, Stethoscope, Activity, FileText, HeartPulse, Clock, Calendar, Printer, Building2 } from "lucide-react";
import Modal from "../../../../components/ui/Modal.jsx";

export default function OpdViewVisitModal({ visit, isOpen, onClose }) {
  if (!isOpen || !visit) return null;

  const visitIdNo = visit.visitId || visit._id || "VIS-N/A";
  const patient = visit.patientId;
  const patientName = patient?.name || visit.patientName || "N/A";
  const patientPhone = patient?.phone || visit.patientPhone || "N/A";
  const patientUhid = patient?.patientId || patient?._id || visit.uhid || "N/A";

  const doctor = visit.doctorId;
  const rawDoctorName = doctor?.userId?.name || doctor?.name || visit.doctorName || "Physician";
  const doctorName = rawDoctorName.startsWith("Dr.") ? rawDoctorName : `Dr. ${rawDoctorName}`;
  const deptName = doctor?.departmentId?.name || visit.departmentId?.name || "Outpatient Department";
  const doctorSpec = doctor?.specialization || "General Medicine";

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
  const statusStr = (visit.status || "Completed").toUpperCase();

  const handlePrint = () => {
    window.print();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="OPD Patient Visit Overview"
      subtitle={`Visit Reference #${visitIdNo}`}
      maxWidth="max-w-3xl"
    >
      <div className="space-y-4 text-xs text-slate-700 font-medium">
        {/* Printable Action Bar (Hidden during print) */}
        <div className="flex items-center justify-between p-3 bg-slate-50 border border-slate-200/80 rounded-2xl print:hidden">
          <div className="flex items-center gap-2 text-slate-600 text-xs font-semibold">
            <Printer className="w-4 h-4 text-blue-600" />
            <span>Ready for official Hospital OPD Patient Summary print</span>
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

        {/* PRINTABLE CONTAINER (Target for @media print CSS) */}
        <div
          id="printable-opd-summary"
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
                  Outpatient Department (OPD) Consultation Record
                </p>
                <p className="text-[10px] text-slate-400 font-mono">
                  Visit Record ID: {visitIdNo}
                </p>
              </div>
            </div>

            <div className="text-right">
              <div className="inline-block px-3 py-1 bg-blue-50 text-blue-700 border border-blue-200 rounded-full font-black text-[11px] tracking-wider uppercase mb-1">
                OPD Visit Summary
              </div>
              <p className="text-[11px] font-bold text-slate-700 font-mono">{visitIdNo}</p>
              <p className="text-[10px] text-slate-400 font-medium">{dateFormatted} {timeFormatted && `| ${timeFormatted}`}</p>
            </div>
          </div>

          {/* Patient & Doctor Side-by-Side Grid */}
          <div className="grid grid-cols-2 gap-4 bg-slate-50 p-4 rounded-xl border border-slate-200/70 text-xs">
            {/* Patient Card */}
            <div className="space-y-1 border-r border-slate-200/80 pr-4">
              <div className="flex items-center gap-1.5 text-blue-700 font-extrabold text-[10px] uppercase tracking-wider">
                <User className="w-3.5 h-3.5" />
                <span>Billed Patient Information</span>
              </div>
              <p className="font-extrabold text-slate-900 text-sm">{patientName}</p>
              <div className="space-y-0.5 text-[11px] font-medium text-slate-600">
                <p><span className="font-bold text-slate-700">UHID:</span> {patientUhid}</p>
                <p><span className="font-bold text-slate-700">Phone Number:</span> {patientPhone}</p>
              </div>
            </div>

            {/* Doctor Card */}
            <div className="space-y-1 pl-2">
              <div className="flex items-center gap-1.5 text-purple-700 font-extrabold text-[10px] uppercase tracking-wider">
                <Stethoscope className="w-3.5 h-3.5" />
                <span>Consulting Doctor &amp; Department</span>
              </div>
              <p className="font-extrabold text-slate-900 text-sm">{doctorName}</p>
              <div className="space-y-0.5 text-[11px] font-medium text-slate-600">
                <p><span className="font-bold text-slate-700">Specialization:</span> {doctorSpec}</p>
                <p><span className="font-bold text-slate-700">Department:</span> {deptName}</p>
                <p><span className="font-bold text-slate-700">Consultation Status:</span> <span className="font-extrabold text-emerald-600">{statusStr}</span></p>
              </div>
            </div>
          </div>

          {/* Patient Vitals Grid */}
          <div>
            <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-2.5 flex items-center gap-1.5 border-b border-slate-200 pb-1">
              <HeartPulse className="w-4 h-4 text-rose-500" />
              <span>Recorded Clinical Vitals</span>
            </h3>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 bg-slate-50 p-3.5 rounded-xl border border-slate-200/80 text-center">
              <div>
                <p className="text-[10px] text-slate-400 font-bold uppercase">Temperature</p>
                <p className="font-extrabold text-slate-900 text-sm mt-0.5">{vitals.temperature ? `${vitals.temperature} °F` : "—"}</p>
              </div>
              <div>
                <p className="text-[10px] text-slate-400 font-bold uppercase">Blood Pressure</p>
                <p className="font-extrabold text-slate-900 text-sm mt-0.5">{vitals.bloodPressure ? `${vitals.bloodPressure} mmHg` : "—"}</p>
              </div>
              <div>
                <p className="text-[10px] text-slate-400 font-bold uppercase">Pulse Rate</p>
                <p className="font-extrabold text-slate-900 text-sm mt-0.5">{vitals.pulse ? `${vitals.pulse} BPM` : "—"}</p>
              </div>
              <div>
                <p className="text-[10px] text-slate-400 font-bold uppercase">Oxygen SpO2</p>
                <p className="font-extrabold text-slate-900 text-sm mt-0.5">{vitals.spO2 ? `${vitals.spO2} %` : "—"}</p>
              </div>
            </div>
          </div>

          {/* Symptoms & Notes */}
          <div>
            <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-2.5 flex items-center gap-1.5 border-b border-slate-200 pb-1">
              <FileText className="w-4 h-4 text-slate-600" />
              <span>Chief Complaints &amp; Clinical Notes</span>
            </h3>
            <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-xl space-y-2">
              <div>
                <span className="font-extrabold text-slate-800 text-xs">Chief Symptoms:</span>
                <p className="text-slate-700 text-xs mt-0.5 font-medium leading-relaxed">{visit.symptoms || "Routine OPD Consultation"}</p>
              </div>
              {visit.notes && (
                <div className="pt-2 border-t border-slate-200">
                  <span className="font-extrabold text-slate-800 text-xs">Doctor Instructions &amp; Notes:</span>
                  <p className="text-slate-600 text-xs mt-0.5 leading-relaxed">{visit.notes}</p>
                </div>
              )}
            </div>
          </div>

          {/* Signatures & Footer */}
          <div className="pt-8 flex items-end justify-between border-t border-slate-200">
            <div className="space-y-0.5 text-[10px] text-slate-400">
              <p className="font-semibold text-slate-600">Statutory Notice:</p>
              <p>• Computer-generated OPD Consultation Summary from CityCare EMR System.</p>
              <p>• Printed on {new Date().toLocaleString()}</p>
            </div>

            <div className="text-center space-y-1">
              <div className="w-36 border-b-2 border-slate-400 pb-1 font-serif text-slate-600 italic">
                {doctorName}
              </div>
              <p className="font-extrabold text-slate-900 text-[10px]">{doctorName}</p>
              <p className="text-[10px] font-semibold text-slate-500">Authorized Practitioner Signature</p>
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
