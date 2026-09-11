import React from "react";
import EmptyState from "../common/EmptyState.jsx";

export default function ActivityLogTab({ activityLogs, patient }) {
  const list = activityLogs || patient?.activityLogs || [];

  if (!list || list.length === 0) {
    return <EmptyState title="No Activity Logs" message="No audit activity recorded for this patient yet." />;
  }

  return (
    <div className="space-y-4">
      <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider">
        Patient Account Audit & Activity Log ({list.length})
      </h3>
      <div className="space-y-3">
        {list.map((act, i) => (
          <div key={act.id || act._id || i} className="bg-slate-50 border border-slate-200 rounded-2xl p-4 text-xs space-y-1">
            <div className="flex items-center justify-between">
              <span className="font-bold text-slate-900">{act.action || act.eventType || "Activity Recorded"}</span>
              <span className="text-[11px] font-mono text-slate-400">{act.timestamp || act.date || "N/A"}</span>
            </div>
            <p className="text-slate-600">{act.description || act.details || "Patient record updated"}</p>
            {act.user && <p className="text-[10px] text-slate-400 pt-1">User: {act.user}</p>}
          </div>
        ))}
      </div>
    </div>
  );
}

