import { Bell, Check } from "lucide-react";
import { useState, useRef, useEffect } from "react";
import { useNotifications } from "../hooks/useNotifications.js";

const TYPE_COLORS = {
  appointment: "bg-blue-100 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300",
  billing: "bg-amber-100 dark:bg-amber-950/60 text-amber-700 dark:text-amber-300",
  lab_result: "bg-purple-100 dark:bg-purple-950/60 text-purple-700 dark:text-purple-300",
  admission: "bg-red-100 dark:bg-red-950/60 text-red-700 dark:text-red-300",
  system: "bg-gray-100 dark:bg-slate-800 text-gray-700 dark:text-slate-300",
};

const timeAgo = (date) => {
  const diff = Math.floor((Date.now() - new Date(date)) / 1000);
  if (diff < 60) return "just now";
  if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
  if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
  return `${Math.floor(diff / 86400)}d ago`;
};

export default function NotificationDropdown() {
  const { notifications, unreadCount, markRead, markAllRead } = useNotifications();
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  // Bahar click karne pe dropdown band ho jaye
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false);
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="relative" ref={ref}>
      <button
        onClick={() => setOpen((o) => !o)}
        className="relative w-8 h-8 rounded-full bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 flex items-center justify-center transition border border-slate-200/80 dark:border-slate-700/80 cursor-pointer"
      >
        <Bell className="w-4 h-4 text-slate-600 dark:text-slate-300" />
        {unreadCount > 0 && (
          <span className="absolute -top-0.5 -right-0.5 w-4 h-4 bg-rose-500 text-white text-[10px] font-medium rounded-full flex items-center justify-center shadow-xs">
            {unreadCount > 9 ? "9+" : unreadCount}
          </span>
        )}
      </button>

      {open && (
        <div className="absolute right-0 mt-2 w-80 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl shadow-xl z-50 overflow-hidden backdrop-blur-md">
          <div className="flex items-center justify-between px-4 py-3 border-b border-slate-100 dark:border-slate-800">
            <h3 className="text-sm font-semibold text-slate-900 dark:text-slate-100">Notifications</h3>
            {unreadCount > 0 && (
              <button onClick={markAllRead} className="flex items-center gap-1 text-xs text-indigo-600 dark:text-indigo-400 hover:underline cursor-pointer">
                <Check className="w-3 h-3" /> Mark all read
              </button>
            )}
          </div>

          <div className="max-h-80 overflow-y-auto">
            {(!notifications || notifications.length === 0) ? (
              <p className="text-sm text-slate-400 dark:text-slate-500 text-center py-8">No notifications</p>
            ) : (
              notifications.map((n) => (
                <button
                  key={n._id}
                  onClick={() => !n.isRead && markRead(n._id)}
                  className={`w-full text-left px-4 py-3 border-b border-slate-50 dark:border-slate-800/50 last:border-0 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition ${
                    !n.isRead ? "bg-indigo-50/40 dark:bg-indigo-950/20" : ""
                  }`}
                >
                  <div className="flex items-start gap-2">
                    {!n.isRead && <span className="w-1.5 h-1.5 rounded-full bg-indigo-500 mt-1.5 shrink-0" />}
                    <div className={`flex-1 min-w-0 ${n.isRead ? "ml-3.5" : ""}`}>
                      <div className="flex items-center gap-1.5 mb-0.5">
                        <span className={`text-[10px] font-medium px-1.5 py-0.5 rounded ${TYPE_COLORS[n.type] || TYPE_COLORS.system}`}>
                          {n.type ? n.type.replace("_", " ") : "system"}
                        </span>
                      </div>
                      <p className="text-sm text-slate-800 dark:text-slate-200 font-medium truncate">{n.title}</p>
                      <p className="text-xs text-slate-500 dark:text-slate-400 truncate">{n.message}</p>
                      <p className="text-[11px] text-slate-400 dark:text-slate-500 mt-0.5">{timeAgo(n.createdAt)}</p>
                    </div>
                  </div>
                </button>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
}