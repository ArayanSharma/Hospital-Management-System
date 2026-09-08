const COLORS = {
  active: "bg-green-100 text-green-700",
  inactive: "bg-gray-100 text-gray-600",
  pending: "bg-yellow-100 text-yellow-700",
  completed: "bg-blue-100 text-blue-700",
  cancelled: "bg-red-100 text-red-700",
};

export default function Badge({ status, label }) {
  const colorClass = COLORS[status] || "bg-gray-100 text-gray-600";
  return (
    <span className={`inline-block px-2 py-0.5 rounded-full text-xs font-medium ${colorClass}`}>
      {label || status}
    </span>
  );
}