import React from "react";
import { Link } from "react-router-dom";
import { Plus, ArrowRight } from "lucide-react";

export default function RegisterHeader() {
  return (
    <header className="w-full max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
      {/* Brand Logo */}
      <Link to="/" className="flex items-center gap-3 group">
        <div className="w-10 h-10 rounded-2xl bg-[#1D61E7] text-white flex items-center justify-center shadow-lg shadow-blue-500/25 group-hover:scale-105 transition-transform">
          <Plus className="w-6 h-6 stroke-[3]" />
        </div>
        <div>
          <h1 className="text-xl font-bold text-slate-900 dark:text-white tracking-tight leading-none">
            CityCare
          </h1>
          <span className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest leading-none block mt-0.5">
            HOSPITAL
          </span>
        </div>
      </Link>

      {/* Login Navigation Link */}
      <div className="flex items-center gap-2 sm:gap-3">
        <span className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 font-medium">
          Already have an account?
        </span>
        <Link
          to="/login"
          className="px-4 py-2 text-xs sm:text-sm font-semibold text-blue-600 dark:text-blue-400 bg-white dark:bg-slate-800 border border-blue-200/90 dark:border-slate-700 rounded-xl hover:bg-blue-50 dark:hover:bg-slate-700 transition-all shadow-sm flex items-center gap-1.5"
        >
          Login <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
    </header>
  );
}
