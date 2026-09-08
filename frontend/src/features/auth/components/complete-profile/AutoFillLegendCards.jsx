import React from "react";
import { Info, Lock, CheckCircle2, HelpCircle } from "lucide-react";

export default function AutoFillLegendCards() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
      {/* Legend Box */}
      <div className="bg-blue-50/50 dark:bg-blue-950/30 p-3.5 rounded-2xl border border-blue-100 dark:border-blue-900/40 text-xs">
        <div className="flex items-center gap-1.5 font-bold text-blue-700 dark:text-blue-300 mb-2">
          <Info className="w-4 h-4" /> Auto-fill Legend
        </div>
        <ul className="space-y-1.5 text-[11px] text-slate-600 dark:text-slate-300">
          <li className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-500" />
            <span className="font-bold text-emerald-600">Auto-filled</span>
            <span className="text-[10px] text-slate-400">Fetched from account</span>
          </li>
          <li className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-blue-500" />
            <span className="font-bold text-blue-600">Auto-generated</span>
            <span className="text-[10px] text-slate-400">System generated</span>
          </li>
          <li className="flex items-center gap-1.5">
            <Lock className="w-3 h-3 text-slate-400" />
            <span className="font-bold text-slate-600">Read-only</span>
            <span className="text-[10px] text-slate-400">Cannot be edited</span>
          </li>
        </ul>
      </div>

      {/* Why auto-filled box */}
      <div className="bg-emerald-50/50 dark:bg-emerald-950/30 p-3.5 rounded-2xl border border-emerald-100 dark:border-emerald-900/40 text-xs">
        <div className="flex items-center gap-1.5 font-bold text-emerald-700 dark:text-emerald-300 mb-1">
          <CheckCircle2 className="w-4 h-4" /> Why some fields are auto-filled?
        </div>
        <p className="text-[11px] text-slate-600 dark:text-slate-300 leading-relaxed">
          We auto-fill information to save your time and maintain data consistency across the system.
        </p>
      </div>

      {/* Need update box */}
      <div className="bg-sky-50/50 dark:bg-sky-950/30 p-3.5 rounded-2xl border border-sky-100 dark:border-sky-900/40 text-xs">
        <div className="flex items-center gap-1.5 font-bold text-sky-700 dark:text-sky-300 mb-1">
          <HelpCircle className="w-4 h-4" /> Need to update?
        </div>
        <p className="text-[11px] text-slate-600 dark:text-slate-300 leading-relaxed">
          If any auto-filled information is incorrect, please contact your administrator or HR department.
        </p>
      </div>
    </div>
  );
}
