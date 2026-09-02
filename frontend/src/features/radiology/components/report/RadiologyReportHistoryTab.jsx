import React from "react";
import { History, Activity, Eye, Inbox } from "lucide-react";

export default function RadiologyReportHistoryTab({
  orderId,
  patientName,
  historyLogs = [],
  setActiveTab,
}) {
  return (
    <div className="p-6 bg-slate-50/40 space-y-5">
      {/* Header Card */}
      <div className="bg-white border border-slate-200/80 rounded-xl p-5 shadow-2xs flex items-center justify-between">
        <div>
          <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
            <History className="w-4 h-4 text-blue-600" />
            <span>Report Revisions & Audit Log</span>
          </h2>
          <p className="text-slate-500 text-xs mt-0.5">
            History log of all saved drafts, approvals, and finalized versions for study{" "}
            <span className="font-semibold text-blue-600">{orderId}</span> ({patientName})
          </p>
        </div>
        <button
          onClick={() => setActiveTab("report-entry")}
          className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl transition shadow-xs flex items-center gap-1.5 cursor-pointer text-xs"
        >
          <span>Edit Active Report</span>
          <Activity className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Revision Logs List Container */}
      <div className="bg-white border border-slate-200/80 rounded-xl overflow-hidden shadow-2xs">
        <div className="p-4 border-b border-slate-100 bg-slate-50/50 flex items-center justify-between text-xs font-bold text-slate-700">
          <span>REVISION STACK</span>
          <span>{historyLogs.length} Records</span>
        </div>

        <div className="divide-y divide-slate-100">
          {historyLogs.length === 0 ? (
            <div className="p-12 text-center text-slate-400">
              <Inbox className="w-8 h-8 mx-auto mb-2 opacity-50" />
              <p className="font-semibold text-slate-700 text-xs">No Report Revisions Logged</p>
              <p className="text-[11px] text-slate-400">Save a draft or finalize this report to log revisions to database.</p>
            </div>
          ) : (
            historyLogs.map((log, idx) => (
              <div key={log.id} className="p-5 hover:bg-slate-50/70 transition space-y-3">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <span className="w-8 h-8 rounded-full bg-blue-50 text-blue-600 font-bold text-xs flex items-center justify-center border border-blue-100">
                      #{historyLogs.length - idx}
                    </span>
                    <div>
                      <div className="flex items-center gap-2">
                        <h4 className="font-bold text-slate-900 text-sm">{log.version}</h4>
                        <span
                          className={`px-2 py-0.5 text-[10px] font-bold rounded-md capitalize border ${
                            log.status === "finalized"
                              ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                              : "bg-amber-50 text-amber-700 border-amber-200"
                          }`}
                        >
                          {log.status}
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-500">
                        Updated by <span className="font-medium text-slate-800">{log.updatedBy}</span> on{" "}
                        <span className="font-medium text-slate-800">{log.updatedAt}</span>
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setActiveTab("report-entry")}
                      className="px-3 py-1.5 bg-white border border-slate-200 hover:border-slate-300 rounded-lg font-medium text-slate-700 transition flex items-center gap-1 text-xs cursor-pointer"
                    >
                      <Eye className="w-3.5 h-3.5 text-blue-600" />
                      <span>View Active Report</span>
                    </button>
                  </div>
                </div>

                <div className="bg-slate-50 p-3 rounded-xl border border-slate-100 text-xs text-slate-600 space-y-1">
                  <p className="font-semibold text-slate-800">Findings Snippet:</p>
                  <p className="italic">{log.findingsSnippet}</p>
                  <p className="text-[11px] text-slate-500 pt-1 font-medium">Notes: {log.notes}</p>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
