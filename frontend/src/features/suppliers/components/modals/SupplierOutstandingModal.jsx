import React, { useState } from "react";
import Modal from "../../../../components/ui/Modal.jsx";
import { AlertCircle, CheckCircle2, DollarSign } from "lucide-react";
import CustomDropdown from "../../../../components/ui/CustomDropdown.jsx";

export default function SupplierOutstandingModal({ supplier, isOpen, onClose, onSuccess }) {
  const [paymentMode, setPaymentMode] = useState("NEFT Bank Transfer");
  const [payAmount, setPayAmount] = useState(supplier?.outstandingBalance || 45000);

  if (!supplier) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    onSuccess?.(supplier, { paymentMode, payAmount: Number(payAmount) });
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Settle Vendor Outstanding Dues"
      subtitle={`${supplier.name} — Contact: ${supplier.contactPerson || "Manager"}`}
      maxWidth="max-w-md"
    >
      <form onSubmit={handleSubmit} className="space-y-4 text-xs font-medium">
        <div className="p-3.5 bg-amber-50 border border-amber-200/80 rounded-2xl flex items-center justify-between">
          <div className="flex items-center gap-2 text-amber-800 font-bold">
            <AlertCircle className="w-4 h-4 text-amber-600 shrink-0" />
            <span>Total Outstanding Dues:</span>
          </div>
          <span className="text-sm font-extrabold text-amber-900">
            ₹ {(supplier.outstandingBalance || 45000).toLocaleString("en-IN")}
          </span>
        </div>

        <div>
          <label className="block font-bold text-slate-700 mb-1">Disbursement Amount to Pay (₹)</label>
          <input
            type="number"
            step="0.01"
            value={payAmount}
            onChange={(e) => setPayAmount(e.target.value)}
            className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-xs font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
          />
        </div>

        <div>
          <CustomDropdown
            label="Payment Disbursement Mode"
            value={paymentMode}
            options={[
              { label: "NEFT Bank Transfer", value: "NEFT Bank Transfer" },
              { label: "RTGS Online", value: "RTGS Online" },
              { label: "Corporate Cheque", value: "Corporate Cheque" },
              { label: "UPI Business", value: "UPI Business" },
            ]}
            onChange={setPaymentMode}
            fullWidth
          />
        </div>

        <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-xl border border-slate-200 font-bold text-slate-600 hover:bg-slate-50 cursor-pointer"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="px-5 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold transition cursor-pointer flex items-center gap-1.5"
          >
            <CheckCircle2 className="w-4 h-4" />
            <span>Settle & Disburse Dues</span>
          </button>
        </div>
      </form>
    </Modal>
  );
}
