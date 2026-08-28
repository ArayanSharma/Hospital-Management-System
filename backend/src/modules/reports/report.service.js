import Patient from "../patients/patient.model.js";
import Appointment from "../appointments/appointment.model.js";
import Invoice from "../billing/invoice.model.js";
import Payment from "../payments/payment.model.js";
import PharmacySale from "../pharmacy/pharmacySale.model.js";
import Admission from "../ipd/admission.model.js";

const parseDateRange = (startDate, endDate) => {
  const query = {};
  if (startDate || endDate) {
    query.$gte = startDate ? new Date(startDate) : undefined;
    if (endDate) {
      const end = new Date(endDate);
      end.setHours(23, 59, 59, 999);
      query.$lte = end;
    }
  }
  return query;
};

// ---------------- Patient Registration Report ----------------
export const getPatientRegistrationReport = async ({ startDate, endDate }) => {
  const dateQuery = parseDateRange(startDate, endDate);
  const query = Object.keys(dateQuery).length ? { createdAt: dateQuery } : {};

  const totalPatients = await Patient.countDocuments(query);

  // Date-wise breakdown — MongoDB aggregation
  const dailyBreakdown = await Patient.aggregate([
    { $match: query },
    {
      $group: {
        _id: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } },
        count: { $sum: 1 },
      },
    },
    { $sort: { _id: 1 } },
  ]);

  return { totalPatients, dailyBreakdown };
};

// ---------------- Appointment Report ----------------
export const getAppointmentReport = async ({ startDate, endDate }) => {
  const dateQuery = parseDateRange(startDate, endDate);
  const query = Object.keys(dateQuery).length ? { appointmentDate: dateQuery } : {};

  const statusBreakdown = await Appointment.aggregate([
    { $match: query },
    { $group: { _id: "$status", count: { $sum: 1 } } },
  ]);

  const total = await Appointment.countDocuments(query);

  return { total, statusBreakdown };
};

// ---------------- Revenue Report ----------------
export const getRevenueReport = async ({ startDate, endDate }) => {
  const dateQuery = parseDateRange(startDate, endDate);
  const query = { status: "success" };
  if (Object.keys(dateQuery).length) {
    query.paidAt = dateQuery;
  }

  const totalRevenue = await Payment.aggregate([
    { $match: query },
    { $group: { _id: null, total: { $sum: "$amount" } } },
  ]);

  const revenueByMethod = await Payment.aggregate([
    { $match: query },
    { $group: { _id: "$method", total: { $sum: "$amount" } } },
  ]);

  const pendingInvoicesAmount = await Invoice.aggregate([
    { $match: { status: { $in: ["unpaid", "partially-paid"] } } },
    { $group: { _id: null, total: { $sum: { $subtract: ["$total", "$amountPaid"] } } } },
  ]);

  return {
    totalRevenue: totalRevenue[0]?.total || 0,
    revenueByMethod,
    pendingAmount: pendingInvoicesAmount[0]?.total || 0,
  };
};

// ---------------- Pharmacy Sales Report ----------------
export const getPharmacySalesReport = async ({ startDate, endDate }) => {
  const dateQuery = parseDateRange(startDate, endDate);
  const query = Object.keys(dateQuery).length ? { createdAt: dateQuery } : {};

  const totalSales = await PharmacySale.aggregate([
    { $match: query },
    { $group: { _id: null, total: { $sum: "$totalAmount" }, count: { $sum: 1 } } },
  ]);

  // Sabse zyada bikne wali medicines
  const topMedicines = await PharmacySale.aggregate([
    { $match: query },
    { $unwind: "$medicines" },
    {
      $group: {
        _id: "$medicines.medicineId",
        totalQuantity: { $sum: "$medicines.quantity" },
        totalRevenue: { $sum: "$medicines.subtotal" },
      },
    },
    { $sort: { totalQuantity: -1 } },
    { $limit: 10 },
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
        medicineName: "$medicine.name",
        totalQuantity: 1,
        totalRevenue: 1,
      },
    },
  ]);

  return {
    totalSalesAmount: totalSales[0]?.total || 0,
    totalTransactions: totalSales[0]?.count || 0,
    topMedicines,
  };
};

// ---------------- Occupancy Report ----------------
export const getOccupancyReport = async () => {
  const totalAdmitted = await Admission.countDocuments({ status: "admitted" });
  const admittedByWard = await Admission.aggregate([
    { $match: { status: "admitted" } },
    {
      $lookup: {
        from: "wards",
        localField: "wardId",
        foreignField: "_id",
        as: "ward",
      },
    },
    { $unwind: "$ward" },
    {
      $group: {
        _id: "$ward.name",
        count: { $sum: 1 },
      },
    },
  ]);

  return { totalAdmitted, admittedByWard };
};