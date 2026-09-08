import React from "react";
import { Link } from "react-router-dom";
import { Plus } from "lucide-react";

export default function LoginHeader() {
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
    </header>
  );
}
