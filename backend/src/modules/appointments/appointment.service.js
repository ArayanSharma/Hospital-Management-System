import Appointment from "./appointment.model.js";
import Patient from "../patients/patient.model.js";
import Doctor from "../doctors/doctor.model.js";
import Department from "../departments/department.model.js";
import AppError from "../../core/errors/AppError.js";
import { ErrorCodes } from "../../core/errors/errorCodes.js";
import { createAuditLog } from "../audit-logs/audit-log.service.js";
import { isTimeOverlapping } from "../../utils/timeOverlap.js";
import { createNotification } from "../notifications/notification.service.js";
import { generateSequentialId } from "../../utils/generateId.js";

// Helper: conflict check
const checkDoctorConflict = async (doctorId, appointmentDate, startTime, endTime, excludeId = null) => {
  const query = {
    doctorId,
    appointmentDate,
    status: { $in: ["scheduled"] },
  };

  if (excludeId) {
    query._id = { $ne: excludeId };
  }

  const existingAppointments = await Appointment.find(query);

  const hasConflict = existingAppointments.some((appt) =>
    isTimeOverlapping(startTime, endTime, appt.startTime, appt.endTime)
  );

  return hasConflict;
};

// ---------------- CREATE ----------------
export const createAppointment = async (data, currentUser, requestMeta) => {
  const {
    patientId,
    doctorId,
    departmentId,
    appointmentDate,
    startTime,
    endTime,
    reason,
    notes,
    sendNotification,
  } = data;

  const [patient, doctor] = await Promise.all([
    Patient.findById(patientId),
    Doctor.findById(doctorId),
  ]);

  if (!patient || patient.status === "inactive") {
    throw new AppError("Patient not found", 404, ErrorCodes.NOT_FOUND);
  }
  if (!doctor || doctor.status === "inactive") {
    throw new AppError("Doctor not found or inactive", 404, ErrorCodes.NOT_FOUND);
  }

  if (startTime >= endTime) {
    throw new AppError("End time must be after start time", 400, ErrorCodes.VALIDATION_ERROR);
  }

  const hasConflict = await checkDoctorConflict(doctorId, appointmentDate, startTime, endTime);
  if (hasConflict) {
    throw new AppError("Doctor already has an appointment in this time slot", 409, ErrorCodes.VALIDATION_ERROR);
  }

  const dateStr = new Date(appointmentDate).toISOString().slice(0, 10).replace(/-/g, "");
  const appointmentId = await generateSequentialId(Appointment, `APT-${dateStr}`, "appointmentId");

  const appointment = await Appointment.create({
    appointmentId,
    patientId,
    doctorId,
    departmentId: departmentId || doctor.departmentId,
    appointmentDate,
    startTime,
    endTime,
    reason,
    notes: notes || null,
    sendNotification: sendNotification !== false,
    status: "scheduled",
  });

  await createAuditLog({
    userId: currentUser.id,
    action: "CREATE",
    resource: "appointment",
    resourceId: appointment._id,
    newValue: appointment.toObject(),
    ipAddress: requestMeta.ipAddress,
    userAgent: requestMeta.userAgent,
  });

  if (sendNotification !== false) {
    await createNotification({
      userId: doctor.userId,
      type: "appointment",
      title: "New Appointment Scheduled",
      message: `You have a new appointment on ${new Date(appointmentDate).toLocaleDateString()} at ${startTime}`,
      metadata: { appointmentId: appointment._id },
    });
  }

  return appointment;
};

// ---------------- GET ALL (Dynamic MongoDB Query & Stats) ----------------
export const getAllAppointments = async ({
  page = 1,
  limit = 10,
  doctorId,
  patientId,
  departmentId,
  status,
  tab,
  date,
  search,
}) => {
  const query = {};
  if (doctorId && doctorId !== "all") query.doctorId = doctorId;
  if (patientId && patientId !== "all") query.patientId = patientId;
  if (departmentId && departmentId !== "all") query.departmentId = departmentId;
  if (status && status !== "all") query.status = status;

  const todayStart = new Date();
  todayStart.setHours(0, 0, 0, 0);
  const todayEnd = new Date();
  todayEnd.setHours(23, 59, 59, 999);

  if (date) {
    const startOfDay = new Date(date);
    startOfDay.setHours(0, 0, 0, 0);
    const endOfDay = new Date(date);
    endOfDay.setHours(23, 59, 59, 999);
    query.appointmentDate = { $gte: startOfDay, $lte: endOfDay };
  }

  // Handle Tab Filtering
  if (tab === "today") {
    query.appointmentDate = { $gte: todayStart, $lte: todayEnd };
  } else if (tab === "upcoming") {
    query.status = "scheduled";
    query.appointmentDate = { $gt: todayEnd };
  } else if (tab === "checked_in") {
    query.status = { $in: ["checked_in", "in_consultation"] };
  } else if (tab === "completed") {
    query.status = "completed";
  } else if (tab === "cancelled") {
    query.status = "cancelled";
  } else if (tab === "no-show") {
    query.status = "no-show";
  }

  const safeSearch = search ? search.replace(/[.*+?^${}()|[\]\\]/g, "\\$&") : "";

  const skip = (page - 1) * limit;

  const [appointments, total, todayCount, scheduledCount, checkedInCount, completedCount, cancelledCount, noShowCount] = await Promise.all([
    Appointment.find(query)
      .populate("patientId", "name patientId phone email photoUrl")
      .populate({
        path: "doctorId",
        select: "doctorId specialization photoUrl userId",
        populate: { path: "userId", select: "name" },
      })
      .populate("departmentId", "name code")
      .skip(skip)
      .limit(limit)
      .sort({ appointmentDate: -1, startTime: 1 }),
    Appointment.countDocuments(query),
    Appointment.countDocuments({ appointmentDate: { $gte: todayStart, $lte: todayEnd } }),
    Appointment.countDocuments({ status: "scheduled" }),
    Appointment.countDocuments({ status: { $in: ["checked_in", "in_consultation"] } }),
    Appointment.countDocuments({ status: "completed" }),
    Appointment.countDocuments({ status: "cancelled" }),
    Appointment.countDocuments({ status: "no-show" }),
  ]);

  const filteredAppointments = safeSearch
    ? appointments.filter((appt) =>
        appt.patientId?.name?.toLowerCase().includes(safeSearch.toLowerCase()) ||
        appt.patientId?.patientId?.toLowerCase().includes(safeSearch.toLowerCase()) ||
        appt.doctorId?.userId?.name?.toLowerCase().includes(safeSearch.toLowerCase()) ||
        appt.appointmentId?.toLowerCase().includes(safeSearch.toLowerCase()) ||
        appt.reason?.toLowerCase().includes(safeSearch.toLowerCase())
      )
    : appointments;

  return {
    appointments: filteredAppointments,
    stats: {
      totalAppointments: total,
      todayCount,
      scheduledCount,
      checkedInCount,
      completedCount,
      cancelledCount,
      noShowCount,
    },
    pagination: {
      total,
      page: Number(page),
      limit: Number(limit),
      totalPages: Math.ceil((total || 1) / limit),
    },
  };
};

// ---------------- GET BY ID ----------------
export const getAppointmentById = async (id) => {
  const appointment = await Appointment.findById(id)
    .populate("patientId", "name patientId phone email")
    .populate({
      path: "doctorId",
      select: "doctorId specialization photoUrl userId",
      populate: { path: "userId", select: "name" },
    })
    .populate("departmentId", "name code");

  if (!appointment) {
    throw new AppError("Appointment not found", 404, ErrorCodes.NOT_FOUND);
  }

  return appointment;
};

// ---------------- UPDATE (reschedule) ----------------
export const updateAppointment = async (id, data, currentUser, requestMeta) => {
  const appointment = await Appointment.findById(id);
  if (!appointment) {
    throw new AppError("Appointment not found", 404, ErrorCodes.NOT_FOUND);
  }

  const oldValue = appointment.toObject();
  const { appointmentDate, startTime, endTime, reason, notes, status, sendNotification } = data;

  if (appointmentDate || startTime || endTime) {
    const newDate = appointmentDate || appointment.appointmentDate;
    const newStart = startTime || appointment.startTime;
    const newEnd = endTime || appointment.endTime;

    if (newStart >= newEnd) {
      throw new AppError("End time must be after start time", 400, ErrorCodes.VALIDATION_ERROR);
    }

    const hasConflict = await checkDoctorConflict(
      appointment.doctorId,
      newDate,
      newStart,
      newEnd,
      appointment._id
    );
    if (hasConflict) {
      throw new AppError("Doctor already has an appointment in this time slot", 409, ErrorCodes.VALIDATION_ERROR);
    }

    appointment.appointmentDate = newDate;
    appointment.startTime = newStart;
    appointment.endTime = newEnd;
  }

  if (reason !== undefined) appointment.reason = reason;
  if (notes !== undefined) appointment.notes = notes;
  if (status !== undefined) appointment.status = status;
  if (sendNotification !== undefined) appointment.sendNotification = sendNotification;

  await appointment.save();

  await createAuditLog({
    userId: currentUser.id,
    action: "UPDATE",
    resource: "appointment",
    resourceId: appointment._id,
    oldValue,
    newValue: appointment.toObject(),
    ipAddress: requestMeta.ipAddress,
    userAgent: requestMeta.userAgent,
  });

  return appointment;
};

// ---------------- STATUS CHANGE (complete / cancel / no-show / check-in) ----------------
export const changeAppointmentStatus = async (id, newStatus, cancelledReason, currentUser, requestMeta) => {
  const validStatuses = ["scheduled", "checked_in", "in_consultation", "completed", "cancelled", "no-show"];
  if (!validStatuses.includes(newStatus)) {
    throw new AppError("Invalid status value", 400, ErrorCodes.VALIDATION_ERROR);
  }

  const appointment = await Appointment.findById(id);
  if (!appointment) {
    throw new AppError("Appointment not found", 404, ErrorCodes.NOT_FOUND);
  }

  // Edge Case State Transition Validation
  if (appointment.status === "cancelled" && newStatus !== "scheduled" && newStatus !== "cancelled") {
    throw new AppError("Cancelled appointments cannot be updated. Please reschedule the appointment slot.", 400, ErrorCodes.VALIDATION_ERROR);
  }
  if (appointment.status === "completed" && newStatus !== "completed") {
    throw new AppError("Completed appointments are finalized and cannot be modified.", 400, ErrorCodes.VALIDATION_ERROR);
  }

  const oldValue = appointment.toObject();

  appointment.status = newStatus;
  if (newStatus === "cancelled") {
    appointment.cancelledReason = (cancelledReason && cancelledReason.trim()) || "Patient requested cancellation";
  }

  await appointment.save();

  // Audit Log & Notification (Safe Execution)
  try {
    await createAuditLog({
      userId: currentUser.id,
      action: "UPDATE",
      resource: "appointment",
      resourceId: appointment._id,
      oldValue,
      newValue: appointment.toObject(),
      ipAddress: requestMeta.ipAddress,
      userAgent: requestMeta.userAgent,
    });
  } catch (auditErr) {
    console.error("Audit log error on appointment status change:", auditErr);
  }

  if (newStatus === "cancelled" || newStatus === "checked_in") {
    try {
      const doctor = await Doctor.findById(appointment.doctorId);
      if (doctor && doctor.userId) {
        const notifTitle = newStatus === "cancelled" ? "Appointment Cancelled" : "Patient Checked-In";
        const notifMsg = newStatus === "cancelled"
          ? `Appointment on ${new Date(appointment.appointmentDate).toLocaleDateString()} was cancelled. Reason: ${appointment.cancelledReason}`
          : `Patient has checked in for OPD appointment at ${appointment.startTime}.`;

        await createNotification({
          userId: doctor.userId,
          type: "appointment",
          title: notifTitle,
          message: notifMsg,
          metadata: { appointmentId: appointment._id },
        });
      }
    } catch (notifErr) {
      console.error("Notification error on appointment status change:", notifErr);
    }
  }

  return appointment;
};