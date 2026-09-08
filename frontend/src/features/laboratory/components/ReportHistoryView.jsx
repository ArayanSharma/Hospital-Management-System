import React from "react";
import { FileText, Download, Eye, CheckCircle2 } from "lucide-react";
import { formatDate, formatTime } from "../../../utils/formatters.js";

export default function ReportHistoryView({ test }) {
  if (!test) return null;

  const testName = test.testName || "Lipid Profile";
  const orderIdDisplay = test.orderId || "LT-2026-0002";
  const isFinalized = test.status === "completed";

  return (
    <div className="bg-white border border-slate-200/80 rounded-2xl p-5 shadow-2xs space-y-4">
      <div className="flex items-center justify-between border-b border-slate-100 pb-3">
        <div>
          <h3 className="text-base font-bold text-slate-900">Report History</h3>
          <p className="text-xs text-slate-400">Previous versions and generated reports for order {orderIdDisplay}</p>
        </div>
        <span
          className={`px-3 py-1 rounded-full text-xs font-bold ${
            isFinalized ? "bg-emerald-50 text-emerald-600 border border-emerald-200" : "bg-amber-50 text-amber-600 border border-amber-200"
          }`}
        >
          {isFinalized ? "Finalized" : "Draft Status"}
        </span>
      </div>

      <div className="overflow-x-auto border border-slate-200/80 rounded-xl">
        <table className="w-full text-left border-collapse text-xs">
          <thead>
            <tr className="bg-slate-50/80 border-b border-slate-200/80 text-[11px] font-bold text-slate-600 uppercase tracking-wider">
              <th className="py-2.5 px-3">Version</th>
              <th className="py-2.5 px-3">Test Name</th>
              <th className="py-2.5 px-3">Technician</th>
              <th className="py-2.5 px-3">Checked By</th>
              <th className="py-2.5 px-3">Date &amp; Time</th>
              <th className="py-2.5 px-3">Status</th>
              <th className="py-2.5 px-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 text-xs text-slate-800 font-semibold">
            <tr className="hover:bg-slate-50/60 transition-colors">
              <td className="py-3 px-3 font-mono font-bold text-slate-900">v1.0 (Final)</td>
              <td className="py-3 px-3 font-bold text-slate-900">{testName}</td>
              <td className="py-3 px-3 text-slate-700">Rakesh Kumar (Lab Tech)</td>
              <td className="py-3 px-3 text-slate-700">Dr. Amit Patel</td>
              <td className="py-3 px-3">
                <p className="font-medium text-slate-800">{formatDate(test.requestedAt || test.createdAt)}</p>
                <p className="text-slate-400 text-[10px]">{formatTime(test.requestedAt || test.createdAt)}</p>
              </td>
              <td className="py-3 px-3">
                {isFinalized ? (
                  <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-600 border border-emerald-200 flex items-center gap-1 w-fit">
                    <CheckCircle2 className="w-3 h-3" /> Finalized
                  </span>
                ) : (
                  <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-amber-50 text-amber-600 border border-amber-200">
                    Draft
                  </span>
                )}
              </td>
              <td className="py-3 px-3 text-right">
                <div className="flex items-center justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => alert("Viewing report PDF...")}
                    className="p-1.5 rounded-lg border border-slate-200 text-blue-600 hover:bg-blue-50 cursor-pointer"
                    title="View PDF"
                  >
                    <Eye className="w-3.5 h-3.5" />
                  </button>
                  <button
                    type="button"
                    onClick={() => alert("Downloading official PDF...")}
                    className="p-1.5 rounded-lg border border-slate-200 text-blue-600 hover:bg-blue-50 cursor-pointer"
                    title="Download PDF"
                  >
                    <Download className="w-3.5 h-3.5" />
                  </button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}
