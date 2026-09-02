import React from "react";
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from "recharts";
import { Package } from "lucide-react";
import { useNavigate } from "react-router-dom";

const CustomTooltip = ({ active, payload }) => {
  if (active && payload && payload.length) {
    const data = payload[0].payload;
    return (
      <div className="bg-slate-900 text-white px-3 py-2 rounded-lg text-xs shadow-xl border border-slate-700 font-sans z-50">
        <p className="font-semibold">{data.name}</p>
        <p className="text-slate-300">Count: <span className="font-bold text-white">{data.value}</span></p>
        <p className="text-slate-300">Share: <span className="font-bold text-white">{data.percentage}</span></p>
      </div>
    );
  }
  return null;
};

export default function StockStatusOverviewCard({ stockData = [], isLoading }) {
  const navigate = useNavigate();

  if (isLoading) {
    return (
      <div className="bg-white border border-slate-200/70 rounded-2xl p-5 shadow-xs animate-pulse h-full flex flex-col justify-between">
        <div className="h-5 w-44 bg-slate-200 rounded mb-4" />
        <div className="h-48 bg-slate-100 rounded-full w-48 mx-auto" />
        <div className="h-10 bg-slate-100 rounded-xl mt-4" />
      </div>
    );
  }

  if (!stockData || stockData.length === 0) {
    return (
      <div className="bg-white border border-slate-200/70 rounded-2xl p-5 shadow-xs flex flex-col justify-between h-full">
        <div>
          <h3 className="text-base font-bold text-slate-900 mb-4">Stock Status Overview</h3>
          <div className="text-center py-8 text-xs text-slate-400 font-medium">
            No stock status overview data available yet.
          </div>
        </div>
        <div className="pt-4 mt-2 border-t border-slate-100">
          <button
            type="button"
            onClick={() => navigate("/pharmacy/inventory")}
            className="w-full bg-blue-50/70 hover:bg-blue-100/80 border border-blue-200/80 text-blue-600 text-sm font-semibold py-2.5 px-4 rounded-xl flex items-center justify-center gap-2 transition-colors cursor-pointer"
          >
            <Package className="w-4 h-4 text-blue-600" />
            <span>View Inventory</span>
          </button>
        </div>
      </div>
    );
  }

  const totalCount = stockData.reduce((sum, item) => sum + (item.value || 0), 0);

  return (
    <div className="bg-white border border-slate-200/70 rounded-2xl p-5 shadow-xs flex flex-col justify-between h-full">
      <div>
        <h3 className="text-base font-bold text-slate-900 mb-4">Stock Status Overview</h3>

        <div className="grid grid-cols-1 sm:grid-cols-12 gap-4 items-center min-h-[200px]">
          {/* Donut Chart Container */}
          <div className="sm:col-span-6 relative flex items-center justify-center h-48">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={stockData}
                  cx="50%"
                  cy="50%"
                  innerRadius={54}
                  outerRadius={76}
                  paddingAngle={2}
                  dataKey="value"
                  strokeWidth={0}
                >
                  {stockData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color || "#3B82F6"} />
                  ))}
                </Pie>
                <Tooltip content={<CustomTooltip />} />
              </PieChart>
            </ResponsiveContainer>

            {/* Donut Center Overlay */}
            <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
              <span className="text-xl font-bold text-slate-900 leading-none mb-0.5">
                {totalCount.toLocaleString("en-IN")}
              </span>
              <span className="text-xs font-medium text-slate-400">Total</span>
            </div>
          </div>

          {/* Legend / Category List */}
          <div className="sm:col-span-6 space-y-2.5">
            {stockData.map((item, idx) => (
              <div key={idx} className="flex items-center justify-between text-xs">
                <div className="flex items-center gap-2">
                  <span
                    className="w-2.5 h-2.5 rounded-full flex-shrink-0"
                    style={{ backgroundColor: item.color || "#3B82F6" }}
                  />
                  <span className="font-medium text-slate-600">{item.name}</span>
                </div>
                <span className="font-semibold text-slate-900">
                  {item.value} ({item.percentage})
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Navigation Button */}
      <div className="pt-4 mt-2 border-t border-slate-100">
        <button
          type="button"
          onClick={() => navigate("/pharmacy/inventory")}
          className="w-full bg-blue-50/70 hover:bg-blue-100/80 border border-blue-200/80 text-blue-600 text-sm font-semibold py-2.5 px-4 rounded-xl flex items-center justify-center gap-2 transition-colors cursor-pointer"
        >
          <Package className="w-4 h-4 text-blue-600" />
          <span>View Inventory</span>
        </button>
      </div>
    </div>
  );
}
