import React from "react";
import { FlaskConical, Clock, Lock, CheckCircle2, XCircle } from "lucide-react";

export default function LabStatCards({ stats }) {
  const totalOrders = stats?.totalOrders ?? 126;
  const pendingOrders = stats?.pendingOrders ?? 42;
  const pendingPct = stats?.pendingPercentage ?? "33.33%";

  const sampleCollectedOrders = stats?.sampleCollectedOrders ?? 36;
  const sampleCollectedPct = stats?.sampleCollectedPercentage ?? "28.57%";

  const completedOrders = stats?.completedOrders ?? 40;
  const completedPct = stats?.completedPercentage ?? "31.75%";

  const cancelledOrders = stats?.cancelledOrders ?? 8;
  const cancelledPct = stats?.cancelledPercentage ?? "6.35%";

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3.5">
      {/* 1. Total Orders */}
      <div className="bg-white border border-slate-200/80 rounded-2xl p-3.5 shadow-2xs flex items-center justify-between">
        <div className="space-y-0.5">
          <p className="text-[11px] font-semibold text-slate-400">Total Orders</p>
          <p className="text-xl font-extrabold text-slate-900 tracking-tight">{totalOrders}</p>
          <p className="text-[10px] font-medium text-slate-400">All Time</p>
        </div>
        <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
          <FlaskConical className="w-5 h-5" />
        </div>
      </div>

      {/* 2. Pending */}
      <div className="bg-white border border-slate-200/80 rounded-2xl p-3.5 shadow-2xs flex items-center justify-between">
        <div className="space-y-0.5">
          <p className="text-[11px] font-semibold text-slate-400">Pending</p>
          <p className="text-xl font-extrabold text-slate-900 tracking-tight">{pendingOrders}</p>
          <p className="text-[10px] font-medium text-amber-600">({pendingPct})</p>
        </div>
        <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center shrink-0">
          <Clock className="w-5 h-5" />
        </div>
      </div>

      {/* 3. Sample Collected */}
      <div className="bg-white border border-slate-200/80 rounded-2xl p-3.5 shadow-2xs flex items-center justify-between">
        <div className="space-y-0.5">
          <p className="text-[11px] font-semibold text-slate-400">Sample Collected</p>
          <p className="text-xl font-extrabold text-slate-900 tracking-tight">{sampleCollectedOrders}</p>
          <p className="text-[10px] font-medium text-purple-600">({sampleCollectedPct})</p>
        </div>
        <div className="w-10 h-10 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center shrink-0">
          <Lock className="w-5 h-5" />
        </div>
      </div>

      {/* 4. Completed */}
      <div className="bg-white border border-slate-200/80 rounded-2xl p-3.5 shadow-2xs flex items-center justify-between">
        <div className="space-y-0.5">
          <p className="text-[11px] font-semibold text-slate-400">Completed</p>
          <p className="text-xl font-extrabold text-slate-900 tracking-tight">{completedOrders}</p>
          <p className="text-[10px] font-medium text-emerald-600">({completedPct})</p>
        </div>
        <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
          <CheckCircle2 className="w-5 h-5" />
        </div>
      </div>

      {/* 5. Cancelled */}
      <div className="bg-white border border-slate-200/80 rounded-2xl p-3.5 shadow-2xs flex items-center justify-between col-span-2 sm:col-span-1">
        <div className="space-y-0.5">
          <p className="text-[11px] font-semibold text-slate-400">Cancelled</p>
          <p className="text-xl font-extrabold text-slate-900 tracking-tight">{cancelledOrders}</p>
          <p className="text-[10px] font-medium text-rose-500">({cancelledPct})</p>
        </div>
        <div className="w-10 h-10 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center shrink-0">
          <XCircle className="w-5 h-5" />
        </div>
      </div>
    </div>
  );
}
