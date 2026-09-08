import React from "react";
import Modal from "../../../../components/ui/Modal.jsx";
import { Ban, Calendar, User, FileText, AlertCircle } from "lucide-react";

export default function InvoiceCancellationDetailsModal({ isOpen, onClose, invoice }) {
  if (!invoice) return null;

  const cancelInfo = invoice.cancellationInfo || {
    reason: invoice.voidReason || "Billing Adjustment / Order Cancelled",
    cancelledAt: invoice.updatedAt || invoice.createdAt || new Date().toISOString(),
    cancelledBy: "Billing Supervisor (Admin)",
    authCode: invoice.authCode || "AUTH-9920",
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Cancellation Audit Details"
      subtitle={`Invoice ID: ${invoice.invoiceNumber} — Status: Cancelled`}
      maxWidth="max-w-md"
    >
      <div className="space-y-4 text-xs font-medium">
        <div className="p-3.5 bg-rose-50 border border-rose-200/80 rounded-2xl flex items-center justify-between text-rose-900">
          <div className="flex items-center gap-2">
            <Ban className="w-4 h-4 text-rose-600 shrink-0" />
            <span className="font-bold">Invoice Status: Voided / Cancelled</span>
          </div>
          <span className="px-2 py-0.5 rounded-full bg-rose-200/80 text-[10px] font-extrabold text-rose-800">
            CANCELLED
          </span>
        </div>

        <div className="bg-slate-50 border border-slate-200/80 rounded-2xl p-4 space-y-3">
          <div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Cancellation Reason</span>
            <p className="font-bold text-slate-900 text-xs mt-0.5">{cancelInfo.reason}</p>
          </div>

          <div className="grid grid-cols-2 gap-3 pt-2 border-t border-slate-200/60">
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Cancelled By</span>
              <p className="font-semibold text-slate-800 flex items-center gap-1 mt-0.5">
                <User className="w-3 h-3 text-slate-400" />
                {cancelInfo.cancelledBy}
              </p>
            </div>
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Date & Time</span>
              <p className="font-semibold text-slate-800 flex items-center gap-1 mt-0.5">
                <Calendar className="w-3 h-3 text-slate-400" />
                {new Date(cancelInfo.cancelledAt).toLocaleDateString()}
              </p>
            </div>
          </div>

          {cancelInfo.authCode && (
            <div className="pt-2 border-t border-slate-200/60">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Auth Reference Code</span>
              <p className="font-mono font-bold text-slate-700 text-xs mt-0.5">{cancelInfo.authCode}</p>
            </div>
          )}
        </div>

        {/* Modal Action Footer */}
        <div className="pt-3 border-t border-slate-100 flex justify-end">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs rounded-xl transition cursor-pointer"
          >
            Close
          </button>
        </div>
      </div>
    </Modal>
  );
}
