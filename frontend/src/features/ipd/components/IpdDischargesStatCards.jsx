import React from "react";
import { Bed, MapPin, Calendar, Clock, Gift } from "lucide-react";

export default function IpdDischargesStatCards({ stats }) {
  const totalDischarges = stats?.totalAdmissions ? stats.dischargedThisMonth * 2 : 36;
  const thisMonth = stats?.dischargedThisMonth ?? 18;
  const yesterday = 2;
  const averageStay = stats?.averageStay ?? "4.6";
  const pendingSummaries = stats?.pendingDischarges ?? 3;

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
      {/* Card 1: Total Discharges */}
      <div className="bg-white border border-slate-200/80 rounded-2xl p-3.5 shadow-2xs flex flex-col justify-between">
        <div className="flex items-center justify-between">
          <span className="text-xs font-medium text-slate-500">Total Discharges</span>
          <div className="w-8 h-8 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
            <Bed className="w-4 h-4" />
          </div>
        </div>
        <div className="mt-2">
          <h3 className="text-xl font-extrabold text-slate-900 tracking-tight">
            {Number(totalDischarges).toLocaleString()}
          </h3>
          <p className="text-[11px] font-medium text-slate-400 mt-0.5">All Time</p>
        </div>
      </div>

      {/* Card 2: This Month */}
      <div className="bg-white border border-slate-200/80 rounded-2xl p-3.5 shadow-2xs flex flex-col justify-between">
        <div className="flex items-center justify-between">
          <span className="text-xs font-medium text-slate-500">This Month</span>
          <div className="w-8 h-8 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
            <MapPin className="w-4 h-4" />
          </div>
        </div>
        <div className="mt-2">
          <h3 className="text-xl font-extrabold text-slate-900 tracking-tight">
            {Number(thisMonth).toLocaleString()}
          </h3>
          <p className="text-[11px] font-medium text-slate-400 mt-0.5">August 2026</p>
        </div>
      </div>

      {/* Card 3: Yesterday */}
      <div className="bg-white border border-slate-200/80 rounded-2xl p-3.5 shadow-2xs flex flex-col justify-between">
        <div className="flex items-center justify-between">
          <span className="text-xs font-medium text-slate-500">Yesterday</span>
          <div className="w-8 h-8 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center">
            <Calendar className="w-4 h-4" />
          </div>
        </div>
        <div className="mt-2">
          <h3 className="text-xl font-extrabold text-slate-900 tracking-tight">
            {yesterday}
          </h3>
          <p className="text-[11px] font-medium text-slate-400 mt-0.5">25 Aug 2026</p>
        </div>
      </div>

      {/* Card 4: Average Stay (Days) */}
      <div className="bg-white border border-slate-200/80 rounded-2xl p-3.5 shadow-2xs flex flex-col justify-between">
        <div className="flex items-center justify-between">
          <span className="text-xs font-medium text-slate-500">Average Stay (Days)</span>
          <div className="w-8 h-8 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center">
            <Clock className="w-4 h-4" />
          </div>
        </div>
        <div className="mt-2">
          <h3 className="text-xl font-extrabold text-slate-900 tracking-tight">
            {averageStay}
          </h3>
          <p className="text-[11px] font-medium text-slate-400 mt-0.5">This Month</p>
        </div>
      </div>

      {/* Card 5: Pending Summaries */}
      <div className="bg-white border border-slate-200/80 rounded-2xl p-3.5 shadow-2xs flex flex-col justify-between">
        <div className="flex items-center justify-between">
          <span className="text-xs font-medium text-slate-500">Pending Summaries</span>
          <div className="w-8 h-8 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center">
            <Gift className="w-4 h-4" />
          </div>
        </div>
        <div className="mt-2">
          <h3 className="text-xl font-extrabold text-slate-900 tracking-tight">
            {pendingSummaries}
          </h3>
          <p className="text-[11px] font-medium text-slate-400 mt-0.5">Need Summary</p>
        </div>
      </div>
    </div>
  );
}
