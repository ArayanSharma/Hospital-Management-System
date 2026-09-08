import React from "react";
import { Bed, UserCheck, Calendar, Clock, AlertCircle } from "lucide-react";

export default function IpdAdmissionsStatCards({ stats }) {
  const totalAdmissions = stats?.totalAdmissions ?? 78;
  const currentlyAdmitted = stats?.currentlyAdmitted ?? 42;
  const dischargedThisMonth = stats?.dischargedThisMonth ?? 18;
  const averageStay = stats?.averageStay ?? "4.6";
  const pendingDischarges = stats?.pendingDischarges ?? 3;

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
      {/* Card 1: Total Admissions */}
      <div className="bg-white border border-slate-200/80 rounded-2xl p-3.5 shadow-2xs flex flex-col justify-between">
        <div className="flex items-center justify-between">
          <span className="text-xs font-medium text-slate-500">Total Admissions</span>
          <div className="w-8 h-8 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
            <Bed className="w-4 h-4" />
          </div>
        </div>
        <div className="mt-2">
          <h3 className="text-xl font-extrabold text-slate-900 tracking-tight">
            {Number(totalAdmissions).toLocaleString()}
          </h3>
          <p className="text-[11px] font-medium text-slate-400 mt-0.5">All Time</p>
        </div>
      </div>

      {/* Card 2: Currently Admitted */}
      <div className="bg-white border border-slate-200/80 rounded-2xl p-3.5 shadow-2xs flex flex-col justify-between">
        <div className="flex items-center justify-between">
          <span className="text-xs font-medium text-slate-500">Currently Admitted</span>
          <div className="w-8 h-8 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
            <UserCheck className="w-4 h-4" />
          </div>
        </div>
        <div className="mt-2">
          <h3 className="text-xl font-extrabold text-slate-900 tracking-tight">
            {Number(currentlyAdmitted).toLocaleString()}
          </h3>
          <p className="text-[11px] font-medium text-slate-400 mt-0.5">Patients in hospital</p>
        </div>
      </div>

      {/* Card 3: Discharged (This Month) */}
      <div className="bg-white border border-slate-200/80 rounded-2xl p-3.5 shadow-2xs flex flex-col justify-between">
        <div className="flex items-center justify-between">
          <span className="text-xs font-medium text-slate-500">Discharged (This Month)</span>
          <div className="w-8 h-8 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center">
            <Calendar className="w-4 h-4" />
          </div>
        </div>
        <div className="mt-2">
          <h3 className="text-xl font-extrabold text-slate-900 tracking-tight">
            {Number(dischargedThisMonth).toLocaleString()}
          </h3>
          <p className="text-[11px] font-medium text-slate-400 mt-0.5">August 2026</p>
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

      {/* Card 5: Pending Discharges */}
      <div className="bg-white border border-slate-200/80 rounded-2xl p-3.5 shadow-2xs flex flex-col justify-between">
        <div className="flex items-center justify-between">
          <span className="text-xs font-medium text-slate-500">Pending Discharges</span>
          <div className="w-8 h-8 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center">
            <AlertCircle className="w-4 h-4" />
          </div>
        </div>
        <div className="mt-2">
          <h3 className="text-xl font-extrabold text-slate-900 tracking-tight">
            {Number(pendingDischarges).toLocaleString()}
          </h3>
          <p className="text-[11px] font-medium text-slate-400 mt-0.5">Need Summary</p>
        </div>
      </div>
    </div>
  );
}
