import React, { useState } from "react";
import Modal from "../../../../components/ui/Modal.jsx";
import { AlertTriangle, Ban } from "lucide-react";

export default function InvoiceVoidModal({ isOpen, onClose, invoice, onSuccess }) {
  const [voidReason, setVoidReason] = useState("Duplicate Invoice Entry");
  const [authCode, setAuthCode] = useState("");

  if (!invoice) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    onSuccess?.(invoice, { voidReason, authCode });
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Void / Cancel Invoice"
      subtitle={`Invoice: ${invoice.invoiceNumber} — Total: ₹ ${(invoice.total || 0).toLocaleString("en-IN")}`}
      maxWidth="max-w-md"
    >
      <form onSubmit={handleSubmit} className="space-y-4 text-xs font-medium">
        <div className="p-3.5 bg-rose-50 border border-rose-200/80 rounded-2xl flex items-start gap-3 text-rose-800">
          <AlertTriangle className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
          <div className="leading-tight">
            <h5 className="font-bold text-xs">Warning: Critical Audit Action</h5>
            <p className="text-[11px] text-rose-700 mt-0.5">
              Voiding an invoice will reverse all financial ledger entries and mark the status as <strong>Cancelled</strong>.
            </p>
          </div>
        </div>

        {/* Void Reason */}
        <div>
          <label className="block text-slate-700 font-bold mb-1">Reason for Voiding Invoice</label>
          <select
            value={voidReason}
            onChange={(e) => setVoidReason(e.target.value)}
            className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-semibold text-slate-800 focus:outline-none focus:border-blue-500 cursor-pointer"
          >
            <option value="Duplicate Invoice Entry">Duplicate Invoice Entry</option>
            <option value="Billing Error / Wrong Patient">Billing Error / Wrong Patient</option>
            <option value="Services Not Rendered">Services Not Rendered</option>
            <option value="Admin Authorization Cancel">Admin Authorization Cancel</option>
          </select>
        </div>

        {/* Authorization Pin / Notes */}
        <div>
          <label className="block text-slate-700 font-bold mb-1">Supervisor Authorization Code / Remarks</label>
          <input
            type="text"
            value={authCode}
            onChange={(e) => setAuthCode(e.target.value)}
            placeholder="Enter admin authorization code or remarks..."
            className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-800 focus:outline-none focus:border-blue-500"
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
            <Ban className="w-3.5 h-3.5" />
            <span>Confirm Void Invoice</span>
          </button>
        </div>
      </form>
    </Modal>
  );
}
