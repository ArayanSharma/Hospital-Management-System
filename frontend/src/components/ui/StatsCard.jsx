export default function StatsCard({ label, value, sublabel, icon: Icon }) {
  return (
    <div className="bg-white border border-gray-200 rounded-lg p-5">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm text-gray-500">{label}</p>
          <p className="text-2xl font-semibold text-gray-900 mt-1">{value}</p>
          {sublabel && <p className="text-xs text-gray-400 mt-1">{sublabel}</p>}
        </div>
        {Icon && (
          <div className="w-9 h-9 rounded-md bg-gray-100 flex items-center justify-center">
            <Icon className="w-4 h-4 text-gray-600" />
          </div>
        )}
      </div>
    </div>
  );
}