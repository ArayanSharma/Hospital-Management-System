import React, { useState, useRef, useEffect } from "react";
import {
  Eye,
  Edit2,
  MoreVertical,
  FileText,
  Calendar,
  Receipt,
  FlaskConical,
  Scan,
  UserX,
  UserCheck,
} from "lucide-react";

export default function PatientActionMenu({
  patient,
  onEdit,
  onView,
  onToggleStatus,
  navigate,
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

  const isActive = patient.status === "active";

  return (
    <div className="flex items-center justify-end gap-1.5" ref={ref}>
      {/* 1. View Button */}
      <button
        type="button"
        onClick={() => onView(patient)}
        className="p-1.5 rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-100 hover:text-blue-600 transition cursor-pointer shadow-2xs"
        title="View Patient Details"
      >
        <Eye className="w-3.5 h-3.5" />
      </button>

      {/* 2. Edit Button */}
      <button
        type="button"
        onClick={() => onEdit(patient)}
        className="p-1.5 rounded-lg border border-slate-200 text-blue-600 hover:bg-blue-50 transition cursor-pointer shadow-2xs"
        title="Edit Patient"
      >
        <Edit2 className="w-3.5 h-3.5" />
      </button>

      {/* 3. More Actions Dropdown */}
      <div className="relative inline-block text-left">
        <button
          type="button"
          onClick={() => setIsOpen(!isOpen)}
          className={`p-1.5 rounded-lg border text-slate-500 hover:bg-slate-100 hover:text-slate-800 transition cursor-pointer shadow-2xs ${
            isOpen ? "border-blue-500 bg-blue-50/50 ring-2 ring-blue-500/10 text-blue-600" : "border-slate-200"
          }`}
          title="More Patient Actions"
        >
          <MoreVertical className="w-3.5 h-3.5" />
        </button>

        {isOpen && (
          <div className="absolute right-0 mt-1.5 w-52 bg-white border border-slate-200/90 rounded-2xl shadow-xl z-50 p-1.5 text-xs space-y-0.5 animate-in fade-in zoom-in-95 origin-top-right">
            <button
              type="button"
              onClick={() => {
                setIsOpen(false);
                navigate(`/patients/${patient._id}?tab=history`);
              }}
              className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-left font-semibold text-slate-700 hover:bg-blue-50/70 hover:text-blue-700 transition cursor-pointer"
            >
              <FileText className="w-4 h-4 text-blue-600 shrink-0" />
              <span>Medical History</span>
            </button>

            <button
              type="button"
              onClick={() => {
                setIsOpen(false);
                navigate(`/appointments?patientId=${patient._id}`);
              }}
              className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-left font-semibold text-slate-700 hover:bg-cyan-50/70 hover:text-cyan-700 transition cursor-pointer"
            >
              <Calendar className="w-4 h-4 text-cyan-600 shrink-0" />
              <span>Appointments</span>
            </button>

            <button
              type="button"
              onClick={() => {
                setIsOpen(false);
                navigate(`/billing?patientId=${patient._id}`);
              }}
              className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-left font-semibold text-slate-700 hover:bg-teal-50/70 hover:text-teal-700 transition cursor-pointer"
            >
              <Receipt className="w-4 h-4 text-teal-600 shrink-0" />
              <span>Billing</span>
            </button>

            <button
              type="button"
              onClick={() => {
                setIsOpen(false);
                navigate(`/laboratory?patientId=${patient._id}`);
              }}
              className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-left font-semibold text-slate-700 hover:bg-indigo-50/70 hover:text-indigo-700 transition cursor-pointer"
            >
              <FlaskConical className="w-4 h-4 text-indigo-600 shrink-0" />
              <span>Lab Reports</span>
            </button>

            <button
              type="button"
              onClick={() => {
                setIsOpen(false);
                navigate(`/radiology?patientId=${patient._id}`);
              }}
              className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-left font-semibold text-slate-700 hover:bg-purple-50/70 hover:text-purple-700 transition cursor-pointer"
            >
              <Scan className="w-4 h-4 text-purple-600 shrink-0" />
              <span>Radiology Reports</span>
            </button>

            <div className="my-1 border-t border-slate-100"></div>

            <button
              type="button"
              onClick={() => {
                setIsOpen(false);
                onToggleStatus(patient);
              }}
              className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-left font-semibold transition cursor-pointer ${
                isActive ? "text-amber-700 hover:bg-amber-50" : "text-emerald-700 hover:bg-emerald-50"
              }`}
            >
              {isActive ? (
                <>
                  <UserX className="w-4 h-4 text-amber-600 shrink-0" />
                  <span>Deactivate Patient</span>
                </>
              ) : (
                <>
                  <UserCheck className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>Activate Patient</span>
                </>
              )}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
