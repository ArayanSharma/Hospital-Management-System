import React from "react";
import { X, Printer, Receipt, CheckCircle2 } from "lucide-react";

export default function ViewInvoiceModal({ invoice, isOpen, onClose }) {
  if (!isOpen || !invoice) return null;

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-xs p-4 animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl shadow-2xl border border-slate-100 max-w-lg w-full p-6 space-y-5 animate-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <Receipt className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900">{invoice.invoiceNo}</h3>
              <p className="text-xs text-slate-500 font-medium">{invoice.date} • {invoice.time}</p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="w-8 h-8 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 flex items-center justify-center transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Invoice Summary Details */}
        <div className="grid grid-cols-2 gap-3 text-xs">
          <div className="p-3 bg-slate-50 rounded-xl space-y-1">
            <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block">Patient Name</span>
            <span className="font-bold text-slate-900">{invoice.patientName}</span>
          </div>

          <div className="p-3 bg-slate-50 rounded-xl space-y-1">
            <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block">Patient ID</span>
            <span className="font-bold text-slate-800">{invoice.patientId}</span>
          </div>

          <div className="p-3 bg-slate-50 rounded-xl space-y-1">
            <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block">Type</span>
            <span className="font-bold text-blue-600">{invoice.patientType}</span>
          </div>

          <div className="p-3 bg-slate-50 rounded-xl space-y-1">
            <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block">Total Items</span>
            <span className="font-bold text-slate-800">{invoice.itemsCount} Items</span>
          </div>

          <div className="p-3 bg-slate-50 rounded-xl space-y-1">
            <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block">Payment Status</span>
            <span className={`font-bold ${invoice.paymentStatus === "Paid" ? "text-emerald-600" : "text-amber-600"}`}>
              {invoice.paymentStatus} {invoice.paymentMethod ? `(${invoice.paymentMethod})` : ""}
            </span>
          </div>

          <div className="p-3 bg-slate-50 rounded-xl space-y-1">
            <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block">Total Amount</span>
            <span className="font-extrabold text-slate-900 text-sm">₹ {Number(invoice.amount).toLocaleString("en-IN", { minimumFractionDigits: 2 })}</span>
          </div>
        </div>

        {/* Footer */}
        <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
          <button
            type="button"
            onClick={handlePrint}
            className="px-4 py-2 text-xs font-semibold bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-xl transition-colors cursor-pointer flex items-center gap-1.5"
          >
            <Printer className="w-4 h-4" /> Print Invoice
          </button>
          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2 text-xs font-semibold bg-blue-600 hover:bg-blue-700 text-white rounded-xl shadow-xs transition-colors cursor-pointer"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
