import React from "react";
import { Calendar, Clock, User, Stethoscope, FileText } from "lucide-react";
import Modal from "../../../../components/ui/Modal.jsx";

export default function AppointmentViewModal({ appointment, onClose }) {
  if (!appointment) return null;

  const patient = appointment.patientId;
  const patientName = patient?.name || "Patient";
  const patientPhone = patient?.phone || "N/A";
  const patientUhid = patient?.patientId || "PAT-000123";

  const doctor = appointment.doctorId;
  const doctorName = doctor?.userId?.name || doctor?.name || "Dr. Doctor";
  const doctorSpec = doctor?.specialization || "General Physician";

  const dateFormatted = new Date(appointment.appointmentDate).toLocaleDateString("en-GB", {
    weekday: "short",
    day: "numeric",
    month: "short",
    year: "numeric",
  });
  const timeFormatted = `${appointment.startTime} - ${appointment.endTime}`;

  return (
    <Modal
      isOpen={!!appointment}
      onClose={onClose}
      title="Appointment Details"
      subtitle={`Appointment Reference #${appointment.appointmentId || appointment._id}`}
      maxWidth="max-w-xl"
    >
      <div className="space-y-4 text-xs">
        {/* Status Badge Banner */}
        <div className="flex items-center justify-between p-4 bg-slate-50 border border-slate-200/80 rounded-2xl">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-blue-100 text-blue-600 flex items-center justify-center font-bold">
              <Calendar className="w-5 h-5" />
            </div>
            <div>
              <p className="font-extrabold text-slate-900 text-sm">{dateFormatted}</p>
              <p className="text-slate-500 font-semibold text-[11px]">{timeFormatted}</p>
            </div>
          </div>

          <span
            className={`px-3 py-1 rounded-full text-xs font-bold capitalize ${
              appointment.status === "completed"
                ? "bg-emerald-50 text-emerald-600 border border-emerald-200"
                : appointment.status === "cancelled"
                ? "bg-rose-50 text-rose-600 border border-rose-200"
                : appointment.status === "no-show"
                ? "bg-amber-50 text-amber-600 border border-amber-200"
                : appointment.status === "checked_in" || appointment.status === "in_consultation"
                ? "bg-purple-50 text-purple-600 border border-purple-200"
                : "bg-blue-50 text-blue-600 border border-blue-200"
            }`}
          >
            {appointment.status.replace("_", " ")}
          </span>
        </div>

        {/* Patient & Doctor Card */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {/* Patient Card */}
          <div className="p-3.5 bg-white border border-slate-200/80 rounded-2xl space-y-1">
            <div className="flex items-center gap-1.5 text-slate-400 font-extrabold text-[10px] uppercase tracking-wider">
              <User className="w-3.5 h-3.5 text-blue-600" />
              <span>Patient Profile</span>
            </div>
            <p className="font-bold text-slate-900 text-sm pt-0.5">{patientName}</p>
            <p className="text-[11px] text-slate-500 font-medium">UHID: {patientUhid}</p>
            <p className="text-[11px] text-slate-400">Phone: {patientPhone}</p>
          </div>

          {/* Doctor Card */}
          <div className="p-3.5 bg-white border border-slate-200/80 rounded-2xl space-y-1">
            <div className="flex items-center gap-1.5 text-slate-400 font-extrabold text-[10px] uppercase tracking-wider">
              <Stethoscope className="w-3.5 h-3.5 text-purple-600" />
              <span>Assigned Doctor</span>
            </div>
            <p className="font-bold text-slate-900 text-sm pt-0.5">{doctorName}</p>
            <p className="text-[11px] text-purple-700 font-semibold">{doctorSpec}</p>
            <p className="text-[11px] text-slate-400">
              Department: {appointment.departmentId?.name || "General Medicine"}
            </p>
          </div>
        </div>

        {/* Reason & Notes */}
        <div className="p-3.5 bg-slate-50 border border-slate-200/80 rounded-2xl space-y-1">
          <div className="flex items-center gap-1.5 text-slate-400 font-extrabold text-[10px] uppercase tracking-wider">
            <FileText className="w-3.5 h-3.5 text-slate-600" />
            <span>Consultation Reason</span>
          </div>
          <p className="font-semibold text-slate-800 pt-0.5">{appointment.reason || "General Medical OPD Consultation"}</p>
          {appointment.cancelledReason && (
            <div className="mt-2 pt-2 border-t border-slate-200/80 text-rose-700 font-semibold">
              Cancellation Reason: {appointment.cancelledReason}
            </div>
          )}
        </div>
      </div>
    </Modal>
  );
}
