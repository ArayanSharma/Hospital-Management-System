import React from "react";
import { FolderOpen } from "lucide-react";

export default function EmptyState({ title = "No Records Found", message = "No dynamic records registered for this patient yet." }) {
  return (
    <div className="p-10 border border-dashed border-slate-200 rounded-2xl text-center space-y-2 bg-slate-50/50">
      <FolderOpen className="w-8 h-8 text-slate-400 mx-auto" />
      <p className="text-xs font-bold text-slate-700">{title}</p>
      <p className="text-[11px] text-slate-400 max-w-sm mx-auto">{message}</p>
    </div>
  );
}
