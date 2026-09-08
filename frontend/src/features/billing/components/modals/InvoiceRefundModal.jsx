import React, { useState } from "react";
import Modal from "../../../../components/ui/Modal.jsx";
import { AlertCircle, RefreshCw, DollarSign, FileText } from "lucide-react";

export default function InvoiceRefundModal({ isOpen, onClose, invoice, onSuccess }) {
  const maxRefund = invoice?.amountPaid || invoice?.total || 0;
  const [refundAmount, setRefundAmount] = useState(maxRefund);
  const [refundReason, setRefundReason] = useState("Patient Request");
  const [refundMethod, setRefundMethod] = useState("Cash");

  if (!invoice) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    onSuccess?.(invoice, { refundAmount: Number(refundAmount), refundReason, refundMethod });
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Refund / Credit Note"
      subtitle={`Invoice: ${invoice.invoiceNumber} — Patient: ${invoice.patientName || "Patient"}`}
      maxWidth="max-w-md"
    >
      <form onSubmit={handleSubmit} className="space-y-4 text-xs font-medium">
        <div className="p-3.5 bg-amber-50 border border-amber-200/80 rounded-2xl flex items-center justify-between">
          <div className="flex items-center gap-2 text-amber-800 font-bold">
            <AlertCircle className="w-4 h-4 text-amber-600 shrink-0" />
            <span>Eligible Refund Amount</span>
          </div>
          <span className="font-extrabold text-amber-900 text-sm">₹ {maxRefund.toLocaleString("en-IN")}</span>
        </div>

        {/* Refund Amount Input */}
        <div>
          <label className="block text-slate-700 font-bold mb-1">Refund Amount (INR)</label>
          <input
            type="number"
            max={maxRefund}
            min={1}
            value={refundAmount}
            onChange={(e) => setRefundAmount(e.target.value)}
            className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-bold text-slate-800 focus:outline-none focus:border-blue-500"
            required
          />
        </div>

        {/* Refund Method */}
        <div>
          <label className="block text-slate-700 font-bold mb-1">Refund Return Method</label>
          <select
            value={refundMethod}
            onChange={(e) => setRefundMethod(e.target.value)}
            className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-semibold text-slate-800 focus:outline-none focus:border-blue-500 cursor-pointer"
          >
            <option value="Cash">Cash Return</option>
            <option value="Bank Transfer">Bank Transfer / NEFT</option>
            <option value="UPI">UPI Original Payment Mode</option>
            <option value="Credit Note">Generate Store Credit Note</option>
          </select>
        </div>

        {/* Refund Reason */}
        <div>
          <label className="block text-slate-700 font-bold mb-1">Reason for Refund / Credit Note</label>
          <textarea
            rows={2}
            value={refundReason}
            onChange={(e) => setRefundReason(e.target.value)}
            placeholder="Specify reason for patient refund..."
            className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs text-slate-800 focus:outline-none focus:border-blue-500"
            required
          />
        </div>

        {/* Modal Action Footer */}
        <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-2">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs rounded-xl transition cursor-pointer"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="px-4 py-2 bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs rounded-xl shadow-xs transition cursor-pointer flex items-center gap-1.5"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>Process Refund</span>
          </button>
        </div>
      </form>
    </Modal>
  );
}
