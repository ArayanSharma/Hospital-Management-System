import React from "react";
import { formatRupee, formatReportDate } from "../helpers/invoiceCalculations.js";
import { useNavigate } from "react-router-dom";
import { Inbox } from "lucide-react";

export default function RecentPaymentsCard({ recentPayments = [] }) {
  const navigate = useNavigate();

  const displayPayments = Array.isArray(recentPayments)
    ? recentPayments.map((p, idx) => ({
        id: p._id || idx,
        rcp: p.receiptNumber || `RCP-2026-${(1542 - idx).toString().padStart(4, "0")}`,
        name: p.patientId?.name || p.patientName || "Patient",
        date: p.paidAt ? formatReportDate(p.paidAt) : formatReportDate(new Date()),
        amount: p.amount || 0,
      }))
    : [];

  const todaysCollectionSum = displayPayments.reduce((sum, item) => sum + (item.amount || 0), 0);
  const todaysCollectionFormatted = formatRupee(todaysCollectionSum);

  return (
    <div className="bg-white border border-slate-200/80 rounded-2xl p-4 shadow-2xs space-y-3">
      <div className="flex items-center justify-between border-b border-slate-100 pb-2">
        <h3 className="text-xs font-bold text-slate-900">Recent Payments</h3>
        <button
          type="button"
          onClick={() => navigate("/payments")}
          className="text-[11px] font-bold text-blue-600 hover:underline cursor-pointer"
        >
          View All
        </button>
      </div>

      <div className="space-y-2 text-xs">
        {displayPayments.length === 0 ? (
          <div className="py-6 text-center text-slate-400 flex flex-col items-center gap-1">
            <Inbox className="w-4 h-4 text-slate-300" />
            <p className="text-xs font-medium text-slate-500">No payment receipts yet</p>
          </div>
        ) : (
          displayPayments.map((item) => (
            <div
              key={item.id}
              className="p-2.5 rounded-xl border border-slate-100 bg-slate-50/50 hover:bg-slate-50 flex items-center justify-between gap-2 transition"
            >
              <div className="leading-tight truncate">
                <p className="font-mono text-[11px] font-bold text-blue-600">{item.rcp}</p>
                <p className="font-bold text-slate-900 text-[11px] truncate">{item.name}</p>
                <p className="text-[10px] text-slate-400 font-medium">{item.date}</p>
              </div>

              <div className="text-right shrink-0">
                <p className="font-extrabold text-slate-900 text-xs">{formatRupee(item.amount)}</p>
                <span className="px-2 py-0.2 rounded-full text-[9px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200 inline-block mt-0.5">
                  Paid
                </span>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Emphasized Today's Collection Box */}
      <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs">
        <span className="font-bold text-slate-800">Today&apos;s Collection</span>
        <span className="font-black text-emerald-600 text-sm">{todaysCollectionFormatted}</span>
      </div>
    </div>
  );
}
