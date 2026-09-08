import React from "react";
import { X, Pill, Package, Calendar, IndianRupee, ShieldCheck, Tag } from "lucide-react";

export default function InventoryDetailModal({ item, isOpen, onClose }) {
  if (!isOpen || !item) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-xs p-4 animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl shadow-2xl border border-slate-100 max-w-md w-full p-6 space-y-5 animate-in zoom-in-95 duration-200">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center">
              <Pill className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900">{item.name}</h3>
              <p className="text-xs text-slate-500 font-medium">Batch: {item.batchNo}</p>
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

        <div className="grid grid-cols-2 gap-3 text-xs">
          <div className="p-3 bg-slate-50 rounded-xl space-y-1">
            <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block">Form / Dosage</span>
            <span className="font-bold text-slate-800">{item.dosage || "Tablet"}</span>
          </div>

          <div className="p-3 bg-slate-50 rounded-xl space-y-1">
            <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block">Category</span>
            <span className="font-bold text-slate-800">{item.category}</span>
          </div>

          <div className="p-3 bg-slate-50 rounded-xl space-y-1">
            <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block">Available Stock</span>
            <span className="font-bold text-slate-900">{item.availableStock} {item.unit}</span>
          </div>

          <div className="p-3 bg-slate-50 rounded-xl space-y-1">
            <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block">Status</span>
            <span className="font-bold text-emerald-600">{item.status}</span>
          </div>

          <div className="p-3 bg-slate-50 rounded-xl space-y-1">
            <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block">Purchase Price</span>
            <span className="font-bold text-slate-800">₹ {Number(item.purchasePrice).toFixed(2)}</span>
          </div>

          <div className="p-3 bg-slate-50 rounded-xl space-y-1">
            <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block">MRP Price</span>
            <span className="font-bold text-slate-800">₹ {Number(item.mrp).toFixed(2)}</span>
          </div>

          <div className="p-3 bg-slate-50 rounded-xl space-y-1">
            <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block">Expiry Date</span>
            <span className="font-bold text-slate-800">{item.expiryDate}</span>
          </div>

          <div className="p-3 bg-slate-50 rounded-xl space-y-1">
            <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block">Manufacturer</span>
            <span className="font-bold text-slate-800">{item.manufacturer || "Cipla"}</span>
          </div>
        </div>

        <div className="pt-3 border-t border-slate-100 flex justify-end">
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
