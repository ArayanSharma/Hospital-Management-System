import React, { useState, useEffect } from "react";
import { X, Calendar } from "lucide-react";
import { formatRupee, formatReportDate } from "../helpers/invoiceCalculations.js";
import { createPaymentApi } from "../services/payment.api.js";

export default function CollectPaymentPanel({
  invoice,
  onClose,
  onSuccess,
}) {
  if (!invoice) return null;

  const patientName = invoice.patientName || invoice.patientId?.name || "Patient";
  const invoiceDate = invoice.createdAt ? formatReportDate(invoice.createdAt) : formatReportDate(new Date());
  const invoiceId = invoice.invoiceNumber || "INV-2026-000001";
  const totalAmount = invoice.total || 0;
  const currentPaid = invoice.amountPaid || 0;
  const currentDue = invoice.dueAmount !== undefined ? invoice.dueAmount : Math.max(0, totalAmount - currentPaid);

  const [paidAmountInput, setPaidAmountInput] = useState(
    currentDue > 0 ? currentDue.toString() : "0.00"
  );
  const [paymentMode, setPaymentMode] = useState("UPI");
  const [transactionId, setTransactionId] = useState("");
  const [paymentDate, setPaymentDate] = useState(() => {
    return new Date().toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" });
  });
  const [notes, setNotes] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  useEffect(() => {
    if (invoice) {
      const due = invoice.dueAmount !== undefined ? invoice.dueAmount : Math.max(0, invoice.total - (invoice.amountPaid || 0));
      setPaidAmountInput(due > 0 ? due.toString() : "0.00");
    }
  }, [invoice]);

  const numPaid = parseFloat(paidAmountInput) || 0;
  const remainingDue = Math.max(0, currentDue - numPaid);

  const handleSubmitPayment = async (e) => {
    e.preventDefault();
    if (numPaid <= 0) {
      setErrorMsg("Paid amount must be greater than 0");
      return;
    }
    if (numPaid > currentDue + 0.01) {
      setErrorMsg(`Payment amount cannot exceed current due balance of ${formatRupee(currentDue)}`);
      return;
    }

    setSubmitting(true);
    setErrorMsg("");
    try {
      const res = await createPaymentApi({
        invoiceId: invoice._id,
        amount: numPaid,
        method: paymentMode.toLowerCase().replace(" ", "-"),
        transactionId: transactionId || "",
        notes: notes || "",
        paymentDate: new Date(),
      });

      if (onSuccess) {
        onSuccess(res.data?.data || res.data);
      }
    } catch (err) {
      const msg = err.response?.data?.message || "Failed to collect payment.";
      setErrorMsg(msg);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div id="collect-payment-panel-section" className="bg-white border border-slate-200/90 rounded-2xl p-5 shadow-2xs space-y-4">
      {/* Header Bar */}
      <div className="flex items-center justify-between border-b border-slate-100 pb-3">
        <h2 className="text-sm font-bold text-slate-900">Collect Payment</h2>
        <button
          type="button"
          onClick={onClose}
          className="p-1 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition cursor-pointer"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      {errorMsg && (
        <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl text-xs font-semibold text-rose-600">
          {errorMsg}
        </div>
      )}

      {/* Invoice Details Container */}
      <div className="bg-slate-50/70 border border-slate-200/70 rounded-xl p-3.5 space-y-2">
        <h3 className="text-[10px] font-bold tracking-wider uppercase text-slate-400">
          INVOICE DETAILS
        </h3>
        <div className="grid grid-cols-2 gap-y-1 text-xs">
          <div>
            <span className="text-slate-400">Patient Name</span>
            <p className="font-bold text-slate-900">{patientName}</p>
          </div>
          <div className="text-right">
            <span className="text-slate-400">Invoice ID</span>
            <p className="font-bold text-blue-600 font-mono">{invoiceId}</p>
          </div>
          <div>
            <span className="text-slate-400">Invoice Date</span>
            <p className="font-medium text-slate-700">{invoiceDate}</p>
          </div>
          <div className="text-right">
            <span className="text-slate-400">Total Amount</span>
            <p className="font-bold text-slate-900">{formatRupee(totalAmount)}</p>
          </div>
          <div className="col-span-2 text-right pt-1 border-t border-slate-200/60 flex items-center justify-between">
            <span className="text-slate-500 font-semibold">Due Amount</span>
            <span className="font-extrabold text-rose-600 text-sm">{formatRupee(currentDue)}</span>
          </div>
        </div>
      </div>

      {/* Payment Information Form */}
      <form onSubmit={handleSubmitPayment} className="space-y-3">
        <h3 className="text-[10px] font-bold tracking-wider uppercase text-slate-400 border-b border-slate-100 pb-1">
          PAYMENT INFORMATION
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {/* Paid Amount */}
          <div className="space-y-1">
            <label className="text-xs font-bold text-slate-800">
              Paid Amount <span className="text-rose-500">*</span>
            </label>
            <input
              type="number"
              step="0.01"
              required
              value={paidAmountInput}
              onChange={(e) => setPaidAmountInput(e.target.value)}
              className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-xs font-bold text-slate-900 focus:outline-none focus:border-blue-500"
              placeholder="0.00"
            />
          </div>

          {/* Payment Mode */}
          <div className="space-y-1">
            <label className="text-xs font-bold text-slate-800">
              Payment Mode <span className="text-rose-500">*</span>
            </label>
            <select
              value={paymentMode}
              onChange={(e) => setPaymentMode(e.target.value)}
              className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-xs font-bold text-slate-800 focus:outline-none focus:border-blue-500 cursor-pointer h-[38px]"
            >
              <option value="UPI">UPI</option>
              <option value="Cash">Cash</option>
              <option value="Card">Card</option>
              <option value="Cheque">Cheque</option>
              <option value="Bank Transfer">Bank Transfer</option>
            </select>
          </div>

          {/* Transaction / Reference No. */}
          <div className="space-y-1 col-span-1 sm:col-span-2">
            <label className="text-xs font-bold text-slate-800">
              Transaction / Reference No.
            </label>
            <input
              type="text"
              value={transactionId}
              onChange={(e) => setTransactionId(e.target.value)}
              placeholder="e.g. UPI/S12345678901"
              className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-800 focus:outline-none focus:border-blue-500 font-mono"
            />
          </div>

          {/* Payment Date */}
          <div className="space-y-1">
            <label className="text-xs font-bold text-slate-800">
              Payment Date <span className="text-rose-500">*</span>
            </label>
            <div className="relative">
              <input
                type="text"
                value={paymentDate}
                onChange={(e) => setPaymentDate(e.target.value)}
                className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-800 focus:outline-none focus:border-blue-500"
              />
              <Calendar className="w-3.5 h-3.5 text-slate-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
            </div>
          </div>

          {/* Notes */}
          <div className="space-y-1 col-span-1 sm:col-span-2">
            <label className="text-xs font-bold text-slate-800">Notes (Optional)</label>
            <textarea
              rows={2}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Enter payment notes..."
              className="w-full bg-white border border-slate-200 rounded-xl p-3 text-xs text-slate-800 focus:outline-none focus:border-blue-500 resize-none"
            />
          </div>
        </div>

        {/* Footer Remaining Due After Payment & Actions */}
        <div className="pt-3 border-t border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <span className="text-xs font-bold text-slate-700">Remaining Due After Payment: </span>
            <span className="text-xs font-extrabold text-rose-600">{formatRupee(remainingDue)}</span>
          </div>

          <div className="flex items-center gap-2 self-end sm:self-auto">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-white border border-slate-200 hover:bg-slate-50 text-slate-600 font-semibold text-xs rounded-xl transition cursor-pointer"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={submitting}
              className="px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-xl shadow-xs transition cursor-pointer disabled:opacity-50"
            >
              {submitting ? "Processing..." : "Collect Payment"}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}
