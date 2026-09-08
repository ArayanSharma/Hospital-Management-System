import React, { useState } from "react";
import Modal from "../../../../components/ui/Modal.jsx";
import { RotateCcw, CheckCircle2 } from "lucide-react";
import CustomDropdown from "../../../../components/ui/CustomDropdown.jsx";

export default function ReturnRefundModal({ sale, isOpen, onClose, onSuccess }) {
  const [returnReason, setReturnReason] = useState("Doctor Change of Prescription");
  const [refundMode, setRefundMode] = useState("Cash Refund");
  const [refundAmount, setRefundAmount] = useState(sale?.amount || sale?.grandTotal || 0);

  if (!sale) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    onSuccess?.(sale, { returnReason, refundMode, refundAmount: Number(refundAmount) });
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Process Medicine Return & Refund"
      subtitle={`Invoice #${sale.invoiceNo} — Patient: ${sale.patientName || sale.customerName || "Walk-in Patient"}`}
      maxWidth="max-w-md"
    >
      <form onSubmit={handleSubmit} className="space-y-4 text-xs font-medium">
        <div>
          <CustomDropdown
            label="Return Reason"
            value={returnReason}
            options={[
              { label: "Doctor Change of Prescription", value: "Doctor Change of Prescription" },
              { label: "Patient Discharged Early", value: "Patient Discharged Early" },
              { label: "Incorrect Medicine Dispensed", value: "Incorrect Medicine Dispensed" },
              { label: "Damaged / Defective Packaging", value: "Damaged / Defective Packaging" },
            ]}
            onChange={setReturnReason}
            fullWidth
          />
        </div>

        <div>
          <label className="block font-bold text-slate-700 mb-1">Refund Amount (₹)</label>
          <input
            type="number"
            step="0.01"
            value={refundAmount}
            onChange={(e) => setRefundAmount(e.target.value)}
            className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-xs font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-rose-500/20"
          />
        </div>

        <div>
          <CustomDropdown
            label="Refund Payment Method"
            value={refundMode}
            options={[
              { label: "Cash Refund", value: "Cash Refund" },
              { label: "Bank / UPI Credit", value: "Bank / UPI Credit" },
              { label: "Patient Wallet Balance", value: "Patient Wallet Balance" },
            ]}
            onChange={setRefundMode}
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
            className="px-5 py-2 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-bold transition cursor-pointer flex items-center gap-1.5"
          >
            <RotateCcw className="w-4 h-4" />
            <span>Process Refund</span>
          </button>
        </div>
      </form>
    </Modal>
  );
}
