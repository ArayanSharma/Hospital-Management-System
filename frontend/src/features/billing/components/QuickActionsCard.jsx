import React from "react";
import { FileText, CreditCard, ShieldCheck, Settings, ChevronRight } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function QuickActionsCard({ onNewInvoice, onOpenCollectPayment }) {
  const navigate = useNavigate();

  const items = [
    {
      title: "Create New Invoice",
      icon: FileText,
      iconBg: "bg-blue-50 text-blue-600 border-blue-100",
      action: onNewInvoice,
    },
    {
      title: "Collect Payment",
      icon: CreditCard,
      iconBg: "bg-emerald-50 text-emerald-600 border-emerald-100",
      action: onOpenCollectPayment,
    },
    {
      title: "Manage Insurance Claims",
      icon: ShieldCheck,
      iconBg: "bg-purple-50 text-purple-600 border-purple-100",
      action: () => navigate("/insurance"),
    },
    {
      title: "Billing Settings",
      icon: Settings,
      iconBg: "bg-slate-100 text-slate-600 border-slate-200",
      action: () => navigate("/settings"),
    },
  ];

  return (
    <div className="bg-white border border-slate-200/80 rounded-2xl p-4 shadow-2xs space-y-3">
      <h3 className="text-xs font-bold text-slate-900 border-b border-slate-100 pb-2">
        Quick Actions
      </h3>

      <div className="space-y-2 text-xs">
        {items.map((item) => {
          const IconComponent = item.icon;
          return (
            <button
              key={item.title}
              type="button"
              onClick={item.action}
              className="w-full p-2.5 rounded-xl border border-slate-100 bg-slate-50/50 hover:bg-slate-50 flex items-center justify-between gap-3 transition cursor-pointer text-left group"
            >
              <div className="flex items-center gap-3">
                <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 border ${item.iconBg}`}>
                  <IconComponent className="w-4 h-4" />
                </div>
                <span className="font-bold text-slate-800 text-xs group-hover:text-blue-600 transition">
                  {item.title}
                </span>
              </div>

              <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-slate-600 transition" />
            </button>
          );
        })}
      </div>
    </div>
  );
}
