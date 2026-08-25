export default function ActivityFeed({ activity }) {
  if (!activity || activity.length === 0) {
    return <p className="text-sm text-gray-400">No recent activity</p>;
  }

  return (
    <ul className="divide-y divide-gray-100">
      {activity.map((item) => (
        <li key={item.id} className="py-3 flex items-start justify-between">
          <p className="text-sm text-gray-700">{item.description}</p>
          <span className="text-xs text-gray-400 whitespace-nowrap ml-4">
            {new Date(item.timestamp).toLocaleString()}
          </span>
        </li>
      ))}
    </ul>
  );
}