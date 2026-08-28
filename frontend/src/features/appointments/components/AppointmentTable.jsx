import React from "react";
import {
  Calendar,
  Clock,
  Eye,
  MoreVertical,
  ChevronLeft,
  ChevronRight,
  HeartPulse,
  Brain,
  Bone,
  Baby,
  Activity,
  Sparkles,
  Wind,
} from "lucide-react";
import Loading from "../../../components/common/Loading.jsx";
import ErrorState from "../../../components/common/ErrorState.jsx";

const getDepartmentBadge = (deptName) => {
  const name = deptName || "General Medicine";
  if (name.toLowerCase().includes("cardio")) {
    return {
      icon: HeartPulse,
      style: "bg-rose-50 text-rose-600 border-rose-200",
    };
  }
  if (name.toLowerCase().includes("neuro")) {
    return {
      icon: Brain,
      style: "bg-purple-50 text-purple-600 border-purple-200",
    };
  }
  if (name.toLowerCase().includes("ortho")) {
    return {
      icon: Bone,
      style: "bg-blue-50 text-blue-600 border-blue-200",
    };
  }
  if (name.toLowerCase().includes("pedia")) {
    return {
      icon: Baby,
      style: "bg-pink-50 text-pink-600 border-pink-200",
    };
  }
  if (name.toLowerCase().includes("derma")) {
    return {
      icon: Sparkles,
      style: "bg-amber-50 text-amber-600 border-amber-200",
    };
  }
  if (name.toLowerCase().includes("pulmo")) {
    return {
      icon: Wind,
      style: "bg-cyan-50 text-cyan-600 border-cyan-200",
    };
  }
  return {
    icon: Activity,
    style: "bg-emerald-50 text-emerald-600 border-emerald-200",
  };
};

export default function AppointmentTable({
  appointments,
  loading,
  error,
  page,
  setPage,
  pagination,
  onStatusChange,
}) {
  return (
    <div>
      <div className="overflow-x-auto">
        {loading ? (
          <Loading message="Fetching appointment records..." />
        ) : error ? (
          <ErrorState message={error} />
        ) : appointments.length === 0 ? (
          <div className="p-8 text-center text-slate-500 text-xs font-medium">
            No appointments found matching search criteria.
          </div>
        ) : (
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50/80 border-b border-slate-200/80 text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                <th className="py-3 px-4 w-10 text-center">#</th>
                <th className="py-3 px-4">Appointment ID</th>
                <th className="py-3 px-4">Patient</th>
                <th className="py-3 px-4">Doctor</th>
                <th className="py-3 px-4">Department</th>
                <th className="py-3 px-4">Date & Time</th>
                <th className="py-3 px-4 max-w-xs">Reason</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-xs text-slate-800">
              {appointments.map((appt, index) => {
                const rowNumber = ((page - 1) * 10) + index + 1;
                const patient = appt.patientId;
                const patientName = patient?.name || "Patient";
                const patientUhid = patient?.patientId || "PAT-000123";

                const doctor = appt.doctorId;
                const doctorName = doctor?.userId?.name || doctor?.name || "Dr. Doctor";
                const doctorCode = doctor?.doctorId || "CARD-001";

                const deptName = appt.departmentId?.name || doctor?.specialization || "Cardiology";
                const deptBadge = getDepartmentBadge(deptName);
                const DeptIcon = deptBadge.icon;

                const dateFormatted = new Date(appt.appointmentDate).toLocaleDateString("en-GB", {
                  day: "numeric",
                  month: "short",
                  year: "numeric",
                });
                const timeFormatted = `${appt.startTime} - ${appt.endTime}`;

                return (
                  <tr
                    key={appt._id}
                    className="hover:bg-slate-50/70 transition-colors group"
                  >
                    <td className="py-3.5 px-4 text-center font-semibold text-slate-400">
                      {rowNumber}
                    </td>

                    {/* Appointment ID */}
                    <td className="py-3.5 px-4 font-mono font-medium text-slate-500 whitespace-nowrap">
                      {appt.appointmentId || `APT-${index + 1}`}
                    </td>

                    {/* Patient Cell */}
                    <td className="py-3.5 px-4 whitespace-nowrap">
                      <div className="flex items-center gap-2.5">
                        {patient?.photoUrl ? (
                          <img
                            src={patient.photoUrl}
                            alt={patientName}
                            className="w-8 h-8 rounded-full object-cover shrink-0 border border-slate-200"
                          />
                        ) : (
                          <div className="w-8 h-8 rounded-full bg-blue-100 text-blue-700 font-bold text-xs flex items-center justify-center shrink-0">
                            {patientName.substring(0, 2).toUpperCase()}
                          </div>
                        )}
                        <div className="leading-tight">
                          <p className="font-bold text-slate-900">{patientName}</p>
                          <p className="text-[11px] text-slate-400">{patientUhid}</p>
                        </div>
                      </div>
                    </td>

                    {/* Doctor Cell */}
                    <td className="py-3.5 px-4 whitespace-nowrap">
                      <div className="flex items-center gap-2.5">
                        {doctor?.photoUrl ? (
                          <img
                            src={doctor.photoUrl}
                            alt={doctorName}
                            className="w-8 h-8 rounded-full object-cover shrink-0 border border-slate-200"
                          />
                        ) : (
                          <div className="w-8 h-8 rounded-full bg-purple-100 text-purple-700 font-bold text-xs flex items-center justify-center shrink-0">
                            {doctorName.replace("Dr. ", "").substring(0, 2).toUpperCase()}
                          </div>
                        )}
                        <div className="leading-tight">
                          <p className="font-bold text-slate-900">{doctorName}</p>
                          <p className="text-[11px] text-slate-400">{doctorCode}</p>
                        </div>
                      </div>
                    </td>

                    {/* Department Cell */}
                    <td className="py-3.5 px-4 whitespace-nowrap">
                      <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold border ${deptBadge.style}`}>
                        <DeptIcon className="w-3.5 h-3.5" />
                        <span>{deptName}</span>
                      </span>
                    </td>

                    {/* Date & Time Cell */}
                    <td className="py-3.5 px-4 whitespace-nowrap">
                      <div className="leading-tight">
                        <div className="flex items-center gap-1 text-slate-800 font-medium text-xs">
                          <Calendar className="w-3 h-3 text-slate-400" />
                          <span>{dateFormatted}</span>
                        </div>
                        <div className="flex items-center gap-1 text-slate-400 text-[11px] mt-0.5">
                          <Clock className="w-3 h-3 text-slate-400" />
                          <span>{timeFormatted}</span>
                        </div>
                      </div>
                    </td>

                    {/* Reason Cell */}
                    <td className="py-3.5 px-4 max-w-xs text-slate-700 font-medium whitespace-nowrap">
                      {appt.reason || "General Checkup"}
                    </td>

                    {/* Status Cell */}
                    <td className="py-3.5 px-4 whitespace-nowrap">
                      {appt.status === "scheduled" && (
                        <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-blue-50 text-blue-600 border border-blue-200">
                          Scheduled
                        </span>
                      )}
                      {appt.status === "completed" && (
                        <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-emerald-50 text-emerald-600 border border-emerald-200">
                          Completed
                        </span>
                      )}
                      {appt.status === "cancelled" && (
                        <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-rose-50 text-rose-600 border border-rose-200">
                          Cancelled
                        </span>
                      )}
                      {appt.status === "no-show" && (
                        <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-amber-50 text-amber-600 border border-amber-200">
                          No-Show
                        </span>
                      )}
                    </td>

                    {/* Actions Cell */}
                    <td className="py-3.5 px-4 text-right whitespace-nowrap">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          type="button"
                          onClick={() => alert(`Appointment Details: ${appt.appointmentId || appt._id}`)}
                          className="p-1.5 rounded-lg border border-slate-200 text-blue-600 hover:bg-blue-50 transition cursor-pointer"
                          title="View Appointment"
                        >
                          <Eye className="w-3.5 h-3.5" />
                        </button>
                        <button
                          type="button"
                          onClick={() => onStatusChange(appt, appt.status === "scheduled" ? "completed" : "scheduled")}
                          className="p-1.5 rounded-lg text-slate-400 hover:bg-slate-100 hover:text-slate-600 transition cursor-pointer"
                          title="More Options"
                        >
                          <MoreVertical className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
      </div>

      {/* Pagination Bar */}
      <div className="p-4 border-t border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
        <p className="text-slate-500 font-medium">
          Showing {((page - 1) * 10) + 1} to {Math.min(page * 10, pagination?.total || appointments.length)} of {pagination?.total || appointments.length} entries
        </p>
        <div className="flex items-center gap-1 self-center sm:self-auto">
          <button
            disabled={page <= 1}
            onClick={() => setPage(page - 1)}
            className="p-1.5 rounded-lg border border-slate-200 text-slate-500 hover:bg-slate-50 disabled:opacity-40 cursor-pointer"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          <button className="w-7 h-7 rounded-lg bg-blue-600 text-white font-bold text-xs flex items-center justify-center">
            {page}
          </button>
          <button
            disabled={page >= (pagination?.totalPages || 1)}
            onClick={() => setPage(page + 1)}
            className="p-1.5 rounded-lg border border-slate-200 text-slate-500 hover:bg-slate-50 disabled:opacity-40 cursor-pointer"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
