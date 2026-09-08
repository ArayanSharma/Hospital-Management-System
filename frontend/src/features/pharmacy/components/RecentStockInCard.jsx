import React from "react";
import { Pill } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function RecentStockInCard({ items = [], isLoading }) {
  const navigate = useNavigate();

  if (isLoading) {
    return (
      <div className="bg-white border border-slate-200/70 rounded-2xl p-5 shadow-xs animate-pulse h-full space-y-4">
        <div className="flex justify-between">
          <div className="h-5 w-36 bg-slate-200 rounded" />
          <div className="h-4 w-16 bg-slate-100 rounded" />
        </div>
        {[...Array(5)].map((_, i) => (
          <div key={i} className="h-10 bg-slate-100 rounded" />
        ))}
      </div>
    );
  }

  return (
    <div className="bg-white border border-slate-200/70 rounded-2xl p-5 shadow-xs flex flex-col justify-between h-full">
      <div>
        <div className="flex items-center justify-between mb-3 pb-1">
          <h3 className="text-base font-bold text-slate-900">Recent Stock In</h3>
          <button
            type="button"
            onClick={() => navigate("/pharmacy/inventory")}
            className="text-xs font-semibold text-blue-600 hover:text-blue-700 hover:underline cursor-pointer transition-colors"
          >
            View All
          </button>
        </div>

        {items.length === 0 ? (
          <div className="text-center py-8 text-xs text-slate-400 font-medium">
            No stock refilling records found.
          </div>
        ) : (
          <div className="divide-y divide-slate-100">
            {items.map((row, idx) => (
              <div key={row.id || row._id || idx} className="py-2.5 flex items-center justify-between gap-3 hover:bg-slate-50/50 rounded-lg transition-colors px-1">
                <div className="flex items-center gap-3 min-w-0">
                  <div className={`w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 ${row.colorBg || "bg-blue-50 text-blue-600"}`}>
                    <Pill className="w-4 h-4" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-sm font-bold text-slate-900 truncate leading-tight">{row.name || row.medicineName}</p>
                    <p className="text-xs text-slate-400 font-medium">Batch: {row.batchNo || "PCM650"}</p>
                  </div>
                </div>

                <div className="text-right flex-shrink-0">
                  <p className="text-xs font-bold text-slate-800">{row.quantity || row.qtyReceived || 100} {row.unit || "Strip"}</p>
                  <p className="text-[11px] text-slate-400">{row.date || "Today"}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
