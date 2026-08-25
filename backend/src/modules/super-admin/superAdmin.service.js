import User from "../users/user.model.js";
import Role from "../roles/role.model.js";
import Permission from "../permissions/permission.model.js";
import Patient from "../patients/patient.model.js";
import Doctor from "../doctors/doctor.model.js";
import Appointment from "../appointments/appointment.model.js";
import Admission from "../ipd/admission.model.js";
import Invoice from "../billing/invoice.model.js";
import Payment from "../payments/payment.model.js";
import AuditLog from "../audit-logs/audit-log.model.js";

// ---------------- DASHBOARD STATS ----------------
export const getDashboardStats = async () => {
  const sevenDaysAgo = new Date();
  sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

  const [
    totalUsers,
    activeUsers,
    totalRoles,
    totalPermissions,
    totalPatients,
    totalDoctors,
    todayAppointments,
    currentlyAdmitted,
    recentRegistrations,
    usersByRole,
    revenueThisMonth,
  ] = await Promise.all([
    User.countDocuments({ status: { $ne: "deleted" } }),
    User.countDocuments({ status: "active" }),
    Role.countDocuments(),
    Permission.countDocuments(),
    Patient.countDocuments({ status: "active" }),
    Doctor.countDocuments({ status: "active" }),
    Appointment.countDocuments({
      appointmentDate: {
        $gte: new Date(new Date().setHours(0, 0, 0, 0)),
        $lte: new Date(new Date().setHours(23, 59, 59, 999)),
      },
    }),
    Admission.countDocuments({ status: "admitted" }),
    User.countDocuments({ createdAt: { $gte: sevenDaysAgo }, status: { $ne: "deleted" } }),
    User.aggregate([
      { $match: { status: { $ne: "deleted" } } },
      { $lookup: { from: "roles", localField: "roleId", foreignField: "_id", as: "role" } },
      { $unwind: "$role" },
      { $group: { _id: "$role.name", count: { $sum: 1 } } },
    ]),
    Payment.aggregate([
      {
        $match: {
          status: "success",
          paidAt: { $gte: new Date(new Date().getFullYear(), new Date().getMonth(), 1) },
        },
      },
      { $group: { _id: null, total: { $sum: "$amount" } } },
    ]),
  ]);

  return {
    users: {
      total: totalUsers,
      active: activeUsers,
      recentRegistrations,
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
    },
  };
};

// ---------------- RECENT ACTIVITY FEED ----------------
export const getRecentActivity = async (limit = 20) => {
  const logs = await AuditLog.find()
    .populate("userId", "name email")
    .sort({ createdAt: -1 })
    .limit(limit);

  // Raw audit logs ko human-readable feed mein convert karo
  const feed = logs.map((log) => ({
    id: log._id,
    userName: log.userId?.name || "Unknown User",
    action: log.action,
    resource: log.resource,
    description: `${log.userId?.name || "Someone"} ${formatAction(log.action)} a ${formatResource(log.resource)}`,
    timestamp: log.createdAt,
  }));

  return feed;
};

// ---------------- Helpers: readable text banane ke liye ----------------
const formatAction = (action) => {
  const map = { CREATE: "created", UPDATE: "updated", DELETE: "deleted" };
  return map[action] || action.toLowerCase();
};

const formatResource = (resource) => resource.replace(/_/g, " ");