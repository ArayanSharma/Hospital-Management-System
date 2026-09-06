import Skeleton from "./Skeleton.jsx";
import StatsCardSkeleton from "./StatsCardSkeleton.jsx";
import TableSkeleton from "./TableSkeleton.jsx";

export default function PageLayoutSkeleton() {
  return (
    <div className="space-y-6 pb-12 animate-in fade-in duration-200">
      {/* Header skeleton */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="space-y-2">
          <Skeleton className="h-6 w-44" />
          <Skeleton className="h-3.5 w-60" />
        </div>
        <Skeleton className="h-10 w-36 rounded-xl self-start sm:self-auto" />
      </div>

      {/* KPI Cards skeleton */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <StatsCardSkeleton key={i} />
        ))}
      </div>

      {/* Table skeleton */}
      <TableSkeleton rows={6} columns={6} />
    </div>
  );
}
