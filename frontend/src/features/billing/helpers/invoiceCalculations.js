/**
 * Formatting and financial math helpers for Billing & Invoices
 */

export function formatRupee(amount = 0, showDecimals = true) {
  const num = Number(amount) || 0;
  try {
    const formatted = new Intl.NumberFormat("en-IN", {
      minimumFractionDigits: showDecimals ? 2 : 0,
      maximumFractionDigits: showDecimals ? 2 : 0,
    }).format(num);
    return `₹ ${formatted}`;
  } catch {
    return `₹ ${num.toFixed(showDecimals ? 2 : 0)}`;
  }
}

export function formatReportDate(dateString) {
  if (!dateString) {
    const d = new Date();
    return d.toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" });
  }
  try {
    const d = new Date(dateString);
    if (isNaN(d.getTime())) return dateString;
    return d.toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  } catch {
    return dateString;
  }
}

export function numberToWords(amount = 0) {
  const num = Math.floor(Math.abs(Number(amount) || 0));
  if (num === 0) return "Zero Rupees Only";

  const a = [
    "", "One", "Two", "Three", "Four", "Five", "Six", "Seven", "Eight", "Nine",
    "Ten", "Eleven", "Twelve", "Thirteen", "Fourteen", "Fifteen", "Sixteen",
    "Seventeen", "Eighteen", "Nineteen"
  ];
  const b = ["", "", "Twenty", "Thirty", "Forty", "Fifty", "Sixty", "Seventy", "Eighty", "Ninety"];

  function inWords(n) {
    if (n < 20) return a[n];
    if (n < 100) return b[Math.floor(n / 10)] + (n % 10 !== 0 ? " " + a[n % 10] : "");
    if (n < 1000) return a[Math.floor(n / 100)] + " Hundred" + (n % 100 !== 0 ? " " + inWords(n % 100) : "");
    if (n < 100000) return inWords(Math.floor(n / 1000)) + " Thousand" + (n % 1000 !== 0 ? " " + inWords(n % 1000) : "");
    if (n < 10000000) return inWords(Math.floor(n / 100000)) + " Lakh" + (n % 100000 !== 0 ? " " + inWords(n % 100000) : "");
    return inWords(Math.floor(n / 10000000)) + " Crore" + (n % 10000000 !== 0 ? " " + inWords(n % 10000000) : "");
  }

  return `${inWords(num)} Rupees Only`;
}

export function getStatusBadgeConfig(status = "unpaid") {
  const s = String(status || "").toLowerCase();
  switch (s) {
    case "paid":
      return {
        label: "Paid",
        bg: "bg-emerald-50 text-emerald-700 border-emerald-200",
      };
    case "partially-paid":
    case "partially paid":
      return {
        label: "Partially Paid",
        bg: "bg-amber-50 text-amber-700 border-amber-200",
      };
    case "cancelled":
      return {
        label: "Cancelled",
        bg: "bg-slate-100 text-slate-600 border-slate-200",
      };
    case "unpaid":
    default:
      return {
        label: "Unpaid",
        bg: "bg-rose-50 text-rose-700 border-rose-200",
      };
  }
}

/**
 * Pure math helper to compute row amount for a billable item
 */
export function calculateItemAmount(item) {
  const qty = Math.max(1, Number(item.quantity) || 1);
  const price = Math.max(0, Number(item.unitPrice) || 0);
  const disc = Math.max(0, Number(item.discount) || 0);
  const taxPct = Math.max(0, Number(item.taxPercent) || 0);
  const base = price * qty - disc;
  const taxVal = (base * taxPct) / 100;
  return Math.max(0, base + taxVal);
}

/**
 * Pure math helper to compute financial summary for the whole invoice
 */
export function calculateInvoiceTotals(items = [], manualDiscount = "0.00", roundOffInput = "0.00") {
  const rawSubTotal = items.reduce(
    (sum, item) => sum + Math.max(1, Number(item.quantity) || 1) * Math.max(0, Number(item.unitPrice) || 0),
    0
  );

  const totalItemDiscount = items.reduce((sum, item) => sum + Math.max(0, Number(item.discount) || 0), 0);
  const extraDiscount = Math.max(0, parseFloat(manualDiscount) || 0);
  const grandDiscount = totalItemDiscount + extraDiscount;

  const taxableAmount = Math.max(0, rawSubTotal - grandDiscount);

  const totalGst = items.reduce((sum, item) => {
    const qty = Math.max(1, Number(item.quantity) || 1);
    const price = Math.max(0, Number(item.unitPrice) || 0);
    const itemDisc = Math.max(0, Number(item.discount) || 0);
    const base = price * qty - itemDisc;
    return sum + Math.max(0, (base * Math.max(0, Number(item.taxPercent) || 0)) / 100);
  }, 0);

  const roundOff = parseFloat(roundOffInput) || 0;
  const totalAmount = taxableAmount + totalGst + roundOff;

  return {
    rawSubTotal,
    grandDiscount,
    extraDiscount,
    taxableAmount,
    totalGst,
    roundOff,
    totalAmount,
  };
}
