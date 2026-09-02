import React from "react";

export default function RecentPurchaseOrdersCard({
  items = [],
  totalPendingOrders = 0,
  totalPendingAmount = "₹ 0.00",
  onViewAll,
}) {
  return (
    <div className="bg-white border border-slate-200/70 rounded-2xl p-5 shadow-xs flex flex-col justify-between">
      <div>
        <div className="flex items-center justify-between mb-3 pb-1">
          <h3 className="text-sm font-bold text-slate-900">Recent Purchase Orders</h3>
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
            No purchase orders created yet.
          </div>
        ) : (
          <div className="space-y-2.5">
            {items.map((row) => (
              <div key={row.id || row._id} className="p-2 rounded-xl hover:bg-slate-50 border border-transparent hover:border-slate-100 transition-colors">
                <div className="flex items-center justify-between gap-2 mb-0.5">
                  <span className="text-xs font-bold text-blue-600">{row.poNo}</span>
                  <span className={`px-2 py-0.5 text-[10px] font-bold rounded-md ${row.status === "Received" ? "bg-emerald-50 text-emerald-600" : "bg-amber-50 text-amber-600"}`}>
                    {row.status}
                  </span>
                </div>

                <div className="flex items-center justify-between text-xs">
                  <span className="font-semibold text-slate-800 truncate max-w-[160px]">{row.supplierName}</span>
                  <span className="font-bold text-slate-900">
                    {typeof row.amount === "number" ? `₹ ${row.amount.toLocaleString("en-IN")}` : row.amount}
                  </span>
                </div>

                <p className="text-[10px] text-slate-400 font-medium">{row.date}</p>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Bottom Pending Orders Summary */}
      <div className="pt-3.5 mt-3 border-t border-slate-100 flex items-center justify-between text-xs">
        <span className="font-bold text-slate-700">Total Pending Orders: {totalPendingOrders}</span>
        <span className="font-extrabold text-rose-600 tracking-tight">{totalPendingAmount}</span>
      </div>
    </div>
  );
}
