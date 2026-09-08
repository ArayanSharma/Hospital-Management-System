import React from "react";
import Modal from "../../../../components/ui/Modal.jsx";
import { CreditCard, CheckCircle2, DollarSign, Calendar, FileText } from "lucide-react";

export default function InvoicePaymentHistoryModal({ isOpen, onClose, invoice }) {
  if (!invoice) return null;

  const payments = invoice.paymentHistory || [
    {
      _id: "PAY-001",
      date: invoice.createdAt || "2026-08-31T10:30:00Z",
      amount: invoice.amountPaid || invoice.total || 5000,
      mode: invoice.paymentMode || "UPI / Online",
      transactionId: "TXN-884920482",
      receivedBy: "Billing Admin",
    },
  ];

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={`Payment History — ${invoice.invoiceNumber}`}
      subtitle={`Patient: ${invoice.patientName || "Patient"} (${invoice.uhid || "PAT-0001"})`}
      maxWidth="max-w-xl"
    >
      <div className="space-y-4 text-xs font-medium">
        {/* Invoice Summary Banner */}
        <div className="p-3.5 bg-slate-50 border border-slate-200/80 rounded-2xl flex items-center justify-between">
          <div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Total Billed</span>
            <p className="text-sm font-bold text-slate-900">₹ {(invoice.total || 0).toLocaleString("en-IN")}</p>
          </div>
          <div className="text-right">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Total Paid</span>
            <p className="text-sm font-bold text-emerald-600">₹ {(invoice.amountPaid || invoice.total || 0).toLocaleString("en-IN")}</p>
          </div>
          <div className="text-right">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Due Balance</span>
            <p className={`text-sm font-bold ${invoice.dueAmount > 0 ? "text-rose-600" : "text-slate-700"}`}>
              ₹ {(invoice.dueAmount !== undefined ? invoice.dueAmount : Math.max(0, (invoice.total || 0) - (invoice.amountPaid || 0))).toLocaleString("en-IN")}
            </p>
          </div>
        </div>

        {/* Audit Log Timeline */}
        <div className="space-y-3">
          <h4 className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
            <FileText className="w-4 h-4 text-blue-600" />
            <span>Transaction Timeline</span>
          </h4>

          <div className="space-y-2.5 max-h-64 overflow-y-auto pr-1">
            {payments.map((p, idx) => (
              <div key={p._id || idx} className="p-3 bg-white border border-slate-200/90 rounded-xl shadow-2xs flex items-center justify-between gap-3">
                <div className="flex items-start gap-2.5">
                  <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0 border border-emerald-100">
                    <CheckCircle2 className="w-4 h-4" />
                  </div>
                  <div>
                    <p className="font-bold text-slate-900">{p.mode}</p>
                    <p className="text-[11px] text-slate-400 font-mono mt-0.5">Ref: {p.transactionId}</p>
                    <div className="flex items-center gap-2 mt-1 text-[10px] text-slate-500">
                      <span className="flex items-center gap-1">
                        <Calendar className="w-3 h-3 text-slate-400" />
                        {new Date(p.date).toLocaleString()}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="text-right">
                  <span className="text-xs font-extrabold text-emerald-600">+ ₹ {Number(p.amount).toLocaleString("en-IN")}</span>
                  <p className="text-[10px] text-slate-400 mt-0.5">By: {p.receivedBy || "Admin"}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Footer */}
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
