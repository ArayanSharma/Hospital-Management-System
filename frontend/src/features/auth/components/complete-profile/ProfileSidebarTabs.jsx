import React from "react";
import { User, Briefcase, Phone, MapPin, Camera, Sliders, CheckCircle2 } from "lucide-react";

const TAB_ITEMS = [
  { id: "personal", label: "Personal Information", icon: User, step: 1 },
  { id: "professional", label: "Professional Details", icon: Briefcase, step: 2 },
  { id: "contact", label: "Contact Information", icon: Phone, step: 3 },
  { id: "address", label: "Address Information", icon: MapPin, step: 3 },
  { id: "photo", label: "Profile Photo", icon: Camera, step: 4 },
  { id: "preferences", label: "Preferences & Review", icon: Sliders, step: 4 },
];

export default function ProfileSidebarTabs({ userName, userRole, initials, activeTab, setActiveTab }) {
  return (
    <div className="md:col-span-3 space-y-1 bg-slate-50/50 dark:bg-slate-900/30 p-4 rounded-2xl border border-slate-100 dark:border-slate-800/80">
      {/* User Avatar Circle & Badge */}
      <div className="flex flex-col items-center text-center pb-4 mb-3 border-b border-slate-200/80 dark:border-slate-800">
        <div className="relative mb-2">
          <div className="w-16 h-16 rounded-full bg-gradient-to-tr from-blue-600 to-indigo-600 text-white font-black text-xl flex items-center justify-center shadow-md shadow-blue-500/20">
            {initials}
          </div>
          <span className="absolute bottom-1 right-0 w-4 h-4 bg-emerald-500 border-2 border-white dark:border-slate-900 rounded-full" />
        </div>
        <h3 className="text-sm font-bold text-slate-900 dark:text-white leading-snug">
          {userName || "Aditya Sharma"}
        </h3>
        <span className="text-[11px] text-slate-500 dark:text-slate-400 font-semibold px-2 py-0.5 mt-1 bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded-full border border-blue-100 dark:border-blue-800/50">
          {userRole || "DOCTOR"}
        </span>
      </div>

      {/* Navigation List */}
      <div className="space-y-1">
        {TAB_ITEMS.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              type="button"
              onClick={() => setActiveTab(item.id)}
              className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-semibold transition-all text-left ${
                isActive
                  ? "bg-blue-600 text-white font-bold shadow-md shadow-blue-500/20"
                  : "text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800/60"
              }`}
            >
              <div className="flex items-center gap-2.5">
                <Icon className="w-4 h-4" />
                <span>{item.label}</span>
              </div>
              {isActive && <CheckCircle2 className="w-3.5 h-3.5 text-white/80" />}
            </button>
          );
        })}
      </div>
    </div>
  );
}
