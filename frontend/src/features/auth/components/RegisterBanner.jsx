import React from "react";
import { ShieldCheck, Clock, Users, BarChart3 } from "lucide-react";

const FEATURES = [
  {
    icon: ShieldCheck,
    title: "Secure & Protected",
    description: "Your data is encrypted and secure with us.",
  },
  {
    icon: Clock,
    title: "Quick Access",
    description: "Access your dashboard and modules instantly.",
  },
  {
    icon: Users,
    title: "Role Based Access",
    description: "Get access based on your role and permissions.",
  },
  {
    icon: BarChart3,
    title: "Better Management",
    description: "Manage patients, appointments, billing and more efficiently.",
  },
];

export default function RegisterBanner() {
  return (
    <div className="lg:col-span-5 flex flex-col justify-between py-2 pr-0 lg:pr-4">
      <div className="text-center lg:text-left">
        <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight mb-2">
          Create Your Account
        </h2>
        <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 leading-relaxed max-w-md mx-auto lg:mx-0 mb-6">
          Join CityCare Hospital Management System and experience better healthcare management.
        </p>

        {/* Hospital Illustration */}
        <div className="relative my-4 w-full flex justify-center">
          <img
            src="/loginImg/registionImg.png"
            alt="CityCare Hospital Illustration"
            className="w-full max-w-md h-auto object-contain block"
            onError={(e) => {
              e.target.style.display = "none";
            }}
          />
        </div>

        <div className="border-t border-slate-200/80 dark:border-slate-800 my-6"></div>

        {/* Why Create An Account List */}
        <div>
          <h3 className="text-sm font-bold text-slate-900 dark:text-white mb-4 text-left">
            Why create an account?
          </h3>
          <div className="space-y-4 text-left">
            {FEATURES.map((item, idx) => {
              const IconComp = item.icon;
              return (
                <div key={idx} className="flex items-start gap-3.5">
                  <div className="p-2.5 rounded-xl bg-blue-50 dark:bg-blue-900/40 text-blue-600 dark:text-blue-400 border border-blue-100/80 dark:border-slate-800 shrink-0">
                    <IconComp className="w-5 h-5 stroke-[2.2]" />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-slate-900 dark:text-slate-100">
                      {item.title}
                    </h4>
                    <p className="text-xs text-slate-500 dark:text-slate-400 leading-normal">
                      {item.description}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
