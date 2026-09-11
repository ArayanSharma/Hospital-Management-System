import React from "react";
import { Calendar, Clock, User, Stethoscope, FileText, Printer, Building2 } from "lucide-react";
import Modal from "../../../../components/ui/Modal.jsx";

export default function AppointmentViewModal({ appointment, onClose }) {
  if (!appointment) return null;

  const apptIdNo = appointment.appointmentId || appointment._id || "APT-N/A";
  const patient = appointment.patientId;
  const patientName = patient?.name || appointment.patientName || "N/A";
  const patientPhone = patient?.phone || appointment.patientPhone || "N/A";
  const patientUhid = patient?.patientId || patient?._id || appointment.uhid || "N/A";

  const doctor = appointment.doctorId;
  const rawDoctorName = doctor?.userId?.name || doctor?.name || appointment.doctorName || "Physician";
  const doctorName = rawDoctorName.startsWith("Dr.") ? rawDoctorName : `Dr. ${rawDoctorName}`;
  const doctorSpec = doctor?.specialization || doctor?.departmentId?.name || "General OPD Specialist";
  const deptName = appointment.departmentId?.name || doctor?.departmentId?.name || "Outpatient Department";

  const dateFormatted = appointment.appointmentDate
    ? new Date(appointment.appointmentDate).toLocaleDateString("en-GB", {
        weekday: "short",
        day: "numeric",
        month: "short",
        year: "numeric",
      })
    : "N/A";

  const timeFormatted = appointment.startTime && appointment.endTime
    ? `${appointment.startTime} - ${appointment.endTime}`
    : appointment.startTime || "Scheduled Slot";

  const statusStr = (appointment.status || "Scheduled").replace("_", " ").toUpperCase();
  const reasonStr = appointment.reason || "General OPD Medical Consultation";

  const handlePrint = () => {
    window.print();
  };

  return (
    <Modal
      isOpen={!!appointment}
      onClose={onClose}
      title="OPD Appointment Confirmation & Slip"
      subtitle={`Appointment Reference #${apptIdNo}`}
      maxWidth="max-w-3xl"
    >
      <div className="space-y-4 text-xs text-slate-700 font-medium">
        {/* Printable Action Bar (Hidden during print) */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-3 bg-slate-50 border border-slate-200/80 rounded-2xl print:hidden">
          <div className="flex items-center gap-2 text-slate-600 text-xs font-semibold">
            <Printer className="w-4 h-4 text-blue-600 shrink-0" />
            <span>Ready for official Hospital OPD Appointment Slip print</span>
          </div>
          <button
            type="button"
            onClick={handlePrint}
            className="w-full sm:w-auto px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold shadow-md shadow-blue-500/20 transition cursor-pointer flex items-center justify-center gap-2 active:scale-95 shrink-0"
          >
            <Printer className="w-4 h-4" />
            <span>Print Appointment Slip</span>
          </button>
        </div>

        {/* PRINTABLE CONTAINER (Target for @media print CSS) */}
        <div
          id="printable-appointment-slip"
          className="bg-white p-4 sm:p-6 rounded-2xl border border-slate-200/80 text-slate-900 text-xs space-y-4 sm:space-y-5 shadow-xs"
        >
          {/* Hospital Letterhead Header */}
          <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3 sm:gap-4 border-b-2 border-blue-600 pb-4">
            <div className="flex items-start sm:items-center gap-3">
              <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-blue-600 text-white flex items-center justify-center font-black text-lg sm:text-xl shadow-md shrink-0">
                <Building2 className="w-6 h-6 sm:w-7 sm:h-7" />
              </div>
              <div className="space-y-0.5">
                <h1 className="text-sm sm:text-lg font-extrabold text-blue-700 uppercase tracking-tight leading-snug">
                  CityCare Hospital &amp; Medical Research Center
                </h1>
                <p className="text-[10px] sm:text-[11px] font-semibold text-slate-500 leading-tight">
                  Outpatient Department (OPD) Appointment Token &amp; Slip
                </p>
                <p className="text-[9px] sm:text-[10px] text-slate-400 font-mono">
                  Reference ID: {apptIdNo}
                </p>
              </div>
            </div>

            {/* Right Badge & Date info (Fixed layout for mobile screens) */}
            <div className="flex flex-row sm:flex-col items-center sm:items-end justify-between sm:justify-start gap-1 sm:text-right shrink-0 pt-2 sm:pt-0 border-t sm:border-t-0 border-slate-100">
              <div className="inline-flex px-2.5 sm:px-3 py-1 bg-blue-50 text-blue-700 border border-blue-200 rounded-full font-black text-[10px] sm:text-[11px] tracking-wider uppercase whitespace-nowrap">
                OPD Appointment Slip
              </div>
              <div className="text-right sm:text-right font-mono">
                <p className="text-[10px] sm:text-[11px] font-bold text-slate-800 leading-tight">{apptIdNo}</p>
                <p className="text-[9px] sm:text-[10px] text-slate-400 font-medium">{dateFormatted}</p>
              </div>
            </div>
          </div>

          {/* Patient & Doctor Side-by-Side Grid (Stack vertically on mobile) */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 bg-slate-50 p-3.5 sm:p-4 rounded-xl border border-slate-200/70 text-xs">
            {/* Patient Card */}
            <div className="space-y-1 border-b sm:border-b-0 sm:border-r border-slate-200/80 pb-3 sm:pb-0 pr-0 sm:pr-4">
              <div className="flex items-center gap-1.5 text-blue-700 font-extrabold text-[10px] uppercase tracking-wider">
                <User className="w-3.5 h-3.5 shrink-0" />
                <span>Patient Profile</span>
              </div>
              <p className="font-extrabold text-slate-900 text-xs sm:text-sm">{patientName}</p>
              <div className="space-y-0.5 text-[10px] sm:text-[11px] font-medium text-slate-600">
                <p><span className="font-bold text-slate-700">Patient UHID:</span> {patientUhid}</p>
                <p><span className="font-bold text-slate-700">Phone Number:</span> {patientPhone}</p>
              </div>
            </div>

            {/* Doctor Card */}
            <div className="space-y-1 pl-0 sm:pl-2 pt-1 sm:pt-0">
              <div className="flex items-center gap-1.5 text-purple-700 font-extrabold text-[10px] uppercase tracking-wider">
                <Stethoscope className="w-3.5 h-3.5 shrink-0" />
                <span>Consulting Doctor &amp; Dept</span>
              </div>
              <p className="font-extrabold text-slate-900 text-xs sm:text-sm">{doctorName}</p>
              <div className="space-y-0.5 text-[10px] sm:text-[11px] font-medium text-slate-600">
                <p><span className="font-bold text-slate-700">Specialization:</span> {doctorSpec}</p>
                <p><span className="font-bold text-slate-700">Department:</span> {deptName}</p>
                <p><span className="font-bold text-slate-700">Slot Status:</span> <span className="font-extrabold text-blue-700">{statusStr}</span></p>
              </div>
            </div>
          </div>

          {/* Scheduled Slot Box */}
          <div>
            <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-2 flex items-center gap-1.5 border-b border-slate-200 pb-1">
              <Calendar className="w-4 h-4 text-blue-600 shrink-0" />
              <span>Confirmed Appointment Time Slot</span>
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 sm:gap-3.5 bg-blue-50/40 p-3 sm:p-3.5 rounded-xl border border-blue-200/60">
              <div>
                <p className="text-[10px] sm:text-[11px] text-slate-400 font-semibold mb-0.5">Appointment Date</p>
                <p className="font-extrabold text-blue-800 text-xs sm:text-sm">{dateFormatted}</p>
              </div>
              <div>
                <p className="text-[10px] sm:text-[11px] text-slate-400 font-semibold mb-0.5">Time Slot</p>
                <p className="font-extrabold text-slate-900 text-xs sm:text-sm">{timeFormatted}</p>
              </div>
              <div>
                <p className="text-[10px] sm:text-[11px] text-slate-400 font-semibold mb-0.5">Assigned Department</p>
                <p className="font-bold text-slate-800 text-xs">{deptName}</p>
              </div>
            </div>
          </div>

          {/* Reason & Notes */}
          <div>
            <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-2 flex items-center gap-1.5 border-b border-slate-200 pb-1">
              <FileText className="w-4 h-4 text-slate-600 shrink-0" />
              <span>Consultation Purpose &amp; Special Instructions</span>
            </h3>
            <div className="p-3 sm:p-3.5 bg-slate-50 border border-slate-200 rounded-xl space-y-2">
              <div>
                <span className="font-extrabold text-slate-800 text-xs">Stated Reason / Symptoms:</span>
                <p className="text-slate-700 text-xs mt-0.5 font-medium leading-relaxed">{reasonStr}</p>
              </div>
              {appointment.cancelledReason && (
                <div className="pt-2 border-t border-slate-200 text-rose-700 font-bold text-xs">
                  Cancellation Reason: {appointment.cancelledReason}
                </div>
              )}
            </div>
          </div>

          {/* Signatures & Footer */}
          <div className="pt-6 sm:pt-8 flex flex-col sm:flex-row items-start sm:items-end justify-between gap-4 border-t border-slate-200">
            <div className="space-y-0.5 text-[9px] sm:text-[10px] text-slate-400">
              <p className="font-semibold text-slate-600">Patient Instructions:</p>
              <p>• Please report to the OPD Helpdesk 15 minutes prior to your scheduled slot.</p>
              <p>• Slip printed on {new Date().toLocaleString()}</p>
            </div>

            <div className="text-center space-y-1 self-end sm:self-auto">
              <div className="w-32 sm:w-36 border-b-2 border-slate-400 pb-1 font-serif text-slate-600 italic text-xs">
                OPD Desk Officer
              </div>
              <p className="font-extrabold text-slate-900 text-[9px] sm:text-[10px]">Authorized Desk Signature</p>
              <p className="text-[9px] sm:text-[10px] font-semibold text-slate-500">CityCare OPD Reception</p>
            </div>
          </div>
        </div>

        {/* Footer Close Button */}
        <div className="pt-2 flex justify-end print:hidden">
          <button
            type="button"
            onClick={onClose}
            className="w-full sm:w-auto px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold transition cursor-pointer"
          >
            Close
          </button>
        </div>
      </div>
    </Modal>
  );
}
