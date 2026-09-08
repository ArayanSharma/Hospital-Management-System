import React from "react";
import Modal from "../../../../components/ui/Modal.jsx";
import { ClipboardList, CheckCircle2, DollarSign, Ban } from "lucide-react";

export default function SalesTransactionHistoryModal({ sale, isOpen, onClose }) {
  if (!sale) return null;

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Sales Transaction History & Audit Trail"
      subtitle={`Invoice #${sale.invoiceNo} — Patient: ${sale.patientName || sale.customerName || "Walk-in Patient"}`}
      maxWidth="max-w-md"
    >
      <div className="space-y-4 text-xs font-medium">
        <div className="space-y-2">
          <p className="font-bold text-slate-700 flex items-center gap-1.5">
            <ClipboardList className="w-4 h-4 text-purple-600" />
            <span>Timeline Events</span>
          </p>

          <div className="bg-slate-50 border border-slate-200/80 rounded-2xl p-3 space-y-2">
            <div className="p-2.5 bg-white border border-slate-200/70 rounded-xl flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-7 h-7 rounded-lg bg-blue-100 text-blue-600 flex items-center justify-center">
                  <CheckCircle2 className="w-4 h-4" />
                </div>
                <div>
                  <p className="font-bold text-slate-800">Pharmacy Order Created</p>
                  <p className="text-[10px] text-slate-500">Dispensed by Pharmacist Admin</p>
                </div>
              </div>
              <span className="font-mono text-[10px] text-slate-400">{sale.date || "Today"}</span>
            </div>

            <div className="p-2.5 bg-white border border-slate-200/70 rounded-xl flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-7 h-7 rounded-lg bg-emerald-100 text-emerald-600 flex items-center justify-center">
                  <DollarSign className="w-4 h-4" />
                </div>
                <div>
                  <p className="font-bold text-slate-800">Payment Processed ({sale.paymentMethod || "Cash"})</p>
                  <p className="text-[10px] text-slate-500">Receipt #RCPT-8891</p>
                </div>
              </div>
              <span className="font-bold text-emerald-700">₹ {Number(sale.amount || sale.grandTotal || 0).toFixed(2)}</span>
            </div>
          </div>
        </div>
      </div>
    </Modal>
  );
}
