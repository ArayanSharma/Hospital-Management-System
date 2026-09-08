import Skeleton from "./Skeleton.jsx";

export default function FormInputSkeleton({ fields = 4 }) {
  return (
    <div className="space-y-4 py-2">
      {Array.from({ length: fields }).map((_, i) => (
        <div key={i} className="space-y-1.5">
          <Skeleton className="h-3.5 w-24" />
          <Skeleton className="h-10 w-full rounded-xl" />
        </div>
      ))}
      <div className="flex justify-end gap-2 pt-3">
        <Skeleton className="h-9 w-20 rounded-xl" />
        <Skeleton className="h-9 w-28 rounded-xl" />
      </div>
    </div>
  );
}
