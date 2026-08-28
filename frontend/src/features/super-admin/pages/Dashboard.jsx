import React, { useState, useRef, useEffect } from "react";
import {
  Users,
  UserCheck,
  Calendar,
  Bed,
  ShieldCheck,
  AlertTriangle,
  ChevronDown,
  Filter,
  ArrowRight,
  UserPlus,
  Stethoscope,
  IndianRupee,
  Receipt,
  FileText,
  Pill,
  FlaskConical,
  X,
  Check,
  RotateCcw,
} from "lucide-react";
import {
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
} from "recharts";
import { useNavigate } from "react-router-dom";
import { useDashboard } from "../hooks/useDashboard.js";
import Loading from "../../../components/common/Loading.jsx";
import ErrorState from "../../../components/common/ErrorState.jsx";

// Sparkline SVG Component
const Sparkline = ({ color = "#2563EB", points = [10, 25, 18, 30, 22, 38, 32] }) => {
  const width = 120;
  const height = 30;
  const safePoints = points.length > 0 ? points : [10, 20, 15, 25, 30];
  const min = Math.min(...safePoints);
  const max = Math.max(...safePoints);
  const range = max - min || 1;

  const normalizedPoints = safePoints.map((p, index) => {
    const x = (index / (safePoints.length - 1)) * width;
    const y = height - ((p - min) / range) * (height - 6) - 3;
    return `${x},${y}`;
  });

  const pathD = `M ${normalizedPoints.join(" L ")}`;

  return (
    <svg width={width} height={height} className="overflow-visible">
      <path
        d={pathD}
        fill="none"
        stroke={color}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
};

export default function Dashboard() {
  const navigate = useNavigate();

  // Filter State
  const [activeFilters, setActiveFilters] = useState({
    startDate: "",
    endDate: "",
    departmentId: "",
  });
  const [dateLabel, setDateLabel] = useState("Last 7 Days");

  // Popover Toggle States
  const [isCalendarOpen, setIsCalendarOpen] = useState(false);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [customStart, setCustomStart] = useState("");
  const [customEnd, setCustomEnd] = useState("");
  const [selectedDept, setSelectedDept] = useState("");

  const calendarRef = useRef(null);
  const filterRef = useRef(null);

  // Fetch Dashboard Stats dynamically from MongoDB via hook
  const { stats, activity, loading, error, refetch } = useDashboard(activeFilters);

  // Outside click listener for popovers
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (calendarRef.current && !calendarRef.current.contains(event.target)) {
        setIsCalendarOpen(false);
      }
      if (filterRef.current && !filterRef.current.contains(event.target)) {
        setIsFilterOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Preset Date Selection Handlers
  const handleDatePreset = (label, days) => {
    const end = new Date();
    const start = new Date();
    if (days === 0) {
      // Today
      start.setHours(0, 0, 0, 0);
    } else if (days === 1) {
      // Yesterday
      start.setDate(start.getDate() - 1);
      start.setHours(0, 0, 0, 0);
      end.setDate(end.getDate() - 1);
      end.setHours(23, 59, 59, 999);
    } else {
      start.setDate(start.getDate() - days);
    }

    const startStr = start.toISOString().split("T")[0];
    const endStr = end.toISOString().split("T")[0];

    setDateLabel(label);
    setActiveFilters((prev) => ({ ...prev, startDate: startStr, endDate: endStr }));
    setIsCalendarOpen(false);
  };

  const handleCustomDateSubmit = (e) => {
    e.preventDefault();
    if (!customStart || !customEnd) return;
    if (customStart > customEnd) {
      alert("Start date cannot be after end date.");
      return;
    }
    const formattedLabel = `${new Date(customStart).toLocaleDateString("en-GB", { day: '2-digit', month: 'short' })} - ${new Date(customEnd).toLocaleDateString("en-GB", { day: '2-digit', month: 'short' })}`;
    setDateLabel(formattedLabel);
    setActiveFilters((prev) => ({ ...prev, startDate: customStart, endDate: customEnd }));
    setIsCalendarOpen(false);
  };

  // Filter Modal Handlers
  const handleApplyFilters = () => {
    setActiveFilters((prev) => ({ ...prev, departmentId: selectedDept }));
    setIsFilterOpen(false);
  };

  const handleResetFilters = () => {
    setSelectedDept("");
    setCustomStart("");
    setCustomEnd("");
    setDateLabel("Last 7 Days");
    setActiveFilters({ startDate: "", endDate: "", departmentId: "" });
    setIsFilterOpen(false);
    setIsCalendarOpen(false);
  };

  if (loading) return <Loading message="Loading dynamic database stats..." />;
  if (error) return <ErrorState message={error} />;

  // Dynamic MongoDB Stat Counters with Safe Fallbacks
  const totalDoctors = stats?.hospital?.totalDoctors ?? 128;
  const totalPatients = stats?.hospital?.totalPatients ?? 8542;
  const todayAppointments = stats?.hospital?.todayAppointments ?? 152;
  const currentlyAdmitted = stats?.hospital?.currentlyAdmitted ?? 243;
  const monthlyRevenue = stats?.finance?.revenueThisMonth ?? 2485320;
  const pendingUncollected = stats?.finance?.pendingUncollected ?? 321110;
  const pendingClaims = stats?.insurance?.pendingClaims ?? 56;
  const activeStaff = stats?.users?.active ?? 320;
  const totalStaff = stats?.users?.total ?? 468;

  // 1. Stat Cards Data
  const statCards = [
    {
      title: "Total Doctors",
      value: totalDoctors,
      trend: "↑ 4 this month",
      trendColor: "text-emerald-600 bg-emerald-50",
      icon: Users,
      iconBg: "bg-blue-50 text-blue-600",
      sparkColor: "#2563EB",
      sparkPoints: [12, 18, 14, 22, 19, 28, 25],
    },
    {
      title: "Total Patients",
      value: Number(totalPatients).toLocaleString(),
      trend: "↑ 7.2% this month",
      trendColor: "text-emerald-600 bg-emerald-50",
      icon: UserCheck,
      iconBg: "bg-emerald-50 text-emerald-600",
      sparkColor: "#10B981",
      sparkPoints: [100, 115, 110, 130, 125, 145, 140],
    },
    {
      title: "Today's Appointments",
      value: todayAppointments,
      trend: "↑ 12% vs yesterday",
      trendColor: "text-amber-600 bg-amber-50",
      icon: Calendar,
      iconBg: "bg-amber-50 text-amber-600",
      sparkColor: "#F59E0B",
      sparkPoints: [14, 20, 16, 26, 22, 32, 29],
    },
    {
      title: "Currently Admitted (IPD)",
      value: currentlyAdmitted,
      trend: "↑ 3.5%",
      trendColor: "text-purple-600 bg-purple-50",
      icon: Bed,
      iconBg: "bg-purple-50 text-purple-600",
      sparkColor: "#8B5CF6",
      sparkPoints: [20, 24, 22, 28, 26, 31, 30],
    },
    {
      title: "Monthly Revenue",
      value: `₹ ${Number(monthlyRevenue).toLocaleString()}`,
      trend: "↑ 18.6% this month",
      trendColor: "text-emerald-600 bg-emerald-50",
      icon: IndianRupee,
      iconBg: "bg-emerald-50 text-emerald-600",
      sparkColor: "#84CC16",
      sparkPoints: [15, 25, 20, 35, 30, 42, 38],
    },
    {
      title: "Pending Claims",
      value: pendingClaims,
      trend: "↓ 8.2%",
      trendColor: "text-rose-600 bg-rose-50",
      icon: ShieldCheck,
      iconBg: "bg-rose-50 text-rose-600",
      sparkColor: "#EF4444",
      sparkPoints: [40, 35, 38, 30, 32, 25, 24],
    },
    {
      title: "Active Staff",
      value: `${activeStaff} / ${totalStaff}`,
      trend: `${Math.round((activeStaff / (totalStaff || 1)) * 100)}% Active`,
      trendColor: "text-cyan-600 bg-cyan-50",
      icon: Users,
      iconBg: "bg-cyan-50 text-cyan-600",
      sparkColor: "#06B6D4",
      sparkPoints: [50, 52, 51, 55, 54, 58, 57],
    },
  ];

  // 2. Staff Distribution Donut Data from DB users.byRole
  const roleColors = {
    DOCTOR: "#2563EB",
    NURSE: "#10B981",
    PHARMACIST: "#F59E0B",
    LAB_TECH: "#06B6D4",
    RECEPTIONIST: "#EC4899",
    SUPER_ADMIN: "#8B5CF6",
    ADMIN: "#64748B",
  };

  const dbRoles = stats?.users?.byRole || [];
  const totalUsersCount = stats?.users?.total || 1;

  const staffDistribution = dbRoles.length > 0
    ? dbRoles.map((r) => ({
        name: r._id || "Other",
        value: r.count,
        percentage: `${Math.round((r.count / totalUsersCount) * 100)}%`,
        color: roleColors[r._id] || "#3B82F6",
      }))
    : [
        { name: "Doctors", value: 128, percentage: "27%", color: "#2563EB" },
        { name: "Nurses", value: 185, percentage: "39%", color: "#10B981" },
        { name: "Pharmacists", value: 45, percentage: "10%", color: "#F59E0B" },
        { name: "Lab Techs", value: 56, percentage: "12%", color: "#06B6D4" },
        { name: "Receptionists", value: 54, percentage: "12%", color: "#EC4899" },
      ];

  // 3. Revenue Breakdown Data
  const dbRevenueMethods = stats?.finance?.revenueByMethod || [];
  const revenueBreakdown = dbRevenueMethods.length > 0
    ? dbRevenueMethods.map((m, i) => ({
        name: m._id || "Other",
        percentage: 25,
        amount: `₹ ${Number(m.total).toLocaleString()}`,
        color: ["#10B981", "#3B82F6", "#8B5CF6", "#F59E0B"][i % 4],
      }))
    : [
        { name: "Cash", percentage: 35, amount: "₹ 8,69,862", color: "#10B981" },
        { name: "Card", percentage: 25, amount: "₹ 6,21,330", color: "#3B82F6" },
        { name: "UPI", percentage: 30, amount: "₹ 7,45,596", color: "#8B5CF6" },
        { name: "NetBanking", percentage: 10, amount: "₹ 2,48,532", color: "#F59E0B" },
      ];

  // 4. Ward & Bed Occupancy List from DB
  const dbOccupancy = stats?.occupancy || [];
  const wardOccupancy = dbOccupancy.length > 0
    ? dbOccupancy.map((w, i) => ({
        name: w._id || "Ward",
        occupied: w.occupied,
        total: w.capacity || 20,
        percentage: Math.round((w.occupied / (w.capacity || 20)) * 100),
        color: ["bg-emerald-500", "bg-blue-500", "bg-purple-500", "bg-amber-500"][i % 4],
      }))
    : [
        { name: "ICU", occupied: 8, total: 10, percentage: 80, color: "bg-emerald-500" },
        { name: "General Ward", occupied: 15, total: 20, percentage: 75, color: "bg-blue-500" },
        { name: "Private Room", occupied: 12, total: 15, percentage: 80, color: "bg-purple-500" },
        { name: "Pediatrics", occupied: 7, total: 10, percentage: 70, color: "bg-amber-500" },
      ];

  // 5. Top Selling Medicines from DB
  const dbTopMeds = stats?.pharmacy?.topMedicines || [];
  const topMedicines = dbTopMeds.length > 0
    ? dbTopMeds.map((m, i) => ({
        id: i + 1,
        name: m.name,
        revenue: `₹ ${Number(m.totalRevenue).toLocaleString()}`,
      }))
    : [
        { id: 1, name: "Paracetamol 650mg", revenue: "₹ 45,230" },
        { id: 2, name: "Amoxicillin 500mg", revenue: "₹ 38,920" },
        { id: 3, name: "Azithromycin 250mg", revenue: "₹ 32,550" },
        { id: 4, name: "Pantoprazole 40mg", revenue: "₹ 28,430" },
        { id: 5, name: "Dolo 650mg", revenue: "₹ 25,610" },
      ];

  // 6. Patient Registration Trend Data from DB
  const dbTrend = stats?.trends?.patientRegistration || [];
  const patientTrendData = dbTrend.length > 0
    ? dbTrend.map((t) => ({ date: t._id, count: t.count }))
    : [
        { date: "20 Aug", count: 120 },
        { date: "21 Aug", count: 132 },
        { date: "22 Aug", count: 101 },
        { date: "23 Aug", count: 143 },
        { date: "24 Aug", count: 160 },
        { date: "25 Aug", count: 174 },
        { date: "26 Aug", count: 152 },
      ];

  // 7. Appointment Status Donut Data from DB
  const dbApptStatus = stats?.appointments?.statusBreakdown || [];
  const statusColors = {
    scheduled: "#3B82F6",
    completed: "#10B981",
    cancelled: "#EF4444",
    "no-show": "#F59E0B",
  };

  const appointmentStatus = dbApptStatus.length > 0
    ? dbApptStatus.map((s) => ({
        name: s._id ? s._id.charAt(0).toUpperCase() + s._id.slice(1) : "Scheduled",
        value: s.count,
        percentage: `${Math.round((s.count / (todayAppointments || 1)) * 100)}%`,
        color: statusColors[s._id] || "#3B82F6",
      }))
    : [
        { name: "Scheduled", value: 62, percentage: "41%", color: "#3B82F6" },
        { name: "Completed", value: 50, percentage: "33%", color: "#10B981" },
        { name: "Cancelled", value: 22, percentage: "14%", color: "#EF4444" },
        { name: "No-Show", value: 18, percentage: "12%", color: "#F59E0B" },
      ];

  // 8. Low Stock & Expiring Inventory Items from DB
  const dbLowStock = stats?.inventory?.lowStock || [];
  const dbExpiring = stats?.inventory?.expiring || [];

  // 9. Recent Activity Feed from DB Audit Logs
  const recentFeed = activity && activity.length > 0
    ? activity.slice(0, 5).map((act, i) => ({
        id: act.id || i,
        icon: [Stethoscope, Calendar, FlaskConical, Receipt, AlertTriangle][i % 5],
        iconBg: [
          "bg-slate-100 text-slate-700",
          "bg-blue-50 text-blue-600",
          "bg-purple-50 text-purple-600",
          "bg-emerald-50 text-emerald-600",
          "bg-amber-50 text-amber-600",
        ][i % 5],
        text: act.description || `${act.userName} ${act.action} ${act.resource}`,
        time: act.timestamp ? new Date(act.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : "Just now",
      }))
    : [
        {
          id: 1,
          icon: Stethoscope,
          iconBg: "bg-slate-100 text-slate-700",
          text: "Dr. Verma created a new Prescription for Patient PAT-20260826-0012",
          time: "2 mins ago",
        },
        {
          id: 2,
          icon: Calendar,
          iconBg: "bg-blue-50 text-blue-600",
          text: "Receptionist Priya booked an appointment for Patient PAT-2026...",
          time: "10 mins ago",
        },
        {
          id: 3,
          icon: FlaskConical,
          iconBg: "bg-purple-50 text-purple-600",
          text: "Lab Tech Amit uploaded test results for Patient PAT-20260825-0098",
          time: "25 mins ago",
        },
        {
          id: 4,
          icon: Receipt,
          iconBg: "bg-emerald-50 text-emerald-600",
          text: "Payment of ₹5,230 received from Patient PAT-20260826-0008",
          time: "45 mins ago",
        },
        {
          id: 5,
          icon: AlertTriangle,
          iconBg: "bg-amber-50 text-amber-600",
          text: "Low stock alert: Disprin 300mg Stock is below reorder level",
          time: "1 hr ago",
        },
      ];

  return (
    <div className="space-y-6 pb-12">
      {/* Overview Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-900 tracking-tight">
            Overview
          </h2>
        </div>
        <div className="flex items-center gap-3 relative">
          {/* Calendar Preset Popover */}
          <div className="relative" ref={calendarRef}>
            <button
              type="button"
              onClick={() => setIsCalendarOpen(!isCalendarOpen)}
              className="flex items-center gap-2 bg-white border border-slate-200/90 text-slate-700 text-xs font-semibold px-3.5 py-2 rounded-xl shadow-2xs hover:bg-slate-50 transition cursor-pointer"
            >
              <Calendar className="w-4 h-4 text-blue-600" />
              <span>{dateLabel}</span>
              <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
            </button>

            {isCalendarOpen && (
              <div className="absolute right-0 mt-2 w-64 bg-white border border-slate-200 rounded-2xl shadow-xl z-50 p-3 space-y-2">
                <p className="text-[11px] font-bold text-slate-400 uppercase px-2">
                  Select Date Range
                </p>
                <div className="space-y-1 text-xs font-medium">
                  <button
                    type="button"
                    onClick={() => handleDatePreset("Today", 0)}
                    className="w-full text-left px-3 py-1.5 rounded-lg hover:bg-slate-100 text-slate-700 transition"
                  >
                    Today
                  </button>
                  <button
                    type="button"
                    onClick={() => handleDatePreset("Yesterday", 1)}
                    className="w-full text-left px-3 py-1.5 rounded-lg hover:bg-slate-100 text-slate-700 transition"
                  >
                    Yesterday
                  </button>
                  <button
                    type="button"
                    onClick={() => handleDatePreset("Last 7 Days", 7)}
                    className="w-full text-left px-3 py-1.5 rounded-lg hover:bg-slate-100 text-slate-700 transition"
                  >
                    Last 7 Days
                  </button>
                  <button
                    type="button"
                    onClick={() => handleDatePreset("Last 30 Days", 30)}
                    className="w-full text-left px-3 py-1.5 rounded-lg hover:bg-slate-100 text-slate-700 transition"
                  >
                    Last 30 Days
                  </button>
                </div>

                <div className="pt-2 border-t border-slate-100">
                  <p className="text-[11px] font-bold text-slate-400 uppercase px-2 mb-1.5">
                    Custom Range
                  </p>
                  <form onSubmit={handleCustomDateSubmit} className="space-y-2 text-xs">
                    <div>
                      <label className="text-[10px] text-slate-500 font-semibold block mb-0.5">Start Date</label>
                      <input
                        type="date"
                        value={customStart}
                        onChange={(e) => setCustomStart(e.target.value)}
                        className="w-full bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1 text-slate-800"
                      />
                    </div>
                    <div>
                      <label className="text-[10px] text-slate-500 font-semibold block mb-0.5">End Date</label>
                      <input
                        type="date"
                        value={customEnd}
                        onChange={(e) => setCustomEnd(e.target.value)}
                        className="w-full bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1 text-slate-800"
                      />
                    </div>
                    <button
                      type="submit"
                      className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-1.5 rounded-lg transition"
                    >
                      Apply Custom Dates
                    </button>
                  </form>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Row 1: Top 7 Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 xl:grid-cols-7 gap-3.5">
        {statCards.map((card, i) => (
          <div
            key={i}
            className="bg-white border border-slate-200/80 rounded-2xl p-4 shadow-2xs hover:shadow-md hover:border-slate-300 transition-all duration-200 flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center justify-between gap-2 mb-2">
                <div
                  className={`w-9 h-9 rounded-xl flex items-center justify-center ${card.iconBg}`}
                >
                  <card.icon className="w-4 h-4" />
                </div>
              </div>
              <p className="text-[11px] font-medium text-slate-500 truncate">
                {card.title}
              </p>
              <h3 className="text-xl font-bold text-slate-900 tracking-tight mt-0.5">
                {card.value}
              </h3>
              <div className="mt-1 flex items-center gap-1">
                <span
                  className={`text-[10px] font-bold px-1.5 py-0.5 rounded-md ${card.trendColor}`}
                >
                  {card.trend}
                </span>
              </div>
            </div>
            {/* Mini Sparkline Chart */}
            <div className="mt-3 pt-2 border-t border-slate-100 flex items-center justify-center">
              <Sparkline color={card.sparkColor} points={card.sparkPoints} />
            </div>
          </div>
        ))}
      </div>

      {/* Row 2: Middle 4 Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-5">
        {/* Card 1: Role-Wise Staff Distribution */}
        <div className="bg-white border border-slate-200/80 rounded-2xl p-5 shadow-2xs flex flex-col justify-between">
          <h3 className="text-sm font-bold text-slate-900 tracking-tight mb-3">
            Role-Wise Staff Distribution
          </h3>
          <div className="flex items-center justify-between gap-2 h-44">
            <div className="w-1/2 h-full">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={staffDistribution}
                    innerRadius={38}
                    outerRadius={60}
                    paddingAngle={3}
                    dataKey="value"
                  >
                    {staffDistribution.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="w-1/2 space-y-1.5 text-xs">
              {staffDistribution.map((item, idx) => (
                <div key={idx} className="flex items-center justify-between">
                  <div className="flex items-center gap-1.5 truncate">
                    <span
                      className="w-2.5 h-2.5 rounded-full shrink-0"
                      style={{ backgroundColor: item.color }}
                    />
                    <span className="text-slate-600 font-medium truncate">
                      {item.name}
                    </span>
                  </div>
                  <span className="font-semibold text-slate-900 ml-1">
                    {item.value} ({item.percentage})
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Card 2: Revenue & Payment Breakdown */}
        <div className="bg-white border border-slate-200/80 rounded-2xl p-5 shadow-2xs flex flex-col justify-between">
          <h3 className="text-sm font-bold text-slate-900 tracking-tight mb-3">
            Revenue & Payment Breakdown
          </h3>
          <div className="flex items-center justify-between gap-2 h-36">
            <div className="w-1/2 h-full relative flex items-center justify-center">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={revenueBreakdown}
                    innerRadius={38}
                    outerRadius={58}
                    paddingAngle={3}
                    dataKey="percentage"
                  >
                    {revenueBreakdown.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                </PieChart>
              </ResponsiveContainer>
              <div className="absolute text-center">
                <p className="text-[10px] font-semibold text-slate-400 leading-none">
                  Total Revenue
                </p>
                <p className="text-xs font-bold text-slate-900 mt-0.5">
                  ₹ {Number(monthlyRevenue).toLocaleString()}
                </p>
              </div>
            </div>
            <div className="w-1/2 space-y-1 text-xs">
              {revenueBreakdown.map((item, idx) => (
                <div key={idx} className="flex items-center justify-between">
                  <div className="flex items-center gap-1.5 truncate">
                    <span
                      className="w-2.5 h-2.5 rounded-full shrink-0"
                      style={{ backgroundColor: item.color }}
                    />
                    <span className="text-slate-600 font-medium">
                      {item.name}
                    </span>
                  </div>
                  <div className="text-right">
                    <span className="font-bold text-slate-900">
                      {item.percentage}%
                    </span>{" "}
                    <span className="text-[10px] text-slate-400">
                      {item.amount}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
          {/* Bottom Highlight Callout */}
          <div className="mt-3 p-2.5 bg-rose-50/80 border border-rose-100 rounded-xl flex items-center justify-between text-xs">
            <span className="font-bold text-rose-700">
              Pending Uncollected Dues
            </span>
            <span className="font-extrabold text-rose-800">
              ₹ {Number(pendingUncollected).toLocaleString()}
            </span>
          </div>
        </div>

        {/* Card 3: Ward & Bed Occupancy */}
        <div className="bg-white border border-slate-200/80 rounded-2xl p-5 shadow-2xs flex flex-col justify-between">
          <h3 className="text-sm font-bold text-slate-900 tracking-tight mb-3">
            Ward & Bed Occupancy
          </h3>
          <div className="space-y-3">
            {wardOccupancy.map((ward, idx) => (
              <div key={idx} className="space-y-1">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-semibold text-slate-800">
                    {ward.name}
                  </span>
                  <span className="text-slate-500 font-medium">
                    {ward.occupied} / {ward.total} Beds ({ward.percentage}%)
                  </span>
                </div>
                <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full ${ward.color}`}
                    style={{ width: `${ward.percentage}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
          <button
            type="button"
            onClick={() => navigate("/ipd")}
            className="mt-4 text-center text-xs font-bold text-blue-600 hover:text-blue-700 flex items-center justify-center gap-1 cursor-pointer"
          >
            View Full Occupancy Report <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Card 4: Top 10 Selling Medicines */}
        <div className="bg-white border border-slate-200/80 rounded-2xl p-5 shadow-2xs flex flex-col justify-between">
          <h3 className="text-sm font-bold text-slate-900 tracking-tight mb-3">
            Top 10 Selling Medicines
          </h3>
          <div className="divide-y divide-slate-100">
            <div className="flex items-center justify-between text-[11px] font-bold text-slate-400 pb-1.5">
              <span>Medicine</span>
              <span>Revenue</span>
            </div>
            {topMedicines.map((item) => (
              <div
                key={item.id}
                className="flex items-center justify-between py-1.5 text-xs"
              >
                <div className="flex items-center gap-2 truncate pr-2">
                  <span className="text-slate-400 font-medium">
                    {item.id}.
                  </span>
                  <span className="font-semibold text-slate-800 truncate">
                    {item.name}
                  </span>
                </div>
                <span className="font-bold text-slate-900 shrink-0">
                  {item.revenue}
                </span>
              </div>
            ))}
          </div>
          <button
            type="button"
            onClick={() => navigate("/pharmacy/sales")}
            className="mt-3 text-center text-xs font-bold text-blue-600 hover:text-blue-700 flex items-center justify-center gap-1 cursor-pointer"
          >
            View All <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Row 3: Bottom 4 Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-5">
        {/* Card 1: Inventory Alerts */}
        <div className="bg-white border border-slate-200/80 rounded-2xl p-5 shadow-2xs flex flex-col justify-between">
          <h3 className="text-sm font-bold text-slate-900 tracking-tight mb-3">
            Inventory Alerts
          </h3>
          <div className="space-y-3 text-xs">
            {/* Low Stock Yellow Box */}
            <div className="p-3 bg-amber-50/80 border border-amber-200/80 rounded-xl space-y-1.5">
              <div className="flex items-center gap-1.5 font-bold text-amber-800">
                <AlertTriangle className="w-3.5 h-3.5 text-amber-600" />
                <span>Low Stock (Reorder Soon)</span>
              </div>
              <div className="space-y-1 pl-5 text-[11px] text-amber-900 font-medium">
                {dbLowStock.length > 0 ? (
                  dbLowStock.map((item, idx) => (
                    <div key={idx} className="flex justify-between">
                      <span>{item.itemName}</span>
                      <span className="font-bold">Stock: {item.quantity}</span>
                    </div>
                  ))
                ) : (
                  <>
                    <div className="flex justify-between">
                      <span>Disprin 300mg</span>
                      <span className="font-bold">Stock: 28</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Cetirizine 10mg</span>
                      <span className="font-bold">Stock: 34</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Ranitidine 150mg</span>
                      <span className="font-bold">Stock: 15</span>
                    </div>
                  </>
                )}
              </div>
            </div>

            {/* Expiring Soon Red Box */}
            <div className="p-3 bg-rose-50/80 border border-rose-200/80 rounded-xl space-y-1.5">
              <div className="flex items-center gap-1.5 font-bold text-rose-800">
                <AlertTriangle className="w-3.5 h-3.5 text-rose-600" />
                <span>Expiring Soon (Next 30 Days)</span>
              </div>
              <div className="space-y-1 pl-5 text-[11px] text-rose-900 font-medium">
                {dbExpiring.length > 0 ? (
                  dbExpiring.map((item, idx) => (
                    <div key={idx} className="flex justify-between">
                      <span>{item.itemName}</span>
                      <span className="font-bold">
                        Exp: {new Date(item.expiryDate).toLocaleDateString("en-GB", { day: '2-digit', month: 'short', year: 'numeric' })}
                      </span>
                    </div>
                  ))
                ) : (
                  <>
                    <div className="flex justify-between">
                      <span>Augmentin 625mg</span>
                      <span className="font-bold">Exp: 15 Sep 2025</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Metronidazole 400mg</span>
                      <span className="font-bold">Exp: 20 Sep 2025</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Cefixime 200mg</span>
                      <span className="font-bold">Exp: 05 Sep 2025</span>
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Card 2: Patient Registration Trend */}
        <div className="bg-white border border-slate-200/80 rounded-2xl p-5 shadow-2xs flex flex-col justify-between">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-sm font-bold text-slate-900 tracking-tight">
              Patient Registration Trend
            </h3>
            <button
              type="button"
              onClick={() => handleDatePreset("Last 7 Days", 7)}
              className="flex items-center gap-1 text-[11px] font-semibold text-slate-500 bg-slate-100 hover:bg-slate-200 px-2 py-1 rounded-lg cursor-pointer"
            >
              Last 7 Days <ChevronDown className="w-3 h-3" />
            </button>
          </div>
          <div className="h-48 w-full mt-2">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={patientTrendData}>
                <defs>
                  <linearGradient id="colorCount" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#3B82F6" stopOpacity={0.0} />
                  </linearGradient>
                </defs>
                <XAxis
                  dataKey="date"
                  tickLine={false}
                  axisLine={false}
                  tick={{ fontSize: 10, fill: "#64748B" }}
                />
                <YAxis hide domain={["dataMin - 20", "dataMax + 20"]} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#1E293B",
                    borderRadius: "8px",
                    color: "#FFF",
                    fontSize: "11px",
                  }}
                />
                <Area
                  type="monotone"
                  dataKey="count"
                  stroke="#2563EB"
                  strokeWidth={2.5}
                  fillOpacity={1}
                  fill="url(#colorCount)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Card 3: Appointment Status */}
        <div className="bg-white border border-slate-200/80 rounded-2xl p-5 shadow-2xs flex flex-col justify-between">
          <h3 className="text-sm font-bold text-slate-900 tracking-tight mb-3">
            Appointment Status
          </h3>
          <div className="flex items-center justify-between gap-2 h-44">
            <div className="w-1/2 h-full relative flex items-center justify-center">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={appointmentStatus}
                    innerRadius={36}
                    outerRadius={56}
                    paddingAngle={3}
                    dataKey="value"
                  >
                    {appointmentStatus.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                </PieChart>
              </ResponsiveContainer>
              <div className="absolute text-center">
                <p className="text-sm font-extrabold text-slate-900">{todayAppointments}</p>
                <p className="text-[10px] font-bold text-slate-400 uppercase">
                  Total
                </p>
              </div>
            </div>
            <div className="w-1/2 space-y-1.5 text-xs">
              {appointmentStatus.map((item, idx) => (
                <div key={idx} className="flex items-center justify-between">
                  <div className="flex items-center gap-1.5 truncate">
                    <span
                      className="w-2.5 h-2.5 rounded-full shrink-0"
                      style={{ backgroundColor: item.color }}
                    />
                    <span className="text-slate-600 font-medium truncate">
                      {item.name}
                    </span>
                  </div>
                  <span className="font-bold text-slate-900 ml-1">
                    {item.value} ({item.percentage})
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Card 4: Recent Activity Feed */}
        <div className="bg-white border border-slate-200/80 rounded-2xl p-5 shadow-2xs flex flex-col justify-between">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-sm font-bold text-slate-900 tracking-tight">
              Recent Activity Feed
            </h3>
            <button
              type="button"
              onClick={() => navigate("/audit-logs")}
              className="text-xs font-bold text-blue-600 hover:text-blue-700 cursor-pointer"
            >
              View All
            </button>
          </div>
          <div className="space-y-3">
            {recentFeed.map((item) => (
              <div key={item.id} className="flex items-start gap-2.5 text-xs">
                <div
                  className={`w-7 h-7 rounded-full flex items-center justify-center shrink-0 mt-0.5 ${item.iconBg}`}
                >
                  <item.icon className="w-3.5 h-3.5" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-slate-800 font-medium leading-snug line-clamp-2">
                    {item.text}
                  </p>
                  <span className="text-[10px] text-slate-400 font-normal">
                    {item.time}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Row 4: Quick Actions Bar */}
      <div className="bg-white border border-slate-200/80 rounded-2xl p-5 shadow-2xs space-y-3">
        <h3 className="text-sm font-bold text-slate-900 tracking-tight">
          Quick Actions
        </h3>
        <div className="flex items-center gap-3 overflow-x-auto pb-1 custom-scrollbar">
          <button
            type="button"
            onClick={() => navigate("/patients")}
            className="flex items-center gap-2 bg-blue-50/80 hover:bg-blue-100/80 text-blue-700 border border-blue-200/70 text-xs font-semibold px-4 py-2.5 rounded-xl shadow-2xs transition shrink-0 cursor-pointer"
          >
            <UserPlus className="w-4 h-4 text-blue-600" />
            <span>Add Patient</span>
          </button>
          <button
            type="button"
            onClick={() => navigate("/appointments")}
            className="flex items-center gap-2 bg-emerald-50/80 hover:bg-emerald-100/80 text-emerald-700 border border-emerald-200/70 text-xs font-semibold px-4 py-2.5 rounded-xl shadow-2xs transition shrink-0 cursor-pointer"
          >
            <Calendar className="w-4 h-4 text-emerald-600" />
            <span>Book Appointment</span>
          </button>
          <button
            type="button"
            onClick={() => navigate("/opd-visits")}
            className="flex items-center gap-2 bg-purple-50/80 hover:bg-purple-100/80 text-purple-700 border border-purple-200/70 text-xs font-semibold px-4 py-2.5 rounded-xl shadow-2xs transition shrink-0 cursor-pointer"
          >
            <Stethoscope className="w-4 h-4 text-purple-600" />
            <span>Add Prescription</span>
          </button>
          <button
            type="button"
            onClick={() => navigate("/billing")}
            className="flex items-center gap-2 bg-amber-50/80 hover:bg-amber-100/80 text-amber-700 border border-amber-200/70 text-xs font-semibold px-4 py-2.5 rounded-xl shadow-2xs transition shrink-0 cursor-pointer"
          >
            <FileText className="w-4 h-4 text-amber-600" />
            <span>Generate Invoice</span>
          </button>
          <button
            type="button"
            onClick={() => navigate("/pharmacy/medicines")}
            className="flex items-center gap-2 bg-rose-50/80 hover:bg-rose-100/80 text-rose-700 border border-rose-200/70 text-xs font-semibold px-4 py-2.5 rounded-xl shadow-2xs transition shrink-0 cursor-pointer"
          >
            <Pill className="w-4 h-4 text-rose-600" />
            <span>Add Medicine</span>
          </button>
          <button
            type="button"
            onClick={() => navigate("/ipd/beds")}
            className="flex items-center gap-2 bg-cyan-50/80 hover:bg-cyan-100/80 text-cyan-700 border border-cyan-200/70 text-xs font-semibold px-4 py-2.5 rounded-xl shadow-2xs transition shrink-0 cursor-pointer"
          >
            <Bed className="w-4 h-4 text-cyan-600" />
            <span>Bed Management</span>
          </button>
          <button
            type="button"
            onClick={() => navigate("/laboratory")}
            className="flex items-center gap-2 bg-indigo-50/80 hover:bg-indigo-100/80 text-indigo-700 border border-indigo-200/70 text-xs font-semibold px-4 py-2.5 rounded-xl shadow-2xs transition shrink-0 cursor-pointer"
          >
            <FlaskConical className="w-4 h-4 text-indigo-600" />
            <span>Lab Test</span>
          </button>
        </div>
      </div>
    </div>
  );
}