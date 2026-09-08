import React, { useState } from "react";
import Modal from "../../../../components/ui/Modal.jsx";
import { AlertTriangle, XCircle } from "lucide-react";
import { updateLabTestStatusApi } from "../../services/labTest.api.js";

export default function LabCancelOrderModal({ test, isOpen, onClose, onSuccess }) {
  const [reason, setReason] = useState("");
  const [submitting, setSubmitting] = useState(false);

  if (!test) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!reason.trim()) return;
    setSubmitting(true);
    try {
      await updateLabTestStatusApi(test._id, { status: "cancelled", cancellationReason: reason });
      onClose();
      if (onSuccess) onSuccess();
    } catch (err) {
      alert(err.response?.data?.message || "Failed to cancel test order");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Cancel Lab Test Order"
      subtitle={`Order #${test.orderId || test._id}`}
      maxWidth="max-w-md"
    >
      <form onSubmit={handleSubmit} className="space-y-4 text-xs">
        <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl flex items-center gap-3 text-rose-800">
          <AlertTriangle className="w-5 h-5 text-rose-600 shrink-0" />
          <p className="leading-tight font-medium">
            Are you sure you want to cancel test order <span className="font-bold">{test.testName}</span> for{" "}
            <span className="font-bold">{test.patientId?.name}</span>?
          </p>
        </div>

        <div className="space-y-1.5">
          <label className="block font-bold text-slate-700">
            Cancellation Reason <span className="text-rose-500">*</span>
          </label>
          <textarea
            rows={3}
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            placeholder="Please specify why this order is being cancelled..."
            className="w-full bg-white border border-slate-200 text-slate-800 p-2.5 rounded-xl focus:outline-none resize-none"
            required
          />
        </div>

        <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-xl border border-slate-200 font-semibold text-slate-600 hover:bg-slate-50 cursor-pointer"
          >
            Back
          </button>
          <button
            type="submit"
            disabled={submitting || !reason.trim()}
            className="px-5 py-2 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-bold transition cursor-pointer flex items-center gap-1.5 disabled:opacity-50"
          >
            <XCircle className="w-4 h-4" />
            <span>{submitting ? "Cancelling..." : "Confirm Cancel"}</span>
          </button>
        </div>
      </form>
    </Modal>
  );
}
