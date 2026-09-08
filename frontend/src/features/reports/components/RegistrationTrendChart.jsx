import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";

export default function RegistrationTrendChart({ data }) {
  const chartData = data.map((d) => ({
    date: new Date(d._id).toLocaleDateString(undefined, {
      month: "short",
      day: "numeric",
    }),
    count: d.count,
  }));

  if (chartData.length === 0) {
    return (
      <p className="text-sm text-gray-400 py-8 text-center">
        No registrations in this period
      </p>
    );
  }

  return (
    <ResponsiveContainer width="100%" height={220}>
      <AreaChart data={chartData}>
        <defs>
          <linearGradient id="regGradient" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#4f46e5" stopOpacity={0.25} />
            <stop offset="100%" stopColor="#4f46e5" stopOpacity={0} />
          </linearGradient>
        </defs>
        <CartesianGrid
          strokeDasharray="3 3"
          stroke="#f0f0f0"
          vertical={false}
        />
        <XAxis
          dataKey="date"
          tick={{ fontSize: 11, fill: "#6b7280" }}
          axisLine={{ stroke: "#e5e7eb" }}
          tickLine={false}
        />
        <YAxis
          tick={{ fontSize: 12, fill: "#6b7280" }}
          axisLine={false}
          tickLine={false}
          allowDecimals={false}
        />
        <Tooltip
          contentStyle={{
            borderRadius: 8,
            border: "1px solid #e5e7eb",
            fontSize: 13,
          }}
        />
        <Area
          type="monotone"
          dataKey="count"
          stroke="#4f46e5"
          strokeWidth={2}
          fill="url(#regGradient)"
        />
      </AreaChart>
    </ResponsiveContainer>
  );
}
