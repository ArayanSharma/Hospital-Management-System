import React, { useState } from "react";
import { Search, Eye, X } from "lucide-react";
import EmptyState from "../common/EmptyState.jsx";

export default function TestsTab({ tests, patient }) {
  const [testSearch, setTestSearch] = useState("");
  const [testStatusFilter, setTestStatusFilter] = useState("all");
  const [selectedReport, setSelectedReport] = useState(null);

  const list = tests || patient?.labTests || [];

  if (!list || list.length === 0) {
    return <EmptyState title="No Diagnostic Tests" message="No lab or radiology reports ordered for this patient yet." />;
  }


  const filteredTests = list
    .filter((t) => (testStatusFilter === "all" ? true : (t.status || "").toLowerCase() === testStatusFilter.toLowerCase()))
    .filter((t) => (t.name || t.testName || "").toLowerCase().includes(testSearch.toLowerCase()));


  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-2 border-b border-slate-100">
        <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider">
          Lab & Diagnostic Investigations ({list.length})
        </h3>


        <div className="flex items-center gap-2">
          <div className="relative">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-2.5" />
            <input
              type="text"
              placeholder="Search tests..."
              value={testSearch}
              onChange={(e) => setTestSearch(e.target.value)}
              className="pl-8 pr-3 py-1.5 border border-slate-200 rounded-xl text-xs bg-slate-50 focus:bg-white focus:outline-none"
            />
          </div>

          <select
            value={testStatusFilter}
            onChange={(e) => setTestStatusFilter(e.target.value)}
            className="px-3 py-1.5 border border-slate-200 rounded-xl text-xs bg-slate-50 focus:outline-none"
          >
            <option value="all">All Status</option>
            <option value="completed">Completed</option>
            <option value="pending">Pending</option>
          </select>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs border-collapse">
          <thead>
            <tr className="bg-slate-50 text-[11px] font-bold text-slate-500 uppercase tracking-wider border-b border-slate-200">
              <th className="py-3 px-4">Test Name</th>
              <th className="py-3 px-4">Category</th>
              <th className="py-3 px-4">Ordered Date</th>
              <th className="py-3 px-4">Status</th>
              <th className="py-3 px-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 font-medium">
            {filteredTests.map((test) => (
              <tr key={test._id || test.id} className="hover:bg-slate-50">
                <td className="py-3 px-4 font-bold text-slate-900">
                  {test.name || test.testName || "Lab Investigation"}
                  {test.isAbnormal && (
                    <span className="ml-2 px-2 py-0.5 rounded-md text-[10px] font-bold bg-rose-50 text-rose-600 border border-rose-200">
                      Abnormal
                    </span>
                  )}
                </td>
                <td className="py-3 px-4 text-slate-600">{test.category || "Pathology"}</td>
                <td className="py-3 px-4 font-mono text-slate-500">
                  {test.orderedDate || (test.createdAt ? new Date(test.createdAt).toLocaleDateString("en-GB") : "N/A")}
                </td>
                <td className="py-3 px-4">
                  <span
                    className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                      (test.status || "").toLowerCase() === "completed"
                        ? "bg-emerald-50 text-emerald-600 border border-emerald-200"
                        : "bg-amber-50 text-amber-600 border border-amber-200"
                    }`}
                  >
                    {test.status || "Pending"}
                  </span>
                </td>
                <td className="py-3 px-4 text-right space-x-1">
                  <button
                    onClick={() => setSelectedReport(test)}
                    className="p-1.5 border border-slate-200 rounded-lg hover:bg-slate-100 text-blue-600 cursor-pointer"
                    title="View Report"
                  >
                    <Eye className="w-3.5 h-3.5" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Selected Report Modal */}
      {selectedReport && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center z-[10000] p-4">
          <div className="bg-white rounded-3xl p-6 max-w-xl w-full border border-slate-200 space-y-4 shadow-2xl">
            <div className="flex items-center justify-between border-b pb-3 border-slate-100">
              <h3 className="font-bold text-sm text-slate-900">{selectedReport.name || selectedReport.testName} Details</h3>
              <button onClick={() => setSelectedReport(null)} className="p-1 text-slate-400 hover:text-slate-700">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="space-y-2 text-xs text-slate-700">
              <p><strong>Category:</strong> {selectedReport.category || "General"}</p>
              <p><strong>Status:</strong> {selectedReport.status}</p>
              <p><strong>Summary:</strong> {selectedReport.summary || selectedReport.findings || "No detailed findings uploaded."}</p>
            </div>
            <div className="flex justify-end pt-3">
              <button onClick={() => setSelectedReport(null)} className="px-4 py-2 bg-slate-100 text-slate-700 text-xs font-semibold rounded-xl cursor-pointer">
                Close Report
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
