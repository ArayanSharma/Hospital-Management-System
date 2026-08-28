import React from "react";
import { UserPlus, Bed, Eye, Receipt, HelpCircle } from "lucide-react";

export default function IpdDischargesRightPanel({ onAdmitOpen }) {
  return (
    <div className="space-y-4">
      {/* 1. Discharge Summary Card (Donut Chart representation) */}
      <div className="bg-white border border-slate-200/80 rounded-2xl shadow-2xs p-4 space-y-3">
        <h4 className="text-xs font-bold text-slate-900 border-b border-slate-100 pb-2">
          Discharge Summary
        </h4>

        {/* Circular Donut Chart Graphics */}
        <div className="relative w-28 h-28 mx-auto flex items-center justify-center my-2">
          <svg className="w-full h-full transform -rotate-90" viewBox="0 0 36 36">
            <path
              className="text-emerald-500"
              strokeWidth="4"
              strokeDasharray="86, 100"
              stroke="currentColor"
              fill="none"
              d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
            />
            <path
              className="text-amber-500"
              strokeWidth="4"
              strokeDasharray="8, 100"
              strokeDashoffset="-86"
              stroke="currentColor"
              fill="none"
              d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
            />
            <path
              className="text-rose-500"
              strokeWidth="4"
              strokeDasharray="6, 100"
              strokeDashoffset="-94"
              stroke="currentColor"
              fill="none"
              d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
            />
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
            <span className="text-base font-extrabold text-slate-900 leading-none">36</span>
            <span className="text-[10px] text-slate-400 font-medium mt-0.5">Total</span>
          </div>
        </div>

        {/* Legend */}
        <div className="space-y-1.5 text-xs pt-1">
          <div className="flex items-center justify-between text-[11px]">
            <div className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-500" />
              <span className="text-slate-600">With Summary</span>
            </div>
            <span className="font-bold text-slate-900">31 (86.11%)</span>
          </div>

          <div className="flex items-center justify-between text-[11px]">
            <div className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-amber-500" />
              <span className="text-slate-600">Pending Summary</span>
            </div>
            <span className="font-bold text-slate-900">3 (8.33%)</span>
          </div>

          <div className="flex items-center justify-between text-[11px]">
            <div className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-rose-500" />
              <span className="text-slate-600">Without Summary</span>
            </div>
            <span className="font-bold text-slate-900">2 (5.56%)</span>
          </div>
        </div>
      </div>

      {/* 2. Common Discharge Diagnoses Card */}
      <div className="bg-white border border-slate-200/80 rounded-2xl shadow-2xs p-4 space-y-2.5 text-xs">
        <h4 className="text-xs font-bold text-slate-900 border-b border-slate-100 pb-2">
          Common Discharge Diagnoses
        </h4>

        <div className="space-y-2">
          <div className="flex items-center justify-between py-0.5 text-[11px]">
            <span className="text-slate-600 font-medium">Pneumonia</span>
            <span className="font-extrabold text-slate-900">8</span>
          </div>

          <div className="flex items-center justify-between py-0.5 text-[11px]">
            <span className="text-slate-600 font-medium">Dengue Fever</span>
            <span className="font-extrabold text-slate-900">6</span>
          </div>

          <div className="flex items-center justify-between py-0.5 text-[11px]">
            <span className="text-slate-600 font-medium">Typhoid Fever</span>
            <span className="font-extrabold text-slate-900">4</span>
          </div>

          <div className="flex items-center justify-between py-0.5 text-[11px]">
            <span className="text-slate-600 font-medium">Post-Op Recovery</span>
            <span className="font-extrabold text-slate-900">4</span>
          </div>

          <div className="flex items-center justify-between py-0.5 text-[11px]">
            <span className="text-slate-600 font-medium">COPD Exacerbation</span>
            <span className="font-extrabold text-slate-900">3</span>
          </div>
        </div>

        <button
          type="button"
          className="text-xs font-semibold text-blue-600 hover:underline pt-1 block cursor-pointer"
        >
          View All
        </button>
      </div>

      {/* 3. Quick Actions Card */}
      <div className="bg-white border border-slate-200/80 rounded-2xl shadow-2xs p-4 space-y-2.5">
        <h4 className="text-xs font-bold text-slate-900 border-b border-slate-100 pb-2">
          Quick Actions
        </h4>

        <div className="space-y-1.5 text-xs font-semibold text-slate-700">
          <button
            onClick={onAdmitOpen}
            className="w-full p-2 bg-slate-50 hover:bg-blue-50/60 border border-slate-200/80 rounded-xl transition cursor-pointer flex items-center gap-2"
          >
            <UserPlus className="w-3.5 h-3.5 text-blue-600 shrink-0" />
            <span>Admit New Patient</span>
          </button>

          <button
            onClick={() => alert("Navigating to Bed Overview")}
            className="w-full p-2 bg-slate-50 hover:bg-indigo-50/60 border border-slate-200/80 rounded-xl transition cursor-pointer flex items-center gap-2"
          >
            <Bed className="w-3.5 h-3.5 text-indigo-600 shrink-0" />
            <span>Bed Overview</span>
          </button>

          <button
            onClick={() => alert("Navigating to View Admissions")}
            className="w-full p-2 bg-slate-50 hover:bg-cyan-50/60 border border-slate-200/80 rounded-xl transition cursor-pointer flex items-center gap-2"
          >
            <Eye className="w-3.5 h-3.5 text-cyan-600 shrink-0" />
            <span>View Admissions</span>
          </button>

          <button
            onClick={() => alert("Navigating to IPD Billing")}
            className="w-full p-2 bg-slate-50 hover:bg-teal-50/60 border border-slate-200/80 rounded-xl transition cursor-pointer flex items-center gap-2"
          >
            <Receipt className="w-3.5 h-3.5 text-teal-600 shrink-0" />
            <span>IPD Billing</span>
          </button>
        </div>
      </div>

      {/* 4. Need Help? Card */}
      <div className="bg-blue-50/50 border border-blue-100 rounded-2xl p-3.5 text-center space-y-2">
        <h5 className="text-xs font-bold text-slate-900 flex items-center justify-center gap-1.5">
          <HelpCircle className="w-4 h-4 text-blue-600" />
          <span>Need Help?</span>
        </h5>
        <button
          type="button"
          className="w-full py-1.5 bg-white border border-blue-200 text-blue-700 text-xs font-semibold rounded-xl hover:bg-blue-50 transition cursor-pointer shadow-2xs"
        >
          Contact Support
        </button>
      </div>
    </div>
  );
}
