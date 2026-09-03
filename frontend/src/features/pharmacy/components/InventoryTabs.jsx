import React from "react";

export default function InventoryTabs({ activeTab, onSelectTab, counts = {} }) {
  const tabs = [
    { key: "all", label: "All Inventory", count: counts.all ?? counts.totalMedicines ?? 0 },
    { key: "in_stock", label: "In Stock", count: counts.in_stock ?? counts.inStock ?? 0 },
    { key: "low_stock", label: "Low Stock", count: counts.low_stock ?? counts.lowStock ?? 0 },
    { key: "out_of_stock", label: "Out of Stock", count: counts.out_of_stock ?? counts.outOfStock ?? 0 },
    { key: "expiring_soon", label: "Expiring Soon", count: counts.expiring_soon ?? counts.expiringSoon ?? 0 },
    { key: "archived", label: "Archived Batches", count: counts.archived ?? counts.archivedBatches ?? 0 },
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
