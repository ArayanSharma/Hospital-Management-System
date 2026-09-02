import React from "react";

export default function GstDistributionCard({ gstData = [], onViewAll }) {
  if (!gstData || gstData.length === 0) {
    return (
      <div className="bg-white border border-slate-200/80 rounded-2xl p-4.5 shadow-xs">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-sm font-bold text-slate-900">GST Distribution</h3>
          <button
            type="button"
            onClick={onViewAll}
            className="text-xs font-semibold text-blue-600 hover:text-blue-700 transition-colors cursor-pointer"
          >
            View All
          </button>
        </div>
        <div className="text-center py-6 text-xs text-slate-400 font-medium">
          No GST distribution data recorded yet.
        </div>
      </div>
    );
  }

  const totalCount = gstData.reduce((sum, item) => sum + (item.count || 0), 0);

  return (
    <div className="bg-white border border-slate-200/80 rounded-2xl p-4.5 shadow-xs">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-sm font-bold text-slate-900">GST Distribution</h3>
        <button
          type="button"
          onClick={onViewAll}
          className="text-xs font-semibold text-blue-600 hover:text-blue-700 transition-colors cursor-pointer"
        >
          View All
        </button>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse text-xs">
          <thead>
            <tr className="border-b border-slate-100 text-[11px] font-semibold text-slate-400">
              <th className="py-1.5 px-1 font-semibold">GST Rate</th>
              <th className="py-1.5 px-1 text-center font-semibold">No. of Medicines</th>
              <th className="py-1.5 px-1 text-right font-semibold">Percentage</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-50 font-medium text-slate-700">
            {gstData.map((row, idx) => (
              <tr key={idx} className="hover:bg-slate-50/50">
                <td className="py-2 px-1 font-semibold text-slate-800">{row.rate}</td>
                <td className="py-2 px-1 text-center">{(row.count || 0).toLocaleString("en-IN")}</td>
                <td className="py-2 px-1 text-right font-semibold text-slate-600">{row.percentage}</td>
              </tr>
            ))}
          </tbody>
          <tfoot>
            <tr className="border-t border-slate-200 font-bold text-slate-900 text-xs">
              <td className="py-2.5 px-1">Total</td>
              <td className="py-2.5 px-1 text-center">{totalCount.toLocaleString("en-IN")}</td>
              <td className="py-2.5 px-1 text-right">100%</td>
            </tr>
          </tfoot>
        </table>
      </div>
    </div>
  );
}
