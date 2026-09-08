import React, { useState } from "react";
import Modal from "../../../../components/ui/Modal.jsx";
import { AlertTriangle } from "lucide-react";

export default function OpdCancelVisitModal({ visit, isOpen, onClose, onConfirmCancel, submitting }) {
  const [cancelledReason, setCancelledReason] = useState("");

  if (!visit) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    onConfirmCancel(visit, cancelledReason || "Patient requested cancellation");
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Cancel OPD Visit"
      subtitle={`Cancel OPD visit #${visit.visitId || visit._id} for ${visit.patientId?.name || "Patient"}`}
      maxWidth="max-w-md"
    >
      <form onSubmit={handleSubmit} className="space-y-4 text-xs">
        <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl flex items-center gap-3 text-rose-800">
          <AlertTriangle className="w-5 h-5 text-rose-600 shrink-0" />
          <p className="font-semibold leading-tight">
            Are you sure you want to cancel this OPD visit?
          </p>
        </div>

        <div className="space-y-1.5">
          <label className="block text-xs font-bold text-slate-700">Cancellation Reason <span className="text-rose-500">*</span></label>
          <textarea
            required
            rows={3}
            value={cancelledReason}
            onChange={(e) => setCancelledReason(e.target.value)}
            placeholder="Enter cancellation reason (e.g. Patient left, Registered by mistake, Transferred to Emergency)..."
            className="w-full bg-white border border-slate-200 text-slate-800 text-xs font-medium p-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-rose-500/20"
          />
        </div>

        <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-xl border border-slate-200 font-semibold text-slate-600 hover:bg-slate-50 transition cursor-pointer"
          >
            Keep Visit
          </button>
          <button
            type="submit"
            disabled={submitting}
            className="px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-bold transition cursor-pointer disabled:opacity-50"
          >
            {submitting ? "Cancelling..." : "Confirm Cancel Visit"}
          </button>
        </div>
      </form>
    </Modal>
  );
}
