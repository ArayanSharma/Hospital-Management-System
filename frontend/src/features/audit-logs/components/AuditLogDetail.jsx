import { X, User, Shield, Clock, Monitor, Globe } from "lucide-react";

const renderValue = (val) => {
  if (val === null || val === undefined) {
    return <span className="text-gray-400 italic text-xs font-mono">None (Empty)</span>;
  }
  if (typeof val === "object") {
    return (
      <pre className="text-xs bg-slate-900 text-slate-100 rounded-lg p-3 overflow-x-auto whitespace-pre-wrap break-all font-mono leading-relaxed shadow-inner">
        {JSON.stringify(val, null, 2)}
      </pre>
    );
  }
  return <span className="text-sm font-medium text-gray-800 break-all">{String(val)}</span>;
};

export default function AuditLogDetail({ log, onClose }) {
  if (!log) return null;

  const actionColors = {
    CREATE: "bg-emerald-50 text-emerald-700 border-emerald-200",
    UPDATE: "bg-amber-50 text-amber-700 border-amber-200",
    DELETE: "bg-rose-50 text-rose-700 border-rose-200",
  };

  return (
    <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center z-50 p-4 animate-in fade-in duration-200">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-2xl max-h-[85vh] flex flex-col overflow-hidden border border-gray-100">
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 bg-slate-50/50">
          <div>
            <div className="flex items-center gap-2">
              <span className={`text-xs font-semibold px-2.5 py-0.5 rounded-full border ${actionColors[log.action] || "bg-gray-100 text-gray-700"}`}>
                {log.action}
              </span>
              <h2 className="text-base font-semibold text-gray-900 capitalize">
                {log.resource?.replace(/_/g, " ")} Log
              </h2>
            </div>
            <p className="text-xs text-gray-500 mt-1 flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5" />
              {new Date(log.createdAt).toLocaleString()}
            </p>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-lg text-gray-400 hover:text-gray-600 hover:bg-gray-200/60 flex items-center justify-center transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 overflow-y-auto space-y-5">
          <div className="grid grid-cols-2 gap-4 p-4 rounded-xl bg-gray-50/80 border border-gray-100 text-sm">
            <div className="flex items-start gap-2.5">
              <User className="w-4 h-4 text-gray-400 shrink-0 mt-0.5" />
              <div>
                <p className="text-xs text-gray-400 font-medium">Performed By</p>
                <p className="text-gray-900 font-semibold">{log.userId?.name || "Unknown User"}</p>
                <p className="text-xs text-gray-500">{log.userId?.email || "—"}</p>
              </div>
            </div>
            <div className="flex items-start gap-2.5">
              <Shield className="w-4 h-4 text-gray-400 shrink-0 mt-0.5" />
              <div>
                <p className="text-xs text-gray-400 font-medium">Resource ID</p>
                <p className="text-xs font-mono text-gray-800 break-all">{log.resourceId || "—"}</p>
              </div>
            </div>
          </div>

          {(log.ipAddress || log.userAgent) && (
            <div className="flex items-center gap-4 px-4 py-2.5 rounded-lg bg-slate-100/60 text-xs text-gray-600 font-mono">
              {log.ipAddress && (
                <span className="flex items-center gap-1">
                  <Globe className="w-3.5 h-3.5 text-gray-400" /> IP: {log.ipAddress}
                </span>
              )}
              {log.userAgent && (
                <span className="flex items-center gap-1 truncate">
                  <Monitor className="w-3.5 h-3.5 text-gray-400" /> {log.userAgent}
                </span>
              )}
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
            <div className="space-y-1.5">
              <p className="text-xs font-semibold uppercase tracking-wider text-rose-600 flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-rose-500 inline-block"></span> Before (Old State)
              </p>
              {renderValue(log.oldValue)}
            </div>
            <div className="space-y-1.5">
              <p className="text-xs font-semibold uppercase tracking-wider text-emerald-600 flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-emerald-500 inline-block"></span> After (New State)
              </p>
              {renderValue(log.newValue)}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
