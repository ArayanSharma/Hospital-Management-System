import React, { useState, useEffect } from "react";
import { Bed as BedIcon, User, Wrench, X, CheckCircle2 } from "lucide-react";
import api from "../../../lib/axios.js";
import Loading from "../../../components/common/Loading.jsx";

export default function IpdBedDetailsModal({ bed: initialBed, onClose, onAdmitNew }) {
  const [bedDetails, setBedDetails] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!initialBed?._id && !initialBed?.id) {
      setBedDetails(null);
      return;
    }

    const bedId = initialBed._id || initialBed.id;
    const fetchBed = async () => {
      setLoading(true);
      try {
        const { data } = await api.get(`/beds/${bedId}`);
        setBedDetails(data.data);
      } catch (err) {
        setBedDetails(initialBed);
      } finally {
        setLoading(false);
      }
    };

    fetchBed();
  }, [initialBed]);

  if (!initialBed) return null;

  const currentBed = bedDetails || initialBed;
  const wardName = currentBed.wardId?.name || "General Ward";
  const floorName = currentBed.wardId?.floor || "Floor 1";
  const activeAdm = currentBed.activeAdmission;

  const patientName = activeAdm?.patientId?.name || currentBed.currentPatientId?.name || "Patient";
  const patientUhid = activeAdm?.patientId?.patientId || currentBed.currentPatientId?.patientId || "PAT-000123";
  const doctorName = activeAdm?.doctorId?.userId?.name || activeAdm?.doctorId?.name || "Attending Doctor";

  const admDateFormatted = activeAdm?.admissionDate
    ? new Date(activeAdm.admissionDate).toLocaleDateString("en-GB", {
        day: "numeric",
        month: "short",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      })
    : "Recently Admitted";

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl border border-slate-200/90 shadow-xl max-w-md w-full p-5 space-y-4">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-blue-100 text-blue-600 flex items-center justify-center font-bold">
              <BedIcon className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-900">Bed Details — {currentBed.bedNumber}</h3>
              <p className="text-[11px] text-slate-400 capitalize">Status: {currentBed.status}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-700 text-sm font-semibold cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content */}
        {loading ? (
          <Loading message="Loading bed details..." />
        ) : (
          <div className="space-y-3 text-xs">
            <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl space-y-1.5">
              <div className="flex justify-between">
                <span className="text-slate-500 font-medium">Bed Number</span>
                <span className="font-mono font-bold text-slate-900">{currentBed.bedNumber}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500 font-medium">Room / Ward Type</span>
                <span className="font-semibold text-slate-800">{wardName} ({floorName})</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500 font-medium">Bed Status</span>
                <span
                  className={`font-bold capitalize ${
                    currentBed.status === "available"
                      ? "text-emerald-600"
                      : currentBed.status === "occupied"
                      ? "text-rose-600"
                      : "text-amber-600"
                  }`}
                >
                  {currentBed.status}
                </span>
              </div>
            </div>

            {currentBed.status === "occupied" && (
              <div className="p-3 bg-rose-50/50 border border-rose-200 rounded-xl space-y-1.5">
                <div className="flex items-center gap-2 text-rose-700 font-bold">
                  <User className="w-4 h-4" />
                  <span>Currently Occupied — {patientName}</span>
                </div>
                <div className="flex justify-between pt-1 text-[11px]">
                  <span className="text-slate-500">Patient ID / UHID</span>
                  <span className="font-mono font-bold text-slate-800">{patientUhid}</span>
                </div>
                <div className="flex justify-between text-[11px]">
                  <span className="text-slate-500">Admitted Date</span>
                  <span className="font-semibold text-slate-800">{admDateFormatted}</span>
                </div>
                <div className="flex justify-between text-[11px]">
                  <span className="text-slate-500">Attending Doctor</span>
                  <span className="font-semibold text-slate-800">{doctorName}</span>
                </div>
              </div>
            )}

            {currentBed.status === "available" && (
              <div className="p-3 bg-emerald-50/50 border border-emerald-200 rounded-xl text-center space-y-2">
                <p className="text-emerald-700 font-bold">Available for Admission</p>
                <p className="text-[11px] text-slate-500">
                  This bed is clean, disinfected, and ready for patient admission.
                </p>
              </div>
            )}

            {currentBed.status === "maintenance" && (
              <div className="p-3 bg-amber-50/50 border border-amber-200 rounded-xl text-center space-y-1">
                <p className="text-amber-700 font-bold flex items-center justify-center gap-1">
                  <Wrench className="w-3.5 h-3.5" /> Under Maintenance
                </p>
                <p className="text-[11px] text-slate-500">
                  {currentBed.maintenanceReason || "Routine sanitization & equipment check"}
                </p>
              </div>
            )}
          </div>
        )}

        {/* Footer */}
        <div className="pt-2 border-t border-slate-100 flex items-center justify-end gap-2">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold cursor-pointer"
          >
            Close
          </button>
          {currentBed.status === "available" && (
            <button
              type="button"
              onClick={() => {
                onClose();
                if (onAdmitNew) onAdmitNew();
              }}
              className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold shadow-sm shadow-blue-500/20 cursor-pointer flex items-center gap-1.5"
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>Admit Patient to Bed</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
