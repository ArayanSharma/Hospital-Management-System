import React from "react";
import {
  Bed as BedIcon,
  CheckCircle2,
  AlertCircle,
  Wrench,
  Users,
  UserPlus,
  UserCheck,
} from "lucide-react";

export default function IpdStatCards({ stats }) {
  const totalBeds = stats?.totalBeds ?? 120;
  const availableBeds = stats?.availableBeds ?? 32;
  const availablePct = stats?.availablePercentage ?? "26.67%";
  const occupiedBeds = stats?.occupiedBeds ?? 78;
  const occupiedPct = stats?.occupiedPercentage ?? "65.00%";
  const maintenanceBeds = stats?.maintenanceBeds ?? 10;
  const maintenancePct = stats?.maintenancePercentage ?? "8.33%";
  const currentlyAdmitted = stats?.currentlyAdmitted ?? 78;
  const todayAdmissions = stats?.todayAdmissions ?? 6;
  const todayDischarges = stats?.todayDischarges ?? 4;

  return (
    <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-3">
      {/* Card 1: Total Beds */}
      <div className="bg-white border border-slate-200/80 rounded-2xl p-3 shadow-2xs flex flex-col justify-between">
        <div className="flex items-center justify-between">
          <span className="text-[11px] font-medium text-slate-500">Total Beds</span>
          <div className="w-7 h-7 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center">
            <BedIcon className="w-3.5 h-3.5" />
          </div>
        </div>
        <div className="mt-1">
          <h3 className="text-lg font-extrabold text-slate-900 tracking-tight">
            {Number(totalBeds).toLocaleString()}
          </h3>
          <p className="text-[10px] font-semibold text-slate-400 mt-0.5">All Wards</p>
        </div>
      </div>

      {/* Card 2: Available Beds */}
      <div className="bg-white border border-slate-200/80 rounded-2xl p-3 shadow-2xs flex flex-col justify-between">
        <div className="flex items-center justify-between">
          <span className="text-[11px] font-medium text-slate-500">Available Beds</span>
          <div className="w-7 h-7 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center">
            <CheckCircle2 className="w-3.5 h-3.5" />
          </div>
        </div>
        <div className="mt-1">
          <h3 className="text-lg font-extrabold text-slate-900 tracking-tight">
            {Number(availableBeds).toLocaleString()}
          </h3>
          <p className="text-[10px] font-semibold text-emerald-600 mt-0.5">{availablePct}</p>
        </div>
      </div>

      {/* Card 3: Occupied Beds */}
      <div className="bg-white border border-slate-200/80 rounded-2xl p-3 shadow-2xs flex flex-col justify-between">
        <div className="flex items-center justify-between">
          <span className="text-[11px] font-medium text-slate-500">Occupied Beds</span>
          <div className="w-7 h-7 rounded-lg bg-rose-50 text-rose-600 flex items-center justify-center">
            <AlertCircle className="w-3.5 h-3.5" />
          </div>
        </div>
        <div className="mt-1">
          <h3 className="text-lg font-extrabold text-slate-900 tracking-tight">
            {Number(occupiedBeds).toLocaleString()}
          </h3>
          <p className="text-[10px] font-semibold text-rose-500 mt-0.5">{occupiedPct}</p>
        </div>
      </div>

      {/* Card 4: Maintenance */}
      <div className="bg-white border border-slate-200/80 rounded-2xl p-3 shadow-2xs flex flex-col justify-between">
        <div className="flex items-center justify-between">
          <span className="text-[11px] font-medium text-slate-500">Maintenance</span>
          <div className="w-7 h-7 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center">
            <Wrench className="w-3.5 h-3.5" />
          </div>
        </div>
        <div className="mt-1">
          <h3 className="text-lg font-extrabold text-slate-900 tracking-tight">
            {Number(maintenanceBeds).toLocaleString()}
          </h3>
          <p className="text-[10px] font-semibold text-amber-600 mt-0.5">{maintenancePct}</p>
        </div>
      </div>

      {/* Card 5: Currently Admitted */}
      <div className="bg-white border border-slate-200/80 rounded-2xl p-3 shadow-2xs flex flex-col justify-between">
        <div className="flex items-center justify-between">
          <span className="text-[11px] font-medium text-slate-500">Currently Admitted</span>
          <div className="w-7 h-7 rounded-lg bg-cyan-50 text-cyan-600 flex items-center justify-center">
            <Users className="w-3.5 h-3.5" />
          </div>
        </div>
        <div className="mt-1">
          <h3 className="text-lg font-extrabold text-slate-900 tracking-tight">
            {Number(currentlyAdmitted).toLocaleString()}
          </h3>
          <p className="text-[10px] font-semibold text-cyan-600 mt-0.5">Patients</p>
        </div>
      </div>

      {/* Card 6: Today Admissions */}
      <div className="bg-white border border-slate-200/80 rounded-2xl p-3 shadow-2xs flex flex-col justify-between">
        <div className="flex items-center justify-between">
          <span className="text-[11px] font-medium text-slate-500">Today Admissions</span>
          <div className="w-7 h-7 rounded-lg bg-purple-50 text-purple-600 flex items-center justify-center">
            <UserPlus className="w-3.5 h-3.5" />
          </div>
        </div>
        <div className="mt-1">
          <h3 className="text-lg font-extrabold text-slate-900 tracking-tight">
            {Number(todayAdmissions).toLocaleString()}
          </h3>
          <p className="text-[10px] font-semibold text-purple-600 mt-0.5">Today</p>
        </div>
      </div>

      {/* Card 7: Today Discharges */}
      <div className="bg-white border border-slate-200/80 rounded-2xl p-3 shadow-2xs flex flex-col justify-between">
        <div className="flex items-center justify-between">
          <span className="text-[11px] font-medium text-slate-500">Today Discharges</span>
          <div className="w-7 h-7 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center">
            <UserCheck className="w-3.5 h-3.5" />
          </div>
        </div>
        <div className="mt-1">
          <h3 className="text-lg font-extrabold text-slate-900 tracking-tight">
            {Number(todayDischarges).toLocaleString()}
          </h3>
          <p className="text-[10px] font-semibold text-emerald-600 mt-0.5">Today</p>
        </div>
      </div>
    </div>
  );
}
