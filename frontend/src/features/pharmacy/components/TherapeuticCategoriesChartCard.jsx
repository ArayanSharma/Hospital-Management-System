import React, { useState } from "react";

export default function TherapeuticCategoriesChartCard({ categories = [], onViewAll }) {
  const [hoveredIdx, setHoveredIdx] = useState(null);

  if (!categories || categories.length === 0) {
    return (
      <div className="bg-white border border-slate-200/80 rounded-2xl p-4.5 shadow-xs text-center text-xs text-slate-400 py-8">
        No therapeutic category data available in database yet.
      </div>
    );
  }

  const totalCount = categories.reduce((sum, item) => sum + (item.count || 0), 0);

  // Calculate SVG donut slice angles
  let accumulatedAngle = 0;
  const slices = categories.map((cat, idx) => {
    const angle = (cat.count / totalCount) * 360;
    const startAngle = accumulatedAngle;
    accumulatedAngle += angle;

    // Convert angles to SVG arc paths
    const r = 40;
    const cx = 50;
    const cy = 50;

    const startRad = (startAngle - 90) * (Math.PI / 180);
    const endRad = (startAngle + angle - 90) * (Math.PI / 180);

    const x1 = cx + r * Math.cos(startRad);
    const y1 = cy + r * Math.sin(startRad);
    const x2 = cx + r * Math.cos(endRad);
    const y2 = cy + r * Math.sin(endRad);

    const largeArc = angle > 180 ? 1 : 0;

    const pathData = `M ${cx} ${cy} L ${x1} ${y1} A ${r} ${r} 0 ${largeArc} 1 ${x2} ${y2} Z`;

    return {
      ...cat,
      pathData,
      idx,
    };
  });

  return (
    <div className="bg-white border border-slate-200/80 rounded-2xl p-4.5 shadow-xs">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-sm font-bold text-slate-900">Top Therapeutic Categories</h3>
        <button
          type="button"
          onClick={onViewAll}
          className="text-xs font-semibold text-blue-600 hover:text-blue-700 transition-colors cursor-pointer"
        >
          View All
        </button>
      </div>

      <div className="flex items-center gap-4">
        {/* SVG Donut Chart */}
        <div className="relative w-32 h-32 shrink-0 flex items-center justify-center">
          <svg viewBox="0 0 100 100" className="w-full h-full transform -rotate-90">
            {slices.map((slice) => (
              <path
                key={slice.idx}
                d={slice.pathData}
                fill={slice.color}
                onMouseEnter={() => setHoveredIdx(slice.idx)}
                onMouseLeave={() => setHoveredIdx(null)}
                className="transition-opacity duration-200 cursor-pointer hover:opacity-85 stroke-white stroke-2"
              />
            ))}
            {/* Center Donut Hole */}
            <circle cx="50" cy="50" r="24" fill="white" />
          </svg>

          {/* Hover Tooltip Overlay in Center */}
          <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none text-center p-1">
            {hoveredIdx !== null ? (
              <>
                <span className="text-[10px] font-semibold text-slate-400 truncate max-w-[80px]">
                  {categories[hoveredIdx].name}
                </span>
                <span className="text-xs font-bold text-slate-900">
                  {categories[hoveredIdx].count}
                </span>
              </>
            ) : (
              <>
                <span className="text-[10px] font-semibold text-slate-400">Total</span>
                <span className="text-xs font-bold text-slate-900">{totalCount}</span>
              </>
            )}
          </div>
        </div>

        {/* Legend List */}
        <div className="flex-1 space-y-1.5 min-w-0">
          {categories.map((cat, idx) => (
            <div
              key={idx}
              onMouseEnter={() => setHoveredIdx(idx)}
              onMouseLeave={() => setHoveredIdx(null)}
              className={`flex items-center justify-between text-[11px] p-1 rounded-md transition-colors cursor-pointer ${
                hoveredIdx === idx ? "bg-slate-50 font-semibold" : ""
              }`}
            >
              <div className="flex items-center gap-1.5 truncate">
                <span
                  className="w-2 h-2 rounded-full shrink-0"
                  style={{ backgroundColor: cat.color }}
                />
                <span className="text-slate-600 font-medium truncate">{cat.name}</span>
              </div>
              <span className="text-slate-900 font-bold ml-1 shrink-0">
                {cat.count} <span className="text-slate-400 font-normal">({cat.percentage}%)</span>
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
