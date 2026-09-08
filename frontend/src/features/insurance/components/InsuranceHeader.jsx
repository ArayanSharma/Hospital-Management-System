import React from "react";

export default function InsuranceHeader({ activeTab, onTabChange }) {
  return (
    <div className="space-y-4">
      {/* Title */}
      <h1 className="text-xl font-bold text-slate-900 tracking-tight">Insurance / TPA</h1>

      {/* Tabs Bar */}
      <div className="border-b border-slate-200">
        <nav className="flex gap-8">
          <button
            type="button"
            onClick={() => onTabChange("Insurance Policies")}
            className={`pb-3 text-xs font-extrabold border-b-2 transition cursor-pointer ${
              activeTab === "Insurance Policies"
                ? "border-blue-600 text-blue-600"
                : "border-transparent text-slate-500 hover:text-slate-700"
            }`}
          >
            Insurance Policies
          </button>

          <button
            type="button"
            onClick={() => onTabChange("Insurance Claims")}
            className={`pb-3 text-xs font-extrabold border-b-2 transition cursor-pointer ${
              activeTab === "Insurance Claims"
                ? "border-blue-600 text-blue-600"
                : "border-transparent text-slate-500 hover:text-slate-700"
            }`}
          >
            Insurance Claims
          </button>
        </nav>
      </div>
    </div>
  );
}
