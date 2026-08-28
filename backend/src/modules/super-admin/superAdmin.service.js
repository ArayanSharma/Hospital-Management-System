import User from "../users/user.model.js";
import Role from "../roles/role.model.js";
import Permission from "../permissions/permission.model.js";
import Patient from "../patients/patient.model.js";
import Doctor from "../doctors/doctor.model.js";
import Appointment from "../appointments/appointment.model.js";
import Admission from "../ipd/admission.model.js";
import Ward from "../wards/ward.model.js";
import Invoice from "../billing/invoice.model.js";
import Payment from "../payments/payment.model.js";
import InsuranceClaim from "../insurance/insuranceClaim.model.js";
import AuditLog from "../audit-logs/audit-log.model.js";
import PharmacySale from "../pharmacy/pharmacySale.model.js";
import InventoryItem from "../inventory/inventoryItem.model.js";

// Helper for safe Date parsing with edge case fallback
const parseSafeDate = (dateStr, fallbackDate) => {
  if (!dateStr) return fallbackDate;
  const parsed = new Date(dateStr);
  return isNaN(parsed.getTime()) ? fallbackDate : parsed;
};

// ---------------- DASHBOARD STATS (Dynamic Filters + Edge Case Hardening) ----------------
export const getDashboardStats = async (params = {}) => {
  const { startDate, endDate, departmentId } = params;

  // 1. Date Range setup
  const now = new Date();
  const defaultSevenDaysAgo = new Date(now);
  defaultSevenDaysAgo.setDate(defaultSevenDaysAgo.getDate() - 7);

  const start = parseSafeDate(startDate, defaultSevenDaysAgo);
  const end = parseSafeDate(endDate, now);
  end.setHours(23, 59, 59, 999);

  const thirtyDaysFromNow = new Date(now);
  thirtyDaysFromNow.setDate(thirtyDaysFromNow.getDate() + 30);

  const todayStart = new Date(now);
  todayStart.setHours(0, 0, 0, 0);

  const todayEnd = new Date(now);
  todayEnd.setHours(23, 59, 59, 999);

  // Filter Matchers
  const dateMatchFilter = { $gte: start, $lte: end };
  const doctorFilter = { status: "active" };
  if (departmentId) doctorFilter.departmentId = departmentId;

  const apptFilter = { appointmentDate: { $gte: todayStart, $lte: todayEnd } };
  if (departmentId) apptFilter.departmentId = departmentId;

  const [
    totalUsers,
    activeUsers,
    totalRoles,
    totalPermissions,
    totalPatients,
    totalDoctors,
    todayAppointments,
    currentlyAdmitted,
    usersByRole,
    revenueThisMonth,
    revenueByMethod,
    pendingInvoices,
    pendingClaims,
    totalClaims,
    appointmentStatusCounts,
    patientRegistrationTrend,
    lowStockItems,
    expiringItems,
    topSellingMedicines,
    wardOccupancy,
  ] = await Promise.all([
    // 1. Users
    User.countDocuments({ status: { $ne: "deleted" } }),
    User.countDocuments({ status: "active" }),
    Role.countDocuments(),
    Permission.countDocuments(),

    // 2. Patients & Doctors
    Patient.countDocuments({ status: "active" }),
    Doctor.countDocuments(doctorFilter),

    // 3. Today's Appointments & Admitted Patients
    Appointment.countDocuments(apptFilter),
    Admission.countDocuments({ status: "admitted" }),

    // 4. Users By Role Aggregation
    User.aggregate([
      { $match: { status: { $ne: "deleted" } } },
      { $lookup: { from: "roles", localField: "roleId", foreignField: "_id", as: "role" } },
      { $unwind: "$role" },
      { $group: { _id: "$role.name", count: { $sum: 1 } } },
    ]),

    // 5. Monthly Revenue Aggregation
    Payment.aggregate([
      { $match: { status: "success", paidAt: dateMatchFilter } },
      { $group: { _id: null, total: { $sum: "$amount" } } },
    ]),

    // 6. Revenue by Payment Method (Cash, Card, UPI, NetBanking)
    Payment.aggregate([
      { $match: { status: "success", paidAt: dateMatchFilter } },
      { $group: { _id: "$method", total: { $sum: "$amount" } } },
    ]),

    // 7. Pending Uncollected Invoice Amount
    Invoice.aggregate([
      { $match: { status: { $in: ["unpaid", "partially-paid"] } } },
      { $group: { _id: null, pending: { $sum: { $subtract: ["$total", "$amountPaid"] } } } },
    ]),

    // 8. Insurance Claims
    InsuranceClaim.countDocuments({ status: { $in: ["submitted", "under-review"] } }),
    InsuranceClaim.countDocuments(),

    // 9. Appointment Status Breakdown
    Appointment.aggregate([
      { $match: { appointmentDate: dateMatchFilter } },
      { $group: { _id: "$status", count: { $sum: 1 } } },
    ]),

    // 10. Patient Registration 7-Day / Filtered Trend
    Patient.aggregate([
      { $match: { createdAt: dateMatchFilter } },
      {
        $group: {
          _id: { $dateToString: { format: "%d %b", date: "$createdAt" } },
          count: { $sum: 1 },
        },
      },
      { $sort: { _id: 1 } },
    ]),

    // 11. Low Stock Inventory Items
    InventoryItem.find({
      $expr: { $lte: ["$quantity", "$minStockLevel"] },
    })
      .select("itemName quantity minStockLevel")
      .limit(5),

    // 12. Expiring Stock Inventory Items
    InventoryItem.find({
      expiryDate: { $lte: thirtyDaysFromNow },
    })
      .select("itemName expiryDate quantity")
      .limit(5),

    // 13. Top Selling Medicines from Pharmacy Sales
    PharmacySale.aggregate([
      { $match: { createdAt: dateMatchFilter } },
      { $unwind: "$medicines" },
      {
        $group: {
          _id: "$medicines.medicineId",
          totalQty: { $sum: "$medicines.quantity" },
          totalRevenue: { $sum: "$medicines.subtotal" },
        },
      },
      { $sort: { totalQty: -1 } },
      { $limit: 5 },
      {
        $lookup: {
          from: "medicines",
          localField: "_id",
          foreignField: "_id",
          as: "medicine",
        },
      },
      { $unwind: "$medicine" },
      {
        $project: {
          name: "$medicine.name",
          totalQty: 1,
          totalRevenue: 1,
        },
      },
    ]),

    // 14. Ward & Bed Occupancy
    Admission.aggregate([
      { $match: { status: "admitted" } },
      { $lookup: { from: "wards", localField: "wardId", foreignField: "_id", as: "ward" } },
      { $unwind: "$ward" },
      {
        $group: {
          _id: "$ward.name",
          occupied: { $sum: 1 },
          capacity: { $first: "$ward.capacity" },
        },
      },
    ]),
  ]);

  return {
    queryRange: {
      startDate: start.toISOString(),
      endDate: end.toISOString(),
      departmentId: departmentId || null,
    },
    users: {
      total: totalUsers,
      active: activeUsers,
      byRole: usersByRole,
    },
    rbac: {
      totalRoles,
      totalPermissions,
    },
    hospital: {
      totalPatients,
      totalDoctors,
      todayAppointments,
      currentlyAdmitted,
    },
    finance: {
      revenueThisMonth: revenueThisMonth[0]?.total || 0,
      revenueByMethod,
      pendingUncollected: pendingInvoices[0]?.pending || 0,
    },
    insurance: {
      pendingClaims,
      totalClaims,
    },
    appointments: {
      statusBreakdown: appointmentStatusCounts,
    },
    trends: {
      patientRegistration: patientRegistrationTrend,
    },
    inventory: {
      lowStock: lowStockItems,
      expiring: expiringItems,
    },
    pharmacy: {
      topMedicines: topSellingMedicines,
    },
    occupancy: wardOccupancy,
  };
};

// ---------------- RECENT ACTIVITY FEED ----------------
export const getRecentActivity = async (limit = 20) => {
  const logs = await AuditLog.find()
    .populate("userId", "name email")
    .sort({ createdAt: -1 })
    .limit(limit);

  const feed = logs.map((log) => ({
    id: log._id,
    userName: log.userId?.name || "System User",
    action: log.action,
    resource: log.resource,
    description: `${log.userId?.name || "System"} ${formatAction(log.action)} a ${formatResource(log.resource)}`,
    timestamp: log.createdAt,
  }));

  return feed;
};

const formatAction = (action) => {
  const map = { CREATE: "created", UPDATE: "updated", DELETE: "deleted" };
  return map[action] || action.toLowerCase();
};

const formatResource = (resource) => resource.replace(/_/g, " ");