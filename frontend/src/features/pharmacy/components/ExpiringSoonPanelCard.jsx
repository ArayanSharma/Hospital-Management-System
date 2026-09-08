import React from "react";
import { Pill } from "lucide-react";

export default function ExpiringSoonPanelCard({ items = [], onViewAll }) {
  return (
    <div className="bg-white border border-slate-200/70 rounded-2xl p-5 shadow-xs flex flex-col justify-between">
      <div>
        <div className="flex items-center justify-between mb-3 pb-1">
          <h3 className="text-sm font-bold text-slate-900">Expiring Soon (Within 30 Days)</h3>
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
            No items expiring within 30 days.
          </div>
        ) : (
          <div className="space-y-3">
            {items.map((row) => (
              <div key={row.id} className="flex items-center justify-between p-2 rounded-xl hover:bg-slate-50 transition-colors">
                <div className="flex items-center gap-3 min-w-0">
                  <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center flex-shrink-0">
                    <Pill className="w-4 h-4" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-xs font-bold text-slate-900 truncate leading-tight">{row.medicine || row.name}</p>
                    <p className="text-[11px] text-slate-400 font-medium">Batch: {row.batchNo}</p>
                  </div>
                </div>

                <div className="text-right flex-shrink-0">
                  <p className="text-xs font-semibold text-slate-700">{row.expiryDate}</p>
                  <p className="text-[11px] font-semibold text-emerald-600">
                    {row.daysLeft}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
