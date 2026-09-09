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
import { getOrSetCache } from "../../utils/redisCache.js";

// Helper for safe Date parsing with edge case fallback
const parseSafeDate = (dateStr, fallbackDate) => {
  if (!dateStr) return fallbackDate;
  const parsed = new Date(dateStr);
  return isNaN(parsed.getTime()) ? fallbackDate : parsed;
};

// ---------------- DASHBOARD STATS (Cached in Redis) ----------------
export const getDashboardStats = async (params = {}) => {
  const { startDate, endDate, departmentId } = params;

  const cacheKey = `hms:superadmin:dashboard:${startDate || "def"}:${endDate || "def"}:${departmentId || "all"}`;
  const { data: stats } = await getOrSetCache(
    cacheKey,
    async () => {
      const now = new Date();
      const defaultThirtyDaysAgo = new Date(now);
      defaultThirtyDaysAgo.setDate(defaultThirtyDaysAgo.getDate() - 30);

      const start = parseSafeDate(startDate, defaultThirtyDaysAgo);
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
        User.countDocuments({ status: { $ne: "deleted" } }),
        User.countDocuments({ status: "active" }),
        Role.countDocuments(),
        Permission.countDocuments(),

        Patient.countDocuments({ status: "active", isDeleted: { $ne: true } }),
        Doctor.countDocuments(doctorFilter),

        Appointment.countDocuments(departmentId ? { departmentId } : {}),
        Admission.countDocuments({ status: "admitted" }),

        User.aggregate([
          { $match: { status: { $ne: "deleted" } } },
          { $lookup: { from: "roles", localField: "roleId", foreignField: "_id", as: "role" } },
          { $unwind: "$role" },
          { $group: { _id: "$role.name", count: { $sum: 1 } } },
        ]),

        // Dynamic Revenue Calculation from Invoice / PharmacySale / Payment records
        Invoice.aggregate([
          { $match: { status: { $in: ["paid", "partially-paid"] }, createdAt: dateMatchFilter } },
          { $group: { _id: null, total: { $sum: "$amountPaid" } } },
        ]),

        Invoice.aggregate([
          { $match: { status: { $in: ["paid", "partially-paid"] }, createdAt: dateMatchFilter } },
          { $unwind: "$paymentHistory" },
          { $group: { _id: "$paymentHistory.mode", total: { $sum: "$paymentHistory.amount" } } },
        ]),

        Invoice.aggregate([
          { $match: { status: { $in: ["unpaid", "partially-paid"] } } },
          { $group: { _id: null, pending: { $sum: "$dueAmount" } } },
        ]),

        InsuranceClaim.countDocuments({ status: { $in: ["Submitted", "Under Review", "submitted", "under review"] } }),
        InsuranceClaim.countDocuments(),

        Appointment.aggregate([
          { $match: { createdAt: dateMatchFilter } },
          { $group: { _id: "$status", count: { $sum: 1 } } },
        ]),

        Patient.aggregate([
          { $match: { isDeleted: { $ne: true }, createdAt: dateMatchFilter } },
          {
            $group: {
              _id: { $dateToString: { format: "%d %b", date: "$createdAt" } },
              count: { $sum: 1 },
            },
          },
          { $sort: { _id: 1 } },
        ]),

        InventoryItem.find({
          $expr: { $lte: ["$quantity", "$minimumStock"] },
        })
          .select("itemName quantity minimumStock")
          .limit(5),

        InventoryItem.find({
          expiryDate: { $lte: thirtyDaysFromNow },
        })
          .select("itemName expiryDate quantity")
          .limit(5),

        PharmacySale.aggregate([
          { $unwind: "$medicines" },
          {
            $group: {
              _id: "$medicines.medicineId",
              medicineName: { $first: "$medicines.medicineName" },
              totalQty: { $sum: "$medicines.quantity" },
              totalRevenue: { $sum: "$medicines.amount" },
            },
          },
          { $sort: { totalQty: -1 } },
          { $limit: 5 },
          {
            $project: {
              name: "$medicineName",
              totalQty: 1,
              totalRevenue: 1,
            },
          },
        ]),

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
    },
    300
  );

  return stats;
};

// ---------------- RECENT ACTIVITY FEED (Cached in Redis) ----------------
export const getRecentActivity = async (limit = 20) => {
  const { data: feed } = await getOrSetCache(
    `hms:superadmin:activity:${limit}`,
    async () => {
      const logs = await AuditLog.find()
        .populate("userId", "name email")
        .sort({ createdAt: -1 })
        .limit(limit);

      return logs.map((log) => ({
        id: log._id,
        userName: log.userId?.name || "System User",
        action: log.action,
        resource: log.resource,
        description: `${log.userId?.name || "System"} ${formatAction(log.action)} a ${formatResource(log.resource)}`,
        timestamp: log.createdAt,
      }));
    },
    60
  );

  return feed;
};

const formatAction = (action) => {
  const map = { CREATE: "created", UPDATE: "updated", DELETE: "deleted" };
  return map[action] || action.toLowerCase();
};

const formatResource = (resource) => resource.replace(/_/g, " ");