import React from "react";
import { ShoppingCart, PauseCircle, RotateCcw, Receipt, ChevronRight } from "lucide-react";

export default function QuickActionsCard({ onNewSale, onHoldSale, onReturnSale, onDuePayments }) {
  const actions = [
    {
      id: "new_sale",
      title: "New Sale (POS)",
      subtitle: "Create new invoice / dispensing",
      icon: ShoppingCart,
      iconBg: "bg-blue-50 text-blue-600",
      onClick: onNewSale,
    },
    {
      id: "hold_sale",
      title: "Hold Sale",
      subtitle: "Hold current sale",
      icon: PauseCircle,
      iconBg: "bg-blue-50 text-blue-600",
      onClick: onHoldSale,
    },
    {
      id: "return_sale",
      title: "Return Sale",
      subtitle: "Return / Refund invoice",
      icon: RotateCcw,
      iconBg: "bg-rose-50 text-rose-600",
      onClick: onReturnSale,
    },
    {
      id: "due_payments",
      title: "Due Payments",
      subtitle: "View pending payments",
      icon: Receipt,
      iconBg: "bg-amber-50 text-amber-600",
      onClick: onDuePayments,
    },
  ];

  return (
    <div className="bg-white border border-slate-200/70 rounded-2xl p-5 shadow-xs flex flex-col justify-between">
      <div>
        <h3 className="text-sm font-bold text-slate-900 mb-3.5">Quick Actions</h3>

        <div className="space-y-2">
          {actions.map((act) => {
            const IconComponent = act.icon;
            return (
              <div
                key={act.id}
                onClick={act.onClick}
                className="flex items-center justify-between p-2.5 rounded-xl hover:bg-slate-50 border border-transparent hover:border-slate-100 transition-all cursor-pointer group"
              >
                <div className="flex items-center gap-3">
                  <div className={`w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 ${act.iconBg}`}>
                    <IconComponent className="w-4.5 h-4.5" />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-slate-900 leading-tight group-hover:text-blue-600 transition-colors">
                      {act.title}
                    </h4>
                    <p className="text-[11px] font-medium text-slate-400 mt-0.5">{act.subtitle}</p>
                  </div>
                </div>

                <ChevronRight className="w-4 h-4 text-slate-300 group-hover:text-blue-600 group-hover:translate-x-0.5 transition-all" />
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
