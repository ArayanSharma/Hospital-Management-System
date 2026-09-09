import React from "react";
import Modal from "../../../components/ui/Modal.jsx";
import { Pill, Tag, Calendar, IndianRupee, Layers, Printer, Building2, ShieldCheck } from "lucide-react";

export default function InventoryDetailModal({ item, isOpen, onClose }) {
  if (!isOpen || !item) return null;

  const batchNoStr = item.batchNo || "BATCH-N/A";
  const nameStr = item.name || "Unnamed Medicine";
  const dosageStr = item.dosage || "N/A";
  const categoryStr = item.category || "N/A";
  const manufacturerStr = item.manufacturer || "N/A";
  const unitStr = item.unit || "Units";
  const availableStockVal = item.availableStock !== undefined ? item.availableStock : 0;
  const statusStr = item.status || "In Stock";
  const expiryDateStr = item.expiryDate || "N/A";
  const purchasePriceVal = Number(item.purchasePrice || 0);
  const mrpVal = Number(item.mrp || 0);

  const handlePrint = () => {
    window.print();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={nameStr}
      subtitle={`Inventory Batch Reference #${batchNoStr}`}
      maxWidth="max-w-3xl"
    >
      <div className="space-y-4 text-xs text-slate-700 font-medium">
        {/* Action Bar (hidden during print) */}
        <div className="flex items-center justify-between p-3 bg-slate-50 border border-slate-200/80 rounded-2xl print:hidden">
          <div className="flex items-center gap-2 text-slate-600 text-xs font-semibold">
            <Printer className="w-4 h-4 text-blue-600" />
            <span>Ready to print official Pharmacy Inventory Batch Audit Sheet</span>
          </div>
          <button
            type="button"
            onClick={handlePrint}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold shadow-md shadow-blue-500/20 transition cursor-pointer flex items-center gap-2 active:scale-95"
          >
            <Printer className="w-4 h-4" />
            <span>Print Batch Sheet</span>
          </button>
        </div>

        {/* PRINTABLE CONTAINER (Target for @media print CSS) */}
        <div
          id="printable-inventory-detail"
          className="bg-white p-6 rounded-2xl border border-slate-200/80 text-slate-900 text-xs space-y-5 shadow-xs"
        >
          {/* Hospital Letterhead Header */}
          <div className="flex items-start justify-between border-b-2 border-blue-600 pb-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-purple-600 text-white flex items-center justify-center font-black text-xl shadow-md">
                <Building2 className="w-7 h-7" />
              </div>
              <div>
                <h1 className="text-lg font-extrabold text-blue-700 uppercase tracking-tight">
                  CityCare Hospital &amp; Medical Research Center
                </h1>
                <p className="text-[11px] font-semibold text-slate-500">
                  Pharmacy Central Store &amp; Inventory Management Audit
                </p>
                <p className="text-[10px] text-slate-400 font-mono">
                  Batch No: {batchNoStr} | Central Stock Audit
                </p>
              </div>
            </div>

            <div className="text-right">
              <div className="inline-block px-3 py-1 bg-purple-50 text-purple-700 border border-purple-200 rounded-full font-black text-[11px] tracking-wider uppercase mb-1">
                Inventory Batch Data
              </div>
              <p className="text-[11px] font-bold text-slate-700 font-mono">#{batchNoStr}</p>
              <p className="text-[10px] text-slate-400 font-medium">{new Date().toLocaleDateString()}</p>
            </div>
          </div>

          {/* Section 1: Batch & Drug Specifications */}
          <div>
            <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-2.5 flex items-center gap-1.5 border-b border-slate-200 pb-1">
              <Tag className="w-4 h-4 text-purple-600" />
              <span>Batch &amp; Pharmaceutical Details</span>
            </h3>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3.5 bg-slate-50/80 p-3.5 rounded-xl border border-slate-200/80">
              <div>
                <p className="text-[11px] text-slate-400 font-semibold mb-0.5">Medicine Name</p>
                <p className="font-extrabold text-slate-900 text-sm">{nameStr}</p>
              </div>
              <div>
                <p className="text-[11px] text-slate-400 font-semibold mb-0.5">Batch Number</p>
                <p className="font-bold text-purple-700 font-mono">{batchNoStr}</p>
              </div>
              <div>
                <p className="text-[11px] text-slate-400 font-semibold mb-0.5">Category</p>
                <p className="font-bold text-slate-800">{categoryStr}</p>
              </div>
              <div>
                <p className="text-[11px] text-slate-400 font-semibold mb-0.5">Manufacturer / Vendor</p>
                <p className="font-bold text-slate-800">{manufacturerStr}</p>
              </div>
              <div>
                <p className="text-[11px] text-slate-400 font-semibold mb-0.5">Dosage Form</p>
                <p className="font-bold text-slate-800">{dosageStr}</p>
              </div>
              <div>
                <p className="text-[11px] text-slate-400 font-semibold mb-0.5">Expiry Date</p>
                <p className="font-bold text-slate-800">{expiryDateStr}</p>
              </div>
            </div>
          </div>

          {/* Section 2: Stock Levels & Valuation */}
          <div>
            <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-2.5 flex items-center gap-1.5 border-b border-slate-200 pb-1">
              <Layers className="w-4 h-4 text-blue-600" />
              <span>Stock Quantities &amp; Financial Valuation</span>
            </h3>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3.5 bg-blue-50/50 p-3.5 rounded-xl border border-blue-200/70">
              <div>
                <p className="text-[11px] text-slate-400 font-semibold mb-0.5">Available Stock</p>
                <p className="font-extrabold text-blue-700 text-sm">{availableStockVal} {unitStr}</p>
              </div>
              <div>
                <p className="text-[11px] text-slate-400 font-semibold mb-0.5">Purchase Unit Price</p>
                <p className="font-bold text-slate-800">₹ {purchasePriceVal.toFixed(2)}</p>
              </div>
              <div>
                <p className="text-[11px] text-slate-400 font-semibold mb-0.5">MRP Retail Rate</p>
                <p className="font-bold text-slate-800">₹ {mrpVal.toFixed(2)}</p>
              </div>
              <div>
                <p className="text-[11px] text-slate-400 font-semibold mb-0.5">Total Batch Value</p>
                <p className="font-extrabold text-emerald-700 text-sm">
                  ₹ {(purchasePriceVal * availableStockVal).toLocaleString("en-IN", { minimumFractionDigits: 2 })}
                </p>
              </div>
            </div>
          </div>

          {/* Section 3: Batch Status */}
          <div>
            <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-2.5 flex items-center gap-1.5 border-b border-slate-200 pb-1">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              <span>Inventory Status</span>
            </h3>
            <div className="bg-slate-50/80 p-3.5 rounded-xl border border-slate-200/80 flex items-center justify-between">
              <div>
                <p className="text-[11px] text-slate-400 font-semibold mb-0.5">Current Stock Status</p>
                <span
                  className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-extrabold uppercase tracking-wider ${
                    String(statusStr).toLowerCase() === "in stock" || String(statusStr).toLowerCase() === "active"
                      ? "bg-emerald-100 text-emerald-700 border border-emerald-300"
                      : String(statusStr).toLowerCase() === "low stock" || String(statusStr).toLowerCase() === "expiring soon"
                      ? "bg-amber-100 text-amber-700 border border-amber-300"
                      : "bg-rose-100 text-rose-700 border border-rose-300"
                  }`}
                >
                  {statusStr}
                </span>
              </div>
              <div className="text-right text-[11px] text-slate-500 font-medium">
                <p>Tracked under Central Store EMR System</p>
              </div>
            </div>
          </div>

          {/* Footer Signature */}
          <div className="pt-6 flex items-end justify-between border-t border-slate-200">
            <div className="space-y-0.5 text-[10px] text-slate-400">
              <p className="font-semibold text-slate-600">Audit Verification:</p>
              <p>• Official batch record from CityCare EMR Pharmacy Inventory Store.</p>
            </div>
            <div className="text-center space-y-1">
              <div className="w-32 border-b-2 border-slate-400 pb-1 font-serif text-slate-600 italic">
                Store Manager
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
