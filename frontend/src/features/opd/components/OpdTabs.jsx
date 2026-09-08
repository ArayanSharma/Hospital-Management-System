import React from "react";

export default function OpdTabs({ activeTab, setActiveTab, stats }) {
  const inProgressCount = stats?.inProgressCount ?? 12;
  const completedCount = stats?.completedCount ?? 21;
  const walkInCount = stats?.walkInCount ?? 9;

  return (
    <div className="p-4 border-b border-slate-100 flex items-center gap-6 overflow-x-auto text-xs font-semibold">
      <button
        onClick={() => setActiveTab("all")}
        className={`flex items-center gap-1.5 pb-1 border-b-2 transition cursor-pointer ${
          activeTab === "all"
            ? "border-blue-600 text-blue-600 font-bold"
            : "border-transparent text-slate-500 hover:text-slate-800"
        }`}
      >
        <span>All Visits</span>
      </button>

      <button
        onClick={() => setActiveTab("in-progress")}
        className={`flex items-center gap-1.5 pb-1 border-b-2 transition cursor-pointer ${
          activeTab === "in-progress"
            ? "border-blue-600 text-blue-600 font-bold"
            : "border-transparent text-slate-500 hover:text-slate-800"
        }`}
      >
        <span>In-Progress</span>
        <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-blue-50 text-blue-600">
          {inProgressCount}
        </span>
      </button>

      <button
        onClick={() => setActiveTab("completed")}
        className={`flex items-center gap-1.5 pb-1 border-b-2 transition cursor-pointer ${
          activeTab === "completed"
            ? "border-blue-600 text-blue-600 font-bold"
            : "border-transparent text-slate-500 hover:text-slate-800"
        }`}
      >
        <span>Completed</span>
        <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-600">
          {completedCount}
        </span>
      </button>

      <button
        onClick={() => setActiveTab("walk-in")}
        className={`flex items-center gap-1.5 pb-1 border-b-2 transition cursor-pointer ${
          activeTab === "walk-in"
            ? "border-blue-600 text-blue-600 font-bold"
            : "border-transparent text-slate-500 hover:text-slate-800"
        }`}
      >
        <span>Walk-in</span>
        <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-pink-50 text-pink-600">
          {walkInCount}
        </span>
      </button>
    </div>
  );
}
