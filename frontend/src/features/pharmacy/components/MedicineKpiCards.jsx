import React from "react";
import { Pill, LayoutGrid, Tag, Building2, FlaskConical } from "lucide-react";

export default function MedicineKpiCards({ stats, isLoading }) {
  if (isLoading) {
    return (
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
        {[...Array(5)].map((_, i) => (
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
      value: stats?.totalMedicines !== undefined ? stats.totalMedicines : 0,
      subtitle: "All Medicines",
      icon: Pill,
      iconBg: "bg-purple-100 text-purple-600",
    },
    {
      title: "Active Medicines",
      value: stats?.activeMedicines !== undefined ? stats.activeMedicines : 0,
      subtitle: stats?.activePercentage ? `${stats.activePercentage} of total` : "Active Catalog",
      icon: LayoutGrid,
      iconBg: "bg-emerald-100 text-emerald-600",
    },
    {
      title: "Total Categories",
      value: stats?.totalCategories !== undefined ? stats.totalCategories : 0,
      subtitle: "Medicine Categories",
      icon: Tag,
      iconBg: "bg-amber-100 text-amber-600",
    },
    {
      title: "Manufacturers",
      value: stats?.totalManufacturers !== undefined ? stats.totalManufacturers : 0,
      subtitle: "Total Manufacturers",
      icon: Building2,
      iconBg: "bg-blue-100 text-blue-600",
    },
    {
      title: "Inactive Medicines",
      value: stats?.inactiveMedicines !== undefined ? stats.inactiveMedicines : 0,
      subtitle: stats?.inactivePercentage ? `${stats.inactivePercentage} of total` : "Inactive Catalog",
      icon: FlaskConical,
      iconBg: "bg-rose-100 text-rose-600",
    },
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
      {cardsData.map((card, idx) => {
        const IconComponent = card.icon;
        return (
          <div
            key={idx}
            className="bg-white border border-slate-200/80 rounded-2xl p-4.5 shadow-xs hover:shadow-sm transition-all duration-200 flex flex-col justify-between"
          >
            <div className="flex items-start justify-between gap-1 mb-2">
              <div>
                <p className="text-[12px] font-semibold text-slate-500 mb-1">{card.title}</p>
                <h3 className="text-2xl font-bold text-slate-900 tracking-tight">
                  {typeof card.value === "number" ? card.value.toLocaleString("en-IN") : card.value}
                </h3>
              </div>
              <div className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 ${card.iconBg}`}>
                <IconComponent className="w-5 h-5" />
              </div>
            </div>

            <p className="text-[12px] font-medium text-slate-400">{card.subtitle}</p>
          </div>
        );
      })}
    </div>
  );
}
