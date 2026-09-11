import { useEffect } from "react";
import { createPortal } from "react-dom";
import { X } from "lucide-react";

export default function Modal({ isOpen, onClose, title, subtitle, children, maxWidth = "max-w-4xl" }) {
  // Prevent background layout scrolling when modal is open
  useEffect(() => {
    const mainEl = document.querySelector("main");
    if (isOpen) {
      document.body.style.overflow = "hidden";
      if (mainEl) mainEl.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
      if (mainEl) mainEl.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
      if (mainEl) mainEl.style.overflow = "";
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return createPortal(
    <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center z-[9999] p-2.5 sm:p-6 overflow-hidden">
      <div className={`bg-white rounded-2xl shadow-2xl w-full ${maxWidth} max-h-[92vh] flex flex-col border border-slate-200/90 overflow-hidden`}>
        {/* Modal Header */}
        <div className="flex items-center justify-between px-4 sm:px-6 py-3 sm:py-4 border-b border-slate-100 bg-white shrink-0">
          <div className="min-w-0 pr-2">
            <h2 className="text-base sm:text-lg font-bold text-slate-900 tracking-tight truncate">{title}</h2>
            {subtitle && <p className="text-[11px] sm:text-xs text-slate-400 mt-0.5 truncate">{subtitle}</p>}
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-xl text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition cursor-pointer shrink-0"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
        {/* Single Clean Modal Content Scroller */}
        <div className="p-3.5 sm:p-6 overflow-y-auto flex-1">{children}</div>
      </div>
    </div>,
    document.body
  );
}