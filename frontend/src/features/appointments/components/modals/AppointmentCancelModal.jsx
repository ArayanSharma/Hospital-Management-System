import React, { useState } from "react";
import Modal from "../../../../components/ui/Modal.jsx";
import { AlertTriangle } from "lucide-react";

export default function AppointmentCancelModal({ appointment, isOpen, onClose, onConfirmCancel, submitting }) {
  const [cancelledReason, setCancelledReason] = useState("");

  if (!appointment) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    onConfirmCancel(appointment, cancelledReason || "Patient requested cancellation");
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Cancel Appointment"
      subtitle={`Cancel appointment for ${appointment.patientId?.name || "Patient"}`}
      maxWidth="max-w-md"
    >
      <form onSubmit={handleSubmit} className="space-y-4 text-xs">
        <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl flex items-center gap-3 text-rose-800">
          <AlertTriangle className="w-5 h-5 text-rose-600 shrink-0" />
          <p className="font-semibold leading-tight">
            Are you sure you want to cancel this appointment? This action will mark the slot as vacant.
          </p>
        </div>

        <div className="space-y-1.5">
          <label className="block text-xs font-bold text-slate-700">Cancellation Reason <span className="text-rose-500">*</span></label>
          <textarea
            required
            rows={3}
            value={cancelledReason}
            onChange={(e) => setCancelledReason(e.target.value)}
            placeholder="Enter reason for cancellation (e.g. Patient emergency, Doctor unavailable, Duplicate booking)..."
            className="w-full bg-white border border-slate-200 text-slate-800 text-xs font-medium p-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-rose-500/20"
          />
        </div>

        <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-xl border border-slate-200 font-semibold text-slate-600 hover:bg-slate-50 transition cursor-pointer"
          >
            Keep Appointment
          </button>
          <button
            type="submit"
            disabled={submitting}
            className="px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-bold transition cursor-pointer disabled:opacity-50"
          >
            {submitting ? "Cancelling..." : "Confirm Cancel Appointment"}
          </button>
        </div>
      </form>
    </Modal>
  );
}
