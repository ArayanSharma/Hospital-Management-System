import React from "react";
import { CheckCircle2 } from "lucide-react";

export default function PasswordCriteriaBox({ criteria }) {
  const rules = [
    { key: "length", label: "At least 8 characters long" },
    { key: "lowercase", label: "One lowercase letter (a-z)" },
    { key: "uppercase", label: "One uppercase letter (A-Z)" },
    { key: "numberOrSpecial", label: "One number (0-9) or special character" },
  ];

  return (
    <div className="bg-[#EEF5FF] dark:bg-[#162032] border border-[#D5E5FF] dark:border-slate-800 rounded-2xl p-4 my-4 transition-colors">
      <h4 className="text-xs sm:text-sm font-bold text-[#1E56C8] dark:text-blue-400 mb-2.5">
        Password must contain:
      </h4>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs font-medium">
        {rules.map((rule) => {
          const isValid = criteria[rule.key];
          return (
            <div
              key={rule.key}
              className={`flex items-center gap-2 transition-colors ${
                isValid ? "text-emerald-700 dark:text-emerald-400 font-semibold" : "text-slate-600 dark:text-slate-400"
              }`}
            >
              <CheckCircle2
                className={`w-4 h-4 shrink-0 ${
                  isValid ? "text-emerald-500 fill-emerald-100 dark:fill-emerald-900/50" : "text-slate-400 dark:text-slate-600"
                }`}
              />
              <span>{rule.label}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
