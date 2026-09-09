import React from "react";
import { Printer, X, Building2, User, CreditCard, Receipt, FileText, CheckCircle2, ShieldAlert } from "lucide-react";
import Modal from "../../../../components/ui/Modal.jsx";

export default function BillingPrintInvoiceModal({ invoice, isOpen, onClose }) {
  if (!isOpen || !invoice) return null;

  const invoiceNo = invoice.invoiceNumber || invoice._id || "INV-STATEMENT";
  const patientName = invoice.patientName || invoice.patientId?.name || "Patient Record";
  const patientPhone = invoice.patientPhone || invoice.patientId?.phone || "N/A";
  const patientUhid = invoice.uhid || invoice.patientId?.patientId || invoice.patientId?._id || "N/A";
  const departmentsStr = Array.isArray(invoice.departments) && invoice.departments.length > 0
    ? invoice.departments.join(", ")
    : "General OPD";

  const totalAmount = Number(invoice.total || 0);
  const paidAmount = Number(invoice.amountPaid || 0);
  const dueAmount = invoice.dueAmount !== undefined ? Number(invoice.dueAmount) : Math.max(0, totalAmount - paidAmount);
  const status = (invoice.status || "Unpaid").toUpperCase();

  const dateFormatted = invoice.createdAt
    ? new Date(invoice.createdAt).toLocaleDateString("en-GB", {
        weekday: "short",
        day: "numeric",
        month: "short",
        year: "numeric",
      })
    : new Date().toLocaleDateString();

  const timeFormatted = invoice.createdAt
    ? new Date(invoice.createdAt).toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
        hour12: true,
      })
    : "";

  const items = Array.isArray(invoice.items) && invoice.items.length > 0
    ? invoice.items
    : Array.isArray(invoice.breakdown) && invoice.breakdown.length > 0
    ? invoice.breakdown
    : [
        {
          description: `${departmentsStr} Medical Services & Clinical Consultation`,
          amount: totalAmount,
          quantity: 1,
        },
      ];

  const handlePrint = () => {
    window.print();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Print Medical Billing Invoice"
      subtitle={`Invoice Statement Reference #${invoiceNo}`}
      maxWidth="max-w-3xl"
    >
      <div className="space-y-4">
        {/* Printable Action Bar inside modal (hidden during actual browser print) */}
        <div className="flex items-center justify-between p-3 bg-slate-50 border border-slate-200/80 rounded-2xl print:hidden">
          <div className="flex items-center gap-2 text-slate-600 text-xs font-semibold">
            <Printer className="w-4 h-4 text-blue-600" />
            <span>Ready for official Hospital Letterhead Billing Statement print</span>
          </div>
          <button
            type="button"
            onClick={handlePrint}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold shadow-md shadow-blue-500/20 transition cursor-pointer flex items-center gap-2 active:scale-95"
          >
            <Printer className="w-4 h-4" />
            <span>Print Invoice Statement</span>
          </button>
        </div>

        {/* ====================================================================
           PRINTABLE BILLING INVOICE CONTAINER (Target for @media print CSS)
           ==================================================================== */}
        <div
          id="printable-billing-invoice"
          className="bg-white p-6 rounded-2xl border border-slate-200/80 text-slate-900 text-xs space-y-5 shadow-xs"
        >
          {/* 1. Hospital Letterhead Header */}
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
                  123 Healthcare Boulevard, Metro City | Billing Counter: +91 98765 43210
                </p>
                <p className="text-[10px] text-slate-400 font-mono">GSTIN: 27AAAAA0000A1Z5 | NABH Accredited EMR Billing</p>
              </div>
            </div>

            <div className="text-right">
              <div className="inline-block px-3 py-1 bg-blue-50 text-blue-700 border border-blue-200 rounded-full font-black text-[11px] tracking-wider uppercase mb-1">
                Medical Invoice Statement
              </div>
              <p className="text-[11px] font-bold text-slate-700 font-mono">
                {invoiceNo}
              </p>
              <p className="text-[10px] text-slate-400 font-medium">{dateFormatted} {timeFormatted && `| ${timeFormatted}`}</p>
            </div>
          </div>

          {/* 2. Patient & Department Details Grid */}
          <div className="grid grid-cols-2 gap-4 bg-slate-50 p-4 rounded-xl border border-slate-200/70 text-xs">
            {/* Patient Details */}
            <div className="space-y-1.5 border-r border-slate-200/80 pr-4">
              <div className="flex items-center gap-1.5 text-blue-700 font-extrabold text-[10px] uppercase tracking-wider">
                <User className="w-3.5 h-3.5" />
                <span>Billed Patient Information</span>
              </div>
              <p className="font-extrabold text-slate-900 text-sm">{patientName}</p>
              <div className="space-y-0.5 text-[11px] font-medium text-slate-600">
                <p><span className="font-bold text-slate-700">Patient UHID:</span> {patientUhid}</p>
                <p><span className="font-bold text-slate-700">Phone Number:</span> {patientPhone}</p>
              </div>
            </div>

            {/* Department & Account Status */}
            <div className="space-y-1.5 pl-2">
              <div className="flex items-center gap-1.5 text-purple-700 font-extrabold text-[10px] uppercase tracking-wider">
                <Receipt className="w-3.5 h-3.5" />
                <span>Department &amp; Payment Status</span>
              </div>
              <p className="font-extrabold text-slate-900 text-sm">Department: {departmentsStr}</p>
              <div className="space-y-0.5 text-[11px] font-medium text-slate-600">
                <p><span className="font-bold text-slate-700">Billing Status:</span> <span className={`font-extrabold ${status === "PAID" ? "text-emerald-600" : "text-rose-600"}`}>{status}</span></p>
                <p><span className="font-bold text-slate-700">Statement Reference:</span> {invoiceNo}</p>
              </div>
            </div>
          </div>

          {/* 3. Itemized Billing Breakdown Table */}
          <div className="space-y-2">
            <p className="font-extrabold text-slate-800 text-xs uppercase tracking-wider border-b border-slate-200 pb-1">
              Itemized Clinical Services &amp; Medical Dues
            </p>
            <table className="w-full text-left border-collapse border border-slate-200 rounded-lg overflow-hidden text-[11px]">
              <thead>
                <tr className="bg-slate-100 text-slate-700 font-bold uppercase text-[10px]">
                  <th className="p-2.5 border-b border-slate-200">#</th>
                  <th className="p-2.5 border-b border-slate-200">Service Description</th>
                  <th className="p-2.5 border-b border-slate-200 text-center">Qty</th>
                  <th className="p-2.5 border-b border-slate-200 text-right">Amount (₹)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 font-medium">
                {items.map((item, idx) => (
                  <tr key={idx} className="hover:bg-slate-50">
                    <td className="p-2.5 font-bold text-slate-400">{idx + 1}</td>
                    <td className="p-2.5 font-extrabold text-slate-900">{item.description || item.name || "Medical Consultation & Services"}</td>
                    <td className="p-2.5 text-center font-bold text-slate-800">{item.quantity || 1}</td>
                    <td className="p-2.5 text-right font-extrabold text-slate-900">
                      ₹ {(Number(item.amount || item.price || totalAmount)).toLocaleString("en-IN", { minimumFractionDigits: 2 })}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* 4. Financial Account Summary */}
          <div className="flex justify-end pt-2">
            <div className="w-72 bg-slate-50 p-3.5 rounded-xl border border-slate-200 space-y-2 text-xs">
              <div className="flex justify-between text-slate-600">
                <span>Total Billed Amount:</span>
                <span className="font-bold text-slate-900">₹ {totalAmount.toLocaleString("en-IN", { minimumFractionDigits: 2 })}</span>
              </div>
              <div className="flex justify-between text-slate-600">
                <span>Amount Settled / Paid:</span>
                <span className="font-bold text-emerald-600">₹ {paidAmount.toLocaleString("en-IN", { minimumFractionDigits: 2 })}</span>
              </div>
              <div className="flex justify-between pt-2 border-t border-slate-200 font-black text-sm text-slate-900">
                <span>Outstanding Dues Balance:</span>
                <span className={dueAmount > 0 ? "text-rose-600" : "text-emerald-600"}>
                  ₹ {dueAmount.toLocaleString("en-IN", { minimumFractionDigits: 2 })}
                </span>
              </div>
            </div>
          </div>

          {/* 5. Footer & Signatures */}
          <div className="pt-8 flex items-end justify-between border-t border-slate-200">
            <div className="space-y-1 text-[10px] text-slate-400">
              <p className="font-semibold text-slate-600">Statutory Notice:</p>
              <p>• This Medical Invoice Statement is computer-generated from CityCare EMR System.</p>
              <p>• Printed on {new Date().toLocaleString()}</p>
            </div>

            <div className="text-center space-y-1">
              <div className="w-36 border-b-2 border-slate-400 pb-1 font-serif text-slate-600 italic">
                Hospital Billing Desk
              </div>
              <p className="font-extrabold text-slate-900 text-[11px]">Authorized Billing Officer</p>
              <p className="text-[10px] font-semibold text-slate-500">CityCare Accounts Department</p>
            </div>
          </div>
        </div>
      </div>
    </Modal>
  );
}
