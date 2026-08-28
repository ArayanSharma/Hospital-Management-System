import React from "react";
import { Printer, Download, FlaskConical, CheckCircle2, ArrowRight } from "lucide-react";

export default function LabTestDetailsPanel({
  test,
  activeTab,
  setActiveTab,
  onCollectSample,
  submitting,
}) {
  if (!test) {
    return (
      <div className="bg-white border border-slate-200/80 rounded-2xl p-8 text-center text-slate-400 text-xs">
        Select a laboratory order to view test details.
      </div>
    );
  }

  const testName = test.testName || "Laboratory Test";
  const sampleType = test.sampleType || "Blood";
  const currentStatus = test.status || "pending";
  const clinicalNotes = test.clinicalNotes || "No clinical notes specified.";
  const parameters = Array.isArray(test.parameters) && test.parameters.length > 0
    ? test.parameters
    : ["Diagnostic Parameters"];

  return (
    <div className="bg-white border border-slate-200/80 rounded-2xl p-4 shadow-2xs space-y-4">
      {/* Header & Tabs */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-2.5">
        <div className="flex items-center gap-6 text-xs font-semibold">
          <button
            onClick={() => setActiveTab("details")}
            className={`pb-2.5 border-b-2 transition cursor-pointer ${
              activeTab === "details"
                ? "border-blue-600 text-blue-600 font-bold"
                : "border-transparent text-slate-500 hover:text-slate-800"
            }`}
          >
            Test Details
          </button>
          <button
            onClick={() => setActiveTab("entry")}
            className={`pb-2.5 border-b-2 transition cursor-pointer ${
              activeTab === "entry"
                ? "border-blue-600 text-blue-600 font-bold"
                : "border-transparent text-slate-500 hover:text-slate-800"
            }`}
          >
            Results Entry
          </button>
          <button
            onClick={() => setActiveTab("history")}
            className={`pb-2.5 border-b-2 transition cursor-pointer ${
              activeTab === "history"
                ? "border-blue-600 text-blue-600 font-bold"
                : "border-transparent text-slate-500 hover:text-slate-800"
            }`}
          >
            Report History
          </button>
        </div>

        {/* Top-Right Controls */}
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => window.print()}
            className="px-2.5 py-1 rounded-xl border border-slate-200 text-blue-600 hover:bg-blue-50 text-[11px] font-semibold transition cursor-pointer flex items-center gap-1.5"
          >
            <Printer className="w-3.5 h-3.5 text-blue-600" />
            <span>Print Order</span>
          </button>
          <button
            type="button"
            onClick={() => alert("Downloading order PDF...")}
            className="px-2.5 py-1 rounded-xl border border-slate-200 text-blue-600 hover:bg-blue-50 text-[11px] font-semibold transition cursor-pointer flex items-center gap-1.5"
          >
            <Download className="w-3.5 h-3.5 text-blue-600" />
            <span>Download Order</span>
          </button>
        </div>
      </div>

      {/* Selected Test & Sample Type Header + Connected Status Steps */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-rose-50 text-rose-500 flex items-center justify-center font-bold shrink-0">
            <FlaskConical className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-slate-900">{testName}</h3>
            <p className="text-[11px] font-medium text-slate-400">Sample Type: <span className="text-slate-700 font-semibold">{sampleType}</span></p>
          </div>
        </div>

        {/* Connected Status Steps Bar */}
        <div className="flex items-center gap-1 text-[10px] font-bold">
          <span className={`px-2.5 py-1 rounded-lg ${currentStatus === "pending" ? "bg-amber-100 text-amber-700 font-bold" : "bg-slate-100 text-slate-500"}`}>
            Pending
          </span>
          <ArrowRight className="w-3 h-3 text-slate-300 mx-0.5" />
          <span className={`px-2.5 py-1 rounded-lg ${currentStatus === "sample-collected" ? "bg-purple-100 text-purple-700 font-bold" : "bg-slate-100 text-slate-500"}`}>
            Sample Collected
          </span>
          <ArrowRight className="w-3 h-3 text-slate-300 mx-0.5" />
          <span className={`px-2 py-1 rounded-lg ${currentStatus === "completed" ? "bg-emerald-100 text-emerald-700 font-bold" : "text-slate-400 font-semibold"}`}>
            Completed
          </span>
          <ArrowRight className="w-3 h-3 text-slate-300 mx-0.5" />
          <span className={`px-2 py-1 rounded-lg ${currentStatus === "cancelled" ? "bg-rose-100 text-rose-700 font-bold" : "text-slate-400 font-semibold"}`}>
            Cancelled
          </span>
        </div>
      </div>

      {/* Single Bordered Content Area with Vertical Separator */}
      <div className="border border-slate-200/80 rounded-xl p-3.5 bg-white grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
        {/* Left: Test Parameters */}
        <div className="space-y-2 pr-2">
          <p className="font-bold text-slate-900 text-xs">Test Parameters (To be performed)</p>
          <ul className="space-y-1 pl-1 text-slate-700 font-semibold text-[11px]">
            {parameters.map((param, i) => (
              <li key={i} className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-slate-400 shrink-0" />
                <span>{param}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Right: Clinical Notes / Instructions */}
        <div className="space-y-2 pl-2 border-t md:border-t-0 md:border-l border-slate-200/80 pt-3 md:pt-0">
          <p className="font-bold text-slate-900 text-xs">Clinical Notes / Instructions</p>
          <div className="text-slate-600 text-xs leading-relaxed whitespace-pre-line font-medium">
            {clinicalNotes}
          </div>
        </div>
      </div>

      {/* Bottom Sample Workflow Button */}
      <div className="pt-2 flex justify-end">
        {currentStatus === "pending" ? (
          <button
            type="button"
            disabled={submitting}
            onClick={() => onCollectSample(test._id)}
            className="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold shadow-sm shadow-blue-500/20 cursor-pointer flex items-center gap-2 transition disabled:opacity-50"
          >
            <FlaskConical className="w-4 h-4" />
            <span>{submitting ? "Collecting..." : "Mark Sample Collected"}</span>
          </button>
        ) : (
          <div className="flex items-center gap-1.5 text-xs font-bold text-emerald-600 bg-emerald-50 px-3.5 py-2 rounded-xl border border-emerald-200">
            <CheckCircle2 className="w-4 h-4" />
            <span>Sample Collected ({currentStatus})</span>
          </div>
        )}
      </div>
    </div>
  );
}
