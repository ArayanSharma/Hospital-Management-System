import Skeleton from "../../../components/ui/Skeleton.jsx";

export default function ChartSkeleton() {
  return (
    <div className="bg-white border border-slate-200/80 rounded-2xl p-5 shadow-2xs space-y-4">
      <Skeleton className="h-4 w-40" />
      <div className="flex items-end gap-3 h-[220px] px-2 pt-4">
        {[60, 90, 45, 75, 100, 55, 80].map((h, i) => (
          <Skeleton
            key={i}
            className="flex-1 rounded-t-lg rounded-b-none"
            style={{ height: `${h}%`, animationDelay: `${i * 70}ms` }}
          />
        ))}
      </div>
    </div>
  );
}
