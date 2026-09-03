import React from "react";
import Modal from "../../../../components/ui/Modal.jsx";
import { ClipboardList, Package, ArrowUpRight, ArrowDownLeft, RotateCcw } from "lucide-react";

export default function InventoryStockHistoryModal({ item, isOpen, onClose }) {
  if (!item) return null;

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Inventory Stock Movement History"
      subtitle={`${item.name} (${item.dosage || "Tablet"}) — Batch #${item.batchNo || "PCM650/01"}`}
      maxWidth="max-w-xl"
    >
      <div className="space-y-4 text-xs font-medium">
        <div className="p-3.5 bg-slate-50 border border-slate-200/80 rounded-2xl flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-600 text-white flex items-center justify-center font-bold">
              <Package className="w-5 h-5" />
            </div>
            <div>
              <p className="font-extrabold text-slate-900 text-sm">{item.name}</p>
              <p className="text-[11px] text-slate-500 font-semibold mt-0.5">
                Category: {item.category} | Batch: <span className="font-mono text-slate-700">{item.batchNo}</span>
              </p>
            </div>
          </div>
          <div className="text-right">
            <p className="text-[11px] text-slate-400 font-semibold">Available Stock</p>
            <p className="text-sm font-extrabold text-slate-900">{item.availableStock} {item.unit}</p>
          </div>
        </div>

        <div className="space-y-2">
          <p className="font-bold text-slate-700 text-xs flex items-center gap-1.5">
            <ClipboardList className="w-4 h-4 text-blue-600" />
            <span>Audit Trail & Movement Timeline</span>
          </p>

          <div className="bg-slate-50 border border-slate-200/80 rounded-2xl p-3 space-y-2 max-h-60 overflow-y-auto">
            <div className="p-2.5 bg-white border border-slate-200/70 rounded-xl flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-7 h-7 rounded-lg bg-emerald-100 text-emerald-600 flex items-center justify-center">
                  <ArrowDownLeft className="w-4 h-4" />
                </div>
                <div>
                  <p className="font-bold text-slate-800">Stock In (Refill Supplier Order #GRN-9912)</p>
                  <p className="text-[10px] text-slate-500">Received from {item.manufacturer || "Cipla Ltd."}</p>
                </div>
              </div>
              <span className="font-extrabold text-emerald-700">+ 100 Qty</span>
            </div>

            <div className="p-2.5 bg-white border border-slate-200/70 rounded-xl flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-7 h-7 rounded-lg bg-blue-100 text-blue-600 flex items-center justify-center">
                  <ArrowUpRight className="w-4 h-4" />
                </div>
                <div>
                  <p className="font-bold text-slate-800">OPD Dispensed Sale Invoice #PS-4402</p>
                  <p className="text-[10px] text-slate-500">Dispensed to Walk-in Patient</p>
                </div>
              </div>
              <span className="font-extrabold text-rose-600">- 10 Qty</span>
            </div>

            <div className="p-2.5 bg-white border border-slate-200/70 rounded-xl flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-7 h-7 rounded-lg bg-amber-100 text-amber-600 flex items-center justify-center">
                  <RotateCcw className="w-4 h-4" />
                </div>
                <div>
                  <p className="font-bold text-slate-800">Stock Audit Adjustment #ADJ-004</p>
                  <p className="text-[10px] text-slate-500">Damage / Expiry Correction</p>
                </div>
              </div>
              <span className="font-bold text-amber-700">- 2 Qty</span>
            </div>
          </div>
        </div>
      </div>
    </Modal>
  );
}
