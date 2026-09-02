import React from "react";
import { AlertTriangle, XCircle, CalendarDays, Calendar } from "lucide-react";

export default function StockAlertsSummaryCard({ summaryData, onSelectAlert }) {
  const alertItems = [
    {
      id: "low_stock",
      label: "Low Stock Items",
      count: summaryData?.lowStockItems !== undefined ? summaryData.lowStockItems : 0,
      icon: AlertTriangle,
      iconBg: "bg-amber-50 text-amber-600",
    },
    {
      id: "out_of_stock",
      label: "Out of Stock Items",
      count: summaryData?.outOfStockItems !== undefined ? summaryData.outOfStockItems : 0,
      icon: XCircle,
      iconBg: "bg-rose-50 text-rose-600",
    },
    {
      id: "expiring_7",
      label: "Expiring in 7 Days",
      count: summaryData?.expiring7Days !== undefined ? summaryData.expiring7Days : 0,
      icon: CalendarDays,
      iconBg: "bg-rose-50 text-rose-600",
    },
    {
      id: "expiring_30",
      label: "Expiring in 30 Days",
      count: summaryData?.expiring30Days !== undefined ? summaryData.expiring30Days : 0,
      icon: Calendar,
      iconBg: "bg-amber-50 text-amber-600",
    },
  ];

  return (
    <div className="bg-white border border-slate-200/70 rounded-2xl p-5 shadow-xs flex flex-col justify-between">
      <div>
        <div className="flex items-center justify-between mb-3 pb-1">
          <h3 className="text-sm font-bold text-slate-900">Stock Alerts Summary</h3>
          <button
            type="button"
            onClick={() => onSelectAlert && onSelectAlert("all_alerts")}
            className="text-xs font-semibold text-blue-600 hover:text-blue-700 hover:underline cursor-pointer transition-colors"
          >
            View All
          </button>
        </div>

        <div className="space-y-2">
          {alertItems.map((item) => {
            const IconComp = item.icon;
            return (
              <div
                key={item.id}
                onClick={() => onSelectAlert && onSelectAlert(item.id)}
                className="flex items-center justify-between p-2.5 rounded-xl hover:bg-slate-50 transition-colors cursor-pointer border border-transparent hover:border-slate-100"
              >
                <div className="flex items-center gap-3">
                  <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${item.iconBg}`}>
                    <IconComp className="w-4 h-4" />
                  </div>
                  <span className="text-xs font-semibold text-slate-700">{item.label}</span>
                </div>
                <span className="text-xs font-bold text-slate-900">
                  {typeof item.count === "number" ? item.count.toLocaleString("en-IN") : item.count}
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
