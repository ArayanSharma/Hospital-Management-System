import React from "react";
import {
  User,
  FileText,
  FlaskConical,
  Calendar,
  Stethoscope,
  Pill,
  AlertTriangle,
  Upload,
  ShieldCheck,
  Receipt,
  BedDouble,
  HeartPulse,
  Activity,
} from "lucide-react";

export default function PatientDetailNavTabs({ activeTab, setActiveTab, data, patient }) {
  const testsCount = patient?.labTests?.length ?? data?.tests?.length;
  const apptCount = patient?.appointments?.length ?? data?.appointments?.length;

  const tabs = [
    { id: "overview", label: "Overview", icon: User },
    { id: "history", label: "Medical History", icon: FileText },
    { id: "tests", label: "Tests & Lab", icon: FlaskConical, badge: testsCount },
    { id: "appointments", label: "Appointments", icon: Calendar, badge: apptCount },
    { id: "diagnoses", label: "Diagnoses", icon: Stethoscope },
    { id: "prescriptions", label: "Medications", icon: Pill },
    { id: "allergies", label: "Allergies", icon: AlertTriangle },
    { id: "insurance", label: "Insurance", icon: ShieldCheck },
    { id: "billing", label: "Billing", icon: Receipt },
    { id: "admissions", label: "Admissions", icon: BedDouble },
    { id: "timeline", label: "Activity Log", icon: Activity },
  ];

  return (
    <div className="bg-white border border-slate-200 rounded-full p-1 shadow-2xs overflow-x-auto">
      <div className="flex items-center gap-1 min-w-max">
        {tabs.map((t) => {
          const Icon = t.icon;
          const isActive = activeTab === t.id;
          return (
            <button
              key={t.id}
              onClick={() => setActiveTab(t.id)}
              className={`flex items-center gap-2 px-4 py-2 rounded-full text-xs font-bold transition-all cursor-pointer ${
                isActive
                  ? "bg-blue-600 text-white shadow-xs"
                  : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
              }`}
            >
              <Icon className="w-3.5 h-3.5 shrink-0" />
              <span>{t.label}</span>
              {t.badge !== undefined && t.badge > 0 && (
                <span
                  className={`px-1.5 py-0.2 rounded-full text-[10px] font-extrabold ${
                    isActive ? "bg-white/20 text-white" : "bg-slate-100 text-slate-600"
                  }`}
                >
                  {t.badge}
                </span>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}

