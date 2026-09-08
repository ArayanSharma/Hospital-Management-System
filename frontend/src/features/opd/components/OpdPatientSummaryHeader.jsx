import React from "react";
import { User, Building2, Stethoscope } from "lucide-react";

export default function OpdPatientSummaryHeader({ visit }) {
  const patient = visit.patientId;
  const patientName = patient?.name || "Sneha Verma";
  const patientUhid = patient?.patientId || "PAT-000123";

  const doctor = visit.doctorId;
  const doctorName = doctor?.userId?.name || doctor?.name || "Dr. Rajesh Verma";
  const deptName = doctor?.departmentId?.name || doctor?.specialization || "Cardiology";

  const visitDateFormatted = new Date(visit.visitDate).toLocaleDateString("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
  const visitTimeFormatted = new Date(visit.visitDate).toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  });

  const sourceLabel = visit.appointmentId?.appointmentId
    ? `Appointment ${visit.appointmentId.appointmentId}`
    : visit.visitType === "walk-in"
    ? "Walk-in"
    : "Direct Visit";

  return (
    <div className="space-y-2.5">
      {/* Patient Summary Card */}
      <div className="bg-slate-50/60 border border-slate-200/80 rounded-xl p-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-3">
          {patient?.photoUrl ? (
            <img
              src={patient.photoUrl}
              alt={patientName}
              className="w-10 h-10 rounded-full object-cover shrink-0 border border-slate-200"
            />
          ) : (
            <div className="w-10 h-10 rounded-full bg-blue-100 text-blue-700 font-bold text-xs flex items-center justify-center shrink-0">
              {patientName.substring(0, 2).toUpperCase()}
            </div>
          )}
          <div>
            <h4 className="font-bold text-slate-900">
              {patientName} <span className="font-normal text-slate-400">({patientUhid})</span>
            </h4>
            <p className="text-[11px] text-slate-500 mt-0.5">
              28 Years | {patient?.gender || "Female"} | {patient?.bloodGroup || "A+"}
            </p>
            <p className="text-[11px] text-slate-500">{patient?.phone || "+91 98765 43210"}</p>
          </div>
        </div>

        <div className="text-right border-t sm:border-t-0 sm:border-l border-slate-200/80 pt-2 sm:pt-0 sm:pl-4 text-[11px]">
          <p className="text-slate-400">Visit Date &amp; Time</p>
          <p className="font-bold text-slate-800">{visitDateFormatted}, {visitTimeFormatted}</p>
          <p className="text-slate-400 mt-1">Source</p>
          <p className="font-semibold text-blue-600">{sourceLabel}</p>
        </div>
      </div>

      {/* Doctor / Department / Consultation Type Boxes */}
      <div className="grid grid-cols-3 gap-2.5">
        <div className="bg-white border border-slate-200/80 rounded-xl p-2.5 flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
            <User className="w-3.5 h-3.5" />
          </div>
          <div className="leading-tight truncate">
            <p className="text-[10px] text-slate-400 font-medium">Doctor</p>
            <p className="text-xs font-bold text-slate-900 truncate">{doctorName}</p>
            <p className="text-[10px] text-slate-400 truncate">{deptName}</p>
          </div>
        </div>

        <div className="bg-white border border-slate-200/80 rounded-xl p-2.5 flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-rose-50 text-rose-600 flex items-center justify-center shrink-0">
            <Building2 className="w-3.5 h-3.5" />
          </div>
          <div className="leading-tight truncate">
            <p className="text-[10px] text-slate-400 font-medium">Department</p>
            <p className="text-xs font-bold text-slate-900 truncate">{deptName}</p>
          </div>
        </div>

        <div className="bg-white border border-slate-200/80 rounded-xl p-2.5 flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
            <Stethoscope className="w-3.5 h-3.5" />
          </div>
          <div className="leading-tight truncate">
            <p className="text-[10px] text-slate-400 font-medium">Consultation Type</p>
            <p className="text-xs font-bold text-slate-900">OPD</p>
          </div>
        </div>
      </div>
    </div>
  );
}
