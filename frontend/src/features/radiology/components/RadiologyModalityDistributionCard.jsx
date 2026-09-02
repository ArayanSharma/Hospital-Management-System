import React from "react";
import { calculateModalityDistribution } from "../helpers/radiologyCalculations.js";

export default function RadiologyModalityDistributionCard({ orders = [] }) {
  const distribution = calculateModalityDistribution(orders);
  const total = orders.length;

  let cumulativePercent = 0;

  const getCoordinatesForPercent = (percent) => {
    const x = Math.cos(2 * Math.PI * percent);
    const y = Math.sin(2 * Math.PI * percent);
    return [x, y];
  };

  const slices = distribution.map((slice) => {
    const slicePercent = total > 0 ? slice.count / total : 0;
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
      <h3 className="text-xs font-bold text-slate-900 border-b border-slate-100 pb-2">
        Modality Distribution
      </h3>

      {total === 0 ? (
        <div className="py-6 text-center text-xs text-slate-400 font-medium">
          No modality records available
        </div>
      ) : (
        <div className="flex items-center justify-between gap-2">
          {/* SVG Donut Chart with Center Total Text */}
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
              <span className="text-sm font-extrabold text-slate-900 leading-none">{total}</span>
              <span className="text-[9px] font-semibold text-slate-400">Total</span>
            </div>
          </div>

          {/* Legend Data to the Right */}
          <div className="space-y-1 text-[11px] font-semibold flex-1 pl-2 max-h-36 overflow-y-auto">
            {distribution.map((item) => (
              <div key={item.name} className="flex items-center justify-between text-slate-700">
                <div className="flex items-center gap-1.5 truncate">
                  <span
                    className="w-2 h-2 rounded-full shrink-0"
                    style={{ backgroundColor: item.color }}
                  />
                  <span className="truncate">{item.name}</span>
                </div>
                <span className="font-bold text-slate-900 ml-1 shrink-0 text-[10px]">
                  {item.count} <span className="text-slate-400 font-normal">({item.percentage}%)</span>
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
