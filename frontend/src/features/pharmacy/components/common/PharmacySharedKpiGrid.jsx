import React from "react";

export default function PharmacySharedKpiGrid({ cards = [], isLoading, columns = "lg:grid-cols-5" }) {
  if (isLoading) {
    return (
      <div className={`grid grid-cols-2 md:grid-cols-3 ${columns} gap-4`}>
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

  return (
    <div className={`grid grid-cols-2 md:grid-cols-3 ${columns} gap-4`}>
      {cards.map((card, idx) => {
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
              {IconComponent && (
                <div className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 ${card.iconBg}`}>
                  <IconComponent className="w-5 h-5" />
                </div>
              )}
            </div>

            {card.subtitle && (
              <p className="text-[12px] font-medium text-slate-400">{card.subtitle}</p>
            )}
          </div>
        );
      })}
    </div>
  );
}
