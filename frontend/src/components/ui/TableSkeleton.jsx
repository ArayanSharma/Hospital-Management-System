import Skeleton from "./Skeleton.jsx";

export default function TableSkeleton({ rows = 5, columns = 5 }) {
  return (
    <div className="border border-slate-200/80 rounded-2xl bg-white overflow-hidden shadow-2xs">
      {/* Header row */}
      <div className="flex gap-4 px-4 py-3 border-b border-slate-200/80 bg-slate-50/80">
        {Array.from({ length: columns }).map((_, i) => (
          <Skeleton key={i} className="h-3 flex-1 max-w-[120px]" />
        ))}
      </div>

      {/* Data rows */}
      {Array.from({ length: rows }).map((_, rowIdx) => (
        <div
          key={rowIdx}
          className="flex items-center gap-4 px-4 py-4 border-b border-slate-100 last:border-0"
        >
          {Array.from({ length: columns }).map((_, colIdx) => (
            <Skeleton
              key={colIdx}
              className={`h-4 flex-1 ${colIdx === 0 ? "max-w-[160px]" : "max-w-[100px]"}`}
              style={{ animationDelay: `${rowIdx * 50}ms` }}
            />
          ))}
        </div>
      ))}
    </div>
  );
}
