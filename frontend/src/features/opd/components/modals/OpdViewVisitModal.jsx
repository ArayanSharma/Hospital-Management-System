import React from "react";
import { User, Stethoscope, Activity, FileText, HeartPulse, Clock, Calendar, CheckCircle2 } from "lucide-react";
import Modal from "../../../../components/ui/Modal.jsx";

export default function OpdViewVisitModal({ visit, isOpen, onClose }) {
  if (!visit) return null;

  const patient = visit.patientId;
  const patientName = patient?.name || "Patient";
  const patientPhone = patient?.phone || "N/A";
  const patientUhid = patient?.patientId || "PAT-000123";

  const doctor = visit.doctorId;
  const doctorName = doctor?.userId?.name || doctor?.name || "Dr. Doctor";
  const deptName = doctor?.departmentId?.name || visit.departmentId?.name || "General Medicine";

  const dateFormatted = new Date(visit.visitDate).toLocaleDateString("en-GB", {
    weekday: "short",
    day: "numeric",
    month: "short",
    year: "numeric",
  });
  const timeFormatted = new Date(visit.visitDate).toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  });

  const vitals = visit.vitals || {};

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="OPD Visit Overview"
      subtitle={`Visit Reference #${visit.visitId || visit._id}`}
      maxWidth="max-w-2xl"
    >
      <div className="space-y-4 text-xs">
        {/* Header Status Card */}
        <div className="flex items-center justify-between p-4 bg-slate-50 border border-slate-200/80 rounded-2xl">
          <div className="flex items-center gap-3.5">
            <div className="w-11 h-11 rounded-2xl bg-blue-50 text-blue-600 border border-blue-100 flex items-center justify-center font-bold shrink-0">
              <Calendar className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h4 className="text-base font-extrabold text-slate-900">{dateFormatted}</h4>
                <span className="text-slate-400 font-medium">({timeFormatted})</span>
              </div>
              <p className="text-[11px] font-semibold text-slate-500 mt-0.5">
                Department: <span className="text-slate-800 font-bold">{deptName}</span>
              </p>
            </div>
          </div>

          <span
            className={`px-3 py-1 rounded-full text-xs font-extrabold capitalize ${
              visit.status === "completed"
                ? "bg-emerald-50 text-emerald-600 border border-emerald-200"
                : visit.status === "in-progress" || visit.status === "in_consultation"
                ? "bg-blue-50 text-blue-600 border border-blue-200"
                : visit.status === "cancelled"
                ? "bg-rose-50 text-rose-600 border border-rose-200"
                : "bg-pink-50 text-pink-600 border border-pink-200"
            }`}
          >
            {visit.status}
          </span>
        </div>

        {/* Patient & Doctor Side-by-Side */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {/* Patient Card */}
          <div className="p-4 bg-white border border-slate-200/80 rounded-2xl space-y-1.5 shadow-2xs">
            <div className="flex items-center gap-1.5 text-slate-400 font-extrabold text-[10px] uppercase tracking-wider">
              <User className="w-3.5 h-3.5 text-blue-600" />
              <span>Patient Information</span>
            </div>
            <p className="font-extrabold text-slate-900 text-sm pt-0.5">{patientName}</p>
            <p className="text-[11px] font-semibold text-slate-500">UHID: {patientUhid}</p>
            <p className="text-[11px] text-slate-400">Phone: {patientPhone}</p>
          </div>

          {/* Doctor Card */}
          <div className="p-4 bg-white border border-slate-200/80 rounded-2xl space-y-1.5 shadow-2xs">
            <div className="flex items-center gap-1.5 text-slate-400 font-extrabold text-[10px] uppercase tracking-wider">
              <Stethoscope className="w-3.5 h-3.5 text-purple-600" />
              <span>Consulting Doctor</span>
            </div>
            <p className="font-extrabold text-slate-900 text-sm pt-0.5">{doctorName}</p>
            <p className="text-[11px] text-purple-700 font-semibold">{doctor?.specialization || "General Physician"}</p>
            <p className="text-[11px] text-slate-400">Department: {deptName}</p>
          </div>
        </div>

        {/* Patient Vitals Grid */}
        <div className="p-4 bg-slate-50 border border-slate-200/80 rounded-2xl space-y-2">
          <div className="flex items-center gap-1.5 text-slate-500 font-extrabold text-[10px] uppercase tracking-wider">
            <HeartPulse className="w-3.5 h-3.5 text-rose-500" />
            <span>Recorded Vitals</span>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-1">
            <div className="bg-white border border-slate-200/80 p-2.5 rounded-xl text-center">
              <p className="text-[10px] text-slate-400 font-medium">Temp</p>
              <p className="font-bold text-slate-900 text-xs mt-0.5">{vitals.temperature || 98.6} °C</p>
            </div>
            <div className="bg-white border border-slate-200/80 p-2.5 rounded-xl text-center">
              <p className="text-[10px] text-slate-400 font-medium">Blood Pressure</p>
              <p className="font-bold text-slate-900 text-xs mt-0.5">{vitals.bloodPressure || "120/80"} mmHg</p>
            </div>
            <div className="bg-white border border-slate-200/80 p-2.5 rounded-xl text-center">
              <p className="text-[10px] text-slate-400 font-medium">Pulse Rate</p>
              <p className="font-bold text-slate-900 text-xs mt-0.5">{vitals.pulse || 78} BPM</p>
            </div>
            <div className="bg-white border border-slate-200/80 p-2.5 rounded-xl text-center">
              <p className="text-[10px] text-slate-400 font-medium">SpO2</p>
              <p className="font-bold text-slate-900 text-xs mt-0.5">{vitals.spO2 || 98} %</p>
            </div>
          </div>
        </div>

        {/* Symptoms / Complaints */}
        <div className="p-4 bg-white border border-slate-200/80 rounded-2xl space-y-1 shadow-2xs">
          <div className="flex items-center gap-1.5 text-slate-400 font-extrabold text-[10px] uppercase tracking-wider">
            <FileText className="w-3.5 h-3.5 text-slate-600" />
            <span>Chief Complaints / Symptoms</span>
          </div>
          <p className="font-semibold text-slate-800 leading-relaxed pt-1">
            {visit.symptoms || "Routine OPD Consultation & Health Checkup"}
          </p>
          {visit.notes && (
            <p className="text-[11px] text-slate-500 pt-2 border-t border-slate-100">
              <span className="font-bold text-slate-700">Notes:</span> {visit.notes}
            </p>
          )}
        </div>
      </div>
    </Modal>
  );
}
