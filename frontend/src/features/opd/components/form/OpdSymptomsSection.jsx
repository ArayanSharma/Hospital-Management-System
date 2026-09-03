import React from "react";

export default function OpdSymptomsSection({ register, watchSymptoms, watchNotes }) {
  return (
    <>
      {/* Symptoms */}
      <div className="bg-blue-50/30 border border-blue-100 rounded-2xl p-3.5 space-y-2">
        <div className="flex items-center justify-between">
          <p className="text-xs font-bold text-blue-700 uppercase tracking-wider">
            5. Chief Complaints / Symptoms
          </p>
          <span className="text-[10px] text-slate-400">
            {watchSymptoms.length}/500
          </span>
        </div>
        <div>
          <label className="block text-[11px] font-semibold text-slate-700 mb-1">
            Symptoms <span className="text-rose-500">*</span>
          </label>
          <textarea
            rows={2}
            maxLength={500}
            {...register("symptoms")}
            placeholder="Enter patient chief complaints / symptoms..."
            className="w-full bg-white border border-slate-200 rounded-xl p-2.5 text-xs text-slate-800 focus:outline-none resize-none"
          />
          <p className="text-[10px] text-slate-400 mt-0.5">
            e.g. High fever, Dry cough for 3 days, Body ache
          </p>
        </div>
      </div>

      {/* Notes */}
      <div className="bg-blue-50/30 border border-blue-100 rounded-2xl p-3.5 space-y-2">
        <div className="flex items-center justify-between">
          <p className="text-xs font-bold text-blue-700 uppercase tracking-wider">
            7. Notes (Optional)
          </p>
          <span className="text-[10px] text-slate-400">
            {watchNotes.length}/300
          </span>
        </div>
        <textarea
          rows={2}
          maxLength={300}
          {...register("notes")}
          placeholder="Any additional notes..."
          className="w-full bg-white border border-slate-200 rounded-xl p-2.5 text-xs text-slate-800 focus:outline-none resize-none"
        />
      </div>
    </>
  );
}
