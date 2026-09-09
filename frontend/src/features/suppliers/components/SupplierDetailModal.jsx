import React from "react";
import { X, Printer, Building2, User, Phone, Mail, MapPin, Tag, ShieldCheck } from "lucide-react";

export default function SupplierDetailModal({ supplier, isOpen, onClose }) {
  if (!isOpen || !supplier) return null;

  const supplierName = supplier.name || "Vendor Partner";
  const supplierCode = supplier.supplierCode || supplier._id || "SUP-001";
  const contactPerson = supplier.contactPerson || "N/A";
  const designation = supplier.designation || "Sales Representative";
  const phone = supplier.phone || "N/A";
  const email = supplier.email || "N/A";
  const location = supplier.location || "N/A";
  const category = supplier.category || "Pharmaceuticals";
  const status = supplier.status || "Active";
  const paymentStatus = supplier.paymentStatus || "Paid";
  const lastPurchase = supplier.lastPurchase || "N/A";
  const totalPurchases = Number(supplier.totalPurchases || 0);

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-xs p-4 animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl shadow-2xl border border-slate-100 max-w-2xl w-full p-6 space-y-4 animate-in zoom-in-95 duration-200 max-h-[90vh] overflow-y-auto">
        {/* Header Controls Bar (Hidden during actual print) */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-100 print:hidden">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center font-bold">
              <Building2 className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900">{supplierName}</h3>
              <p className="text-xs text-slate-500 font-medium">Supplier Code: {supplierCode}</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handlePrint}
              className="px-3.5 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold shadow-md shadow-blue-500/20 transition cursor-pointer flex items-center gap-1.5 active:scale-95"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Print Statement</span>
            </button>
            <button
              type="button"
              onClick={onClose}
              className="w-8 h-8 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 flex items-center justify-center transition cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* ====================================================================
           PRINTABLE SUPPLIER STATEMENT CONTAINER (Target for @media print CSS)
           ==================================================================== */}
        <div
          id="printable-supplier-statement"
          className="bg-white p-6 rounded-2xl border border-slate-200/80 text-slate-900 text-xs space-y-5 shadow-xs"
        >
          {/* 1. Hospital & Supplier Statement Header */}
          <div className="flex items-start justify-between border-b-2 border-blue-600 pb-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-blue-600 text-white flex items-center justify-center font-black text-xl shadow-md">
                <Building2 className="w-7 h-7" />
              </div>
              <div>
                <h1 className="text-lg font-extrabold text-blue-700 uppercase tracking-tight">
                  CityCare Hospital Procurement &amp; Vendor Management
                </h1>
                <p className="text-[11px] font-semibold text-slate-500">
                  123 Healthcare Boulevard, Metro City | Procurement Desk: +91 98765 43210
                </p>
                <p className="text-[10px] text-slate-400 font-mono">Vendor Registration &amp; Account Ledger Statement</p>
              </div>
            </div>

            <div className="text-right">
              <div className="inline-block px-3 py-1 bg-blue-50 text-blue-700 border border-blue-200 rounded-full font-black text-[11px] tracking-wider uppercase mb-1">
                Vendor Profile Statement
              </div>
              <p className="text-[11px] font-bold text-slate-700 font-mono">
                {supplierCode}
              </p>
              <p className="text-[10px] text-slate-400 font-medium">Generated: {new Date().toLocaleDateString("en-GB")}</p>
            </div>
          </div>

          {/* 2. Vendor Business & Commercial Profile Grid */}
          <div className="grid grid-cols-2 gap-4 bg-slate-50 p-4 rounded-xl border border-slate-200/70 text-xs">
            {/* Vendor Profile Info */}
            <div className="space-y-1.5 border-r border-slate-200/80 pr-4">
              <div className="flex items-center gap-1.5 text-blue-700 font-extrabold text-[10px] uppercase tracking-wider">
                <Building2 className="w-3.5 h-3.5" />
                <span>Vendor Company Details</span>
              </div>
              <p className="font-extrabold text-slate-900 text-sm">{supplierName}</p>
              <div className="space-y-0.5 text-[11px] font-medium text-slate-600">
                <p><span className="font-bold text-slate-700">Category:</span> <span className="font-bold text-blue-600">{category}</span></p>
                <p><span className="font-bold text-slate-700">Location / City:</span> {location}</p>
                <p><span className="font-bold text-slate-700">Vendor Status:</span> <span className="font-bold text-emerald-600 uppercase">{status}</span></p>
              </div>
            </div>

            {/* Representative & Contact Info */}
            <div className="space-y-1.5 pl-2">
              <div className="flex items-center gap-1.5 text-purple-700 font-extrabold text-[10px] uppercase tracking-wider">
                <User className="w-3.5 h-3.5" />
                <span>Account Representative</span>
              </div>
              <p className="font-extrabold text-slate-900 text-sm">{contactPerson}</p>
              <div className="space-y-0.5 text-[11px] font-medium text-slate-600">
                <p><span className="font-bold text-slate-700">Designation:</span> {designation}</p>
                <p><span className="font-bold text-slate-700">Phone:</span> {phone}</p>
                <p><span className="font-bold text-slate-700">Email:</span> {email}</p>
              </div>
            </div>
          </div>

          {/* 3. Account Summary & Financial Purchase Dues */}
          <div className="space-y-2">
            <p className="font-extrabold text-slate-800 text-xs uppercase tracking-wider border-b border-slate-200 pb-1">
              Procurement &amp; Account Financial Summary
            </p>
            <div className="grid grid-cols-3 gap-3 text-center text-xs">
              <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl space-y-0.5">
                <p className="text-[10px] text-slate-400 font-bold uppercase">Last Purchase Date</p>
                <p className="font-extrabold text-slate-900 text-sm">{lastPurchase}</p>
              </div>

              <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl space-y-0.5">
                <p className="text-[10px] text-slate-400 font-bold uppercase">Payment Dues Status</p>
                <p className={`font-extrabold text-sm ${paymentStatus === "Paid" ? "text-emerald-600" : "text-amber-600"}`}>
                  {paymentStatus}
                </p>
              </div>

              <div className="p-3 bg-blue-50/50 border border-blue-200 rounded-xl space-y-0.5">
                <p className="text-[10px] text-blue-700 font-bold uppercase">Accumulated Purchases</p>
                <p className="font-black text-blue-900 text-base">
                  ₹ {totalPurchases.toLocaleString("en-IN", { minimumFractionDigits: 2 })}
                </p>
              </div>
            </div>
          </div>

          {/* 4. Quality & Compliance Notice */}
          <div className="p-3 bg-slate-50 border border-slate-200/80 rounded-xl space-y-1">
            <p className="font-bold text-slate-700 text-[10px] uppercase flex items-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
              <span>Procurement Quality &amp; Compliance Statement:</span>
            </p>
            <p className="text-slate-600 font-medium text-[11px] leading-relaxed">
              This vendor is verified and registered under CityCare Central Pharmacy Procurement Guidelines for pharmaceutical &amp; medical supply replenishment.
            </p>
          </div>

          {/* 5. Footer & Signatures */}
          <div className="pt-8 flex items-end justify-between border-t border-slate-200">
            <div className="space-y-1 text-[10px] text-slate-400">
              <p className="font-semibold text-slate-600">Verification Notice:</p>
              <p>• Computer-generated Supplier Account Statement.</p>
              <p>• Printed on {new Date().toLocaleString()}</p>
            </div>

            <div className="text-center space-y-1">
              <div className="w-36 border-b-2 border-slate-400 pb-1 font-serif text-slate-600 italic">
                Procurement Officer
              </div>
              <p className="font-extrabold text-slate-900 text-[11px]">Chief Procurement Officer</p>
              <p className="text-[10px] font-semibold text-slate-500">CityCare Central Hospital</p>
            </div>
          </div>
        </div>

        {/* Modal Bottom Close Button (Hidden during print) */}
        <div className="pt-2 flex justify-end print:hidden">
          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2 text-xs font-bold bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl transition cursor-pointer"
          >
            Close Details
          </button>
        </div>
      </div>
    </div>
  );
}
