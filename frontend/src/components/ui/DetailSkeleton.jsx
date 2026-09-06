import Skeleton from "./Skeleton.jsx";

export default function DetailSkeleton() {
  return (
    <div className="max-w-3xl mx-auto space-y-5">
      <Skeleton className="h-4 w-32" />

      {/* Header card */}
      <div className="bg-white border border-slate-200/80 rounded-2xl p-6 shadow-2xs">
        <div className="flex items-center gap-4">
          <Skeleton className="w-12 h-12 rounded-full shrink-0" />
          <div className="space-y-2 flex-1">
            <Skeleton className="h-4 w-40" />
            <Skeleton className="h-3 w-56" />
          </div>
        </div>
      </div>

      {/* Content card */}
      <div className="bg-white border border-slate-200/80 rounded-2xl p-6 space-y-3 shadow-2xs">
        <Skeleton className="h-4 w-24" />
        <Skeleton className="h-3 w-full" />
        <Skeleton className="h-3 w-5/6" />
        <Skeleton className="h-3 w-4/6" />
      </div>

      {/* Another content card */}
      <div className="bg-white border border-slate-200/80 rounded-2xl p-6 space-y-3 shadow-2xs">
        <Skeleton className="h-4 w-28" />
        <Skeleton className="h-3 w-full" />
        <Skeleton className="h-3 w-3/6" />
      </div>
    </div>
  );
}
