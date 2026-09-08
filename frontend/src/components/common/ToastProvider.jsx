import React, { createContext, useContext, useState, useCallback } from "react";
import { Bell, CheckCircle, AlertTriangle, AlertCircle, Info, X } from "lucide-react";

const ToastContext = createContext(null);

export const useToast = () => {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error("useToast must be used within a ToastProvider");
  }
  return context;
};

const SEVERITY_STYLES = {
  appointment: {
    bg: "bg-blue-900/90 border-blue-500/50 text-blue-100",
    icon: <Bell className="w-5 h-5 text-blue-400" />,
  },
  billing: {
    bg: "bg-emerald-900/90 border-emerald-500/50 text-emerald-100",
    icon: <CheckCircle className="w-5 h-5 text-emerald-400" />,
  },
  lab_result: {
    bg: "bg-purple-900/90 border-purple-500/50 text-purple-100",
    icon: <Info className="w-5 h-5 text-purple-400" />,
  },
  admission: {
    bg: "bg-amber-900/90 border-amber-500/50 text-amber-100",
    icon: <AlertTriangle className="w-5 h-5 text-amber-400" />,
  },
  critical: {
    bg: "bg-rose-900/90 border-rose-500/50 text-rose-100 animate-pulse",
    icon: <AlertCircle className="w-5 h-5 text-rose-400" />,
  },
  default: {
    bg: "bg-slate-900/90 border-slate-700 text-slate-100",
    icon: <Bell className="w-5 h-5 text-cyan-400" />,
  },
};

export const ToastProvider = ({ children }) => {
  const [toasts, setToasts] = useState([]);

  const removeToast = useCallback((id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const addToast = useCallback(
    ({ id: explicitId, title, message, type = "default", metadata = null, duration = 5000 }) => {
      const id = explicitId || Date.now() + Math.random().toString(36).substring(2, 9);
      
      // Edge Case 5: Deduplication check to prevent double toast alerts
      setToasts((prev) => {
        if (prev.some((t) => t.id === id)) return prev;
        return [...prev.slice(-4), { id, title, message, type, metadata }];
      });

      // Edge Case 1: Browser Audio Policy Guard
      if (type === "critical" || type === "admission") {
        try {
          const AudioContextClass = window.AudioContext || window.webkitAudioContext;
          if (AudioContextClass) {
            const ctx = new AudioContextClass();
            if (ctx.state === "suspended") {
              ctx.resume();
            }
            const osc = ctx.createOscillator();
            const gain = ctx.createGain();
            osc.type = "sine";
            osc.frequency.setValueAtTime(587.33, ctx.currentTime); // D5 note
            gain.gain.setValueAtTime(0.15, ctx.currentTime);
            osc.connect(gain);
            gain.connect(ctx.destination);
            osc.start();
            osc.stop(ctx.currentTime + 0.3);
          }
        } catch (e) {
          // Graceful audio playback failure handling
        }
      }

      if (duration > 0) {
        setTimeout(() => {
          removeToast(id);
        }, duration);
      }
    },
    [removeToast]
  );

  return (
    <ToastContext.Provider value={{ addToast, removeToast }}>
      {children}
      
      {/* Toast Notification Container */}
      <div
        className="fixed bottom-5 right-5 z-[9999] flex flex-col gap-3 max-w-sm w-full pointer-events-none"
        aria-live="polite"
      >
        {toasts.map((toast) => {
          const style = SEVERITY_STYLES[toast.type] || SEVERITY_STYLES.default;

          return (
            <div
              key={toast.id}
              className={`pointer-events-auto flex items-start gap-3 p-4 rounded-xl border shadow-2xl backdrop-blur-md transition-all duration-300 transform translate-y-0 opacity-100 ${style.bg}`}
            >
              <div className="shrink-0 mt-0.5">{style.icon}</div>
              <div className="flex-1 min-w-0">
                <h4 className="font-semibold text-sm leading-tight truncate">{toast.title}</h4>
                <p className="text-xs opacity-90 mt-1 line-clamp-2 leading-relaxed">{toast.message}</p>
                {toast.metadata?.link && (
                  <a
                    href={toast.metadata.link}
                    className="inline-block mt-2 text-xs underline font-medium text-cyan-300 hover:text-cyan-100"
                  >
                    View Details →
                  </a>
                )}
              </div>
              <button
                onClick={() => removeToast(toast.id)}
                className="shrink-0 text-slate-400 hover:text-white transition-colors p-1"
                aria-label="Close notification"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          );
        })}
      </div>
    </ToastContext.Provider>
  );
};
