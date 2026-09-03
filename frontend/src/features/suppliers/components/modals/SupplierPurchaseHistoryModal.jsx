import React from "react";
import Modal from "../../../../components/ui/Modal.jsx";
import { ClipboardList, ArrowDownLeft } from "lucide-react";

export default function SupplierPurchaseHistoryModal({ supplier, isOpen, onClose }) {
  if (!supplier) return null;

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Supplier Purchase History"
      subtitle={`${supplier.name} — Goods Received Note (GRN) Timeline`}
      maxWidth="max-w-xl"
    >
      <div className="space-y-4 text-xs font-medium">
        <div className="space-y-2">
          <p className="font-bold text-slate-700 text-xs flex items-center gap-1.5">
            <ClipboardList className="w-4 h-4 text-purple-600" />
            <span>GRN Stock In Audit History</span>
          </p>

          <div className="bg-slate-50 border border-slate-200/80 rounded-2xl p-3 space-y-2">
            <div className="p-2.5 bg-white border border-slate-200/70 rounded-xl flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-7 h-7 rounded-lg bg-emerald-100 text-emerald-600 flex items-center justify-center">
                  <ArrowDownLeft className="w-4 h-4" />
                </div>
                <div>
                  <p className="font-bold text-slate-800">GRN Refill Bill #INV-2026-088</p>
                  <p className="text-[10px] text-slate-500">Paracetamol 650mg & Amoxicillin 500mg</p>
                </div>
              </div>
              <div className="text-right">
                <span className="font-extrabold text-emerald-700">+ 1,200 Qty</span>
                <p className="text-[10px] text-slate-400">25 Aug 2026</p>
              </div>
            </div>

            <div className="p-2.5 bg-white border border-slate-200/70 rounded-xl flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-7 h-7 rounded-lg bg-blue-100 text-blue-600 flex items-center justify-center">
                  <ArrowDownLeft className="w-4 h-4" />
                </div>
                <div>
                  <p className="font-bold text-slate-800">GRN Refill Bill #INV-2026-042</p>
                  <p className="text-[10px] text-slate-500">Surgical Gloves & Bandages</p>
                </div>
              </div>
              <div className="text-right">
                <span className="font-extrabold text-blue-700">+ 500 Qty</span>
                <p className="text-[10px] text-slate-400">10 Aug 2026</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Modal>
  );
}
