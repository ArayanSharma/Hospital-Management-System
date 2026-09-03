import React, { useState, useEffect } from "react";
import Modal from "../../../../components/ui/Modal.jsx";
import { Calendar, Clock, AlertCircle } from "lucide-react";
import api from "../../../../lib/axios.js";

export default function RadiologyScheduleModal({ order, isOpen, onClose, onSuccess }) {
  const [scheduledDate, setScheduledDate] = useState("");
  const [scheduledTime, setScheduledTime] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  useEffect(() => {
    if (order?.scheduledAt) {
      const dt = new Date(order.scheduledAt);
      setScheduledDate(dt.toISOString().split("T")[0]);
      setScheduledTime(dt.toTimeString().slice(0, 5));
    } else {
      const today = new Date().toISOString().split("T")[0];
      setScheduledDate(today);
      setScheduledTime("10:00");
    }
  }, [order]);

  if (!order) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setErrorMsg("");

    try {
      const fullDateTime = new Date(`${scheduledDate}T${scheduledTime}:00`);
      await api.patch(`/radiology-tests/${order._id}`, {
        status: "scheduled",
        scheduledAt: fullDateTime.toISOString(),
      });
      onClose();
      if (onSuccess) onSuccess();
    } catch (err) {
      setErrorMsg(err.response?.data?.message || "Failed to schedule scan");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={order.status === "scheduled" ? "Reschedule Radiology Scan" : "Schedule Radiology Scan"}
      subtitle={`Order #${order.orderId || order._id}`}
      maxWidth="max-w-md"
    >
      <form onSubmit={handleSubmit} className="space-y-4 text-xs">
        <div className="p-3 bg-blue-50 border border-blue-200 rounded-xl text-blue-900 font-semibold">
          <p className="font-bold">Modality: {order.modality || "X-Ray"} ({order.bodyRegion || "Chest"})</p>
          <p className="text-[11px] text-blue-700 mt-0.5">Patient: {order.patientId?.name || order.patientName || "N/A"}</p>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div className="space-y-1.5">
            <label className="block font-bold text-slate-700">Scan Date</label>
            <input
              type="date"
              value={scheduledDate}
              onChange={(e) => setScheduledDate(e.target.value)}
              className="w-full bg-white border border-slate-200 text-slate-800 font-semibold p-2.5 rounded-xl focus:outline-none"
              required
            />
          </div>

          <div className="space-y-1.5">
            <label className="block font-bold text-slate-700">Time Slot</label>
            <input
              type="time"
              value={scheduledTime}
              onChange={(e) => setScheduledTime(e.target.value)}
              className="w-full bg-white border border-slate-200 text-slate-800 font-semibold p-2.5 rounded-xl focus:outline-none"
              required
            />
          </div>
        </div>

        {errorMsg && (
          <div className="p-3 bg-rose-50 border border-rose-200 text-rose-700 rounded-xl font-semibold flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{errorMsg}</span>
          </div>
        )}

        <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-xl border border-slate-200 font-semibold text-slate-600 hover:bg-slate-50 cursor-pointer"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={submitting}
            className="px-5 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold transition cursor-pointer flex items-center gap-1.5 disabled:opacity-50"
          >
            <Calendar className="w-4 h-4" />
            <span>{submitting ? "Scheduling..." : "Confirm Schedule"}</span>
          </button>
        </div>
      </form>
    </Modal>
  );
}
