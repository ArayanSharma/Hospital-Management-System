import React from "react";
import { ShieldCheck, Lightbulb, Crown, Shield, Stethoscope, HeartPulse, UserCheck, Pill, CreditCard, User } from "lucide-react";

export default function AddUserRightSidebar() {
  const roleList = [
    {
      title: "Super Admin",
      desc: "Full system access and all permissions",
      icon: <Crown className="w-4 h-4 text-purple-600" />,
      bg: "bg-purple-50",
    },
    {
      title: "Admin",
      desc: "Manage hospital operations and settings",
      icon: <Shield className="w-4 h-4 text-blue-600" />,
      bg: "bg-blue-50",
    },
    {
      title: "Doctor",
      desc: "Access to patient records and prescriptions",
      icon: <Stethoscope className="w-4 h-4 text-emerald-600" />,
      bg: "bg-emerald-50",
    },
    {
      title: "Nurse",
      desc: "Manage patient care and ward activities",
      icon: <HeartPulse className="w-4 h-4 text-rose-500" />,
      bg: "bg-rose-50",
    },
    {
      title: "Receptionist",
      desc: "Manage appointments and registrations",
      icon: <UserCheck className="w-4 h-4 text-orange-500" />,
      bg: "bg-orange-50",
    },
    {
      title: "Pharmacist",
      desc: "Manage pharmacy and inventory",
      icon: <Pill className="w-4 h-4 text-teal-600" />,
      bg: "bg-teal-50",
    },
    {
      title: "Accountant",
      desc: "Manage billing and financial records",
      icon: <CreditCard className="w-4 h-4 text-amber-600" />,
      bg: "bg-amber-50",
    },
    {
      title: "Patient",
      desc: "View own medical records and history",
      icon: <User className="w-4 h-4 text-slate-600" />,
      bg: "bg-slate-100",
    },
  ];

  return (
    <div className="space-y-4">
      {/* Card 1: Role Information matching Screenshot */}
      <div className="bg-white border border-slate-200/90 rounded-2xl p-4 shadow-2xs space-y-3">
        <h3 className="text-xs font-extrabold text-slate-900 tracking-wide border-b border-slate-100 pb-2">
          Role Information
        </h3>

        <div className="space-y-2.5">
          {roleList.map((r) => (
            <div key={r.title} className="flex items-start gap-2.5">
              <div className={`w-7 h-7 rounded-lg ${r.bg} flex items-center justify-center shrink-0 mt-0.5`}>
                {r.icon}
              </div>
              <div>
                <h4 className="text-xs font-extrabold text-slate-900 leading-snug">{r.title}</h4>
                <p className="text-[10px] text-slate-500 font-medium leading-tight">{r.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Card 2: Password Guidelines matching Screenshot */}
      <div className="bg-white border border-slate-200/90 rounded-2xl p-4 shadow-2xs space-y-3">
        <div className="flex items-center gap-2 border-b border-slate-100 pb-2">
          <ShieldCheck className="w-4 h-4 text-blue-600" />
          <h3 className="text-xs font-extrabold text-blue-700 tracking-wide">Password Guidelines</h3>
        </div>

        <div className="space-y-1.5 text-[11px] font-semibold text-slate-600">
          <div className="flex items-center gap-2">
            <span className="text-emerald-600 font-extrabold">✓</span>
            <span>Minimum 8 characters long</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-emerald-600 font-extrabold">✓</span>
            <span>Include uppercase and lowercase letters</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-emerald-600 font-extrabold">✓</span>
            <span>Include at least one number</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-emerald-600 font-extrabold">✓</span>
            <span>Include at least one special character</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-emerald-600 font-extrabold">✓</span>
            <span>Avoid common passwords</span>
          </div>
        </div>
      </div>

      {/* Card 3: Note Alert Banner matching Screenshot */}
      <div className="bg-amber-50/70 border border-amber-200/80 rounded-2xl p-4 shadow-2xs space-y-1.5 text-xs">
        <div className="flex items-center gap-1.5 text-amber-800 font-extrabold">
          <Lightbulb className="w-4 h-4 text-amber-600" />
          <span>Note</span>
        </div>
        <p className="text-[11px] text-amber-800/90 font-medium leading-relaxed">
          A temporary password will be sent to the user's email address. User must change the password on first login.
        </p>
      </div>
    </div>
  );
}
