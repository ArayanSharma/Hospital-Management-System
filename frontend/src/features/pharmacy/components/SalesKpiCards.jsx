import React from "react";
import { ShoppingCart, IndianRupee, ShoppingBag, Receipt, TrendingUp } from "lucide-react";

export default function SalesKpiCards({ stats, isLoading }) {
  if (isLoading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        {[...Array(5)].map((_, i) => (
          <div key={i} className="bg-white border border-slate-100 rounded-2xl p-5 shadow-xs animate-pulse space-y-3">
            <div className="flex items-center justify-between">
              <div className="h-4 w-24 bg-slate-200 rounded" />
              <div className="w-11 h-11 rounded-full bg-slate-100" />
            </div>
            <div className="h-8 w-24 bg-slate-200 rounded" />
            <div className="h-4 w-28 bg-slate-100 rounded" />
          </div>
        ))}
      </div>
    );
  }

  const cardsData = [
    {
      title: "Today's Sales",
      value: stats?.todaysSales !== undefined ? stats.todaysSales : "₹ 0.00",
      trend: stats?.todaysSalesTrend || "Live Today",
      trendType: "green",
      icon: ShoppingCart,
      iconBg: "bg-blue-50 text-blue-600",
    },
    {
      title: "Today's Transactions",
      value: stats?.todaysTransactions !== undefined ? stats.todaysTransactions : "0",
      trend: "Total Orders",
      trendType: "green",
      icon: IndianRupee,
      iconBg: "bg-emerald-50 text-emerald-600",
    },
    {
      title: "This Month Sales",
      value: stats?.thisMonthSales !== undefined ? stats.thisMonthSales : "₹ 0.00",
      trend: "Monthly Volume",
      trendType: "green",
      icon: ShoppingBag,
      iconBg: "bg-purple-50 text-purple-600",
    },
    {
      title: "Pending Payments",
      value: stats?.pendingPayments !== undefined ? stats.pendingPayments : "₹ 0.00",
      trend: stats?.pendingInvoicesCount || "0 Invoices",
      trendType: "slate",
      icon: Receipt,
      iconBg: "bg-amber-50 text-amber-600",
    },
    {
      title: "Total Profit (This Month)",
      value: stats?.totalProfit !== undefined ? stats.totalProfit : "₹ 0.00",
      trend: stats?.profitMargin || "Margin: 20%",
      trendType: "slate",
      icon: TrendingUp,
      iconBg: "bg-rose-50 text-rose-600",
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
      {cardsData.map((card, idx) => {
        const IconComp = card.icon;
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
                <IconComp className="w-5 h-5" />
              </div>
            </div>

            <div className="pt-1">
              {card.trendType === "green" ? (
                <p className="text-xs font-semibold text-emerald-600 flex items-center gap-1">
                  <span className="text-sm font-bold">↑</span> {card.trend}
                </p>
              ) : (
                <p className="text-xs font-semibold text-slate-500">{card.trend}</p>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}
