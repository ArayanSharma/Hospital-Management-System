import React from "react";
import { Users, UserCheck, UserX, UserPlus } from "lucide-react";

export default function PatientStatsCards({ stats, totalFallback, patientsLength }) {
  const totalPatientsCount = stats?.totalPatients ?? (totalFallback || patientsLength);
  const activePatientsCount = stats?.activePatients ?? 0;
  const inactivePatientsCount = stats?.inactivePatients ?? 0;
  const newThisMonthCount = stats?.newThisMonth ?? 0;
  const activePercentage = stats?.activePercentage ?? "100.00";
  const inactivePercentage = stats?.inactivePercentage ?? "0.00";

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {/* Card 1: Total Patients */}
      <div className="bg-white border border-slate-200/80 rounded-2xl p-4 shadow-2xs flex items-center gap-4">
        <div className="w-12 h-12 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
          <Users className="w-6 h-6" />
        </div>
        <div>
          <p className="text-xs font-medium text-slate-500">Total Patients</p>
          <h3 className="text-2xl font-extrabold text-slate-900 tracking-tight mt-0.5">
            {Number(totalPatientsCount).toLocaleString()}
          </h3>
          <p className="text-[11px] font-semibold text-slate-400 mt-0.5">Active Database</p>
        </div>
      </div>

      {/* Card 2: Active Patients */}
      <div className="bg-white border border-slate-200/80 rounded-2xl p-4 shadow-2xs flex items-center gap-4">
        <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
          <UserCheck className="w-6 h-6" />
        </div>
        <div>
          <p className="text-xs font-medium text-slate-500">Active Patients</p>
          <h3 className="text-2xl font-extrabold text-slate-900 tracking-tight mt-0.5">
            {Number(activePatientsCount).toLocaleString()}
          </h3>
          <p className="text-[11px] font-semibold text-emerald-600 mt-0.5">
            {activePercentage}% of total
          </p>
        </div>
      </div>

      {/* Card 3: Inactive Patients */}
      <div className="bg-white border border-slate-200/80 rounded-2xl p-4 shadow-2xs flex items-center gap-4">
        <div className="w-12 h-12 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center shrink-0">
          <UserX className="w-6 h-6" />
        </div>
        <div>
          <p className="text-xs font-medium text-slate-500">Inactive Patients</p>
          <h3 className="text-2xl font-extrabold text-slate-900 tracking-tight mt-0.5">
            {Number(inactivePatientsCount).toLocaleString()}
          </h3>
          <p className="text-[11px] font-semibold text-amber-600 mt-0.5">
            {inactivePercentage}% of total
          </p>
        </div>
      </div>

      {/* Card 4: New This Month */}
      <div className="bg-white border border-slate-200/80 rounded-2xl p-4 shadow-2xs flex items-center gap-4">
        <div className="w-12 h-12 rounded-2xl bg-purple-50 text-purple-600 flex items-center justify-center shrink-0">
          <UserPlus className="w-6 h-6" />
        </div>
        <div>
          <p className="text-xs font-medium text-slate-500">New This Month</p>
          <h3 className="text-2xl font-extrabold text-slate-900 tracking-tight mt-0.5">
            {Number(newThisMonthCount).toLocaleString()}
          </h3>
          <p className="text-[11px] font-semibold text-emerald-600 mt-0.5 flex items-center gap-0.5">
            + Registered this month
          </p>
        </div>
      </div>
    </div>
  );
}
