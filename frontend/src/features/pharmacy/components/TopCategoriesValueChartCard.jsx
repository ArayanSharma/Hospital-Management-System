import React from "react";
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from "recharts";

const CustomTooltip = ({ active, payload }) => {
  if (active && payload && payload.length) {
    const data = payload[0].payload;
    return (
      <div className="bg-slate-900 text-white px-3 py-2 rounded-lg text-xs shadow-xl border border-slate-700 font-sans z-50">
        <p className="font-semibold">{data.category}</p>
        <p className="text-slate-300">Value: <span className="font-bold text-white">{data.amount}</span></p>
        <p className="text-slate-300">Share: <span className="font-bold text-white">{data.percentage}</span></p>
      </div>
    );
  }
  return null;
};

export default function TopCategoriesValueChartCard({ categories = [], onViewReport }) {
  if (!categories || categories.length === 0) {
    return (
      <div className="bg-white border border-slate-200/70 rounded-2xl p-5 shadow-xs flex flex-col justify-between h-full">
        <div>
          <div className="flex items-center justify-between mb-3 pb-1">
            <h3 className="text-sm font-bold text-slate-900">Top Categories by Stock Value</h3>
            <button
              type="button"
              onClick={onViewReport}
              className="text-xs font-semibold text-blue-600 hover:text-blue-700 hover:underline cursor-pointer transition-colors"
            >
              View Report
            </button>
          </div>
          <div className="text-center py-8 text-xs text-slate-400 font-medium">
            No stock category valuation data available yet.
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white border border-slate-200/70 rounded-2xl p-5 shadow-xs flex flex-col justify-between h-full">
      <div>
        <div className="flex items-center justify-between mb-3 pb-1">
          <h3 className="text-sm font-bold text-slate-900">Top Categories by Stock Value</h3>
          <button
            type="button"
            onClick={onViewReport}
            className="text-xs font-semibold text-blue-600 hover:text-blue-700 hover:underline cursor-pointer transition-colors"
          >
            View Report
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-12 gap-3 items-center min-h-[190px]">
          {/* Donut Chart Container */}
          <div className="sm:col-span-5 relative flex items-center justify-center h-44">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={categories}
                  cx="50%"
                  cy="50%"
                  innerRadius={46}
                  outerRadius={66}
                  paddingAngle={2}
                  dataKey="rawAmount"
                  strokeWidth={0}
                >
                  {categories.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color || "#3B82F6"} />
                  ))}
                </Pie>
                <Tooltip content={<CustomTooltip />} />
              </PieChart>
            </ResponsiveContainer>
          </div>

          {/* Category breakdown legend list */}
          <div className="sm:col-span-7 space-y-1.5">
            {categories.map((item, idx) => (
              <div key={idx} className="flex items-center justify-between text-xs">
                <div className="flex items-center gap-2">
                  <span
                    className="w-2.5 h-2.5 rounded-full flex-shrink-0"
                    style={{ backgroundColor: item.color || "#3B82F6" }}
                  />
                  <span className="font-medium text-slate-600">{item.category}</span>
                </div>
                <span className="font-semibold text-slate-900">
                  {item.amount} ({item.percentage})
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Footnote */}
      <div className="pt-3 mt-3 border-t border-slate-100 text-[11px] text-slate-400 flex items-center gap-1.5">
        <span>ⓘ Note: Stock values are based on latest purchase price.</span>
      </div>
    </div>
  );
}
