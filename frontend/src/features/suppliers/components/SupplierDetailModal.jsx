import React from "react";
import { X, Building2, Phone, Mail, MapPin, Tag, FileText, CheckCircle2 } from "lucide-react";

export default function SupplierDetailModal({ supplier, isOpen, onClose }) {
  if (!isOpen || !supplier) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-xs p-4 animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl shadow-2xl border border-slate-100 max-w-md w-full p-6 space-y-5 animate-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
              <Building2 className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900">{supplier.name}</h3>
              <p className="text-xs text-slate-500 font-medium">Code: {supplier.supplierCode || "SUP-001"}</p>
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

        {/* Commercial & Contact Information */}
        <div className="grid grid-cols-2 gap-3 text-xs">
          <div className="p-3 bg-slate-50 rounded-xl space-y-1">
            <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block">Contact Person</span>
            <span className="font-bold text-slate-900">{supplier.contactPerson}</span>
            <span className="text-[11px] text-slate-500 block">{supplier.designation}</span>
          </div>

          <div className="p-3 bg-slate-50 rounded-xl space-y-1">
            <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block">Category</span>
            <span className="font-bold text-blue-600">{supplier.category}</span>
          </div>

          <div className="p-3 bg-slate-50 rounded-xl space-y-1">
            <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block">Phone Number</span>
            <span className="font-bold text-slate-800">{supplier.phone}</span>
          </div>

          <div className="p-3 bg-slate-50 rounded-xl space-y-1">
            <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block">Email Address</span>
            <span className="font-bold text-slate-800 truncate block">{supplier.email}</span>
          </div>

          <div className="p-3 bg-slate-50 rounded-xl space-y-1">
            <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block">Location / City</span>
            <span className="font-bold text-slate-800">{supplier.location}</span>
          </div>

          <div className="p-3 bg-slate-50 rounded-xl space-y-1">
            <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block">Payment Status</span>
            <span className={`font-bold ${supplier.paymentStatus === "Paid" ? "text-emerald-600" : "text-amber-600"}`}>
              {supplier.paymentStatus}
            </span>
          </div>

          <div className="p-3 bg-slate-50 rounded-xl space-y-1">
            <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block">Last Purchase</span>
            <span className="font-bold text-slate-800">{supplier.lastPurchase}</span>
          </div>

          <div className="p-3 bg-slate-50 rounded-xl space-y-1">
            <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block">Total Purchases</span>
            <span className="font-extrabold text-slate-900 text-sm">₹ {Number(supplier.totalPurchases).toLocaleString("en-IN")}</span>
          </div>
        </div>

        {/* Footer */}
        <div className="pt-3 border-t border-slate-100 flex justify-end">
          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2 text-xs font-semibold bg-blue-600 hover:bg-blue-700 text-white rounded-xl shadow-xs transition-colors cursor-pointer"
          >
            Close Details
          </button>
        </div>
      </div>
    </div>
  );
}
