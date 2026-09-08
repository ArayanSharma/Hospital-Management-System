import React from "react";
import { Bell } from "lucide-react";

export default function ProfileNavbar({ userName, userRole, initials }) {
  return (
    <header className="bg-white/80 dark:bg-[#111827]/80 backdrop-blur-md border-b border-slate-200/80 dark:border-slate-800/80 sticky top-0 z-30 px-4 lg:px-8 py-3 flex items-center justify-between shadow-sm">
      {/* Left Logo */}
      <div className="flex items-center gap-3">
        <div className="w-9 h-9 rounded-xl bg-blue-600 flex items-center justify-center text-white font-extrabold text-xl shadow-md shadow-blue-500/20">
          +
        </div>
        <div>
          <h1 className="text-base font-extrabold text-slate-900 dark:text-white tracking-tight leading-none">
            CityCare
          </h1>
          <span className="text-[10px] font-bold tracking-widest text-blue-600 dark:text-blue-400 uppercase">
            HOSPITAL
          </span>
        </div>
      </div>

      {/* Right Section: Notifications & User Avatar Chip */}
      <div className="flex items-center gap-4">
        <button className="relative p-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300 transition-colors">
          <Bell className="w-5 h-5" />
          <span className="absolute top-1 right-1 w-4 h-4 bg-red-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center">
            3
          </span>
        </button>

        <div className="flex items-center gap-2.5 pl-3 border-l border-slate-200 dark:border-slate-800">
          <div className="w-8 h-8 rounded-full bg-blue-600 text-white font-bold text-xs flex items-center justify-center shadow-inner">
            {initials}
          </div>
          <div className="hidden sm:block text-left">
            <div className="text-xs font-bold text-slate-900 dark:text-white leading-tight">
              {userName || "Aditya Sharma"}
            </div>
            <div className="text-[10px] text-slate-500 dark:text-slate-400 font-medium">
              {userRole || "Pharmacist"}
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
