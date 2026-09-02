import React from "react";
import { Pill, Package, IndianRupee, AlertTriangle, XCircle, CalendarDays } from "lucide-react";

export default function InventoryKpiCards({ stats, isLoading }) {
  if (isLoading) {
    return (
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3.5">
        {[...Array(6)].map((_, i) => (
          <div key={i} className="bg-white border border-slate-200/70 rounded-2xl p-4 shadow-xs animate-pulse space-y-2">
            <div className="flex justify-between items-center">
              <div className="h-3 w-20 bg-slate-200 rounded" />
              <div className="w-10 h-10 rounded-full bg-slate-100" />
            </div>
            <div className="h-6 w-16 bg-slate-200 rounded" />
            <div className="h-3 w-24 bg-slate-100 rounded" />
          </div>
        ))}
      </div>
    );
  }

  const cardsData = [
    {
      title: "Total Medicines",
      value: stats?.totalMedicines !== undefined ? stats.totalMedicines : "0",
      subtitle: "All Medicines",
      icon: Pill,
      iconBg: "bg-purple-50 text-purple-600",
    },
    {
      title: "Total Stock (Units)",
      value: stats?.totalStockUnits !== undefined ? stats.totalStockUnits : "0",
      subtitle: "Across all batches",
      icon: Package,
      iconBg: "bg-blue-50 text-blue-600",
    },
    {
      title: "Stock Value (₹)",
      value: stats?.stockValue !== undefined ? stats.stockValue : "₹ 0.00",
      subtitle: "At purchase price",
      icon: IndianRupee,
      iconBg: "bg-emerald-50 text-emerald-600",
    },
    {
      title: "Low Stock Items",
      value: stats?.lowStockItems !== undefined ? stats.lowStockItems : 0,
      subtitle: "Reorder soon",
      icon: AlertTriangle,
      iconBg: "bg-amber-50 text-amber-600",
    },
    {
      title: "Out of Stock",
      value: stats?.outOfStock !== undefined ? stats.outOfStock : 0,
      subtitle: "Not available",
      icon: XCircle,
      iconBg: "bg-rose-50 text-rose-600",
    },
    {
      title: "Expiring Soon",
      value: stats?.expiringSoon !== undefined ? stats.expiringSoon : 0,
      subtitle: "Within 30 days",
      icon: CalendarDays,
      iconBg: "bg-rose-50 text-rose-600",
    },
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3.5">
      {cardsData.map((card, idx) => {
        const IconComponent = card.icon;
        return (
          <div
            key={idx}
            className="bg-white border border-slate-200/70 rounded-2xl p-4 shadow-xs hover:shadow-sm transition-all duration-200 flex flex-col justify-between"
          >
            <div className="flex items-start justify-between gap-1 mb-2">
              <div>
                <p className="text-[11px] font-semibold text-slate-500 mb-0.5">{card.title}</p>
                <h3 className="text-xl font-bold text-slate-900 tracking-tight">
                  {typeof card.value === "number" ? card.value.toLocaleString("en-IN") : card.value}
                </h3>
              </div>
              <div className={`w-9 h-9 rounded-full flex items-center justify-center flex-shrink-0 ${card.iconBg}`}>
                <IconComponent className="w-4.5 h-4.5" />
              </div>
            </div>

            <p className="text-[11px] font-medium text-slate-400">{card.subtitle}</p>
          </div>
        );
      })}
    </div>
  );
}
