import React from "react";
import { Printer, Download, FileText, Activity, History } from "lucide-react";
import { downloadRadiologyReportPdf } from "../../helpers/radiologyPdfHelper.js";

export default function RadiologyReportHeader({
  activeTab,
  setActiveTab,
  orderId,
  historyCount = 0,
}) {
  return (
    <div className="border-b border-slate-200/90 px-5 py-3 flex flex-wrap items-center justify-between gap-3 bg-slate-50/50">
      {/* Left Tabs */}
      <div className="flex items-center gap-6">
        <button
          onClick={() => setActiveTab("study-details")}
          className={`py-1 text-xs font-semibold transition border-b-2 flex items-center gap-1.5 cursor-pointer ${
            activeTab === "study-details"
              ? "border-blue-600 text-blue-600"
              : "border-transparent text-slate-500 hover:text-slate-700"
          }`}
        >
          <FileText className="w-3.5 h-3.5" />
          <span>Study Details</span>
        </button>

        <button
          onClick={() => setActiveTab("report-entry")}
          className={`py-1 text-xs font-semibold transition border-b-2 flex items-center gap-1.5 cursor-pointer ${
            activeTab === "report-entry"
              ? "border-blue-600 text-blue-600"
              : "border-transparent text-slate-500 hover:text-slate-700"
          }`}
        >
          <Activity className="w-3.5 h-3.5" />
          <span>Report Entry</span>
        </button>

        <button
          onClick={() => setActiveTab("report-history")}
          className={`py-1 text-xs font-semibold transition border-b-2 flex items-center gap-1.5 cursor-pointer ${
            activeTab === "report-history"
              ? "border-blue-600 text-blue-600"
              : "border-transparent text-slate-500 hover:text-slate-700"
          }`}
        >
          <History className="w-3.5 h-3.5" />
          <span>Report History</span>
          <span className="ml-1 px-1.5 py-0.2 bg-slate-200 text-slate-700 text-[10px] rounded-full">
            {historyCount}
          </span>
        </button>
      </div>

      {/* Right Actions */}
      <div className="flex items-center gap-2">
        <button
          onClick={() => downloadRadiologyReportPdf("radiology-report-preview-card", `${orderId}_Order.pdf`)}
          className="flex items-center gap-1.5 px-3 py-1.5 bg-white border border-slate-200/90 hover:border-slate-300 rounded-lg font-medium text-slate-700 hover:bg-slate-50 transition shadow-2xs cursor-pointer"
        >
          <Printer className="w-3.5 h-3.5 text-blue-600" />
          <span>Print Order</span>
        </button>
        <button
          onClick={() => downloadRadiologyReportPdf("radiology-report-preview-card", `${orderId}_Order.pdf`)}
          className="flex items-center gap-1.5 px-3 py-1.5 bg-white border border-slate-200/90 hover:border-slate-300 rounded-lg font-medium text-slate-700 hover:bg-slate-50 transition shadow-2xs cursor-pointer"
        >
          <Download className="w-3.5 h-3.5 text-blue-600" />
          <span>Download Order</span>
        </button>
      </div>
    </div>
  );
}
