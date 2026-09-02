import React from "react";
import { Pill, Package, ShoppingCart, AlertTriangle, CalendarDays } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function PharmacyKpiCards({ kpis, isLoading }) {
  const navigate = useNavigate();

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        {[...Array(5)].map((_, i) => (
          <div key={i} className="bg-white border border-slate-100 rounded-2xl p-5 shadow-xs animate-pulse space-y-3">
            <div className="flex items-center justify-between">
              <div className="h-4 w-24 bg-slate-200 rounded" />
              <div className="w-12 h-12 rounded-full bg-slate-100" />
            </div>
            <div className="h-8 w-20 bg-slate-200 rounded" />
            <div className="h-4 w-28 bg-slate-100 rounded" />
          </div>
        ))}
      </div>
    );
  }

  const cardsData = [
    {
      title: "Total Medicines",
      value: kpis?.totalMedicines?.value || "0",
      trend: kpis?.totalMedicines?.change || "Active Catalog",
      isArrowTrend: true,
      icon: Pill,
      iconBg: "bg-blue-50 text-blue-600",
    },
    {
      title: "Total Stock Value",
      value: kpis?.totalStockValue?.value || "₹ 0.00",
      trend: kpis?.totalStockValue?.change || "Current Value",
      isDotTrend: true,
      icon: Package,
      iconBg: "bg-purple-50 text-purple-600",
    },
    {
      title: "Today's Sales",
      value: kpis?.todaysSales?.value || "₹ 0.00",
      trend: kpis?.todaysSales?.change || "Sales Summary",
      isArrowTrend: true,
      icon: ShoppingCart,
      iconBg: "bg-emerald-50 text-emerald-600",
    },
    {
      title: "Low Stock Items",
      value: kpis?.lowStockItems?.value !== undefined ? kpis.lowStockItems.value : 0,
      actionText: "View details →",
      isAction: true,
      actionPath: "/pharmacy/inventory?filter=low_stock",
      icon: AlertTriangle,
      iconBg: "bg-amber-50 text-amber-600",
    },
    {
      title: "Expiring Soon",
      value: kpis?.expiringSoon?.value !== undefined ? kpis.expiringSoon.value : 0,
      actionText: "View details →",
      isAction: true,
      actionPath: "/pharmacy/inventory?filter=expiring",
      icon: CalendarDays,
      iconBg: "bg-rose-50 text-rose-600",
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
      {cardsData.map((card, idx) => {
        const IconComponent = card.icon;
        return (
          <div
            key={idx}
            className="bg-white border border-slate-200/70 rounded-2xl p-4.5 shadow-xs hover:shadow-sm transition-all duration-200 flex flex-col justify-between"
          >
            <div className="flex items-start justify-between gap-2 mb-2">
              <div>
                <p className="text-xs font-medium text-slate-500 mb-1">{card.title}</p>
                <h3 className="text-2xl font-bold text-slate-900 tracking-tight">{card.value}</h3>
              </div>
              <div className={`w-11 h-11 rounded-full flex items-center justify-center flex-shrink-0 ${card.iconBg}`}>
                <IconComponent className="w-5 h-5" />
              </div>
            </div>

            <div className="pt-1">
              {card.isArrowTrend && (
                <p className="text-xs font-semibold text-emerald-600 flex items-center gap-1">
                  <span className="text-sm font-bold">↑</span> {card.trend}
                </p>
              )}

              {card.isDotTrend && (
                <p className="text-xs font-semibold text-emerald-600 flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 inline-block" />
                  {card.trend}
                </p>
              )}

              {card.isAction && (
                <button
                  type="button"
                  onClick={() => navigate(card.actionPath)}
                  className="text-xs font-semibold text-blue-600 hover:text-blue-700 hover:underline flex items-center gap-1 cursor-pointer transition-colors"
                >
                  {card.actionText}
                </button>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}
