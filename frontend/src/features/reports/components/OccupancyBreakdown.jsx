const COLORS = ["#4f46e5", "#7c3aed", "#2563eb", "#0891b2", "#059669"];

export default function OccupancyBreakdown({ data, total }) {
  if (!data || data.length === 0) {
    return <p className="text-sm text-gray-400 py-8 text-center">No patients currently admitted</p>;
  }

  return (
    <div className="space-y-3">
      {data.map((ward, i) => (
        <div key={ward._id} className="flex items-center gap-3">
          <span className="w-2.5 h-2.5 rounded-full shrink-0" style={{ backgroundColor: COLORS[i % COLORS.length] }} />
          <span className="text-sm text-gray-700 flex-1 truncate">{ward._id}</span>
          <span className="text-sm font-medium text-gray-900">{ward.count}</span>
          <span className="text-xs text-gray-400 w-10 text-right">
            {total > 0 ? Math.round((ward.count / total) * 100) : 0}%
          </span>
        </div>
      ))}
    </div>
  );
}