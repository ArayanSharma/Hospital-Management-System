import React from "react";
import { Calendar, Clock, CheckCircle2, UserCheck } from "lucide-react";

export default function OpdStatCards({ stats }) {
  const todayCount = stats?.todayCount ?? 36;
  const inProgressCount = stats?.inProgressCount ?? 12;
  const completedCount = stats?.completedCount ?? 21;
  const walkInCount = stats?.walkInCount ?? 9;

  const todayLabel = new Date().toLocaleDateString("en-US", {
    weekday: "short",
    day: "numeric",
    month: "short",
    year: "numeric",
  });

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {/* Card 1: Today's Visits */}
      <div className="bg-white border border-slate-200/80 rounded-2xl p-4 shadow-2xs flex items-center gap-3.5">
        <div className="w-11 h-11 rounded-2xl bg-purple-50 text-purple-600 flex items-center justify-center shrink-0">
          <Calendar className="w-5 h-5" />
        </div>
        <div>
          <p className="text-[11px] font-medium text-slate-500">Today's Visits</p>
          <h3 className="text-xl font-extrabold text-slate-900 tracking-tight mt-0.5">
            {Number(todayCount).toLocaleString()}
          </h3>
          <p className="text-[10px] font-semibold text-slate-400 mt-0.5">
            {todayLabel}
          </p>
        </div>
      </div>

      {/* Card 2: In-Progress */}
      <div className="bg-white border border-slate-200/80 rounded-2xl p-4 shadow-2xs flex items-center gap-3.5">
        <div className="w-11 h-11 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
          <Clock className="w-5 h-5" />
        </div>
        <div>
          <p className="text-[11px] font-medium text-slate-500">In-Progress</p>
          <h3 className="text-xl font-extrabold text-slate-900 tracking-tight mt-0.5">
            {Number(inProgressCount).toLocaleString()}
          </h3>
          <p className="text-[10px] font-semibold text-emerald-600 mt-0.5">
            Currently in consultation
          </p>
        </div>
      </div>

      {/* Card 3: Completed */}
      <div className="bg-white border border-slate-200/80 rounded-2xl p-4 shadow-2xs flex items-center gap-3.5">
        <div className="w-11 h-11 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center shrink-0">
          <CheckCircle2 className="w-5 h-5" />
        </div>
        <div>
          <p className="text-[11px] font-medium text-slate-500">Completed</p>
          <h3 className="text-xl font-extrabold text-slate-900 tracking-tight mt-0.5">
            {Number(completedCount).toLocaleString()}
          </h3>
          <p className="text-[10px] font-semibold text-slate-400 mt-0.5">
            Completed today
          </p>
        </div>
      </div>

      {/* Card 4: Walk-in Visits */}
      <div className="bg-white border border-slate-200/80 rounded-2xl p-4 shadow-2xs flex items-center gap-3.5">
        <div className="w-11 h-11 rounded-2xl bg-rose-50 text-rose-600 flex items-center justify-center shrink-0">
          <UserCheck className="w-5 h-5" />
        </div>
        <div>
          <p className="text-[11px] font-medium text-slate-500">Walk-in Visits</p>
          <h3 className="text-xl font-extrabold text-slate-900 tracking-tight mt-0.5">
            {Number(walkInCount).toLocaleString()}
          </h3>
          <p className="text-[10px] font-semibold text-rose-500 mt-0.5">
            Today
          </p>
        </div>
      </div>
    </div>
  );
}
