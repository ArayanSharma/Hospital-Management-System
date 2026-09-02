import React from "react";

export default function TopManufacturersCard({ manufacturers = [], onViewAll }) {
  if (!manufacturers || manufacturers.length === 0) {
    return (
      <div className="bg-white border border-slate-200/80 rounded-2xl p-4.5 shadow-xs">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-sm font-bold text-slate-900">Top Manufacturers</h3>
          <button
            type="button"
            onClick={onViewAll}
            className="text-xs font-semibold text-blue-600 hover:text-blue-700 transition-colors cursor-pointer"
          >
            View All
          </button>
        </div>
        <div className="text-center py-6 text-xs text-slate-400 font-medium">
          No top manufacturers recorded yet.
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white border border-slate-200/80 rounded-2xl p-4.5 shadow-xs">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-sm font-bold text-slate-900">Top Manufacturers</h3>
        <button
          type="button"
          onClick={onViewAll}
          className="text-xs font-semibold text-blue-600 hover:text-blue-700 transition-colors cursor-pointer"
        >
          View All
        </button>
      </div>

      <div className="space-y-2.5">
        {manufacturers.map((item, idx) => (
          <div
            key={item.rank || idx}
            className="flex items-center justify-between py-1 px-1.5 rounded-xl hover:bg-slate-50 transition-colors"
          >
            <div className="flex items-center gap-3">
              <span className="w-6 h-6 rounded-full bg-slate-100 border border-slate-200/80 flex items-center justify-center text-[11px] font-bold text-slate-600 shrink-0">
                {item.rank || idx + 1}
              </span>
              <span className="text-xs font-bold text-slate-800">{item.name}</span>
            </div>

            <span className="text-xs font-semibold text-slate-500">{item.count} Medicines</span>
          </div>
        ))}
      </div>
    </div>
  );
}
