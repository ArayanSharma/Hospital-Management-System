import React from "react";
import { Calendar, Clock, CheckCircle2, XCircle, UserX, UserCheck } from "lucide-react";

export default function AppointmentStatCards({ stats }) {
  const todayCount = stats?.todayCount ?? 0;
  const scheduledCount = stats?.scheduledCount ?? 0;
  const checkedInCount = stats?.checkedInCount ?? 0;
  const completedCount = stats?.completedCount ?? 0;
  const cancelledCount = stats?.cancelledCount ?? 0;
  const noShowCount = stats?.noShowCount ?? 0;

  const todayLabel = new Date().toLocaleDateString("en-US", {
    weekday: "long",
    day: "numeric",
    month: "short",
    year: "numeric",
  });

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
      {/* Card 1: Today's Appointments */}
      <div className="bg-white border border-slate-200/80 rounded-2xl p-4 shadow-2xs flex items-center gap-3.5">
        <div className="w-11 h-11 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
          <Calendar className="w-5 h-5" />
        </div>
        <div>
          <p className="text-[11px] font-medium text-slate-500">Today's Appointments</p>
          <h3 className="text-xl font-extrabold text-slate-900 tracking-tight mt-0.5">
            {Number(todayCount).toLocaleString()}
          </h3>
          <p className="text-[10px] font-semibold text-slate-400 mt-0.5">
            {todayLabel}
          </p>
        </div>
      </div>

      {/* Card 2: Checked-In Waiting */}
      <div className="bg-white border border-slate-200/80 rounded-2xl p-4 shadow-2xs flex items-center gap-3.5">
        <div className="w-11 h-11 rounded-2xl bg-purple-50 text-purple-600 flex items-center justify-center shrink-0">
          <UserCheck className="w-5 h-5" />
        </div>
        <div>
          <p className="text-[11px] font-medium text-slate-500">Checked-In Waiting</p>
          <h3 className="text-xl font-extrabold text-slate-900 tracking-tight mt-0.5">
            {Number(checkedInCount).toLocaleString()}
          </h3>
          <p className="text-[10px] font-semibold text-purple-600 mt-0.5">
            OPD Queue
          </p>
        </div>
      </div>

      {/* Card 2: Scheduled */}
      <div className="bg-white border border-slate-200/80 rounded-2xl p-4 shadow-2xs flex items-center gap-3.5">
        <div className="w-11 h-11 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
          <Clock className="w-5 h-5" />
        </div>
        <div>
          <p className="text-[11px] font-medium text-slate-500">Scheduled</p>
          <h3 className="text-xl font-extrabold text-slate-900 tracking-tight mt-0.5">
            {Number(scheduledCount).toLocaleString()}
          </h3>
          <p className="text-[10px] font-semibold text-emerald-600 mt-0.5">
            Upcoming appointments
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
            Today
          </p>
        </div>
      </div>

      {/* Card 4: Cancelled */}
      <div className="bg-white border border-slate-200/80 rounded-2xl p-4 shadow-2xs flex items-center gap-3.5">
        <div className="w-11 h-11 rounded-2xl bg-rose-50 text-rose-600 flex items-center justify-center shrink-0">
          <XCircle className="w-5 h-5" />
        </div>
        <div>
          <p className="text-[11px] font-medium text-slate-500">Cancelled</p>
          <h3 className="text-xl font-extrabold text-slate-900 tracking-tight mt-0.5">
            {Number(cancelledCount).toLocaleString()}
          </h3>
          <p className="text-[10px] font-semibold text-rose-500 mt-0.5">
            Today
          </p>
        </div>
      </div>

      {/* Card 5: No-Show */}
      <div className="bg-white border border-slate-200/80 rounded-2xl p-4 shadow-2xs flex items-center gap-3.5">
        <div className="w-11 h-11 rounded-2xl bg-purple-50 text-purple-600 flex items-center justify-center shrink-0">
          <UserX className="w-5 h-5" />
        </div>
        <div>
          <p className="text-[11px] font-medium text-slate-500">No-Show</p>
          <h3 className="text-xl font-extrabold text-slate-900 tracking-tight mt-0.5">
            {Number(noShowCount).toLocaleString()}
          </h3>
          <p className="text-[10px] font-semibold text-purple-600 mt-0.5">
            Today
          </p>
        </div>
      </div>
    </div>
  );
}
