import React from "react";
import { Building2, CheckCircle2, XCircle, UserCheck } from "lucide-react";

export default function DepartmentStatsCards({ stats, totalFallback, departmentsLength }) {
  const totalDepts = stats?.totalDepartments ?? (totalFallback || departmentsLength);
  const activeDepts = stats?.activeDepartments ?? 0;
  const inactiveDepts = stats?.inactiveDepartments ?? 0;
  const withHod = stats?.withHodCount ?? 0;

  const activePct = stats?.activePercentage ?? "100.0";
  const inactivePct = stats?.inactivePercentage ?? "0.0";
  const hodPct = stats?.hodPercentage ?? "100.0";

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {/* Card 1: Total Departments */}
      <div className="bg-white border border-slate-200/80 rounded-2xl p-4 shadow-2xs flex items-center gap-3.5">
        <div className="w-11 h-11 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
          <Building2 className="w-5 h-5" />
        </div>
        <div>
          <p className="text-[11px] font-medium text-slate-500">Total Departments</p>
          <h3 className="text-xl font-extrabold text-slate-900 tracking-tight mt-0.5">
            {Number(totalDepts).toLocaleString()}
          </h3>
          <p className="text-[10px] font-semibold text-slate-400 mt-0.5">All Registered</p>
        </div>
      </div>

      {/* Card 2: Active Departments */}
      <div className="bg-white border border-slate-200/80 rounded-2xl p-4 shadow-2xs flex items-center gap-3.5">
        <div className="w-11 h-11 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
          <CheckCircle2 className="w-5 h-5" />
        </div>
        <div>
          <p className="text-[11px] font-medium text-slate-500">Active Departments</p>
          <h3 className="text-xl font-extrabold text-slate-900 tracking-tight mt-0.5">
            {Number(activeDepts).toLocaleString()}
          </h3>
          <p className="text-[10px] font-semibold text-emerald-600 mt-0.5">
            {activePct}% of total
          </p>
        </div>
      </div>

      {/* Card 3: Inactive Departments */}
      <div className="bg-white border border-slate-200/80 rounded-2xl p-4 shadow-2xs flex items-center gap-3.5">
        <div className="w-11 h-11 rounded-2xl bg-rose-50 text-rose-600 flex items-center justify-center shrink-0">
          <XCircle className="w-5 h-5" />
        </div>
        <div>
          <p className="text-[11px] font-medium text-slate-500">Inactive Departments</p>
          <h3 className="text-xl font-extrabold text-slate-900 tracking-tight mt-0.5">
            {Number(inactiveDepts).toLocaleString()}
          </h3>
          <p className="text-[10px] font-semibold text-rose-500 mt-0.5">
            {inactivePct}% of total
          </p>
        </div>
      </div>

      {/* Card 4: Departments with HOD */}
      <div className="bg-white border border-slate-200/80 rounded-2xl p-4 shadow-2xs flex items-center gap-3.5">
        <div className="w-11 h-11 rounded-2xl bg-purple-50 text-purple-600 flex items-center justify-center shrink-0">
          <UserCheck className="w-5 h-5" />
        </div>
        <div>
          <p className="text-[11px] font-medium text-slate-500">Departments with HOD</p>
          <h3 className="text-xl font-extrabold text-slate-900 tracking-tight mt-0.5">
            {Number(withHod).toLocaleString()}
          </h3>
          <p className="text-[10px] font-semibold text-purple-600 mt-0.5">
            {hodPct}% of total
          </p>
        </div>
      </div>
    </div>
  );
}
