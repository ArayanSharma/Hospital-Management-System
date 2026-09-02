import React from "react";
import { AlertCircle, Plus, Eye, Edit3, Trash2, Settings, Lightbulb } from "lucide-react";

export default function AddRoleRightSidebar() {
  const actionsList = [
    {
      title: "Create",
      desc: "Add new records",
      icon: <Plus className="w-3.5 h-3.5 text-emerald-600" />,
      bg: "bg-emerald-50 text-emerald-700",
    },
    {
      title: "Read",
      desc: "View and list records",
      icon: <Eye className="w-3.5 h-3.5 text-blue-600" />,
      bg: "bg-blue-50 text-blue-700",
    },
    {
      title: "Update",
      desc: "Edit existing records",
      icon: <Edit3 className="w-3.5 h-3.5 text-amber-600" />,
      bg: "bg-amber-50 text-amber-700",
    },
    {
      title: "Delete",
      desc: "Delete or deactivate records",
      icon: <Trash2 className="w-3.5 h-3.5 text-rose-600" />,
      bg: "bg-rose-50 text-rose-700",
    },
    {
      title: "Manage",
      desc: "Full access to the module",
      icon: <Settings className="w-3.5 h-3.5 text-purple-600" />,
      bg: "bg-purple-50 text-purple-700",
    },
  ];

  return (
    <div className="space-y-4">
      {/* Card 1: About Roles matching Screenshot */}
      <div className="bg-white border border-slate-200/90 rounded-2xl p-4 shadow-2xs space-y-2.5">
        <div className="flex items-center gap-2 border-b border-slate-100 pb-2">
          <AlertCircle className="w-4 h-4 text-purple-600" />
          <h3 className="text-xs font-extrabold text-purple-700 tracking-wide">About Roles</h3>
        </div>

        <p className="text-[11px] text-slate-500 font-medium leading-relaxed">
          Roles help you control what users can access in the system.
        </p>

        <ul className="space-y-1.5 text-[11px] text-slate-600 font-medium pl-1">
          <li className="flex items-start gap-1.5">
            <span className="text-purple-600 font-bold">•</span>
            <span>Create custom roles for your organization.</span>
          </li>
          <li className="flex items-start gap-1.5">
            <span className="text-purple-600 font-bold">•</span>
            <span>Assign specific permissions to each role.</span>
          </li>
          <li className="flex items-start gap-1.5">
            <span className="text-purple-600 font-bold">•</span>
            <span>Assign roles to users to control access.</span>
          </li>
          <li className="flex items-start gap-1.5">
            <span className="text-purple-600 font-bold">•</span>
            <span>System roles are protected and can't be deleted.</span>
          </li>
        </ul>
      </div>

      {/* Card 2: Permission Actions matching Screenshot */}
      <div className="bg-white border border-slate-200/90 rounded-2xl p-4 shadow-2xs space-y-3">
        <h3 className="text-xs font-extrabold text-slate-900 tracking-wide border-b border-slate-100 pb-2">
          Permission Actions
        </h3>

        <div className="space-y-2.5">
          {actionsList.map((a) => (
            <div key={a.title} className="flex items-center gap-2.5">
              <div className={`w-6 h-6 rounded-lg ${a.bg} flex items-center justify-center shrink-0`}>
                {a.icon}
              </div>
              <div>
                <h4 className="text-xs font-extrabold text-slate-900 leading-none">{a.title}</h4>
                <p className="text-[10px] text-slate-400 font-medium leading-tight">{a.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Card 3: Tips Alert Banner matching Screenshot */}
      <div className="bg-amber-50/70 border border-amber-200/80 rounded-2xl p-4 shadow-2xs space-y-2 text-xs">
        <div className="flex items-center gap-1.5 text-amber-800 font-extrabold">
          <Lightbulb className="w-4 h-4 text-amber-600" />
          <span>Tips</span>
        </div>

        <ul className="space-y-1.5 text-[11px] text-amber-900/90 font-medium pl-1">
          <li className="flex items-start gap-1.5">
            <span className="text-amber-600 font-bold">•</span>
            <span>Give minimum permissions required.</span>
          </li>
          <li className="flex items-start gap-1.5">
            <span className="text-amber-600 font-bold">•</span>
            <span>Avoid giving delete or manage access unless necessary.</span>
          </li>
          <li className="flex items-start gap-1.5">
            <span className="text-amber-600 font-bold">•</span>
            <span>You can edit permissions anytime.</span>
          </li>
        </ul>
      </div>
    </div>
  );
}
