import React from "react";

export default function PharmacySharedTabs({ tabs = [], activeTab, onSelectTab }) {
  return (
    <div className="border-b border-slate-200 flex items-center gap-6 text-xs font-semibold overflow-x-auto">
      {tabs.map((tab) => {
        const isActive = activeTab === tab.key;
        return (
          <button
            key={tab.key}
            type="button"
            onClick={() => onSelectTab(tab.key)}
            className={`pb-2.5 flex items-center gap-2 transition-all cursor-pointer border-b-2 font-bold whitespace-nowrap ${
              isActive
                ? "border-blue-600 text-blue-600"
                : "border-transparent text-slate-500 hover:text-slate-800"
            }`}
          >
            <span>{tab.label}</span>
            {tab.count !== undefined && (
              <span
                className={`px-2 py-0.5 rounded-full text-[11px] font-bold ${
                  isActive ? "bg-blue-100 text-blue-700" : "bg-slate-100 text-slate-500"
                }`}
              >
                {typeof tab.count === "number" ? tab.count.toLocaleString("en-IN") : tab.count}
              </span>
            )}
          </button>
        );
      })}
    </div>
  );
}
