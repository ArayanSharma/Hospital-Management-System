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
        <div className="flex items-center justify-between p-3 bg-slate-50 border border-slate-200/80 rounded-2xl print:hidden">
          <div className="flex items-center gap-2 text-slate-600 text-xs font-semibold">
            <Printer className="w-4 h-4 text-blue-600" />
            <span>Ready for official Hospital OPD Appointment Slip print</span>
          </div>
          <button
            type="button"
            onClick={handlePrint}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold shadow-md shadow-blue-500/20 transition cursor-pointer flex items-center gap-2 active:scale-95"
          >
            <Printer className="w-4 h-4" />
            <span>Print Appointment Slip</span>
          </button>
        </div>

        {/* PRINTABLE CONTAINER (Target for @media print CSS) */}
        <div
          id="printable-appointment-slip"
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
                  Outpatient Department (OPD) Appointment Token &amp; Slip
                </p>
                <p className="text-[10px] text-slate-400 font-mono">
                  Appointment Reference ID: {apptIdNo}
                </p>
              </div>
            </div>

            <div className="text-right">
              <div className="inline-block px-3 py-1 bg-blue-50 text-blue-700 border border-blue-200 rounded-full font-black text-[11px] tracking-wider uppercase mb-1">
                OPD Appointment Slip
              </div>
              <p className="text-[11px] font-bold text-slate-700 font-mono">{apptIdNo}</p>
              <p className="text-[10px] text-slate-400 font-medium">{dateFormatted}</p>
            </div>
          </div>

          {/* Patient & Doctor Side-by-Side Grid */}
          <div className="grid grid-cols-2 gap-4 bg-slate-50 p-4 rounded-xl border border-slate-200/70 text-xs">
            {/* Patient Card */}
            <div className="space-y-1 border-r border-slate-200/80 pr-4">
              <div className="flex items-center gap-1.5 text-blue-700 font-extrabold text-[10px] uppercase tracking-wider">
                <User className="w-3.5 h-3.5" />
                <span>Patient Profile</span>
              </div>
              <p className="font-extrabold text-slate-900 text-sm">{patientName}</p>
              <div className="space-y-0.5 text-[11px] font-medium text-slate-600">
                <p><span className="font-bold text-slate-700">Patient UHID:</span> {patientUhid}</p>
                <p><span className="font-bold text-slate-700">Phone Number:</span> {patientPhone}</p>
              </div>
            </div>

            {/* Doctor Card */}
            <div className="space-y-1 pl-2">
              <div className="flex items-center gap-1.5 text-purple-700 font-extrabold text-[10px] uppercase tracking-wider">
                <Stethoscope className="w-3.5 h-3.5" />
                <span>Consulting Doctor &amp; Dept</span>
              </div>
              <p className="font-extrabold text-slate-900 text-sm">{doctorName}</p>
              <div className="space-y-0.5 text-[11px] font-medium text-slate-600">
                <p><span className="font-bold text-slate-700">Specialization:</span> {doctorSpec}</p>
                <p><span className="font-bold text-slate-700">Department:</span> {deptName}</p>
                <p><span className="font-bold text-slate-700">Slot Status:</span> <span className="font-extrabold text-blue-700">{statusStr}</span></p>
              </div>
            </div>
          </div>

          {/* Scheduled Slot Box */}
          <div>
            <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-2.5 flex items-center gap-1.5 border-b border-slate-200 pb-1">
              <Calendar className="w-4 h-4 text-blue-600" />
              <span>Confirmed Appointment Time Slot</span>
            </h3>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3.5 bg-blue-50/40 p-3.5 rounded-xl border border-blue-200/60">
              <div>
                <p className="text-[11px] text-slate-400 font-semibold mb-0.5">Appointment Date</p>
                <p className="font-extrabold text-blue-800 text-sm">{dateFormatted}</p>
              </div>
              <div>
                <p className="text-[11px] text-slate-400 font-semibold mb-0.5">Time Slot</p>
                <p className="font-extrabold text-slate-900 text-sm">{timeFormatted}</p>
              </div>
              <div>
                <p className="text-[11px] text-slate-400 font-semibold mb-0.5">Assigned Department</p>
                <p className="font-bold text-slate-800">{deptName}</p>
              </div>
            </div>
          </div>

          {/* Reason & Notes */}
          <div>
            <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-2.5 flex items-center gap-1.5 border-b border-slate-200 pb-1">
              <FileText className="w-4 h-4 text-slate-600" />
              <span>Consultation Purpose &amp; Special Instructions</span>
            </h3>
            <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-xl space-y-2">
              <div>
                <span className="font-extrabold text-slate-800 text-xs">Stated Reason / Symptoms:</span>
                <p className="text-slate-700 text-xs mt-0.5 font-medium leading-relaxed">{reasonStr}</p>
              </div>
              {appointment.cancelledReason && (
                <div className="pt-2 border-t border-slate-200 text-rose-700 font-bold">
                  Cancellation Reason: {appointment.cancelledReason}
                </div>
              )}
            </div>
          </div>

          {/* Signatures & Footer */}
          <div className="pt-8 flex items-end justify-between border-t border-slate-200">
            <div className="space-y-0.5 text-[10px] text-slate-400">
              <p className="font-semibold text-slate-600">Patient Instructions:</p>
              <p>• Please report to the OPD Helpdesk 15 minutes prior to your scheduled slot.</p>
              <p>• Slip printed on {new Date().toLocaleString()}</p>
            </div>

            <div className="text-center space-y-1">
              <div className="w-36 border-b-2 border-slate-400 pb-1 font-serif text-slate-600 italic">
                OPD Desk Officer
              </div>
              <p className="font-extrabold text-slate-900 text-[10px]">Authorized Desk Signature</p>
              <p className="text-[10px] font-semibold text-slate-500">CityCare OPD Reception</p>
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
