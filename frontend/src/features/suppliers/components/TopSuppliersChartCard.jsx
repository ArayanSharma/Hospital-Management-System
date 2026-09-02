import React from "react";

export default function TopSuppliersChartCard({ items = [], onViewAll, onSelectSupplier }) {
  if (!items || items.length === 0) {
    return (
      <div className="bg-white border border-slate-200/70 rounded-2xl p-5 shadow-xs flex flex-col justify-between">
        <div>
          <div className="flex items-center justify-between mb-3 pb-1">
            <h3 className="text-sm font-bold text-slate-900">Top Suppliers by Purchase Value</h3>
            <button
              type="button"
              onClick={onViewAll}
              className="text-xs font-semibold text-blue-600 hover:text-blue-700 hover:underline cursor-pointer transition-colors"
            >
              View All
            </button>
          </div>
          <div className="text-center py-6 text-xs text-slate-400 font-medium">
            No top suppliers recorded yet.
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white border border-slate-200/70 rounded-2xl p-5 shadow-xs flex flex-col justify-between">
      <div>
        <div className="flex items-center justify-between mb-3 pb-1">
          <h3 className="text-sm font-bold text-slate-900">Top Suppliers by Purchase Value</h3>
          <button
            type="button"
            onClick={onViewAll}
            className="text-xs font-semibold text-blue-600 hover:text-blue-700 hover:underline cursor-pointer transition-colors"
          >
            View All
          </button>
        </div>

        <div className="space-y-2.5">
          {items.map((row, idx) => {
            const rank = idx + 1;
            let rankBadge = "bg-blue-50 text-blue-600 font-bold";
            if (rank === 1) rankBadge = "bg-amber-500 text-white font-extrabold shadow-xs";
            if (rank === 2) rankBadge = "bg-slate-400 text-white font-extrabold shadow-xs";
            if (rank === 3) rankBadge = "bg-amber-700 text-white font-extrabold shadow-xs";

            return (
              <div
                key={row.id || row._id || idx}
                onClick={() => onSelectSupplier && onSelectSupplier(row)}
                className="flex items-center justify-between p-2 rounded-xl hover:bg-slate-50 border border-transparent hover:border-slate-100 transition-colors cursor-pointer"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <div className={`w-6 h-6 rounded-full text-xs flex items-center justify-center flex-shrink-0 ${rankBadge}`}>
                    {rank}
                  </div>
                  <p className="text-xs font-bold text-slate-900 truncate leading-tight">{row.name}</p>
                </div>
                <span className="text-xs font-bold text-slate-900 flex-shrink-0">
                  {typeof row.totalPurchases === "number" ? `₹ ${row.totalPurchases.toLocaleString("en-IN")}` : (row.totalPurchases || "₹ 0.00")}
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
