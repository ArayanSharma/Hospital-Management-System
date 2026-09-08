import React from "react";
import { Users, UserCheck, Stethoscope, Receipt, FileBarChart } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function AppointmentIntegratedModules() {
  const navigate = useNavigate();

  return (
    <div className="bg-white border border-slate-200/80 rounded-2xl p-5 shadow-2xs space-y-3">
      <h3 className="text-sm font-bold text-slate-900 tracking-tight">
        Integrated Modules
      </h3>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-5 gap-3">
        <div
          onClick={() => navigate("/patients")}
          className="p-3.5 bg-slate-50/60 hover:bg-blue-50/50 border border-slate-200/80 hover:border-blue-200 rounded-xl transition cursor-pointer group"
        >
          <div className="w-8 h-8 rounded-lg bg-blue-100 text-blue-600 flex items-center justify-center mb-2 group-hover:scale-105 transition-transform">
            <Users className="w-4 h-4" />
          </div>
          <h4 className="text-xs font-bold text-slate-900 group-hover:text-blue-600 transition-colors">
            Patients
          </h4>
          <p className="text-[11px] text-slate-400 leading-tight mt-0.5">
            View patient records
          </p>
        </div>

        <div
          onClick={() => navigate("/doctors")}
          className="p-3.5 bg-slate-50/60 hover:bg-purple-50/50 border border-slate-200/80 hover:border-purple-200 rounded-xl transition cursor-pointer group"
        >
          <div className="w-8 h-8 rounded-lg bg-purple-100 text-purple-600 flex items-center justify-center mb-2 group-hover:scale-105 transition-transform">
            <UserCheck className="w-4 h-4" />
          </div>
          <h4 className="text-xs font-bold text-slate-900 group-hover:text-purple-600 transition-colors">
            Doctors
          </h4>
          <p className="text-[11px] text-slate-400 leading-tight mt-0.5">
            Manage doctor profiles
          </p>
        </div>

        <div
          onClick={() => navigate("/opd-visits")}
          className="p-3.5 bg-slate-50/60 hover:bg-cyan-50/50 border border-slate-200/80 hover:border-cyan-200 rounded-xl transition cursor-pointer group"
        >
          <div className="w-8 h-8 rounded-lg bg-cyan-100 text-cyan-600 flex items-center justify-center mb-2 group-hover:scale-105 transition-transform">
            <Stethoscope className="w-4 h-4" />
          </div>
          <h4 className="text-xs font-bold text-slate-900 group-hover:text-cyan-600 transition-colors">
            OPD Visits
          </h4>
          <p className="text-[11px] text-slate-400 leading-tight mt-0.5">
            Consultation & notes
          </p>
        </div>

        <div
          onClick={() => navigate("/billing")}
          className="p-3.5 bg-slate-50/60 hover:bg-teal-50/50 border border-slate-200/80 hover:border-teal-200 rounded-xl transition cursor-pointer group"
        >
          <div className="w-8 h-8 rounded-lg bg-teal-100 text-teal-600 flex items-center justify-center mb-2 group-hover:scale-105 transition-transform">
            <Receipt className="w-4 h-4" />
          </div>
          <h4 className="text-xs font-bold text-slate-900 group-hover:text-teal-600 transition-colors">
            Billing
          </h4>
          <p className="text-[11px] text-slate-400 leading-tight mt-0.5">
            Generate invoices
          </p>
        </div>

        <div
          onClick={() => navigate("/reports")}
          className="p-3.5 bg-slate-50/60 hover:bg-indigo-50/50 border border-slate-200/80 hover:border-indigo-200 rounded-xl transition cursor-pointer group"
        >
          <div className="w-8 h-8 rounded-lg bg-indigo-100 text-indigo-600 flex items-center justify-center mb-2 group-hover:scale-105 transition-transform">
            <FileBarChart className="w-4 h-4" />
          </div>
          <h4 className="text-xs font-bold text-slate-900 group-hover:text-indigo-600 transition-colors">
            Reports
          </h4>
          <p className="text-[11px] text-slate-400 leading-tight mt-0.5">
            Analytics & insights
          </p>
        </div>
      </div>
    </div>
  );
}
