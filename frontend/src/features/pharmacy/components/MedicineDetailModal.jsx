import React from "react";
import Modal from "../../../components/ui/Modal.jsx";
import { Pill, Tag, IndianRupee, Layers, Printer, Building2 } from "lucide-react";

export default function MedicineDetailModal({ item, isOpen, onClose }) {
  if (!item || !isOpen) return null;

  const codeStr = item.code || "MED-N/A";
  const nameStr = item.name || "Unnamed Medicine";
  const brandStr = item.brandName || "Generic";
  const genericStr = item.genericName || "N/A";
  const categoryStr = item.category || "N/A";
  const manufacturerStr = item.manufacturer || "N/A";
  const dosageFormStr = item.dosageForm || "N/A";
  const strengthStr = item.strength || "N/A";
  const unitStr = item.unit || "N/A";

  const unitPriceVal = Number(item.unitPrice || item.price || 0);
  const mrpVal = item.mrp !== undefined ? Number(item.mrp) : null;
  const gstRateVal = item.gstRate !== undefined ? item.gstRate : item.gst !== undefined ? item.gst : 12;

  const minStockVal = item.minStockLevel !== undefined ? item.minStockLevel : "N/A";
  const reorderVal = item.reorderLevel !== undefined ? item.reorderLevel : "N/A";
  const statusStr = item.status || "Active";

  const handlePrint = () => {
    window.print();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={nameStr}
      subtitle={`Code: ${codeStr} | Brand: ${brandStr}`}
      maxWidth="max-w-3xl"
    >
      <div className="space-y-4 text-xs text-slate-700 font-medium">
        {/* Printable Action Bar (Hidden during print) */}
        <div className="flex items-center justify-between p-3 bg-slate-50 border border-slate-200/80 rounded-2xl print:hidden">
          <div className="flex items-center gap-2 text-slate-600 text-xs font-semibold">
            <Printer className="w-4 h-4 text-blue-600" />
            <span>Ready to print official Pharmacy Master Specification Sheet</span>
          </div>
          <button
            type="button"
            onClick={handlePrint}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold shadow-md shadow-blue-500/20 transition cursor-pointer flex items-center gap-2 active:scale-95"
          >
            <Printer className="w-4 h-4" />
            <span>Print Medicine Sheet</span>
          </button>
        </div>

        {/* PRINTABLE CONTAINER (Target for @media print CSS) */}
        <div
          id="printable-medicine-detail"
          className="bg-white p-6 rounded-2xl border border-slate-200/80 text-slate-900 text-xs space-y-5 shadow-xs"
        >
          {/* Hospital Letterhead Header */}
          <div className="flex items-start justify-between border-b-2 border-blue-600 pb-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-blue-600 text-white flex items-center justify-center font-black text-xl shadow-md">
                <Building2 className="w-7 h-7" />
              </div>
              <div>
                <h1 className="text-lg font-extrabold text-blue-700 uppercase tracking-tight">
                  CityCare Hospital &amp; Medical Research Center
                </h1>
                <p className="text-[11px] font-semibold text-slate-500">
                  Pharmacy Master Catalog &amp; Formulatory Directory
                </p>
                <p className="text-[10px] text-slate-400 font-mono">
                  Drug Record ID: {codeStr} | Licensed EMR Pharmacy
                </p>
              </div>
            </div>

            <div className="text-right">
              <div className="inline-block px-3 py-1 bg-purple-50 text-purple-700 border border-purple-200 rounded-full font-black text-[11px] tracking-wider uppercase mb-1">
                Medicine Master Data
              </div>
              <p className="text-[11px] font-bold text-slate-700 font-mono">{codeStr}</p>
              <p className="text-[10px] text-slate-400 font-medium">{new Date().toLocaleDateString()}</p>
            </div>
          </div>

          {/* Section 1: General Information */}
          <div>
            <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-2.5 flex items-center gap-1.5 border-b border-slate-200 pb-1">
              <Tag className="w-4 h-4 text-blue-600" />
              <span>General Drug Specifications</span>
            </h3>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3.5 bg-slate-50/80 p-3.5 rounded-xl border border-slate-200/80">
              <div>
                <p className="text-[11px] text-slate-400 font-semibold mb-0.5">Brand / Trade Name</p>
                <p className="font-extrabold text-slate-900 text-sm">{nameStr} ({brandStr})</p>
              </div>
              <div>
                <p className="text-[11px] text-slate-400 font-semibold mb-0.5">Generic Chemical Name</p>
                <p className="font-bold text-slate-800">{genericStr}</p>
              </div>
              <div>
                <p className="text-[11px] text-slate-400 font-semibold mb-0.5">Therapeutic Category</p>
                <p className="font-bold text-slate-800">{categoryStr}</p>
              </div>
              <div>
                <p className="text-[11px] text-slate-400 font-semibold mb-0.5">Manufacturer / Vendor</p>
                <p className="font-bold text-slate-800">{manufacturerStr}</p>
              </div>
              <div>
                <p className="text-[11px] text-slate-400 font-semibold mb-0.5">Dosage Form</p>
                <p className="font-bold text-slate-800">{dosageFormStr}</p>
              </div>
              <div>
                <p className="text-[11px] text-slate-400 font-semibold mb-0.5">Strength / Unit Packaging</p>
                <p className="font-bold text-slate-800">{strengthStr} ({unitStr})</p>
              </div>
            </div>
          </div>

          {/* Section 2: Pricing & Taxation */}
          <div>
            <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-2.5 flex items-center gap-1.5 border-b border-slate-200 pb-1">
              <IndianRupee className="w-4 h-4 text-emerald-600" />
              <span>Commercial Pricing &amp; GST Rates</span>
            </h3>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3.5 bg-emerald-50/50 p-3.5 rounded-xl border border-emerald-200/70">
              <div>
                <p className="text-[11px] text-slate-400 font-semibold mb-0.5">Unit Hospital Price</p>
                <p className="font-extrabold text-emerald-700 text-sm">
                  ₹ {unitPriceVal.toFixed(2)}
                </p>
              </div>
              <div>
                <p className="text-[11px] text-slate-400 font-semibold mb-0.5">MRP Rate</p>
                <p className="font-bold text-slate-800">
                  {mrpVal !== null ? `₹ ${mrpVal.toFixed(2)}` : "N/A"}
                </p>
              </div>
              <div>
                <p className="text-[11px] text-slate-400 font-semibold mb-0.5">GST Rate Applicable</p>
                <p className="font-bold text-slate-800">{gstRateVal}%</p>
              </div>
              <div>
                <p className="text-[11px] text-slate-400 font-semibold mb-0.5">Prescription Classification</p>
                <p className="font-bold text-slate-800">{item.prescriptionRequired ? "Schedule H (Rx)" : "OTC (Over-The-Counter)"}</p>
              </div>
            </div>
          </div>

          {/* Section 3: Inventory Thresholds & Status */}
          <div>
            <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-2.5 flex items-center gap-1.5 border-b border-slate-200 pb-1">
              <Layers className="w-4 h-4 text-purple-600" />
              <span>Stock Threshold Control &amp; Master Status</span>
            </h3>
            <div className="grid grid-cols-3 gap-3.5 bg-slate-50/80 p-3.5 rounded-xl border border-slate-200/80">
              <div>
                <p className="text-[11px] text-slate-400 font-semibold mb-0.5">Min Stock Floor</p>
                <p className="font-bold text-slate-800">{minStockVal} {minStockVal !== "N/A" ? "Units" : ""}</p>
              </div>
              <div>
                <p className="text-[11px] text-slate-400 font-semibold mb-0.5">Reorder Alert Level</p>
                <p className="font-bold text-slate-800">{reorderVal} {reorderVal !== "N/A" ? "Units" : ""}</p>
              </div>
              <div>
                <p className="text-[11px] text-slate-400 font-semibold mb-0.5">Catalog Status</p>
                <span
                  className={`inline-flex items-center px-2.5 py-0.5 rounded-md text-[11px] font-bold capitalize ${
                    String(statusStr).toLowerCase() === "active" || String(statusStr).toLowerCase() === "in stock"
                      ? "bg-emerald-100 text-emerald-700 border border-emerald-200"
                      : String(statusStr).toLowerCase() === "archived"
                      ? "bg-slate-100 text-slate-600 border border-slate-200"
                      : "bg-rose-100 text-rose-700 border border-rose-200"
                  }`}
                >
                  {statusStr}
                </span>
              </div>
            </div>
          </div>

          {/* Footer Signature */}
          <div className="pt-6 flex items-end justify-between border-t border-slate-200">
            <div className="space-y-0.5 text-[10px] text-slate-400">
              <p className="font-semibold text-slate-600">Formulary Audit:</p>
              <p>• Official record generated from CityCare Central EMR Pharmacy Module.</p>
            </div>
            <div className="text-center space-y-1">
              <div className="w-32 border-b-2 border-slate-400 pb-1 font-serif text-slate-600 italic">
                Chief Pharmacist
              </div>
              <p className="font-extrabold text-slate-900 text-[10px]">Authorized Signature</p>
            </div>
          </div>
        </div>

        {/* Footer Close Button */}
        <div className="pt-2 flex justify-end print:hidden">
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
