import React from "react";
import { ClipboardList, Clock, Calendar, Activity, CheckCircle2, XCircle } from "lucide-react";
import { calculateRadiologyStats } from "../helpers/radiologyCalculations.js";

export default function RadiologyStatCards({ orders = [], backendStats = {} }) {
  const calc = calculateRadiologyStats(orders, backendStats);
  const total = calc.total || 0;

  const getPct = (val) => {
    if (!total || total === 0) return "0%";
    return `${Math.round((val / total) * 100)}%`;
  };

  const cards = [
    {
      title: "Total Orders",
      value: calc.total,
      subtext: "Database Total",
      icon: ClipboardList,
      iconBg: "bg-blue-50 text-blue-600 border border-blue-100",
    },
    {
      title: "Pending",
      value: calc.pending,
      subtext: getPct(calc.pending),
      icon: Clock,
      iconBg: "bg-amber-50 text-amber-600 border border-amber-100",
    },
    {
      title: "Scheduled",
      value: calc.scheduled,
      subtext: getPct(calc.scheduled),
      icon: Calendar,
      iconBg: "bg-purple-50 text-purple-600 border border-purple-100",
    },
    {
      title: "In-Progress",
      value: calc.inProgress,
      subtext: getPct(calc.inProgress),
      icon: Activity,
      iconBg: "bg-cyan-50 text-cyan-600 border border-cyan-100",
    },
    {
      title: "Completed",
      value: calc.completed,
      subtext: getPct(calc.completed),
      icon: CheckCircle2,
      iconBg: "bg-emerald-50 text-emerald-600 border border-emerald-100",
    },
    {
      title: "Urgent/Emergency",
      value: calc.urgent,
      subtext: getPct(calc.urgent),
      icon: XCircle,
      iconBg: "bg-rose-50 text-rose-600 border border-rose-100",
    },
  ];

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
      {cards.map((c) => {
        const IconComponent = c.icon;
        return (
          <div
            key={c.title}
            className="bg-white border border-slate-200/80 rounded-2xl p-3.5 shadow-2xs flex items-center justify-between hover:shadow-xs transition-shadow"
          >
            <div className="flex items-center gap-3">
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${c.iconBg}`}>
                <IconComponent className="w-5 h-5" />
              </div>
              <div className="leading-tight">
                <p className="text-[11px] font-semibold text-slate-500">{c.title}</p>
                <p className="text-xl font-extrabold text-slate-900 my-0.5">{c.value}</p>
                <p className="text-[10px] font-medium text-slate-400">{c.subtext}</p>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
