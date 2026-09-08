import React, { useState } from "react";
import Modal from "../../../../components/ui/Modal.jsx";
import { CreditCard, CheckCircle2 } from "lucide-react";
import CustomDropdown from "../../../../components/ui/CustomDropdown.jsx";

export default function CollectPaymentModal({ sale, isOpen, onClose, onSuccess }) {
  const [paymentMethod, setPaymentMethod] = useState("Cash");
  const [amount, setAmount] = useState(sale?.amount || sale?.grandTotal || 0);

  if (!sale) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    onSuccess?.(sale, { paymentMethod, amount: Number(amount) });
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Collect Pending Sale Payment"
      subtitle={`Invoice #${sale.invoiceNo} — Patient: ${sale.patientName || sale.customerName || "Walk-in Patient"}`}
      maxWidth="max-w-md"
    >
      <form onSubmit={handleSubmit} className="space-y-4 text-xs font-medium">
        <div className="p-3 bg-amber-50 border border-amber-200/80 rounded-xl text-[11px] text-amber-800 space-y-1">
          <p className="font-bold flex items-center gap-1.5">
            <CreditCard className="w-3.5 h-3.5 text-amber-600" />
            <span>Outstanding Payment Balance</span>
          </p>
          <p>Total Invoice Amount: <strong className="text-slate-900">₹ {Number(sale.amount || sale.grandTotal || 0).toFixed(2)}</strong></p>
        </div>

        <div>
          <label className="block font-bold text-slate-700 mb-1">Amount to Collect (₹)</label>
          <input
            type="number"
            step="0.01"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-xs font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
          />
        </div>

        <div>
          <CustomDropdown
            label="Payment Mode / Gateway"
            value={paymentMethod}
            options={[
              { label: "Cash Payment", value: "Cash" },
              { label: "UPI / QR Code", value: "UPI" },
              { label: "Debit / Credit Card", value: "Card" },
              { label: "Net Banking", value: "Net Banking" },
            ]}
            onChange={setPaymentMethod}
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
            className="px-5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold transition cursor-pointer flex items-center gap-1.5"
          >
            <CheckCircle2 className="w-4 h-4" />
            <span>Mark Payment Paid</span>
          </button>
        </div>
      </form>
    </Modal>
  );
}
