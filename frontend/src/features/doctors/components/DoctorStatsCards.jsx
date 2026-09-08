import React from "react";
import { UserCheck, Building2, IndianRupee, Stethoscope } from "lucide-react";

export default function DoctorStatsCards({ stats, totalFallback, doctorsLength }) {
  const totalDoctorsCount = stats?.totalDoctors ?? (totalFallback || doctorsLength);
  const activeDoctorsCount = stats?.activeDoctors ?? 0;
  const totalDepartmentsCount = stats?.totalDepartments ?? 0;
  const avgConsultationFee = stats?.avgConsultationFee ?? 0;
  const activePercentage = stats?.activePercentage ?? "100.00";

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {/* Card 1: Total Doctors */}
      <div className="bg-white border border-slate-200/80 rounded-2xl p-4 shadow-2xs flex items-center gap-4">
        <div className="w-12 h-12 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
          <Stethoscope className="w-6 h-6" />
        </div>
        <div>
          <p className="text-xs font-medium text-slate-500">Total Doctors</p>
          <h3 className="text-2xl font-extrabold text-slate-900 tracking-tight mt-0.5">
            {Number(totalDoctorsCount).toLocaleString()}
          </h3>
          <p className="text-[11px] font-semibold text-slate-400 mt-0.5">Active Medical Staff</p>
        </div>
      </div>

      {/* Card 2: Active Doctors */}
      <div className="bg-white border border-slate-200/80 rounded-2xl p-4 shadow-2xs flex items-center gap-4">
        <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
          <UserCheck className="w-6 h-6" />
        </div>
        <div>
          <p className="text-xs font-medium text-slate-500">Active Doctors</p>
          <h3 className="text-2xl font-extrabold text-slate-900 tracking-tight mt-0.5">
            {Number(activeDoctorsCount).toLocaleString()}
          </h3>
          <p className="text-[11px] font-semibold text-emerald-600 mt-0.5">
            {activePercentage}% Available
          </p>
        </div>
      </div>

      {/* Card 3: Total Departments */}
      <div className="bg-white border border-slate-200/80 rounded-2xl p-4 shadow-2xs flex items-center gap-4">
        <div className="w-12 h-12 rounded-2xl bg-purple-50 text-purple-600 flex items-center justify-center shrink-0">
          <Building2 className="w-6 h-6" />
        </div>
        <div>
          <p className="text-xs font-medium text-slate-500">Departments</p>
          <h3 className="text-2xl font-extrabold text-slate-900 tracking-tight mt-0.5">
            {Number(totalDepartmentsCount).toLocaleString()}
          </h3>
          <p className="text-[11px] font-semibold text-slate-400 mt-0.5">Specialized Units</p>
        </div>
      </div>

      {/* Card 4: Avg Consultation Fee */}
      <div className="bg-white border border-slate-200/80 rounded-2xl p-4 shadow-2xs flex items-center gap-4">
        <div className="w-12 h-12 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center shrink-0">
          <IndianRupee className="w-6 h-6" />
        </div>
        <div>
          <p className="text-xs font-medium text-slate-500">Avg Fee</p>
          <h3 className="text-2xl font-extrabold text-slate-900 tracking-tight mt-0.5">
            ₹{Number(avgConsultationFee).toLocaleString()}
          </h3>
          <p className="text-[11px] font-semibold text-slate-400 mt-0.5">Overall Average</p>
        </div>
      </div>
    </div>
  );
}
