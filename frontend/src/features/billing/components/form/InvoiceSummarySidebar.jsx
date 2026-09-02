import React from "react";
import { FileText, Clock } from "lucide-react";
import { formatRupee } from "../../helpers/invoiceCalculations.js";

export default function InvoiceSummarySidebar({ form }) {
  const {
    totals,
    manualDiscount,
    setManualDiscount,
    roundOffInput,
    setRoundOffInput,
  } = form;

  const paidAmount = 0;
  const dueAmount = totals.totalAmount;

  return (
    <div className="space-y-4">
      {/* Card 1: Invoice Summary */}
      <div className="bg-white border border-slate-200/90 rounded-2xl p-4 shadow-2xs space-y-3">
        <div className="flex items-center gap-2 border-b border-slate-100 pb-2.5">
          <FileText className="w-4 h-4 text-blue-600" />
          <h3 className="text-xs font-extrabold text-blue-700 uppercase tracking-wide">
            Invoice Summary
          </h3>
        </div>

        <div className="space-y-2.5 text-xs font-medium">
          {/* Sub Total */}
          <div className="flex items-center justify-between text-slate-700">
            <span>Sub Total</span>
            <span className="font-bold text-slate-900">{formatRupee(totals.rawSubTotal)}</span>
          </div>

          {/* Discount (-) */}
          <div className="flex items-center justify-between text-slate-700">
            <span>Discount (-)</span>
            <input
              type="number"
              step="0.01"
              value={manualDiscount}
              onChange={(e) => setManualDiscount(e.target.value)}
              className="w-24 text-right bg-slate-50 border border-slate-200 rounded-lg px-2 py-1 text-xs font-bold text-slate-800 focus:outline-none focus:border-blue-500"
            />
          </div>

          {/* Taxable Amount (Senior Architect Formula: Subtotal - Discount) */}
          <div className="flex items-center justify-between text-slate-700">
            <span className="font-bold text-slate-800">Taxable Amount</span>
            <span className="font-bold text-slate-900">{formatRupee(totals.taxableAmount)}</span>
          </div>

          {/* GST (12%) */}
          <div className="flex items-center justify-between text-slate-700">
            <span>GST (12%)</span>
            <span className="font-bold text-slate-900">{formatRupee(totals.totalGst)}</span>
          </div>

          {/* Round Off */}
          <div className="flex items-center justify-between text-slate-700">
            <span>Round Off</span>
            <input
              type="number"
              step="0.01"
              value={roundOffInput}
              onChange={(e) => setRoundOffInput(e.target.value)}
              className="w-24 text-right bg-slate-50 border border-slate-200 rounded-lg px-2 py-1 text-xs font-bold text-slate-800 focus:outline-none focus:border-blue-500"
            />
          </div>

          <div className="border-t border-slate-100 my-1 pt-2 space-y-2">
            {/* Total Amount */}
            <div className="flex items-center justify-between text-sm">
              <span className="font-extrabold text-blue-900">Total Amount</span>
              <span className="font-black text-blue-600 text-base">{formatRupee(totals.totalAmount)}</span>
            </div>

            {/* Paid Amount */}
            <div className="flex items-center justify-between text-slate-700">
              <span>Paid Amount</span>
              <span className="font-bold text-slate-900">{formatRupee(paidAmount)}</span>
            </div>

            {/* Due Amount */}
            <div className="flex items-center justify-between text-sm">
              <span className="font-bold text-slate-800">Due Amount</span>
              <span className="font-black text-rose-600 text-base">{formatRupee(dueAmount)}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Card 2: Invoice Status (System Controlled as specified by Senior Architect) */}
      <div className="bg-white border border-slate-200/90 rounded-2xl p-4 shadow-2xs space-y-3">
        <div className="flex items-center justify-between border-b border-slate-100 pb-2">
          <div className="flex items-center gap-2">
            <Clock className="w-4 h-4 text-blue-600" />
            <h3 className="text-xs font-extrabold text-blue-700 uppercase tracking-wide">
              Invoice Status
            </h3>
          </div>
          <span className="text-[9px] font-bold bg-slate-100 text-slate-600 px-1.5 py-0.5 rounded border border-slate-200">
            SYSTEM CONTROLLED
          </span>
        </div>

        <div className="p-3 bg-rose-50/70 border border-rose-200/80 rounded-xl space-y-1">
          <div className="flex items-center justify-between">
            <span className="text-xs font-extrabold text-rose-700">Initial Status: UNPAID</span>
            <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-rose-100 text-rose-800 border border-rose-200">
              Unpaid
            </span>
          </div>
          <p className="text-[10px] text-slate-500 leading-tight">
            Status automatically updates from Unpaid ➔ Partially Paid ➔ Paid upon collecting payment.
          </p>
        </div>
      </div>
    </div>
  );
}
