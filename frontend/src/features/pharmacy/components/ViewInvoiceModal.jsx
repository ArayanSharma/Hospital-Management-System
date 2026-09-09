import React from "react";
import { X, Printer, Pill, Building2, CheckCircle2, ShieldCheck } from "lucide-react";

export default function ViewInvoiceModal({ invoice, isOpen, onClose }) {
  if (!isOpen || !invoice) return null;

  const invoiceNo = invoice.invoiceNo || invoice.saleInvoiceNo || invoice._id || "INV-RECEIPT";
  const customerName = invoice.patientName || invoice.customerName || "Customer Record";
  const customerId = invoice.patientId || invoice.customerId || "Walk-in";
  const saleType = invoice.patientType || invoice.saleType || "Walk-in";
  const paymentStatus = invoice.paymentStatus || "Paid";
  const paymentMethod = invoice.paymentMethod || "Cash";
  const totalAmount = Number(invoice.amount || invoice.totalAmount || 0);

  const dateStr = invoice.date || (invoice.createdAt ? new Date(invoice.createdAt).toLocaleDateString("en-GB") : new Date().toLocaleDateString());
  const timeStr = invoice.time || (invoice.createdAt ? new Date(invoice.createdAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }) : "");

  const items = Array.isArray(invoice.items) && invoice.items.length > 0
    ? invoice.items
    : Array.isArray(invoice.medicines) && invoice.medicines.length > 0
    ? invoice.medicines
    : [];

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-xs p-4 animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl shadow-2xl border border-slate-100 max-w-2xl w-full p-6 space-y-4 animate-in zoom-in-95 duration-200 max-h-[90vh] overflow-y-auto">
        {/* Modal Controls Bar (Hidden during actual print) */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-100 print:hidden">
          <div className="flex items-center gap-2 text-slate-600 text-xs font-semibold">
            <Pill className="w-4 h-4 text-emerald-600" />
            <span>Official Pharmacy Tax Invoice Receipt</span>
          </div>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handlePrint}
              className="px-3.5 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold shadow-md shadow-emerald-500/20 transition cursor-pointer flex items-center gap-1.5"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Print Invoice</span>
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
           PRINTABLE PHARMACY RECEIPT CONTAINER (Target for @media print CSS)
           ==================================================================== */}
        <div
          id="printable-pharmacy-receipt"
          className="bg-white p-6 rounded-2xl border border-slate-200/80 text-slate-900 text-xs space-y-5 shadow-xs"
        >
          {/* 1. Hospital Pharmacy Letterhead */}
          <div className="flex items-start justify-between border-b-2 border-emerald-600 pb-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-emerald-600 text-white flex items-center justify-center font-black text-xl shadow-md">
                <Building2 className="w-7 h-7" />
              </div>
              <div>
                <h1 className="text-lg font-extrabold text-emerald-800 uppercase tracking-tight">
                  CityCare Central Pharmacy &amp; Medical Store
                </h1>
                <p className="text-[11px] font-semibold text-slate-500">
                  123 Healthcare Boulevard, Metro City | Store Phone: +91 98765 43210
                </p>
                <p className="text-[10px] text-slate-400 font-mono">Drug License: DL-2026-9921 | GSTIN: 27AAAAA0000A1Z5</p>
              </div>
            </div>

            <div className="text-right">
              <div className="inline-block px-3 py-1 bg-emerald-50 text-emerald-800 border border-emerald-200 rounded-full font-black text-[11px] tracking-wider uppercase mb-1">
                GST Tax Invoice
              </div>
              <p className="text-[11px] font-bold text-slate-700 font-mono">
                {invoiceNo}
              </p>
              <p className="text-[10px] text-slate-400 font-medium">{dateStr} {timeStr && `| ${timeStr}`}</p>
            </div>
          </div>

          {/* 2. Customer & Transaction Details Grid */}
          <div className="grid grid-cols-2 gap-4 bg-slate-50 p-4 rounded-xl border border-slate-200/70 text-xs">
            <div className="space-y-1 border-r border-slate-200/80 pr-4">
              <p className="font-extrabold text-slate-900 text-sm">{customerName}</p>
              <p className="text-slate-600 font-medium"><span className="font-bold text-slate-700">Patient ID / UHID:</span> {customerId}</p>
              <p className="text-slate-600 font-medium"><span className="font-bold text-slate-700">Sale Category:</span> <span className="font-bold text-blue-600">{saleType}</span></p>
            </div>

            <div className="space-y-1 pl-2 text-right">
              <p className="text-slate-600 font-medium"><span className="font-bold text-slate-700">Payment Status:</span> <span className="font-bold text-emerald-600 uppercase">{paymentStatus}</span></p>
              <p className="text-slate-600 font-medium"><span className="font-bold text-slate-700">Payment Method:</span> {paymentMethod}</p>
              <p className="text-slate-600 font-medium"><span className="font-bold text-slate-700">GST Dues:</span> Exempted / Included</p>
            </div>
          </div>

          {/* 3. Itemized Medicines Table */}
          <div className="space-y-2">
            <p className="font-extrabold text-slate-800 text-xs uppercase tracking-wider border-b border-slate-200 pb-1">
              Dispensed Pharmaceutical Medicines
            </p>
            {items.length > 0 ? (
              <table className="w-full text-left border-collapse border border-slate-200 rounded-lg overflow-hidden text-[11px]">
                <thead>
                  <tr className="bg-slate-100 text-slate-700 font-bold uppercase text-[10px]">
                    <th className="p-2 border-b border-slate-200">#</th>
                    <th className="p-2 border-b border-slate-200">Medicine Name</th>
                    <th className="p-2 border-b border-slate-200">Batch No</th>
                    <th className="p-2 border-b border-slate-200 text-center">Qty</th>
                    <th className="p-2 border-b border-slate-200 text-right">Price (₹)</th>
                    <th className="p-2 border-b border-slate-200 text-right">Total (₹)</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200 font-medium">
                  {items.map((item, idx) => {
                    const qty = item.quantity || 1;
                    const price = item.unitPrice || item.price || 0;
                    const lineTotal = item.amount || qty * price;
                    return (
                      <tr key={idx} className="hover:bg-slate-50">
                        <td className="p-2 font-bold text-slate-400">{idx + 1}</td>
                        <td className="p-2 font-extrabold text-slate-900">{item.medicineName || item.name || "Medicine"}</td>
                        <td className="p-2 text-slate-600 font-mono text-[10px]">{item.batchNo || "BATCH-2026"}</td>
                        <td className="p-2 text-center font-bold text-slate-800">{qty}</td>
                        <td className="p-2 text-right text-slate-700">₹{price.toFixed(2)}</td>
                        <td className="p-2 text-right font-extrabold text-slate-900">₹{lineTotal.toFixed(2)}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            ) : (
              <div className="p-3 bg-slate-50 border border-slate-200 rounded-lg flex items-center justify-between text-xs font-semibold">
                <span>Prescribed Medicines Dispensed</span>
                <span className="font-extrabold text-slate-900">₹ {totalAmount.toFixed(2)}</span>
              </div>
            )}
          </div>

          {/* 4. Financial Summary Card */}
          <div className="flex justify-end pt-2">
            <div className="w-64 bg-slate-50 p-3 rounded-xl border border-slate-200 space-y-1.5 text-xs">
              <div className="flex justify-between text-slate-600">
                <span>Subtotal:</span>
                <span>₹ {totalAmount.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-slate-600">
                <span>GST Tax (Included):</span>
                <span>₹ {(totalAmount * 0.05).toFixed(2)}</span>
              </div>
              <div className="flex justify-between pt-2 border-t border-slate-200 font-black text-sm text-slate-900">
                <span>Grand Total Paid:</span>
                <span className="text-emerald-600">₹ {totalAmount.toFixed(2)}</span>
              </div>
            </div>
          </div>

          {/* 5. Statutory Terms & Pharmacist Signature */}
          <div className="pt-8 flex items-end justify-between border-t border-slate-200">
            <div className="space-y-1 text-[10px] text-slate-400">
              <p className="font-semibold text-slate-600">Statutory Notice:</p>
              <p>• Medicines once sold cannot be returned without original GST invoice.</p>
              <p>• Keep medicines out of reach of children. Store in a cool dry place.</p>
            </div>

            <div className="text-center space-y-1">
              <div className="w-36 border-b-2 border-slate-400 pb-1 font-serif text-slate-600 italic">
                Registered Pharmacist
              </div>
              <p className="font-extrabold text-slate-900 text-[11px]">Authorized Pharmacist</p>
              <p className="text-[10px] font-semibold text-slate-500">CityCare Central Pharmacy</p>
            </div>
          </div>
        </div>

        {/* Modal Bottom Close Button */}
        <div className="pt-2 flex justify-end print:hidden">
          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2 text-xs font-bold bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl transition cursor-pointer"
          >
            Close Window
          </button>
        </div>
      </div>
    </div>
  );
}
