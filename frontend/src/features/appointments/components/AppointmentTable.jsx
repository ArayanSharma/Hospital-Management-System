import React, { useState, useRef, useEffect } from "react";
import {
  Calendar,
  Clock,
  Eye,
  Edit2,
  MoreVertical,
  ChevronLeft,
  ChevronRight,
  RefreshCw,
  UserCheck,
  CheckCircle2,
  AlertCircle,
  XCircle,
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

function AppointmentActionMenu({
  appt,
  onEdit,
  onView,
  onReschedule,
  onStatusChange,
  onOpenCancelModal,
}) {
  const [isOpen, setIsOpen] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (ref.current && !ref.current.contains(e.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="flex items-center justify-end gap-1.5" ref={ref}>
      {/* 1. [ ✏️ ] Edit Button */}
      <button
        type="button"
        onClick={() => onEdit(appt)}
        className="p-1.5 rounded-lg border border-slate-200 text-blue-600 hover:bg-blue-50 transition-all duration-150 cursor-pointer active:scale-95 shadow-2xs"
        title="Edit Appointment Details"
      >
        <Edit2 className="w-3.5 h-3.5" />
      </button>

      {/* 2. [ 👁 ] View Button */}
      <button
        type="button"
        onClick={() => onView(appt)}
        className="p-1.5 rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-100 hover:text-blue-600 transition-all duration-150 cursor-pointer active:scale-95 shadow-2xs"
        title="View Details"
      >
        <Eye className="w-3.5 h-3.5" />
      </button>

      {/* 3. [ ⋮ ] More Menu Button */}
      <div className="relative inline-block text-left">
        <button
          type="button"
          onClick={() => setIsOpen(!isOpen)}
          className={`p-1.5 rounded-lg border text-slate-500 hover:bg-slate-100 hover:text-slate-800 transition-all duration-150 cursor-pointer active:scale-95 shadow-2xs ${
            isOpen ? "border-blue-500 bg-blue-50/50 ring-2 ring-blue-500/10 text-blue-600" : "border-slate-200"
          }`}
          title="More Actions"
        >
          <MoreVertical className="w-3.5 h-3.5" />
        </button>

        {isOpen && (
          <div className="absolute right-0 top-full mt-1.5 w-52 bg-white border border-slate-200/90 rounded-2xl shadow-2xl z-[100] p-1.5 text-xs space-y-0.5 animate-in fade-in zoom-in-95 duration-150 ease-out origin-top-right">
            {/* 1. Reschedule */}
            <button
              type="button"
              onClick={() => {
                setIsOpen(false);
                onReschedule(appt);
              }}
              className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-left font-semibold text-slate-700 hover:bg-purple-50/70 hover:text-purple-700 transition cursor-pointer"
            >
              <RefreshCw className="w-4 h-4 text-purple-600 shrink-0" />
              <span>Reschedule Slot</span>
            </button>

            <div className="my-1 border-t border-slate-100"></div>

            {/* 2. Check-in */}
            {appt.status !== "completed" && appt.status !== "cancelled" && (
              <button
                type="button"
                onClick={() => {
                  setIsOpen(false);
                  onStatusChange(appt, "checked_in");
                }}
                disabled={appt.status === "checked_in"}
                className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-left font-semibold transition ${
                  appt.status === "checked_in"
                    ? "opacity-50 text-slate-400 cursor-not-allowed bg-slate-50"
                    : "text-slate-700 hover:bg-indigo-50/70 hover:text-indigo-700 cursor-pointer"
                }`}
              >
                <UserCheck className="w-4 h-4 text-indigo-600 shrink-0" />
                <span>{appt.status === "checked_in" ? "Already Checked-In" : "Check-in Patient"}</span>
              </button>
            )}

            {/* 3. Mark as Completed */}
            {appt.status !== "completed" && appt.status !== "cancelled" && (
              <button
                type="button"
                onClick={() => {
                  setIsOpen(false);
                  onStatusChange(appt, "completed");
                }}
                className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-left font-semibold text-emerald-700 hover:bg-emerald-50/70 transition cursor-pointer"
              >
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>Mark as Completed</span>
              </button>
            )}

            {/* 4. Mark as No-Show */}
            {appt.status !== "completed" && appt.status !== "cancelled" && (
              <button
                type="button"
                onClick={() => {
                  setIsOpen(false);
                  onStatusChange(appt, "no-show");
                }}
                className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-left font-semibold text-amber-700 hover:bg-amber-50/70 transition cursor-pointer"
              >
                <AlertCircle className="w-4 h-4 text-amber-600 shrink-0" />
                <span>Mark as No-Show</span>
              </button>
            )}

            {(appt.status === "completed" || appt.status === "cancelled") && (
              <div className="px-3 py-2 text-[11px] font-semibold text-slate-400 italic">
                Appointment is {appt.status}. Reschedule to reactivate.
              </div>
            )}

            <div className="my-1 border-t border-slate-100"></div>

            {/* 5. Cancel */}
            {appt.status !== "cancelled" && (
              <button
                type="button"
                onClick={() => {
                  setIsOpen(false);
                  onOpenCancelModal(appt);
                }}
                className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-left font-semibold text-rose-700 hover:bg-rose-50/70 transition cursor-pointer"
              >
                <XCircle className="w-4 h-4 text-rose-600 shrink-0" />
                <span>Cancel Appointment</span>
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default function AppointmentTable({
  appointments,
  loading,
  error,
  page,
  setPage,
  pagination,
  onEdit,
  onView,
  onReschedule,
  onStatusChange,
  onOpenCancelModal,
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
                const rowNumber = (page - 1) * 10 + index + 1;
                const patient = appt.patientId;
                const patientName = patient?.name || "Patient";
                const patientUhid = patient?.patientId || "PAT-000123";

                const doctor = appt.doctorId;
                const doctorName = doctor?.userId?.name || doctor?.name || "Dr. Doctor";
                const doctorCode = doctor?.doctorId || "DOC-001";

                const deptName = appt.departmentId?.name || doctor?.specialization || "General Medicine";
                const deptBadge = getDepartmentBadge(deptName);
                const DeptIcon = deptBadge.icon;

                const dateFormatted = new Date(appt.appointmentDate).toLocaleDateString("en-GB", {
                  day: "numeric",
                  month: "short",
                  year: "numeric",
                });
                const timeFormatted = `${appt.startTime} - ${appt.endTime}`;

                return (
                  <tr key={appt._id} className="hover:bg-slate-50/70 transition-colors group">
                    <td className="py-3.5 px-4 text-center font-semibold text-slate-400">
                      {rowNumber}
                    </td>

                    <td className="py-3.5 px-4 font-mono font-medium text-slate-500 whitespace-nowrap">
                      {appt.appointmentId || `APT-${index + 1}`}
                    </td>

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

                    <td className="py-3.5 px-4 whitespace-nowrap">
                      <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold border ${deptBadge.style}`}>
                        <DeptIcon className="w-3.5 h-3.5" />
                        <span>{deptName}</span>
                      </span>
                    </td>

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

                    <td className="py-3.5 px-4 max-w-xs text-slate-700 font-medium whitespace-nowrap">
                      {appt.reason || "General Checkup"}
                    </td>

                    <td className="py-3.5 px-4 whitespace-nowrap">
                      {appt.status === "scheduled" && (
                        <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-blue-50 text-blue-600 border border-blue-200">
                          Scheduled
                        </span>
                      )}
                      {(appt.status === "checked_in" || appt.status === "in_consultation") && (
                        <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-purple-50 text-purple-600 border border-purple-200">
                          Checked-In
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

                    <td className="py-3.5 px-4 text-right whitespace-nowrap">
                      <AppointmentActionMenu
                        appt={appt}
                        onEdit={onEdit}
                        onView={onView}
                        onReschedule={onReschedule}
                        onStatusChange={onStatusChange}
                        onOpenCancelModal={onOpenCancelModal}
                      />
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
          Showing {(page - 1) * 10 + 1} to {Math.min(page * 10, pagination?.total || appointments.length)} of {pagination?.total || appointments.length} entries
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
