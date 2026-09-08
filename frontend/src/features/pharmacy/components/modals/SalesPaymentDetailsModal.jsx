import React from "react";
import Modal from "../../../../components/ui/Modal.jsx";
import { CreditCard, CheckCircle2, Calendar, FileText } from "lucide-react";

export default function SalesPaymentDetailsModal({ sale, isOpen, onClose }) {
  if (!sale) return null;

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Payment & Transaction Details"
      subtitle={`Invoice #${sale.invoiceNo} — Patient: ${sale.patientName || sale.customerName || "Walk-in Patient"}`}
      maxWidth="max-w-md"
    >
      <div className="space-y-4 text-xs font-medium">
        <div className="p-3.5 bg-slate-50 border border-slate-200/80 rounded-2xl space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-slate-500">Invoice Number:</span>
            <span className="font-extrabold text-blue-600">{sale.invoiceNo}</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-slate-500">Payment Status:</span>
            <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
              sale.paymentStatus === "Paid"
                ? "bg-emerald-100 text-emerald-700"
                : "bg-amber-100 text-amber-700"
            }`}>
              {sale.paymentStatus || "Paid"}
            </span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-slate-500">Payment Mode:</span>
            <span className="font-bold text-slate-800">{sale.paymentMethod || "Cash"}</span>
          </div>
          <div className="flex items-center justify-between pt-2 border-t border-slate-200/70">
            <span className="font-bold text-slate-700">Total Paid Amount:</span>
            <span className="text-sm font-extrabold text-slate-900">
              ₹ {Number(sale.amount || sale.grandTotal || 0).toLocaleString("en-IN", { minimumFractionDigits: 2 })}
            </span>
          </div>
        </div>

        <div className="space-y-2">
          <p className="font-bold text-slate-700 flex items-center gap-1.5">
            <FileText className="w-4 h-4 text-blue-600" />
            <span>Dispensed Items Summary</span>
          </p>
          <div className="bg-slate-50 border border-slate-200/80 rounded-2xl p-3 text-[11px] space-y-1 text-slate-600">
            <p>Patient ID: <strong className="text-slate-800">{sale.patientId || "WALK-IN"}</strong></p>
            <p>Prescription Ref: <strong className="text-slate-800">#RX-9902</strong></p>
            <p>Dispensed Date: <strong className="text-slate-800">{sale.date || "Today"} {sale.time || ""}</strong></p>
          </div>
        </div>
      </div>
    </Modal>
  );
}
