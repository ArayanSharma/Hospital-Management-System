import React, { useState } from "react";
import Modal from "../../../../components/ui/Modal.jsx";
import { AlertTriangle, XCircle } from "lucide-react";
import api from "../../../../lib/axios.js";

export default function RadiologyCancelModal({ order, isOpen, onClose, onSuccess }) {
  const [reason, setReason] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  if (!order) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!reason.trim()) return;
    setSubmitting(true);
    setErrorMsg("");

    try {
      await api.patch(`/radiology-tests/${order._id}`, {
        status: "cancelled",
        cancellationReason: reason,
      });
      onClose();
      if (onSuccess) onSuccess();
    } catch (err) {
      setErrorMsg(err.response?.data?.message || "Failed to cancel radiology scan order");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Cancel Radiology Scan Order"
      subtitle={`Order #${order.orderId || order._id}`}
      maxWidth="max-w-md"
    >
      <form onSubmit={handleSubmit} className="space-y-4 text-xs">
        <div className="p-3.5 bg-rose-50 border border-rose-200 rounded-2xl flex items-start gap-3 text-rose-900">
          <AlertTriangle className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
          <div className="leading-tight">
            <p className="font-extrabold text-sm text-rose-900">Confirm Order Cancellation</p>
            <p className="text-[11px] text-rose-700 font-semibold mt-0.5">
              Cancelling this scan will update its status to &quot;Cancelled&quot;. Please provide a reason below.
            </p>
          </div>
        </div>

        <div className="space-y-1.5">
          <label className="block font-bold text-slate-700">Reason for Cancellation</label>
          <textarea
            rows={3}
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            placeholder="e.g. Patient non-cooperative, equipment maintenance, duplicate order..."
            className="w-full bg-white border border-slate-200 text-slate-800 p-2.5 rounded-xl focus:outline-none resize-none font-medium"
            required
          />
        </div>

        {errorMsg && (
          <div className="p-3 bg-rose-50 border border-rose-200 text-rose-700 rounded-xl font-semibold">
            {errorMsg}
          </div>
        )}

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
