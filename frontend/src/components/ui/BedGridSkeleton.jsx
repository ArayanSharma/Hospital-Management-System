import Skeleton from "./Skeleton.jsx";

export default function BedGridSkeleton({ wardsCount = 3, bedsPerWard = 8 }) {
  return (
    <div className="space-y-6">
      {/* Header Skeleton */}
      <div className="flex justify-between items-center">
        <div className="space-y-2">
          <Skeleton className="h-6 w-40" />
          <Skeleton className="h-4 w-56" />
        </div>
        <Skeleton className="h-9 w-28 rounded-xl" />
      </div>

      {/* Legend Skeleton */}
      <div className="flex gap-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="flex items-center gap-2">
            <Skeleton className="w-3.5 h-3.5 rounded-md" />
            <Skeleton className="h-3 w-16" />
          </div>
        ))}
      </div>

      {/* Ward Cards Skeleton */}
      {Array.from({ length: wardsCount }).map((_, wardIdx) => (
        <div key={wardIdx} className="bg-white border border-slate-200/80 rounded-2xl p-5 shadow-2xs space-y-4">
          <div className="flex justify-between items-center">
            <div className="space-y-1.5">
              <Skeleton className="h-4 w-36" />
              <Skeleton className="h-3 w-28" />
            </div>
            <Skeleton className="h-4 w-16" />
          </div>

          <div className="grid grid-cols-4 sm:grid-cols-6 lg:grid-cols-8 gap-3">
            {Array.from({ length: bedsPerWard }).map((_, bedIdx) => (
              <Skeleton
                key={bedIdx}
                className="h-20 rounded-xl"
                style={{ animationDelay: `${(wardIdx * 8 + bedIdx) * 30}ms` }}
              />
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
