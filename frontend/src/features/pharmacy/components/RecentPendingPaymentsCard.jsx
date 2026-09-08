import React from "react";

export default function RecentPendingPaymentsCard({
  items = [],
  totalPending = "₹ 0.00",
  onViewAll,
  onSelectPending,
}) {
  return (
    <div className="bg-white border border-slate-200/70 rounded-2xl p-5 shadow-xs flex flex-col justify-between">
      <div>
        <div className="flex items-center justify-between mb-3 pb-1">
          <h3 className="text-sm font-bold text-slate-900">Recent Pending Payments</h3>
          <button
            type="button"
            onClick={onViewAll}
            className="text-xs font-semibold text-blue-600 hover:text-blue-700 hover:underline cursor-pointer transition-colors"
          >
            View All
          </button>
        </div>

        {items.length === 0 ? (
          <div className="text-center py-6 text-xs text-slate-400 font-medium">
            No pending payments.
          </div>
        ) : (
          <div className="space-y-2.5">
            {items.map((row) => (
              <div
                key={row.id || row._id}
                onClick={() => onSelectPending && onSelectPending(row)}
                className="flex items-center justify-between p-2 rounded-xl hover:bg-slate-50 border border-transparent hover:border-slate-100 transition-colors cursor-pointer"
              >
                <div>
                  <p className="text-xs font-bold text-blue-600 leading-tight">{row.invoiceNo}</p>
                  <p className="text-[11px] font-medium text-slate-500 mt-0.5">{row.patientName || row.customerName}</p>
                </div>
                <p className="text-xs font-bold text-amber-600">
                  {typeof row.amount === "number" ? `₹ ${row.amount.toLocaleString("en-IN", { minimumFractionDigits: 2 })}` : row.amount}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Bottom Total Pending Summary */}
      <div className="pt-3.5 mt-3 border-t border-slate-100 flex items-center justify-between">
        <span className="text-xs font-bold text-slate-700">Total Pending</span>
        <span className="text-sm font-extrabold text-rose-600 tracking-tight">{totalPending}</span>
      </div>
    </div>
  );
}
