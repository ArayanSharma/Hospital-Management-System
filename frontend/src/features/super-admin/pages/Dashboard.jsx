import { Users, UserCheck, Calendar, Bed } from "lucide-react";
import { useDashboard } from "../hooks/useDashboard.js";
import StatsCard from "../../../components/ui/StatsCard.jsx";
import ActivityFeed from "../components/ActivityFeed.jsx";
import Loading from "../../../components/common/Loading.jsx";
import ErrorState from "../../../components/common/ErrorState.jsx";

export default function Dashboard() {
  const { stats, activity, loading, error } = useDashboard();

  if (loading) return <Loading message="Loading dashboard..." />;
  if (error) return <ErrorState message={error} />;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl font-semibold text-gray-900">Dashboard</h1>
        <p className="text-sm text-gray-500">System overview</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatsCard
          label="Total Users"
          value={stats.users.total}
          sublabel={`${stats.users.active} active`}
          icon={Users}
        />
        <StatsCard
          label="Total Patients"
          value={stats.hospital.totalPatients}
          icon={UserCheck}
        />
        <StatsCard
          label="Today's Appointments"
          value={stats.hospital.todayAppointments}
          icon={Calendar}
        />
        <StatsCard
          label="Currently Admitted"
          value={stats.hospital.currentlyAdmitted}
          icon={Bed}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white border border-gray-200 rounded-lg p-5">
          <h2 className="text-sm font-medium text-gray-900 mb-4">Recent Activity</h2>
          <ActivityFeed activity={activity} />
        </div>

        <div className="bg-white border border-gray-200 rounded-lg p-5">
          <h2 className="text-sm font-medium text-gray-900 mb-4">Users by Role</h2>
          <ul className="space-y-2">
            {stats.users.byRole.map((r) => (
              <li key={r._id} className="flex justify-between text-sm">
                <span className="text-gray-600">{r._id}</span>
                <span className="font-medium text-gray-900">{r.count}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}