import React from "react";
import { Users, ShoppingCart, Package, ClipboardList, CalendarDays } from "lucide-react";

export default function SupplierKpiCards({ stats, isLoading }) {
  if (isLoading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        {[...Array(5)].map((_, i) => (
          <div key={i} className="bg-white border border-slate-100 rounded-2xl p-5 shadow-xs animate-pulse space-y-3">
            <div className="flex items-center justify-between">
              <div className="h-4 w-24 bg-slate-200 rounded" />
              <div className="w-11 h-11 rounded-full bg-slate-100" />
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
      title: "Total Suppliers",
      value: stats?.totalSuppliers !== undefined ? stats.totalSuppliers : "0",
      subtitle: "All Registered Suppliers",
      subtitleClass: "text-slate-500",
      icon: Users,
      iconBg: "bg-purple-50 text-purple-600",
    },
    {
      title: "Active Suppliers",
      value: stats?.activeSuppliers !== undefined ? stats.activeSuppliers : "0",
      subtitle: stats?.activePercentage || "Active Vendors",
      subtitleClass: "text-emerald-600 font-semibold",
      icon: ShoppingCart,
      iconBg: "bg-emerald-50 text-emerald-600",
    },
    {
      title: "Total Purchase Value",
      value: stats?.totalPurchaseValue !== undefined ? stats.totalPurchaseValue : "₹ 0.00",
      subtitle: "Accumulated Value",
      subtitleClass: "text-slate-500",
      icon: Package,
      iconBg: "bg-amber-50 text-amber-600",
    },
    {
      title: "Pending Orders",
      value: stats?.pendingOrders !== undefined ? stats.pendingOrders : "0",
      subtitle: "Orders to be received",
      subtitleClass: "text-slate-500",
      icon: ClipboardList,
      iconBg: "bg-blue-50 text-blue-600",
    },
    {
      title: "Overdue Payments",
      value: stats?.overduePayments !== undefined ? stats.overduePayments : "₹ 0.00",
      subtitle: stats?.overdueSuppliersCount || "0 Suppliers",
      subtitleClass: "text-rose-600 font-semibold",
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
                <h3 className="text-2xl font-bold text-slate-900 tracking-tight">
                  {typeof card.value === "number" ? card.value.toLocaleString("en-IN") : card.value}
                </h3>
              </div>
              <div className={`w-11 h-11 rounded-full flex items-center justify-center flex-shrink-0 ${card.iconBg}`}>
                <IconComponent className="w-5 h-5" />
              </div>
            </div>

            <div className="pt-1">
              <p className={`text-xs ${card.subtitleClass}`}>{card.subtitle}</p>
            </div>
          </div>
        );
      })}
    </div>
  );
}
