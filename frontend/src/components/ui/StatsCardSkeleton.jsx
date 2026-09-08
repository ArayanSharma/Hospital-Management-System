import Skeleton from "./Skeleton.jsx";

export default function StatsCardSkeleton() {
  return (
    <div className="bg-white border border-slate-200/80 rounded-2xl p-5 shadow-2xs">
      <div className="flex items-start justify-between">
        <div className="space-y-2 flex-1">
          <Skeleton className="h-3 w-20" />
          <Skeleton className="h-7 w-16" />
          <Skeleton className="h-3 w-24" />
        </div>
        <Skeleton className="w-9 h-9 rounded-xl shrink-0" />
      </div>
    </div>
  );
}
