import React from "react";
import Modal from "../../../../components/ui/Modal.jsx";
import { XCircle, AlertCircle } from "lucide-react";
import { formatDate, formatTime } from "../../../../utils/formatters.js";

export default function LabCancellationDetailsModal({ test, isOpen, onClose }) {
  if (!test) return null;

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Lab Order Cancellation Record"
      subtitle={`Order #${test.orderId || test._id}`}
      maxWidth="max-w-md"
    >
      <div className="space-y-4 text-xs">
        <div className="p-3.5 bg-rose-50 border border-rose-200 rounded-2xl flex items-center gap-3 text-rose-900">
          <XCircle className="w-6 h-6 text-rose-600 shrink-0" />
          <div>
            <p className="font-extrabold text-sm text-rose-900">Order Cancelled</p>
            <p className="text-[11px] text-rose-700 font-semibold mt-0.5">
              Cancelled On: {formatDate(test.updatedAt || new Date())} ({formatTime(test.updatedAt || new Date())})
            </p>
          </div>
        </div>

        <div className="p-4 bg-white border border-slate-200 rounded-2xl space-y-1.5 shadow-2xs">
          <p className="font-bold text-slate-700 text-[11px]">Reason for Cancellation:</p>
          <p className="text-slate-800 font-medium leading-relaxed bg-slate-50 p-2.5 rounded-xl border border-slate-200">
            {test.cancellationReason || test.clinicalNotes || "Order cancelled by attending doctor / laboratory manager."}
          </p>
        </div>
      </div>
    </Modal>
  );
}
