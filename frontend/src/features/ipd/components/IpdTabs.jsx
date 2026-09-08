import React from "react";

export default function IpdTabs({ activeTab, setActiveTab }) {
  return (
    <div className="border-b border-slate-200/80 flex items-center gap-6 text-xs font-semibold">
      <button
        onClick={() => setActiveTab("bed-overview")}
        className={`pb-2.5 border-b-2 transition cursor-pointer ${
          activeTab === "bed-overview"
            ? "border-blue-600 text-blue-600 font-bold"
            : "border-transparent text-slate-500 hover:text-slate-800"
        }`}
      >
        Bed Overview
      </button>

      <button
        onClick={() => setActiveTab("admissions")}
        className={`pb-2.5 border-b-2 transition cursor-pointer ${
          activeTab === "admissions"
            ? "border-blue-600 text-blue-600 font-bold"
            : "border-transparent text-slate-500 hover:text-slate-800"
        }`}
      >
        Admissions
      </button>

      <button
        onClick={() => setActiveTab("discharges")}
        className={`pb-2.5 border-b-2 transition cursor-pointer ${
          activeTab === "discharges"
            ? "border-blue-600 text-blue-600 font-bold"
            : "border-transparent text-slate-500 hover:text-slate-800"
        }`}
      >
        Discharges
      </button>
    </div>
  );
}
