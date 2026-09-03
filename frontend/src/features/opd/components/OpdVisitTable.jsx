import React, { useState, useRef, useEffect } from "react";
import {
  Eye,
  Edit2,
  MoreVertical,
  ChevronLeft,
  ChevronRight,
  Stethoscope,
  FileText,
  Pill,
  FlaskConical,
  Printer,
  Activity,
  CheckCircle2,
  UserCheck,
  Calendar,
  XCircle,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import Loading from "../../../components/common/Loading.jsx";
import ErrorState from "../../../components/common/ErrorState.jsx";

function OpdActionMenu({
  visit,
  onSelectVisit,
  onStatusChange,
  onAssignDoctor,
  onOpenCancelModal,
}) {
  const navigate = useNavigate();
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

  const isCompleted = visit.status === "completed";
  const isInProgress = visit.status === "in-progress" || visit.status === "in_consultation";
  const isWalkIn = visit.status === "walk-in" || visit.status === "registered" || visit.status === "scheduled";

  return (
    <div className="flex items-center justify-end gap-1.5" ref={ref} onClick={(e) => e.stopPropagation()}>
      {/* 1. [ ✏️ ] Edit Button */}
      <button
        type="button"
        onClick={() => onSelectVisit(visit, "edit")}
        className="p-1.5 rounded-lg border border-slate-200 text-blue-600 hover:bg-blue-50 transition-all duration-150 cursor-pointer active:scale-95 shadow-2xs"
        title="Edit Visit Details"
      >
        <Edit2 className="w-3.5 h-3.5" />
      </button>

      {/* 2. [ 👁 ] View Button */}
      <button
        type="button"
        onClick={() => onSelectVisit(visit)}
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
          <div className="absolute right-0 top-full mt-1.5 w-56 bg-white border border-slate-200/90 rounded-2xl shadow-2xl z-[100] p-1.5 text-xs space-y-0.5 animate-in fade-in zoom-in-95 duration-150 ease-out origin-top-right">
            {/* A. Completed Visit Actions */}
            {isCompleted && (
              <>
                <button
                  type="button"
                  onClick={() => {
                    setIsOpen(false);
                    onSelectVisit(visit, "consultation");
                  }}
                  className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-left font-semibold text-slate-700 hover:bg-purple-50/70 hover:text-purple-700 transition cursor-pointer"
                >
                  <Stethoscope className="w-4 h-4 text-purple-600 shrink-0" />
                  <span>View Consultation</span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setIsOpen(false);
                    const pid = visit.patientId?._id || visit.patientId;
                    navigate(`/patients/${pid}?tab=history`);
                  }}
                  className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-left font-semibold text-slate-700 hover:bg-indigo-50/70 hover:text-indigo-700 transition cursor-pointer"
                >
                  <FileText className="w-4 h-4 text-indigo-600 shrink-0" />
                  <span>Medical Record</span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setIsOpen(false);
                    navigate("/pharmacy/medicines");
                  }}
                  className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-left font-semibold text-slate-700 hover:bg-emerald-50/70 hover:text-emerald-700 transition cursor-pointer"
                >
                  <Pill className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>Prescription</span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setIsOpen(false);
                    navigate("/laboratory");
                  }}
                  className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-left font-semibold text-slate-700 hover:bg-cyan-50/70 hover:text-cyan-700 transition cursor-pointer"
                >
                  <FlaskConical className="w-4 h-4 text-cyan-600 shrink-0" />
                  <span>Lab / Radiology</span>
                </button>

                <div className="my-1 border-t border-slate-100"></div>

                <button
                  type="button"
                  onClick={() => {
                    setIsOpen(false);
                    window.print();
                  }}
                  className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-left font-semibold text-slate-700 hover:bg-slate-100 transition cursor-pointer"
                >
                  <Printer className="w-4 h-4 text-slate-600 shrink-0" />
                  <span>Print Summary</span>
                </button>
              </>
            )}

            {/* B. In-Progress Visit Actions */}
            {isInProgress && (
              <>
                <button
                  type="button"
                  onClick={() => {
                    setIsOpen(false);
                    onSelectVisit(visit, "consultation");
                  }}
                  className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-left font-semibold text-slate-700 hover:bg-blue-50/70 hover:text-blue-700 transition cursor-pointer"
                >
                  <Stethoscope className="w-4 h-4 text-blue-600 shrink-0" />
                  <span>Open Consultation</span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setIsOpen(false);
                    onSelectVisit(visit, "notes");
                  }}
                  className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-left font-semibold text-slate-700 hover:bg-purple-50/70 hover:text-purple-700 transition cursor-pointer"
                >
                  <FileText className="w-4 h-4 text-purple-600 shrink-0" />
                  <span>Clinical Notes</span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setIsOpen(false);
                    onSelectVisit(visit, "diagnosis");
                  }}
                  className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-left font-semibold text-slate-700 hover:bg-indigo-50/70 hover:text-indigo-700 transition cursor-pointer"
                >
                  <Activity className="w-4 h-4 text-indigo-600 shrink-0" />
                  <span>Diagnosis</span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setIsOpen(false);
                    onSelectVisit(visit, "prescription");
                  }}
                  className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-left font-semibold text-slate-700 hover:bg-emerald-50/70 hover:text-emerald-700 transition cursor-pointer"
                >
                  <Pill className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>Prescription</span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setIsOpen(false);
                    navigate("/laboratory");
                  }}
                  className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-left font-semibold text-slate-700 hover:bg-cyan-50/70 hover:text-cyan-700 transition cursor-pointer"
                >
                  <FlaskConical className="w-4 h-4 text-cyan-600 shrink-0" />
                  <span>Lab / Radiology Orders</span>
                </button>

                <div className="my-1 border-t border-slate-100"></div>

                <button
                  type="button"
                  onClick={() => {
                    setIsOpen(false);
                    onStatusChange(visit, "completed");
                  }}
                  className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-left font-semibold text-emerald-700 hover:bg-emerald-50/70 transition cursor-pointer"
                >
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>Complete Visit</span>
                </button>
              </>
            )}

            {/* C. Walk-in / Registered Visit Actions */}
            {isWalkIn && (
              <>
                <button
                  type="button"
                  onClick={() => {
                    setIsOpen(false);
                    onStatusChange(visit, "in-progress");
                  }}
                  className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-left font-semibold text-slate-700 hover:bg-blue-50/70 hover:text-blue-700 transition cursor-pointer"
                >
                  <Stethoscope className="w-4 h-4 text-blue-600 shrink-0" />
                  <span>Open Consultation</span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setIsOpen(false);
                    onAssignDoctor(visit);
                  }}
                  className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-left font-semibold text-slate-700 hover:bg-purple-50/70 hover:text-purple-700 transition cursor-pointer"
                >
                  <UserCheck className="w-4 h-4 text-purple-600 shrink-0" />
                  <span>Assign Doctor</span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setIsOpen(false);
                    navigate("/appointments");
                  }}
                  className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-left font-semibold text-slate-700 hover:bg-indigo-50/70 hover:text-indigo-700 transition cursor-pointer"
                >
                  <Calendar className="w-4 h-4 text-indigo-600 shrink-0" />
                  <span>Convert to Appointment</span>
                </button>

                <div className="my-1 border-t border-slate-100"></div>

                <button
                  type="button"
                  onClick={() => {
                    setIsOpen(false);
                    onOpenCancelModal(visit);
                  }}
                  className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-left font-semibold text-rose-700 hover:bg-rose-50/70 transition cursor-pointer"
                >
                  <XCircle className="w-4 h-4 text-rose-600 shrink-0" />
                  <span>Cancel Visit</span>
                </button>
              </>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default function OpdVisitTable({
  visits,
  loading,
  error,
  page,
  setPage,
  pagination,
  selectedVisit,
  onSelectVisit,
  onStatusChange,
  onAssignDoctor,
  onOpenCancelModal,
}) {
  return (
    <div>
      <div className="overflow-x-auto">
        {loading ? (
          <Loading message="Loading OPD visits..." />
        ) : error ? (
          <ErrorState message={error} />
        ) : visits.length === 0 ? (
          <div className="p-8 text-center text-slate-500 text-xs font-medium">
            No OPD visits found matching search criteria.
          </div>
        ) : (
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50/80 border-b border-slate-200/80 text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                <th className="py-3 px-3.5 w-8 text-center">#</th>
                <th className="py-3 px-3.5">Visit ID</th>
                <th className="py-3 px-3.5">Patient</th>
                <th className="py-3 px-3.5">Doctor</th>
                <th className="py-3 px-3.5">Visit Date & Time</th>
                <th className="py-3 px-3.5">Status</th>
                <th className="py-3 px-3.5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-xs text-slate-800">
              {visits.map((visit, index) => {
                const isSelected = selectedVisit?._id === visit._id;
                const rowNumber = (page - 1) * 10 + index + 1;

                const patient = visit.patientId;
                const patientName = patient?.name || "Patient";
                const patientUhid = patient?.patientId || "PAT-000123";

                const doctor = visit.doctorId;
                const doctorName = doctor?.userId?.name || doctor?.name || "Dr. Doctor";
                const deptName = doctor?.departmentId?.name || doctor?.specialization || "General Medicine";

                const dateFormatted = new Date(visit.visitDate).toLocaleDateString("en-GB", {
                  day: "numeric",
                  month: "short",
                  year: "numeric",
                });
                const timeFormatted = new Date(visit.visitDate).toLocaleTimeString([], {
                  hour: "2-digit",
                  minute: "2-digit",
                  hour12: true,
                });

                return (
                  <tr
                    key={visit._id}
                    onClick={() => onSelectVisit(visit)}
                    className={`transition-colors cursor-pointer group ${
                      isSelected
                        ? "bg-blue-50/80 font-medium"
                        : "hover:bg-slate-50/70"
                    }`}
                  >
                    <td className="py-3 px-3.5 text-center font-semibold text-slate-400">
                      {rowNumber}
                    </td>

                    {/* Visit ID */}
                    <td className="py-3 px-3.5 font-mono font-medium text-slate-500 whitespace-nowrap">
                      {visit.visitId || `VIS-${index + 1}`}
                    </td>

                    {/* Patient Cell */}
                    <td className="py-3 px-3.5 whitespace-nowrap">
                      <div className="flex items-center gap-2.5">
                        {patient?.photoUrl ? (
                          <img
                            src={patient.photoUrl}
                            alt={patientName}
                            className="w-7 h-7 rounded-full object-cover shrink-0 border border-slate-200"
                          />
                        ) : (
                          <div className="w-7 h-7 rounded-full bg-blue-100 text-blue-700 font-bold text-[11px] flex items-center justify-center shrink-0">
                            {patientName.substring(0, 2).toUpperCase()}
                          </div>
                        )}
                        <div className="leading-tight">
                          <p className="font-bold text-slate-900">{patientName}</p>
                          <p className="text-[10px] text-slate-400">{patientUhid}</p>
                        </div>
                      </div>
                    </td>

                    {/* Doctor Cell */}
                    <td className="py-3 px-3.5 whitespace-nowrap">
                      <div className="flex items-center gap-2.5">
                        {doctor?.photoUrl ? (
                          <img
                            src={doctor.photoUrl}
                            alt={doctorName}
                            className="w-7 h-7 rounded-full object-cover shrink-0 border border-slate-200"
                          />
                        ) : (
                          <div className="w-7 h-7 rounded-full bg-purple-100 text-purple-700 font-bold text-[11px] flex items-center justify-center shrink-0">
                            {doctorName.replace("Dr. ", "").substring(0, 2).toUpperCase()}
                          </div>
                        )}
                        <div className="leading-tight">
                          <p className="font-bold text-slate-900">{doctorName}</p>
                          <p className="text-[10px] text-slate-400">{deptName}</p>
                        </div>
                      </div>
                    </td>

                    {/* Date & Time Cell */}
                    <td className="py-3 px-3.5 whitespace-nowrap">
                      <div className="leading-tight text-[11px]">
                        <p className="font-medium text-slate-800">{dateFormatted}</p>
                        <p className="text-slate-400 mt-0.5">{timeFormatted}</p>
                      </div>
                    </td>

                    {/* Status Badge Cell */}
                    <td className="py-3 px-3.5 whitespace-nowrap">
                      {visit.status === "in-progress" && (
                        <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-blue-50 text-blue-600 border border-blue-200">
                          In-Progress
                        </span>
                      )}
                      {visit.status === "completed" && (
                        <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-emerald-50 text-emerald-600 border border-emerald-200">
                          Completed
                        </span>
                      )}
                      {(visit.status === "walk-in" || visit.status === "registered" || visit.status === "scheduled") && (
                        <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-pink-50 text-pink-600 border border-pink-200">
                          Walk-in
                        </span>
                      )}
                      {visit.status === "cancelled" && (
                        <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-rose-50 text-rose-600 border border-rose-200">
                          Cancelled
                        </span>
                      )}
                    </td>

                    {/* Actions Cell */}
                    <td className="py-3 px-3.5 text-right whitespace-nowrap">
                      <OpdActionMenu
                        visit={visit}
                        onSelectVisit={onSelectVisit}
                        onStatusChange={onStatusChange}
                        onAssignDoctor={onAssignDoctor}
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
      <div className="p-3.5 border-t border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
        <p className="text-slate-500 font-medium text-[11px]">
          Showing {(page - 1) * 10 + 1} to {Math.min(page * 10, pagination?.total || visits.length)} of {pagination?.total || visits.length} entries
        </p>
        <div className="flex items-center gap-1 self-center sm:self-auto">
          <button
            disabled={page <= 1}
            onClick={() => setPage(page - 1)}
            className="p-1 rounded-lg border border-slate-200 text-slate-500 hover:bg-slate-50 disabled:opacity-40 cursor-pointer"
          >
            <ChevronLeft className="w-3.5 h-3.5" />
          </button>
          <button className="w-6 h-6 rounded-lg bg-blue-600 text-white font-bold text-xs flex items-center justify-center">
            {page}
          </button>
          <button
            disabled={page >= (pagination?.totalPages || 1)}
            onClick={() => setPage(page + 1)}
            className="p-1 rounded-lg border border-slate-200 text-slate-500 hover:bg-slate-50 disabled:opacity-40 cursor-pointer"
          >
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
}
