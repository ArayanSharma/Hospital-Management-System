import { useState, useEffect, useCallback } from "react";
import { TrendingUp, IndianRupee, Users, Bed } from "lucide-react";
import {
  getRevenueReportApi,
  getPatientRegistrationReportApi,
  getPharmacySalesReportApi,
  getOccupancyReportApi,
} from "../services/report.api.js";
import DateRangePicker from "../../../components/common/DateRangePicker.jsx";
import ReportCard from "../components/ReportCard.jsx";
import RevenueByMethodChart from "../components/RevenueByMethodChart.jsx";
import RegistrationTrendChart from "../components/RegistrationTrendChart.jsx";
import TopMedicinesList from "../components/TopMedicinesList.jsx";
import OccupancyBreakdown from "../components/OccupancyBreakdown.jsx";
import StatsCard from "../../../components/ui/StatsCard.jsx";
import Loading from "../../../components/common/Loading.jsx";
import ErrorState from "../../../components/common/ErrorState.jsx";
import ErrorBoundary from "../../../components/common/ErrorBoundary.jsx";

const getDefaultRange = () => {
  const end = new Date();
  const start = new Date();
  start.setDate(start.getDate() - 30);
  return {
    startDate: start.toISOString().split("T")[0],
    endDate: end.toISOString().split("T")[0],
  };
};

export default function Reports() {
  const [range, setRange] = useState(getDefaultRange());
  const [revenue, setRevenue] = useState(null);
  const [registrations, setRegistrations] = useState(null);
  const [pharmacy, setPharmacy] = useState(null);
  const [occupancy, setOccupancy] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchAll = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const params = { startDate: range.startDate, endDate: range.endDate };
      const [revRes, regRes, pharmRes, occRes] = await Promise.all([
        getRevenueReportApi(params),
        getPatientRegistrationReportApi(params),
        getPharmacySalesReportApi(params),
        getOccupancyReportApi(),
      ]);
      setRevenue(revRes.data.data);
      setRegistrations(regRes.data.data);
      setPharmacy(pharmRes.data.data);
      setOccupancy(occRes.data.data);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to load reports");
    } finally {
      setLoading(false);
    }
  }, [range]);

  useEffect(() => {
    fetchAll();
  }, [fetchAll]);

  if (loading) return <Loading message="Crunching numbers..." />;
  if (error) return <ErrorState message={error} />;

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-xl font-semibold text-gray-900">Reports</h1>
          <p className="text-sm text-gray-500">Analytics and insights</p>
        </div>
        <DateRangePicker
          startDate={range.startDate}
          endDate={range.endDate}
          onChange={(startDate, endDate) => setRange({ startDate, endDate })}
        />
      </div>

      {/* Top-level KPIs */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatsCard
          label="Revenue"
          value={`₹${revenue?.totalRevenue?.toFixed(0) || 0}`}
          icon={IndianRupee}
        />
        <StatsCard
          label="New Registrations"
          value={registrations?.totalPatients || 0}
          icon={Users}
        />
        <StatsCard
          label="Pending Amount"
          value={`₹${revenue?.pendingAmount?.toFixed(0) || 0}`}
          icon={TrendingUp}
        />
        <StatsCard
          label="Currently Admitted"
          value={occupancy?.totalAdmitted || 0}
          icon={Bed}
        />
      </div>

      {/* Charts grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        <ReportCard
          title="Patient Registrations"
          subtitle="New patients over time"
        >
          <ErrorBoundary title="Chart unavailable" message="Could not render this chart.">
            <RegistrationTrendChart data={registrations?.dailyBreakdown || []} />
          </ErrorBoundary>
        </ReportCard>

        <ReportCard
          title="Revenue by Payment Method"
          subtitle="Collected in selected period"
        >
          <ErrorBoundary title="Chart unavailable" message="Could not render this chart.">
            <RevenueByMethodChart data={revenue?.revenueByMethod || []} />
          </ErrorBoundary>
        </ReportCard>

        <ReportCard title="Top Selling Medicines" subtitle="By quantity sold">
          <ErrorBoundary title="Widget unavailable" message="Could not load top medicines list.">
            <TopMedicinesList medicines={pharmacy?.topMedicines || []} />
          </ErrorBoundary>
        </ReportCard>

        <ReportCard
          title="Ward Occupancy"
          subtitle={`${occupancy?.totalAdmitted || 0} patients currently admitted`}
        >
          <ErrorBoundary title="Widget unavailable" message="Could not render occupancy breakdown.">
            <OccupancyBreakdown
              data={occupancy?.admittedByWard || []}
              total={occupancy?.totalAdmitted || 0}
            />
          </ErrorBoundary>
        </ReportCard>
      </div>
    </div>
  );
}
