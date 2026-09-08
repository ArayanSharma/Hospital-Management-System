import React from "react";
import { Headphones } from "lucide-react";

export default function LoginHelpCard() {
  return (
    <div className="bg-[#EEF5FF] dark:bg-[#162032] border border-[#D5E5FF] dark:border-slate-800 rounded-2xl p-4 my-6 flex items-center justify-between gap-3 transition-colors">
      <div className="flex items-center gap-3">
        <div className="p-2.5 rounded-xl bg-white dark:bg-slate-800 text-blue-600 dark:text-blue-400 shadow-xs border border-blue-100 dark:border-slate-700 shrink-0">
          <Headphones className="w-5 h-5 stroke-[2.2]" />
        </div>
        <div>
          <h4 className="text-xs sm:text-sm font-bold text-slate-900 dark:text-slate-100 leading-tight">
            Need Help?
          </h4>
          <p className="text-[11px] sm:text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Contact our support team
          </p>
        </div>
      </div>
      <button
        type="button"
        onClick={() => alert("Support desk contact: support@citycare.com | +91 1800-123-4567")}
        className="px-3.5 py-2 text-xs font-bold text-blue-600 dark:text-blue-400 bg-white dark:bg-slate-800 border border-blue-200 dark:border-slate-700 rounded-xl hover:bg-blue-50 dark:hover:bg-slate-700 active:scale-95 transition-all shadow-xs shrink-0 cursor-pointer"
      >
        Contact Support
      </button>
    </div>
  );
}
