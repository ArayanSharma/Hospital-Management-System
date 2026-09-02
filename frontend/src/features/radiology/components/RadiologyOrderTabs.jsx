import React from "react";

export default function RadiologyOrderTabs({ activeTab, setActiveTab, counts = {} }) {
  const tabs = [
    { id: "all", label: `All Orders (${counts.total || 0})` },
    { id: "pending", label: `Pending (${counts.pending || 0})` },
    { id: "scheduled", label: `Scheduled (${counts.scheduled || 0})` },
    { id: "in-progress", label: `In-Progress (${counts.inProgress || 0})` },
    { id: "completed", label: `Completed (${counts.completed || 0})` },
    { id: "cancelled", label: `Cancelled (${counts.cancelled || 0})` },
  ];

  return (
    <div className="bg-white border-b border-slate-200/80 px-4 pt-2 overflow-x-auto">
      <div className="flex items-center gap-6 text-xs font-semibold whitespace-nowrap">
        {tabs.map((tab) => {
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`pb-3 border-b-2 transition cursor-pointer text-xs font-semibold ${
                isActive
                  ? "border-blue-600 text-blue-600 font-extrabold"
                  : "border-transparent text-slate-500 hover:text-slate-800"
              }`}
            >
              {tab.label}
            </button>
          );
        })}
      </div>
    </div>
  );
}
