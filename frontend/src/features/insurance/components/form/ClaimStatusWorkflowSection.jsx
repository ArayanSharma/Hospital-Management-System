import React from "react";
import { Hourglass, Search, CheckCircle2, XCircle, DollarSign } from "lucide-react";

export default function ClaimStatusWorkflowSection({
  status,
  setStatus,
  submittedDate,
  setSubmittedDate,
  expectedReviewDate,
  setExpectedReviewDate,
  remarks,
  setRemarks,
  remarksLength = 0,
}) {
  return (
    <div className="bg-white border border-slate-200/80 rounded-2xl p-4 shadow-2xs space-y-4">
      <div className="flex items-center gap-2 border-b border-slate-100 pb-2.5">
        <Hourglass className="w-4 h-4 text-blue-600" />
        <h3 className="text-xs font-extrabold text-blue-700 tracking-wide">3. Claim Status</h3>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
        {/* Status */}
        <div className="space-y-1">
          <label className="text-[11px] font-bold text-slate-700">
            Current Status <span className="text-rose-500">*</span>
          </label>
          <select
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-1.5 text-xs font-bold text-slate-800 focus:outline-none focus:border-blue-500 cursor-pointer h-[34px]"
          >
            <option value="Submitted">Submitted</option>
            <option value="Under Review">Under Review</option>
            <option value="Approved">Approved</option>
            <option value="Rejected">Rejected</option>
            <option value="Settled">Settled</option>
          </select>
        </div>

        {/* Submitted Date */}
        <div className="space-y-1">
          <label className="text-[11px] font-bold text-slate-700">
            Submitted Date <span className="text-rose-500">*</span>
          </label>
          <input
            type="date"
            required
            value={submittedDate}
            onChange={(e) => setSubmittedDate(e.target.value)}
            className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-1.5 text-xs text-slate-800 focus:outline-none focus:border-blue-500"
          />
        </div>

        {/* Expected Review Date */}
        <div className="space-y-1">
          <label className="text-[11px] font-bold text-slate-700">Expected Review Date</label>
          <input
            type="date"
            value={expectedReviewDate}
            onChange={(e) => setExpectedReviewDate(e.target.value)}
            className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-1.5 text-xs text-slate-800 focus:outline-none focus:border-blue-500"
          />
        </div>

        {/* Remarks */}
        <div className="space-y-1">
          <div className="flex items-center justify-between">
            <label className="text-[11px] font-bold text-slate-700">Remarks (Optional)</label>
            <span className="text-[9px] font-bold text-slate-400">{remarksLength}/250</span>
          </div>
          <input
            type="text"
            maxLength={250}
            value={remarks}
            onChange={(e) => setRemarks(e.target.value)}
            placeholder="Enter any remarks..."
            className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-1.5 text-xs text-slate-800 focus:outline-none focus:border-blue-500"
          />
        </div>
      </div>

      {/* 5-Step Visual Stepper Diagram */}
      <div className="pt-3 border-t border-slate-100">
        <p className="text-[11px] font-bold text-slate-500 mb-3">Claim Status Workflow</p>
        <div className="flex items-center justify-between relative max-w-xl mx-auto px-4">
          <div className="absolute top-4 left-10 right-10 h-0.5 bg-slate-200 z-0"></div>

          <div className="relative z-10 flex flex-col items-center gap-1 text-center">
            <div className="w-8 h-8 rounded-full bg-blue-600 text-white flex items-center justify-center shadow-xs">
              <Hourglass className="w-4 h-4" />
            </div>
            <span className="text-[10px] font-extrabold text-blue-600">Submitted</span>
          </div>

          <div className="relative z-10 flex flex-col items-center gap-1 text-center">
            <div className="w-8 h-8 rounded-full bg-slate-200 text-slate-500 flex items-center justify-center">
              <Search className="w-4 h-4" />
            </div>
            <span className="text-[10px] font-bold text-slate-500">Under Review</span>
          </div>

          <div className="relative z-10 flex flex-col items-center gap-1 text-center">
            <div className="w-8 h-8 rounded-full bg-slate-200 text-slate-500 flex items-center justify-center">
              <CheckCircle2 className="w-4 h-4" />
            </div>
            <span className="text-[10px] font-bold text-slate-500">Approved</span>
          </div>

          <div className="relative z-10 flex flex-col items-center gap-1 text-center">
            <div className="w-8 h-8 rounded-full bg-slate-200 text-slate-500 flex items-center justify-center">
              <XCircle className="w-4 h-4" />
            </div>
            <span className="text-[10px] font-bold text-slate-500">Rejected</span>
          </div>

          <div className="relative z-10 flex flex-col items-center gap-1 text-center">
            <div className="w-8 h-8 rounded-full bg-slate-200 text-slate-500 flex items-center justify-center">
              <DollarSign className="w-4 h-4" />
            </div>
            <span className="text-[10px] font-bold text-slate-500">Settled</span>
          </div>
        </div>
      </div>
    </div>
  );
}
