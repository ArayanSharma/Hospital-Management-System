import React from "react";
import LabResultsEntryForm from "./LabResultsEntryForm.jsx";

export default function LabResultsEntryPanel({
  test,
  onSaveResults,
  onFinalizeReport,
  submitting,
}) {
  if (!test) {
    return (
      <div className="bg-white border border-slate-200/80 rounded-2xl p-8 text-center text-slate-400 text-xs">
        Select an order to enter results.
      </div>
    );
  }

  return (
    <div className="bg-white border border-slate-200/80 rounded-2xl p-4 shadow-2xs space-y-3.5">
      <div className="flex items-center justify-between border-b border-slate-100 pb-2.5">
        <h4 className="text-xs font-bold text-slate-900">Enter Test Results</h4>
      </div>

      <LabResultsEntryForm
        test={test}
        onSaveResults={onSaveResults}
        onFinalizeReport={onFinalizeReport}
        submitting={submitting}
        compact={true}
      />
    </div>
  );
}
