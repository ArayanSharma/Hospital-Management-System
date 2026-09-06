import Skeleton from "../../../components/ui/Skeleton.jsx";
import StatsCardSkeleton from "../../../components/ui/StatsCardSkeleton.jsx";

export default function DashboardSkeleton() {
  return (
    <div className="space-y-6 pb-12">
      <div>
        <Skeleton className="h-6 w-32 mb-2" />
        <Skeleton className="h-4 w-48" />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <StatsCardSkeleton key={i} />
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white border border-slate-200/80 rounded-2xl p-5 space-y-3 shadow-2xs">
          <Skeleton className="h-4 w-32 mb-2" />
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="flex justify-between py-2 border-b border-slate-100 last:border-0">
              <Skeleton className="h-3 w-48" />
              <Skeleton className="h-3 w-16" />
            </div>
          ))}
        </div>
        <div className="bg-white border border-slate-200/80 rounded-2xl p-5 space-y-3 shadow-2xs">
          <Skeleton className="h-4 w-24 mb-2" />
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="flex justify-between py-1.5 border-b border-slate-100 last:border-0">
              <Skeleton className="h-3 w-20" />
              <Skeleton className="h-3 w-8" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
