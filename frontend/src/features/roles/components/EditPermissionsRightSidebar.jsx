import React from "react";
import { CheckCircle2, MinusCircle, Edit3, XCircle, Lightbulb, Stethoscope, Shield } from "lucide-react";

export default function EditPermissionsRightSidebar({ role }) {
  const isSystem = role?.roleType === "System" || role?.isSystemRole;

  return (
    <div className="space-y-4">
      {/* Card 1: Selected Role Card matching Screenshot */}
      <div className="bg-white border border-slate-200/90 rounded-2xl p-4 shadow-2xs space-y-3">
        <h3 className="text-xs font-extrabold text-slate-900 tracking-wide border-b border-slate-100 pb-2">
          Selected Role
        </h3>

        {role ? (
          <div className="space-y-2 text-xs">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-emerald-50 text-emerald-600 border border-emerald-200 flex items-center justify-center shrink-0">
                {role.name === "DOCTOR" ? (
                  <Stethoscope className="w-4 h-4" />
                ) : (
                  <Shield className="w-4 h-4" />
                )}
              </div>
              <div>
                <h4 className="font-black text-slate-900 font-mono text-sm">{role.name}</h4>
                <span
                  className={`px-2 py-0.5 rounded-md text-[9px] font-black inline-block border ${
                    isSystem
                      ? "bg-purple-50 text-purple-700 border-purple-200"
                      : "bg-orange-50 text-orange-700 border-orange-200"
                  }`}
                >
                  {isSystem ? "System Role" : "Custom Role"}
                </span>
              </div>
            </div>

            <p className="text-[11px] text-slate-600 font-medium leading-relaxed">
              {role.description || "Access to OPD/IPD, prescriptions, medical records and reports."}
            </p>
          </div>
        ) : (
          <p className="text-xs text-slate-400 font-medium py-4 text-center">No role selected.</p>
        )}
      </div>

      {/* Card 2: Permission Guide matching Screenshot */}
      <div className="bg-white border border-slate-200/90 rounded-2xl p-4 shadow-2xs space-y-3">
        <h3 className="text-xs font-extrabold text-slate-900 tracking-wide border-b border-slate-100 pb-2">
          Permission Guide
        </h3>

        <div className="space-y-3 text-xs">
          <div className="flex items-start gap-2.5">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
            <div>
              <h4 className="text-[11px] font-extrabold text-slate-900 leading-snug">
                Full Access (All Actions)
              </h4>
              <p className="text-[10px] text-slate-400 font-medium leading-tight">
                Can create, read, update, delete and manage
              </p>
            </div>
          </div>

          <div className="flex items-start gap-2.5">
            <MinusCircle className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
            <div>
              <h4 className="text-[11px] font-extrabold text-slate-900 leading-snug">Read Only</h4>
              <p className="text-[10px] text-slate-400 font-medium leading-tight">
                Can only view and read data
              </p>
            </div>
          </div>

          <div className="flex items-start gap-2.5">
            <Edit3 className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
            <div>
              <h4 className="text-[11px] font-extrabold text-slate-900 leading-snug">Limited Access</h4>
              <p className="text-[10px] text-slate-400 font-medium leading-tight">
                Can perform some selected actions
              </p>
            </div>
          </div>

          <div className="flex items-start gap-2.5">
            <XCircle className="w-4 h-4 text-rose-500 shrink-0 mt-0.5" />
            <div>
              <h4 className="text-[11px] font-extrabold text-slate-900 leading-snug">No Access</h4>
              <p className="text-[10px] text-slate-400 font-medium leading-tight">
                No permissions for this module
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Card 3: Tips Banner matching Screenshot */}
      <div className="bg-amber-50/70 border border-amber-200/80 rounded-2xl p-4 shadow-2xs space-y-2 text-xs">
        <div className="flex items-center gap-1.5 text-amber-800 font-extrabold">
          <Lightbulb className="w-4 h-4 text-amber-600" />
          <span>Tips</span>
        </div>

        <ul className="space-y-1.5 text-[11px] text-amber-900/90 font-medium pl-1">
          <li className="flex items-start gap-1.5">
            <span className="text-amber-600 font-bold">•</span>
            <span>Grant minimum permissions required.</span>
          </li>
          <li className="flex items-start gap-1.5">
            <span className="text-amber-600 font-bold">•</span>
            <span>Avoid giving delete or manage access unless necessary.</span>
          </li>
          <li className="flex items-start gap-1.5">
            <span className="text-amber-600 font-bold">•</span>
            <span>Changes will apply to all users with this role.</span>
          </li>
        </ul>
      </div>
    </div>
  );
}
