import React from "react";
import Modal from "../../../components/ui/Modal.jsx";
import { Pill, Tag, IndianRupee, Layers } from "lucide-react";

export default function MedicineDetailModal({ item, isOpen, onClose }) {
  if (!item) return null;

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={item.name}
      subtitle={`Code: ${item.code || "MED-0000"} | Brand: ${item.brandName || "Generic"}`}
      maxWidth="max-w-2xl"
    >
      <div className="space-y-5 text-xs text-slate-700 font-medium">
        {/* Section 1: General Information */}
        <div>
          <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-2.5 flex items-center gap-1.5">
            <Tag className="w-4 h-4 text-blue-600" />
            <span>General Information</span>
          </h3>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3.5 bg-slate-50/80 p-3.5 rounded-xl border border-slate-100">
            <div>
              <p className="text-[11px] text-slate-400 font-semibold mb-0.5">Generic Name</p>
              <p className="font-bold text-slate-800">{item.genericName || "—"}</p>
            </div>
            <div>
              <p className="text-[11px] text-slate-400 font-semibold mb-0.5">Category</p>
              <p className="font-bold text-slate-800">{item.category || "General"}</p>
            </div>
            <div>
              <p className="text-[11px] text-slate-400 font-semibold mb-0.5">Manufacturer</p>
              <p className="font-bold text-slate-800">{item.manufacturer || "Vendor"}</p>
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

        {/* Section 2: Pricing & Taxation */}
        <div>
          <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-2.5 flex items-center gap-1.5">
            <IndianRupee className="w-4 h-4 text-emerald-600" />
            <span>Pricing & Tax Details</span>
          </h3>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3.5 bg-emerald-50/50 p-3.5 rounded-xl border border-emerald-100/60">
            <div>
              <p className="text-[11px] text-slate-400 font-semibold mb-0.5">Unit Price</p>
              <p className="font-extrabold text-emerald-700 text-sm">
                ₹ {(Number(item.unitPrice || item.price) || 0).toFixed(2)}
              </p>
            </div>
            <div>
              <p className="text-[11px] text-slate-400 font-semibold mb-0.5">MRP</p>
              <p className="font-bold text-slate-800">
                ₹ {(Number(item.mrp) || Number(item.unitPrice || item.price || 0) * 1.2).toFixed(2)}
              </p>
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

        {/* Section 3: Inventory Thresholds & Status */}
        <div>
          <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-2.5 flex items-center gap-1.5">
            <Layers className="w-4 h-4 text-purple-600" />
            <span>Inventory Thresholds & Status</span>
          </h3>
          <div className="grid grid-cols-3 gap-3.5 bg-slate-50/80 p-3.5 rounded-xl border border-slate-100">
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
                className={`inline-flex items-center px-2.5 py-0.5 rounded-md text-[11px] font-bold capitalize ${
                  String(item.status || "Active").toLowerCase() === "active" || String(item.status || "").toLowerCase() === "in stock"
                    ? "bg-emerald-100 text-emerald-700 border border-emerald-200"
                    : String(item.status || "").toLowerCase() === "archived"
                    ? "bg-slate-100 text-slate-600 border border-slate-200"
                    : "bg-rose-100 text-rose-700 border border-rose-200"
                }`}
              >
                {item.status || "Active"}
              </span>
            </div>
          </div>
        </div>

        {/* Footer Close Button */}
        <div className="pt-2 flex justify-end">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold transition cursor-pointer"
          >
            Close
          </button>
        </div>
      </div>
    </Modal>
  );
}
