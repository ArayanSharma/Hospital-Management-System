import React from "react";
import EmptyState from "../common/EmptyState.jsx";

export default function AppointmentsTab({ appointments, patient }) {
  const list = appointments || patient?.appointments || patient?.appointmentHistory || [];

  if (!list || list.length === 0) {
    return <EmptyState title="No Appointments" message="No previous or upcoming OPD appointments scheduled for this patient." />;
  }

  return (
    <div className="space-y-4">
      <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider">
        Appointment History & Schedule ({list.length})
      </h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {list.map((apt) => {
          const docName = apt.doctorId?.name || apt.doctor?.name || (typeof apt.doctor === "string" ? apt.doctor : null) || "Consulting Doctor";
          const deptName = apt.departmentId?.name || apt.department?.name || apt.department || "General OPD";
          const aptDate = apt.appointmentDate ? new Date(apt.appointmentDate).toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" }) : (apt.date || "N/A");
          const timeSlot = apt.startTime ? `${apt.startTime} - ${apt.endTime || ""}` : (apt.time || "OPD Slot");

          return (
            <div key={apt._id || apt.id} className="bg-slate-50 border border-slate-200 rounded-2xl p-4 space-y-2 text-xs">
              <div className="flex items-center justify-between">
                <span className="font-bold text-slate-900 capitalize">{apt.reason || apt.type || "OPD Visit"}</span>
                <span
                  className={`px-2.5 py-0.5 rounded-full text-[10px] font-extrabold capitalize ${
                    apt.status === "completed"
                      ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                      : apt.status === "cancelled"
                      ? "bg-rose-50 text-rose-700 border border-rose-200"
                      : "bg-blue-50 text-blue-700 border border-blue-200"
                  }`}
                >
                  {apt.status || "Scheduled"}
                </span>
              </div>
              <p className="text-slate-600">
                Doctor: <strong className="text-slate-800">{docName}</strong> ({deptName})
              </p>
              <div className="flex items-center justify-between text-[11px] text-slate-500 pt-2 border-t border-slate-200">
                <span>Date: {aptDate}</span>
                <span>Time: {timeSlot}</span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

