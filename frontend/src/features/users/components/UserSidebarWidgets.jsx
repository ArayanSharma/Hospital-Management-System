import React from "react";
import { Users, UserCheck, UserX, ShieldAlert, Plus, Edit, PauseCircle, ArrowRight } from "lucide-react";

export default function UserSidebarWidgets({ counts = {}, roleDistribution = [], users = [] }) {
  const total = counts.total ?? 0;
  const active = counts.active ?? 0;
  const inactive = counts.inactive ?? 0;
  const suspendedBlocked = (counts.suspended ?? 0) + (counts.blocked ?? 0);

  const roleColors = [
    { bg: "bg-blue-600", stroke: "#2563eb" },
    { bg: "bg-purple-600", stroke: "#9333ea" },
    { bg: "bg-orange-500", stroke: "#f97316" },
    { bg: "bg-emerald-500", stroke: "#10b981" },
    { bg: "bg-amber-500", stroke: "#f59e0b" },
    { bg: "bg-slate-600", stroke: "#475569" },
    { bg: "bg-rose-500", stroke: "#f43f5e" },
    { bg: "bg-indigo-600", stroke: "#4f46e5" },
  ];

  const getRoleColorObj = (index) => {
    return roleColors[index % roleColors.length];
  };

  let accumPercent = 0;
  const chartSegments = roleDistribution.map((item, idx) => {
    const numPct = parseFloat(item.percent) || 0;
    const offset = accumPercent;
    accumPercent += numPct;
    return {
      ...item,
      numPct,
      offset,
      color: getRoleColorObj(idx),
    };
  });

  return (
    <div className="space-y-4">
      {/* Card 1: User Overview (100% Dynamic DB Counts) */}
      <div className="bg-white border border-slate-200/90 rounded-2xl p-4 shadow-2xs space-y-3">
        <h3 className="text-xs font-extrabold text-slate-900 tracking-wide border-b border-slate-100 pb-2">
          User Overview
        </h3>

        <div className="grid grid-cols-2 gap-3">
          {/* Total Users */}
          <div className="p-3 bg-blue-50/50 border border-blue-100 rounded-xl flex items-center justify-between">
            <div>
              <p className="text-xl font-black text-slate-900">{total}</p>
              <p className="text-[10px] font-bold text-slate-500">Total Users</p>
            </div>
            <div className="w-7 h-7 rounded-lg bg-blue-100 text-blue-600 flex items-center justify-center">
              <Users className="w-4 h-4" />
            </div>
          </div>

          {/* Active Users */}
          <div className="p-3 bg-emerald-50/50 border border-emerald-100 rounded-xl flex items-center justify-between">
            <div>
              <p className="text-xl font-black text-slate-900">{active}</p>
              <p className="text-[10px] font-bold text-slate-500">Active Users</p>
            </div>
            <div className="w-7 h-7 rounded-lg bg-emerald-100 text-emerald-600 flex items-center justify-center">
              <UserCheck className="w-4 h-4" />
            </div>
          </div>

          {/* Inactive Users */}
          <div className="p-3 bg-slate-50 border border-slate-200/80 rounded-xl flex items-center justify-between">
            <div>
              <p className="text-xl font-black text-slate-900">{inactive}</p>
              <p className="text-[10px] font-bold text-slate-500">Inactive Users</p>
            </div>
            <div className="w-7 h-7 rounded-lg bg-slate-200 text-slate-600 flex items-center justify-center">
              <UserX className="w-4 h-4" />
            </div>
          </div>

          {/* Suspended / Blocked */}
          <div className="p-3 bg-rose-50/50 border border-rose-100 rounded-xl flex items-center justify-between">
            <div>
              <p className="text-xl font-black text-slate-900">{suspendedBlocked}</p>
              <p className="text-[10px] font-bold text-slate-500">Suspended / Blocked</p>
            </div>
            <div className="w-7 h-7 rounded-lg bg-rose-100 text-rose-600 flex items-center justify-center">
              <ShieldAlert className="w-4 h-4" />
            </div>
          </div>
        </div>
      </div>

      {/* Card 2: Role Distribution (100% Dynamic Donut Chart & Legend from DB) */}
      <div className="bg-white border border-slate-200/90 rounded-2xl p-4 shadow-2xs space-y-3">
        <h3 className="text-xs font-extrabold text-slate-900 tracking-wide border-b border-slate-100 pb-2">
          Role Distribution
        </h3>

        {roleDistribution.length === 0 ? (
          <p className="text-xs text-slate-400 font-medium py-3 text-center">
            No role distribution data available.
          </p>
        ) : (
          <div className="flex items-center gap-4">
            {/* Donut Chart with Dynamic SVG Paths */}
            <div className="relative w-28 h-28 shrink-0 flex items-center justify-center">
              <svg viewBox="0 0 36 36" className="w-full h-full transform -rotate-90">
                <path
                  d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                  fill="none"
                  stroke="#e2e8f0"
                  strokeWidth="4"
                />
                {chartSegments.map((seg) => (
                  <path
                    key={seg.role}
                    d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                    fill="none"
                    stroke={seg.color.stroke}
                    strokeWidth="4.5"
                    strokeDasharray={`${seg.numPct}, 100`}
                    strokeDashoffset={`-${seg.offset}`}
                  />
                ))}
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
                <span className="text-sm font-black text-slate-900 leading-none">{total}</span>
                <span className="text-[9px] font-bold text-slate-400">Total</span>
              </div>
            </div>

            {/* Dynamic Legend List */}
            <div className="space-y-1 text-[10px] font-bold text-slate-700 flex-1">
              {chartSegments.map((item) => (
                <div key={item.role} className="flex items-center justify-between">
                  <div className="flex items-center gap-1.5 min-w-0">
                    <span className={`w-2 h-2 rounded-full shrink-0 ${item.color.bg}`}></span>
                    <span className="capitalize truncate">{item.role}</span>
                  </div>
                  <span className="text-slate-500 font-mono shrink-0 ml-1">
                    {item.count} ({item.percent})
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Card 3: Recent Activities */}
      <div className="bg-white border border-slate-200/90 rounded-2xl p-4 shadow-2xs space-y-3">
        <h3 className="text-xs font-extrabold text-slate-900 tracking-wide border-b border-slate-100 pb-2">
          Recent Activities
        </h3>

        <div className="space-y-3 text-xs">
          {/* Row 1 */}
          <div className="flex items-start gap-2.5">
            <div className="w-6 h-6 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0 mt-0.5 border border-emerald-200">
              <Plus className="w-3.5 h-3.5" />
            </div>
            <div className="flex-1">
              <p className="text-[11px] font-extrabold text-slate-900">New user added</p>
              <p className="text-[10px] text-slate-500 font-bold">Dr. Arjun Sharma (Doctor)</p>
              <p className="text-[9px] text-slate-400 font-medium">31 May 2025, 11:20 AM</p>
            </div>
          </div>

          {/* Row 2 */}
          <div className="flex items-start gap-2.5">
            <div className="w-6 h-6 rounded-full bg-amber-50 text-amber-600 flex items-center justify-center shrink-0 mt-0.5 border border-amber-200">
              <Edit className="w-3.5 h-3.5" />
            </div>
            <div className="flex-1">
              <p className="text-[11px] font-extrabold text-slate-900">User updated</p>
              <p className="text-[10px] text-slate-500 font-bold">Nisha Sharma (Nurse)</p>
              <p className="text-[9px] text-slate-400 font-medium">31 May 2025, 09:45 AM</p>
            </div>
          </div>

          {/* Row 3 */}
          <div className="flex items-start gap-2.5">
            <div className="w-6 h-6 rounded-full bg-orange-50 text-orange-600 flex items-center justify-center shrink-0 mt-0.5 border border-orange-200">
              <PauseCircle className="w-3.5 h-3.5" />
            </div>
            <div className="flex-1">
              <p className="text-[11px] font-extrabold text-slate-900">User suspended</p>
              <p className="text-[10px] text-slate-500 font-bold">Sunita Rani (Nurse)</p>
              <p className="text-[9px] text-slate-400 font-medium">15 May 2025, 02:30 PM</p>
            </div>
          </div>
        </div>

        <div className="pt-2 border-t border-slate-100 text-center">
          <button
            type="button"
            onClick={() => alert("Opening complete Audit Logs...")}
            className="text-[11px] font-bold text-blue-600 hover:text-blue-700 inline-flex items-center gap-1 transition cursor-pointer"
          >
            <span>View all activities</span>
            <ArrowRight className="w-3 h-3" />
          </button>
        </div>
      </div>
    </div>
  );
}
