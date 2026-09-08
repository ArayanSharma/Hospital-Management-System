import React from "react";
import { Clock, Calendar, Activity, CheckCircle2, XCircle, ArrowRight, ArrowDown, ArrowLeft } from "lucide-react";
import { calculateRadiologyStats } from "../helpers/radiologyCalculations.js";

export default function RadiologyStatusWorkflowCard({ orders = [], backendStats = {} }) {
  const calc = calculateRadiologyStats(orders, backendStats);

  const steps = [
    { label: "Pending", count: calc.pending || 0, icon: Clock, color: "text-amber-600 bg-amber-50 border-amber-200" },
    { label: "Scheduled", count: calc.scheduled || 0, icon: Calendar, color: "text-purple-600 bg-purple-50 border-purple-200" },
    { label: "In-Progress", count: calc.inProgress || 0, icon: Activity, color: "text-cyan-600 bg-cyan-50 border-cyan-200" },
    { label: "Completed", count: calc.completed || 0, icon: CheckCircle2, color: "text-emerald-600 bg-emerald-50 border-emerald-200" },
    { label: "Cancelled", count: calc.cancelled || 0, icon: XCircle, color: "text-rose-600 bg-rose-50 border-rose-200" },
  ];

  return (
    <div className="bg-white border border-slate-200/80 rounded-2xl p-4 shadow-2xs space-y-3">
      <h3 className="text-xs font-bold text-slate-900 border-b border-slate-100 pb-2">
        Status Workflow
      </h3>

      {/* Visual Workflow Diagram */}
      <div className="py-2 px-1 space-y-4">
        {/* Top Row: Pending -> Scheduled -> In-Progress */}
        <div className="flex items-center justify-between text-center">
          {/* Step 1: Pending */}
          <div className="flex flex-col items-center">
            <div className={`w-8 h-8 rounded-full border flex items-center justify-center ${steps[0].color}`}>
              <Clock className="w-4 h-4" />
            </div>
            <span className="text-[10px] font-bold text-slate-700 mt-1">{steps[0].label}</span>
            <span className="text-xs font-extrabold text-slate-900">{steps[0].count}</span>
          </div>

          <ArrowRight className="w-3.5 h-3.5 text-slate-300 mx-1" />

          {/* Step 2: Scheduled */}
          <div className="flex flex-col items-center">
            <div className={`w-8 h-8 rounded-full border flex items-center justify-center ${steps[1].color}`}>
              <Calendar className="w-4 h-4" />
            </div>
            <span className="text-[10px] font-bold text-slate-700 mt-1">{steps[1].label}</span>
            <span className="text-xs font-extrabold text-slate-900">{steps[1].count}</span>
          </div>

          <ArrowRight className="w-3.5 h-3.5 text-slate-300 mx-1" />

          {/* Step 3: In-Progress */}
          <div className="flex flex-col items-center relative">
            <div className={`w-8 h-8 rounded-full border flex items-center justify-center ${steps[2].color}`}>
              <Activity className="w-4 h-4" />
            </div>
            <span className="text-[10px] font-bold text-slate-700 mt-1">{steps[2].label}</span>
            <span className="text-xs font-extrabold text-slate-900">{steps[2].count}</span>
          </div>
        </div>

        {/* Down Arrow from In-Progress to Cancelled */}
        <div className="flex justify-end pr-5">
          <ArrowDown className="w-3.5 h-3.5 text-slate-300" />
        </div>

        {/* Bottom Row: Completed <- Cancelled */}
        <div className="flex items-center justify-end gap-6 text-center">
          {/* Step 4: Completed */}
          <div className="flex flex-col items-center">
            <div className={`w-8 h-8 rounded-full border flex items-center justify-center ${steps[3].color}`}>
              <CheckCircle2 className="w-4 h-4" />
            </div>
            <span className="text-[10px] font-bold text-slate-700 mt-1">{steps[3].label}</span>
            <span className="text-xs font-extrabold text-slate-900">{steps[3].count}</span>
          </div>

          <ArrowLeft className="w-3.5 h-3.5 text-slate-300" />

          {/* Step 5: Cancelled */}
          <div className="flex flex-col items-center">
            <div className={`w-8 h-8 rounded-full border flex items-center justify-center ${steps[4].color}`}>
              <XCircle className="w-4 h-4" />
            </div>
            <span className="text-[10px] font-bold text-slate-700 mt-1">{steps[4].label}</span>
            <span className="text-xs font-extrabold text-slate-900">{steps[4].count}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
