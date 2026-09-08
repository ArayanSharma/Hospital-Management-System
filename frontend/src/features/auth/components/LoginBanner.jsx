import React from "react";
import { Users, ShieldCheck, BarChart3, Lock } from "lucide-react";

const PILL_CARDS = [
  { icon: Users, label: "Secure Access" },
  { icon: ShieldCheck, label: "Role Based" },
  { icon: BarChart3, label: "Real-time Updates" },
  { icon: Lock, label: "Data Protection" },
];

export default function LoginBanner() {
  return (
    <div className="lg:col-span-5 flex flex-col justify-between py-2 pr-0 lg:pr-4">
      <div className="text-center lg:text-left">
        <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight mb-1">
          Welcome Back!
        </h2>
        <h3 className="text-xl sm:text-2xl font-bold text-slate-800 dark:text-slate-200 tracking-tight mb-2">
          Sign in to your account
        </h3>
        <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 leading-relaxed max-w-md mx-auto lg:mx-0 mb-6">
          Access your hospital dashboard and manage patients, appointments, billing and more.
        </p>

        {/* 4 Pill Cards Row */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 my-6">
          {PILL_CARDS.map((card, idx) => {
            const IconComp = card.icon;
            return (
              <div
                key={idx}
                className="bg-white dark:bg-[#111827] rounded-2xl p-3.5 border border-slate-100 dark:border-slate-800 shadow-sm flex flex-col items-center justify-center text-center group hover:shadow-md transition-all"
              >
                <div className="p-2 rounded-xl bg-blue-50 dark:bg-blue-900/40 text-blue-600 dark:text-blue-400 mb-2 group-hover:scale-110 transition-transform">
                  <IconComp className="w-5 h-5 stroke-[2.2]" />
                </div>
                <span className="text-[11px] sm:text-xs font-bold text-slate-800 dark:text-slate-200 leading-tight">
                  {card.label}
                </span>
              </div>
            );
          })}
        </div>

        {/* Hospital Building & Ambulance Uncropped Illustration */}
        <div className="relative my-4 w-full flex justify-center">
          <img
            src="/loginImg/loginImg.png"
            alt="CityCare Hospital & Ambulance Illustration"
            className="w-full max-w-md h-auto object-contain block drop-shadow-sm"
            onError={(e) => {
              e.target.style.display = "none";
            }}
          />
        </div>
      </div>
    </div>
  );
}
