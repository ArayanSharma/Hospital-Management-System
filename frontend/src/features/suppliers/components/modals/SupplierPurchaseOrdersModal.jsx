import React from "react";
import Modal from "../../../../components/ui/Modal.jsx";
import { ShoppingCart, Package } from "lucide-react";

export default function SupplierPurchaseOrdersModal({ supplier, isOpen, onClose }) {
  if (!supplier) return null;

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Supplier Purchase Orders"
      subtitle={`${supplier.name} (${supplier.category || "Pharmaceuticals"})`}
      maxWidth="max-w-xl"
    >
      <div className="space-y-4 text-xs font-medium">
        <div className="p-3.5 bg-slate-50 border border-slate-200/80 rounded-2xl flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-600 text-white flex items-center justify-center font-bold">
              <ShoppingCart className="w-5 h-5" />
            </div>
            <div>
              <p className="font-extrabold text-slate-900 text-sm">{supplier.name}</p>
              <p className="text-[11px] text-slate-500 font-semibold mt-0.5">
                GST: <span className="font-mono text-slate-700">{supplier.gstNumber || "27AAACM1234A1Z5"}</span> | Phone: {supplier.phone}
              </p>
            </div>
          </div>
          <div className="text-right">
            <p className="text-[11px] text-slate-400 font-semibold">Payment Terms</p>
            <p className="text-xs font-extrabold text-slate-900">{supplier.paymentTerms || "Net 30"}</p>
          </div>
        </div>

        <div className="space-y-2">
          <p className="font-bold text-slate-700 text-xs flex items-center gap-1.5">
            <Package className="w-4 h-4 text-blue-600" />
            <span>Recent Purchase Orders (PO List)</span>
          </p>

          <div className="bg-slate-50 border border-slate-200/80 rounded-2xl p-3 space-y-2">
            <div className="p-2.5 bg-white border border-slate-200/70 rounded-xl flex items-center justify-between">
              <div>
                <p className="font-extrabold text-blue-600 font-mono">#PO-2026-0881</p>
                <p className="text-[10px] text-slate-500">Ordered 25 Aug 2026 • 1,200 Units</p>
              </div>
              <div className="text-right">
                <span className="bg-emerald-100 text-emerald-700 px-2 py-0.5 rounded text-[10px] font-bold">Delivered</span>
                <p className="font-extrabold text-slate-900 text-xs mt-0.5">₹ 1,45,000.00</p>
              </div>
            </div>

            <div className="p-2.5 bg-white border border-slate-200/70 rounded-xl flex items-center justify-between">
              <div>
                <p className="font-extrabold text-blue-600 font-mono">#PO-2026-0742</p>
                <p className="text-[10px] text-slate-500">Ordered 10 Aug 2026 • 800 Units</p>
              </div>
              <div className="text-right">
                <span className="bg-blue-100 text-blue-700 px-2 py-0.5 rounded text-[10px] font-bold">In Transit</span>
                <p className="font-extrabold text-slate-900 text-xs mt-0.5">₹ 98,500.00</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Modal>
  );
}
