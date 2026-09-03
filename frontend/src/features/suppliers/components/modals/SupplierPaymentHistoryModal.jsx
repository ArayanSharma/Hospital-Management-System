import React from "react";
import Modal from "../../../../components/ui/Modal.jsx";
import { CreditCard, CheckCircle2, DollarSign } from "lucide-react";

export default function SupplierPaymentHistoryModal({ supplier, isOpen, onClose }) {
  if (!supplier) return null;

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Supplier Payment History & Receipts"
      subtitle={`${supplier.name} — Vendor Ledger`}
      maxWidth="max-w-xl"
    >
      <div className="space-y-4 text-xs font-medium">
        <div className="p-3.5 bg-slate-50 border border-slate-200/80 rounded-2xl flex items-center justify-between">
          <div>
            <p className="text-[11px] text-slate-500 font-semibold">Credit Limit</p>
            <p className="text-sm font-extrabold text-slate-900">₹ {(supplier.creditLimit || 500000).toLocaleString("en-IN")}</p>
          </div>
          <div className="text-right">
            <p className="text-[11px] text-slate-500 font-semibold">Payment Terms</p>
            <p className="text-xs font-bold text-blue-600">{supplier.paymentTerms || "Net 30"}</p>
          </div>
        </div>

        <div className="space-y-2">
          <p className="font-bold text-slate-700 text-xs flex items-center gap-1.5">
            <CreditCard className="w-4 h-4 text-emerald-600" />
            <span>Disbursed Vendor Payments</span>
          </p>

          <div className="bg-slate-50 border border-slate-200/80 rounded-2xl p-3 space-y-2">
            <div className="p-2.5 bg-white border border-slate-200/70 rounded-xl flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-7 h-7 rounded-lg bg-emerald-100 text-emerald-600 flex items-center justify-center">
                  <CheckCircle2 className="w-4 h-4" />
                </div>
                <div>
                  <p className="font-bold text-slate-800">NEFT Bank Transfer #TXN-9941</p>
                  <p className="text-[10px] text-slate-500">Cleared for Invoice #INV-2026-088</p>
                </div>
              </div>
              <div className="text-right">
                <span className="font-extrabold text-emerald-700">₹ 1,45,000.00</span>
                <p className="text-[10px] text-slate-400">28 Aug 2026</p>
              </div>
            </div>

            <div className="p-2.5 bg-white border border-slate-200/70 rounded-xl flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-7 h-7 rounded-lg bg-blue-100 text-blue-600 flex items-center justify-center">
                  <DollarSign className="w-4 h-4" />
                </div>
                <div>
                  <p className="font-bold text-slate-800">Cheque Payment #CHQ-0023</p>
                  <p className="text-[10px] text-slate-500">Cleared for Invoice #INV-2026-012</p>
                </div>
              </div>
              <div className="text-right">
                <span className="font-extrabold text-slate-900">₹ 50,000.00</span>
                <p className="text-[10px] text-slate-400">15 Aug 2026</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Modal>
  );
}
