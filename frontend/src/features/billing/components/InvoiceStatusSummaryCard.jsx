import React from "react";

export default function InvoiceStatusSummaryCard({ statusSummary = {} }) {
  const paid = statusSummary.paid || { count: 562, percentage: 45.0 };
  const partiallyPaid = statusSummary.partiallyPaid || { count: 298, percentage: 23.9 };
  const unpaid = statusSummary.unpaid || { count: 312, percentage: 25.0 };
  const cancelled = statusSummary.cancelled || { count: 76, percentage: 6.1 };

  const totalCount = (paid.count || 0) + (partiallyPaid.count || 0) + (unpaid.count || 0) + (cancelled.count || 0);

  const legend = [
    { label: "Paid", count: paid.count, pct: `${paid.percentage}%`, color: "#10B981" },
    { label: "Partially Paid", count: partiallyPaid.count, pct: `${partiallyPaid.percentage}%`, color: "#F59E0B" },
    { label: "Unpaid", count: unpaid.count, pct: `${unpaid.percentage}%`, color: "#EF4444" },
    { label: "Cancelled", count: cancelled.count, pct: `${cancelled.percentage}%`, color: "#94A3B8" },
  ];

  // SVG donut calculation
  let cumulativePercent = 0;
  const getCoordinatesForPercent = (percent) => {
    const x = Math.cos(2 * Math.PI * percent);
    const y = Math.sin(2 * Math.PI * percent);
    return [x, y];
  };

  const slices = legend.map((slice) => {
    const slicePercent = totalCount > 0 ? slice.count / totalCount : 0;
    const [startX, startY] = getCoordinatesForPercent(cumulativePercent);
    cumulativePercent += slicePercent;
    const [endX, endY] = getCoordinatesForPercent(cumulativePercent);
    const largeArcFlag = slicePercent > 0.5 ? 1 : 0;

    const pathData = [
      `M ${startX * 50 + 60} ${startY * 50 + 60}`,
      `A 50 50 0 ${largeArcFlag} 1 ${endX * 50 + 60} ${endY * 50 + 60}`,
    ].join(" ");

    return {
      ...slice,
      pathData,
    };
  });

  return (
    <div className="bg-white border border-slate-200/80 rounded-2xl p-4 shadow-2xs space-y-3">
      <div className="flex items-center justify-between border-b border-slate-100 pb-2">
        <h3 className="text-xs font-bold text-slate-900">Invoice Status Summary</h3>
        <button
          type="button"
          onClick={() => alert("Viewing Invoice Status Summary Report...")}
          className="text-[11px] font-bold text-blue-600 hover:underline cursor-pointer"
        >
          View Report
        </button>
      </div>

      <div className="flex items-center justify-between gap-3 pt-1">
        {/* SVG Donut Chart */}
        <div className="relative w-28 h-28 shrink-0 flex items-center justify-center">
          <svg viewBox="0 0 120 120" className="w-full h-full -rotate-90">
            {slices.map((slice, index) => (
              <path
                key={index}
                d={slice.pathData}
                fill="none"
                stroke={slice.color}
                strokeWidth="16"
              />
            ))}
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center text-center pointer-events-none">
            <span className="text-xs font-extrabold text-slate-900 leading-none">{totalCount.toLocaleString()}</span>
            <span className="text-[9px] font-semibold text-slate-400">Invoices</span>
          </div>
        </div>

        {/* Legend */}
        <div className="space-y-1.5 text-[11px] font-semibold flex-1 pl-1">
          {legend.map((item) => (
            <div key={item.label} className="flex items-center justify-between text-slate-700">
              <div className="flex items-center gap-1.5 truncate">
                <span
                  className="w-2 h-2 rounded-full shrink-0"
                  style={{ backgroundColor: item.color }}
                />
                <span className="truncate">{item.label}</span>
              </div>
              <span className="font-bold text-slate-900 ml-1 shrink-0 text-[10px]">
                {item.count} <span className="text-slate-400 font-normal">({item.pct})</span>
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
