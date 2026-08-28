import React from "react";

export default function ActionButton({
  children,
  onClick,
  type = "button",
  variant = "primary", // 'primary' | 'secondary' | 'outline' | 'success' | 'danger'
  disabled = false,
  loading = false,
  icon: Icon,
  className = "",
}) {
  const baseStyles =
    "px-4 py-2.5 rounded-xl text-xs font-bold transition cursor-pointer flex items-center justify-center gap-2 disabled:opacity-50 select-none";

  const variants = {
    primary: "bg-blue-600 hover:bg-blue-700 text-white shadow-sm shadow-blue-500/20",
    secondary: "bg-slate-100 hover:bg-slate-200 text-slate-700",
    outline: "bg-white border border-slate-200 text-blue-600 hover:bg-blue-50",
    success: "bg-emerald-600 hover:bg-emerald-700 text-white shadow-sm shadow-emerald-500/20",
    danger: "bg-rose-600 hover:bg-rose-700 text-white shadow-sm shadow-rose-500/20",
  };

  return (
    <button
      type={type}
      disabled={disabled || loading}
      onClick={onClick}
      className={`${baseStyles} ${variants[variant] || variants.primary} ${className}`}
    >
      {Icon && <Icon className="w-4 h-4 shrink-0" />}
      <span>{loading ? "Processing..." : children}</span>
    </button>
  );
}
