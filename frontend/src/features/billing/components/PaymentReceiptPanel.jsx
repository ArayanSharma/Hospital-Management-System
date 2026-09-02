import React from "react";
import { X, Building2, Printer } from "lucide-react";
import { formatRupee, numberToWords, formatReportDate } from "../helpers/invoiceCalculations.js";
import { downloadRadiologyReportPdf } from "../../radiology/helpers/radiologyPdfHelper.js";

export default function PaymentReceiptPanel({
  receipt,
  onClose,
}) {
  if (!receipt) return null;

  const rcpNumber = receipt.receiptNumber || "RCP-2026-000001";
  const rcpDate = receipt.paidAt
    ? `${formatReportDate(receipt.paidAt)}`
    : formatReportDate(new Date());

  const patientName = receipt.patientId?.name || receipt.patientName || "Patient";
  const uhid = receipt.patientId?.patientId || receipt.uhid || "UHID";
  const invoiceId = receipt.invoiceId?.invoiceNumber || receipt.invoiceNumber || "INV-2026";
  const paymentMode = (receipt.method || "Cash").toUpperCase();
  const transactionNo = receipt.transactionId || "N/A";
  const receivedBy = receipt.receivedBy?.name || "Staff";

  const amountReceived = receipt.amount || 0;
  const invoiceTotal = receipt.invoiceId?.total || amountReceived;
  const currentPaid = receipt.invoiceId?.amountPaid || amountReceived;
  const remainingDue = receipt.invoiceId?.dueAmount !== undefined
    ? receipt.invoiceId.dueAmount
    : Math.max(0, invoiceTotal - currentPaid);

  const depts = receipt.invoiceId?.departments?.length > 0
    ? receipt.invoiceId.departments.join(", ")
    : "Hospital Services";

  const handlePrint = () => {
    downloadRadiologyReportPdf("payment-receipt-printable-container", `${rcpNumber}_Receipt.pdf`);
  };

  return (
    <div id="payment-receipt-panel-section" className="bg-white border border-slate-200/90 rounded-2xl p-5 shadow-2xs space-y-4">
      {/* Header Bar */}
      <div className="flex items-center justify-between border-b border-slate-100 pb-3">
        <h2 className="text-sm font-bold text-slate-900">Payment Receipt</h2>
        <button
          type="button"
          onClick={onClose}
          className="p-1 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition cursor-pointer"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      {/* PRINTABLE RECEIPT CONTAINER */}
      <div
        id="payment-receipt-printable-container"
        className="bg-white border border-slate-200/90 rounded-xl p-4 space-y-4 text-xs"
      >
        {/* Branding Header */}
        <div className="flex items-start justify-between border-b border-slate-100 pb-3">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-blue-600 text-white flex items-center justify-center font-extrabold text-sm shadow-2xs">
              <Building2 className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-extrabold text-slate-900 text-sm leading-none">CityCare</h3>
              <p className="text-[10px] font-bold text-slate-500 tracking-wide uppercase">Hospital</p>
            </div>
          </div>

          <div className="text-right">
            <h4 className="text-xs font-black text-slate-400 tracking-wider uppercase">RECEIPT</h4>
            <p className="text-sm font-mono font-extrabold text-emerald-600">{rcpNumber}</p>
          </div>
        </div>

        {/* Receipt Key-Value Details Grid */}
        <div className="grid grid-cols-2 gap-x-4 gap-y-1.5 text-xs">
          <div>
            <span className="text-slate-400 font-medium">Receipt Date:</span>
            <span className="font-bold text-slate-800 ml-1.5">{rcpDate}</span>
          </div>
          <div>
            <span className="text-slate-400 font-medium">Payment Mode:</span>
            <span className="font-bold text-slate-800 ml-1.5">{paymentMode}</span>
          </div>
          <div>
            <span className="text-slate-400 font-medium">Patient Name:</span>
            <span className="font-bold text-slate-900 ml-1.5">{patientName}</span>
          </div>
          <div>
            <span className="text-slate-400 font-medium">Transaction No.:</span>
            <span className="font-mono text-slate-800 ml-1.5">{transactionNo}</span>
          </div>
          <div>
            <span className="text-slate-400 font-medium">UHID:</span>
            <span className="font-mono font-bold text-slate-800 ml-1.5">{uhid}</span>
          </div>
          <div>
            <span className="text-slate-400 font-medium">Received By:</span>
            <span className="font-bold text-slate-800 ml-1.5">{receivedBy}</span>
          </div>
          <div>
            <span className="text-slate-400 font-medium">Invoice ID:</span>
            <span className="font-mono font-bold text-blue-600 ml-1.5">{invoiceId}</span>
          </div>
        </div>

        {/* Itemized Table */}
        <div className="border border-slate-200/80 rounded-xl overflow-hidden mt-2">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200/80 text-[10px] font-bold text-slate-500 uppercase">
                <th className="py-2 px-3 w-8">#</th>
                <th className="py-2 px-3">Description</th>
                <th className="py-2 px-3 text-right">Invoice Amount</th>
                <th className="py-2 px-3 text-right">Paid Amount</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-medium text-slate-800">
              <tr>
                <td className="py-2.5 px-3">1</td>
                <td className="py-2.5 px-3">
                  <p className="font-semibold text-slate-900">Payment for Invoice {invoiceId}</p>
                  <p className="text-[10px] text-slate-400">({depts})</p>
                </td>
                <td className="py-2.5 px-3 text-right font-bold">{formatRupee(invoiceTotal)}</td>
                <td className="py-2.5 px-3 text-right font-bold text-emerald-700">{formatRupee(amountReceived)}</td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* Amount Received & Remaining Due Totals */}
        <div className="space-y-1 text-right text-xs pt-1">
          <div className="flex justify-end gap-6">
            <span className="text-slate-500 font-semibold">Amount Received</span>
            <span className="font-extrabold text-slate-900 w-28">{formatRupee(amountReceived)}</span>
          </div>
          <div className="flex justify-end gap-6">
            <span className="text-slate-500 font-semibold">Remaining Due</span>
            <span className="font-extrabold text-rose-600 w-28">{formatRupee(remainingDue)}</span>
          </div>
        </div>

        {/* Amount in Words */}
        <div className="pt-2 border-t border-slate-100 flex items-center justify-between">
          <p className="text-xs text-slate-600 italic">
            <span className="font-bold text-slate-800 not-italic">Amount in Words: </span>
            {numberToWords(amountReceived)}
          </p>

          <button
            type="button"
            onClick={handlePrint}
            className="flex items-center gap-1.5 px-3.5 py-1.5 bg-white border border-slate-200 hover:bg-slate-50 text-blue-600 font-bold text-xs rounded-xl transition cursor-pointer shadow-2xs"
          >
            <Printer className="w-3.5 h-3.5" />
            <span>Print</span>
          </button>
        </div>
      </div>
    </div>
  );
}
