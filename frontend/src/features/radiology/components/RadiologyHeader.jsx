import React from "react";
import { Plus, Download } from "lucide-react";

export default function RadiologyHeader({ onOrderTest, onExport }) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
      {/* Title & Subtitle */}
      <div>
        <h1 className="text-xl font-extrabold text-slate-900 tracking-tight">
          Radiology Orders
        </h1>
        <p className="text-xs font-medium text-slate-500 mt-0.5">
          Manage radiology imaging &amp; scan orders
        </p>
      </div>

      {/* Action Buttons */}
      <div className="flex items-center gap-2.5">
        <button
          type="button"
          onClick={onOrderTest}
          className="bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs px-4 py-2.5 rounded-xl shadow-sm shadow-blue-500/20 cursor-pointer flex items-center gap-2 transition"
        >
          <Plus className="w-4 h-4" />
          <span>+ Order Test (Radiology)</span>
        </button>

        <button
          type="button"
          onClick={onExport || (() => alert("Exporting Radiology Orders..."))}
          className="bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 font-bold text-xs px-3.5 py-2.5 rounded-xl shadow-2xs cursor-pointer flex items-center gap-1.5 transition"
        >
          <Download className="w-3.5 h-3.5 text-slate-500" />
          <span>Export</span>
        </button>
      </div>
    </div>
  );
}
