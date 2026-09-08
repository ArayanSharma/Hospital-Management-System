import React from "react";
import { useNavigate } from "react-router-dom";

export default function TopSellingMedicinesCard({ items = [], isLoading }) {
  const navigate = useNavigate();

  if (isLoading) {
    return (
      <div className="bg-white border border-slate-200/70 rounded-2xl p-5 shadow-xs animate-pulse h-full space-y-4">
        <div className="flex justify-between">
          <div className="h-5 w-44 bg-slate-200 rounded" />
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
          <h3 className="text-base font-bold text-slate-900">Top Selling Medicines (This Month)</h3>
          <button
            type="button"
            onClick={() => navigate("/pharmacy/sales")}
            className="text-xs font-semibold text-blue-600 hover:text-blue-700 hover:underline cursor-pointer transition-colors"
          >
            View All
          </button>
        </div>

        {items.length === 0 ? (
          <div className="text-center py-8 text-xs text-slate-400 font-medium">
            No medicine sales recorded yet.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-100 text-xs font-semibold text-slate-400">
                  <th className="py-2 font-semibold">Medicine</th>
                  <th className="py-2 text-right font-semibold">Sold Qty</th>
                  <th className="py-2 text-right font-semibold">Sales (₹)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-xs">
                {items.map((row, idx) => (
                  <tr key={row.id || row._id || idx} className="hover:bg-slate-50/50 transition-colors">
                    <td className="py-3 font-semibold text-slate-800">{row.medicine || row.name}</td>
                    <td className="py-3 text-right font-semibold text-slate-700">{(row.soldQty || row.count || 0).toLocaleString("en-IN")}</td>
                    <td className="py-3 text-right font-bold text-slate-900">{(row.salesAmount || row.totalAmount || 0).toLocaleString("en-IN")}</td>
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
