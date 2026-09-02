import React from "react";
import { useNavigate } from "react-router-dom";

export default function LowStockAlertsCard({ items = [], isLoading }) {
  const navigate = useNavigate();

  if (isLoading) {
    return (
      <div className="bg-white border border-slate-200/70 rounded-2xl p-5 shadow-xs animate-pulse space-y-4">
        <div className="flex justify-between">
          <div className="h-5 w-36 bg-slate-200 rounded" />
          <div className="h-4 w-16 bg-slate-100 rounded" />
        </div>
        {[...Array(4)].map((_, i) => (
          <div key={i} className="h-10 bg-slate-100 rounded" />
        ))}
      </div>
    );
  }

  return (
    <div className="bg-white border border-slate-200/70 rounded-2xl p-5 shadow-xs flex flex-col justify-between h-full">
      <div>
        <div className="flex items-center justify-between mb-3 pb-1">
          <h3 className="text-base font-bold text-slate-900">Low Stock Alerts</h3>
          <button
            type="button"
            onClick={() => navigate("/pharmacy/inventory?filter=low_stock")}
            className="text-xs font-semibold text-blue-600 hover:text-blue-700 hover:underline cursor-pointer transition-colors"
          >
            View All
          </button>
        </div>

        {items.length === 0 ? (
          <div className="text-center py-8 text-xs text-slate-400 font-medium">
            No low stock alert items.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-100 text-xs font-semibold text-slate-400">
                  <th className="py-2.5 font-semibold">Medicine</th>
                  <th className="py-2.5 font-semibold">Batch No.</th>
                  <th className="py-2.5 text-center font-semibold">Available Stock</th>
                  <th className="py-2.5 text-center font-semibold">Unit</th>
                  <th className="py-2.5 text-center font-semibold">Min. Level</th>
                  <th className="py-2.5 text-right font-semibold">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-xs">
                {items.map((row, idx) => (
                  <tr key={row.id || row._id || idx} className="hover:bg-slate-50/50 transition-colors">
                    <td className="py-3 font-semibold text-slate-800">{row.medicine || row.name}</td>
                    <td className="py-3 font-medium text-slate-500">{row.batchNo || row.code || "PCM650"}</td>
                    <td className="py-3 text-center font-bold text-slate-800">{row.availableStock ?? row.currentStock ?? 10}</td>
                    <td className="py-3 text-center font-medium text-slate-500">{row.unit || "Strip"}</td>
                    <td className="py-3 text-center font-medium text-slate-500">{row.minLevel ?? row.minStockLevel ?? 50}</td>
                    <td className="py-3 text-right">
                      <span className="bg-amber-50 text-amber-600 border border-amber-200/80 px-2.5 py-1 rounded-md text-[11px] font-semibold inline-block">
                        {row.status || "Low Stock"}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
