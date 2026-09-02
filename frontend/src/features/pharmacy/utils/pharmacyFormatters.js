export const formatCurrency = (val) => {
  const num = typeof val === "number" ? val : parseFloat(val) || 0;
  return `₹ ${num.toLocaleString("en-IN", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
};

export const formatNumber = (val) => {
  const num = typeof val === "number" ? val : parseInt(val, 10) || 0;
  return num.toLocaleString("en-IN");
};

export const getStatusBadgeStyle = (status) => {
  const s = String(status || "").toLowerCase();
  if (s.includes("active") || s.includes("in stock") || s.includes("paid") || s.includes("completed")) {
    return "bg-emerald-100 text-emerald-700 border-emerald-200";
  }
  if (s.includes("low") || s.includes("pending") || s.includes("warning")) {
    return "bg-amber-100 text-amber-700 border-amber-200";
  }
  if (s.includes("out") || s.includes("inactive") || s.includes("unpaid") || s.includes("expired")) {
    return "bg-rose-100 text-rose-700 border-rose-200";
  }
  return "bg-slate-100 text-slate-700 border-slate-200";
};
