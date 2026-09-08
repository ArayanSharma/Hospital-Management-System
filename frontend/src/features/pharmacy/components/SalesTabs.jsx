import React from "react";

export default function SalesTabs({ activeTab, onSelectTab, counts = {} }) {
  const tabs = [
    { key: "all", label: "All Sales", count: counts.all ?? 0 },
    { key: "walk_in", label: "Walk-in", count: counts.walk_in ?? counts.walkIn ?? 0 },
    { key: "opd", label: "OPD", count: counts.opd ?? 0 },
    { key: "ipd", label: "IPD", count: counts.ipd ?? 0 },
  ];

  return (
    <div className="border-b border-slate-200/80 mb-2">
      <nav className="-mb-px flex gap-6 overflow-x-auto custom-scrollbar">
        {tabs.map((tab) => {
          const isActive = activeTab === tab.key;
          return (
            <button
              key={tab.key}
              type="button"
              onClick={() => onSelectTab(tab.key)}
              className={`pb-2.5 text-xs font-medium border-b-2 transition-all flex items-center gap-2 cursor-pointer whitespace-nowrap ${
                isActive
                  ? "border-blue-600 text-blue-600 font-bold"
                  : "border-transparent text-slate-500 hover:text-slate-700 hover:border-slate-300"
              }`}
            >
              <span>{tab.label}</span>
              <span
                className={`px-1.5 py-0.5 text-[11px] font-bold rounded-md ${
                  isActive ? "bg-blue-50 text-blue-600" : "bg-slate-100 text-slate-500"
                }`}
              >
                {typeof tab.count === "number" ? tab.count.toLocaleString("en-IN") : tab.count}
              </span>
            </button>
          );
        })}
      </nav>
    </div>
  );
}
