import React from "react";
import { X, Pill, ShieldCheck, Tag, Building2, IndianRupee, Layers, FileText } from "lucide-react";

export default function MedicineDetailModal({ item, isOpen, onClose }) {
  if (!isOpen || !item) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-xs animate-fadeIn">
      <div className="bg-white rounded-2xl max-w-2xl w-full shadow-2xl border border-slate-100 overflow-hidden flex flex-col max-h-[90vh]">
        {/* Modal Header */}
        <div className="p-5 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-100 text-blue-600 flex items-center justify-center font-bold">
              <Pill className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-slate-900">{item.name}</h2>
              <p className="text-xs text-slate-500 font-medium">
                Code: <span className="font-semibold text-slate-700">{item.code || "MED-0001"}</span> | Brand:{" "}
                <span className="font-semibold text-slate-700">{item.brandName || "Generic"}</span>
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-all"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto space-y-6 text-xs text-slate-700">
          {/* Section 1: General Details */}
          <div>
            <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-3 flex items-center gap-1.5">
              <Tag className="w-4 h-4 text-blue-600" />
              <span>General Information</span>
            </h3>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 bg-slate-50/70 p-4 rounded-xl border border-slate-100">
              <div>
                <p className="text-[11px] text-slate-400 font-semibold mb-0.5">Generic Name</p>
                <p className="font-bold text-slate-800">{item.genericName || "—"}</p>
              </div>
              <div>
                <p className="text-[11px] text-slate-400 font-semibold mb-0.5">Category</p>
                <p className="font-bold text-slate-800">{item.category}</p>
              </div>
              <div>
                <p className="text-[11px] text-slate-400 font-semibold mb-0.5">Manufacturer</p>
                <p className="font-bold text-slate-800">{item.manufacturer}</p>
              </div>
              <div>
                <p className="text-[11px] text-slate-400 font-semibold mb-0.5">Dosage Form</p>
                <p className="font-bold text-slate-800">{item.dosageForm || "Tablet"}</p>
              </div>
              <div>
                <p className="text-[11px] text-slate-400 font-semibold mb-0.5">Strength</p>
                <p className="font-bold text-slate-800">{item.strength || "—"}</p>
              </div>
              <div>
                <p className="text-[11px] text-slate-400 font-semibold mb-0.5">Unit Package</p>
                <p className="font-bold text-slate-800">{item.unit || "Strip"}</p>
              </div>
            </div>
          </div>

          {/* Section 2: Pricing & GST */}
          <div>
            <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-3 flex items-center gap-1.5">
              <IndianRupee className="w-4 h-4 text-emerald-600" />
              <span>Pricing & Tax Details</span>
            </h3>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 bg-emerald-50/40 p-4 rounded-xl border border-emerald-100/60">
              <div>
                <p className="text-[11px] text-slate-400 font-semibold mb-0.5">Unit Price</p>
                <p className="font-bold text-emerald-700 text-sm">
                  ₹ {(Number(item.unitPrice || item.price) || 0).toFixed(2)}
                </p>
              </div>
              <div>
                <p className="text-[11px] text-slate-400 font-semibold mb-0.5">MRP</p>
                <p className="font-bold text-slate-800">₹ {(Number(item.mrp) || Number(item.unitPrice || item.price) * 1.2).toFixed(2)}</p>
              </div>
              <div>
                <p className="text-[11px] text-slate-400 font-semibold mb-0.5">GST Rate</p>
                <p className="font-bold text-slate-800">{item.gstRate || item.gst || 12}%</p>
              </div>
              <div>
                <p className="text-[11px] text-slate-400 font-semibold mb-0.5">Prescription Required</p>
                <p className="font-bold text-slate-800">{item.prescriptionRequired ? "Yes (Rx)" : "No (OTC)"}</p>
              </div>
            </div>
          </div>

          {/* Section 3: Stock Thresholds & Status */}
          <div>
            <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-3 flex items-center gap-1.5">
              <Layers className="w-4 h-4 text-purple-600" />
              <span>Inventory Thresholds & Status</span>
            </h3>
            <div className="grid grid-cols-3 gap-4 bg-slate-50/70 p-4 rounded-xl border border-slate-100">
              <div>
                <p className="text-[11px] text-slate-400 font-semibold mb-0.5">Min Stock Level</p>
                <p className="font-bold text-slate-800">{item.minStockLevel || 50} Units</p>
              </div>
              <div>
                <p className="text-[11px] text-slate-400 font-semibold mb-0.5">Reorder Level</p>
                <p className="font-bold text-slate-800">{item.reorderLevel || 20} Units</p>
              </div>
              <div>
                <p className="text-[11px] text-slate-400 font-semibold mb-0.5">Catalog Status</p>
                <span
                  className={`inline-flex items-center px-2 py-0.5 rounded text-[11px] font-bold ${
                    item.status === "Active" || item.status === "active"
                      ? "bg-emerald-100 text-emerald-700"
                      : "bg-rose-100 text-rose-700"
                  }`}
                >
                  {item.status}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="p-4 border-t border-slate-100 bg-slate-50/50 flex justify-end">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 bg-slate-200 hover:bg-slate-300 text-slate-700 rounded-xl text-xs font-bold transition-all cursor-pointer"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
