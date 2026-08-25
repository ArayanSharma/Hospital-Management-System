import Appointment from "./appointment.model.js";
import Patient from "../patients/patient.model.js";
import Doctor from "../doctors/doctor.model.js";
import Department from "../departments/department.model.js";
import AppError from "../../core/errors/AppError.js";
import { ErrorCodes } from "../../core/errors/errorCodes.js";
import { createAuditLog } from "../audit-logs/audit-log.service.js";
import { isTimeOverlapping } from "../../utils/timeOverlap.js";
import { createNotification } from "../notifications/notification.service.js";

// ---------------- Helper: conflict check ----------------
const checkDoctorConflict = async (doctorId, appointmentDate, startTime, endTime, excludeId = null) => {
  const query = {
    doctorId,
    appointmentDate,
    status: { $in: ["scheduled"] }, // sirf active appointments check honi chahiye, cancelled wale nahi
  };

  if (excludeId) {
    query._id = { $ne: excludeId }; // update ke waqt khud se conflict na ho
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
    appointmentDate,
    startTime,
    endTime,
    reason,
  } = data;

  // 1. Validate references exist
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

  // 2. Basic time validity
  if (startTime >= endTime) {
    throw new AppError(
      "End time must be after start time",
      400,
      ErrorCodes.VALIDATION_ERROR
    );
  }

  // 3. Conflict check — doctor ki schedule mein overlap to nahi
  const hasConflict = await checkDoctorConflict(
    doctorId,
    appointmentDate,
    startTime,
    endTime
  );
  if (hasConflict) {
    throw new AppError(
      "Doctor already has an appointment in this time slot",
      409,
      ErrorCodes.VALIDATION_ERROR
    );
  }

  const appointment = await Appointment.create({
    patientId,
    doctorId,
    departmentId: doctor.departmentId, // doctor se automatically le liya, alag se nahi maangna
    appointmentDate,
    startTime,
    endTime,
    reason,
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

  // ---------------- NOTIFICATION: Doctor ko inform karo ----------------
  await createNotification({
    userId: doctor.userId,
    type: "appointment",
    title: "New Appointment Scheduled",
    message: `You have a new appointment on ${new Date(appointmentDate).toLocaleDateString()} at ${startTime}`,
    metadata: { appointmentId: appointment._id },
  });

  return appointment;
};

// ---------------- GET ALL ----------------
export const getAllAppointments = async ({
  page = 1,
  limit = 10,
  doctorId,
  patientId,
  status,
  date,
}) => {
  const query = {};
  if (doctorId) query.doctorId = doctorId;
  if (patientId) query.patientId = patientId;
  if (status) query.status = status;
  if (date) {
    const startOfDay = new Date(date);
    startOfDay.setHours(0, 0, 0, 0);
    const endOfDay = new Date(date);
    endOfDay.setHours(23, 59, 59, 999);
    query.appointmentDate = { $gte: startOfDay, $lte: endOfDay };
  }

  const skip = (page - 1) * limit;

  const [appointments, total] = await Promise.all([
    Appointment.find(query)
      .populate("patientId", "name patientId phone")
      .populate({
        path: "doctorId",
        select: "doctorId specialization",
        populate: { path: "userId", select: "name" },
      })
      .populate("departmentId", "name")
      .skip(skip)
      .limit(limit)
      .sort({ appointmentDate: -1, startTime: 1 }),
    Appointment.countDocuments(query),
  ]);

  return {
    appointments,
    pagination: {
      total,
      page: Number(page),
      limit: Number(limit),
      totalPages: Math.ceil(total / limit),
    },
  };
};

// ---------------- GET BY ID ----------------
export const getAppointmentById = async (id) => {
  const appointment = await Appointment.findById(id)
    .populate("patientId", "name patientId phone")
    .populate({
      path: "doctorId",
      select: "doctorId specialization",
      populate: { path: "userId", select: "name" },
    })
    .populate("departmentId", "name");

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

  if (appointment.status !== "scheduled") {
    throw new AppError(
      "Only scheduled appointments can be rescheduled",
      400,
      ErrorCodes.VALIDATION_ERROR
    );
  }

  const oldValue = appointment.toObject();
  const { appointmentDate, startTime, endTime, reason, notes } = data;

  // Agar time/date change ho raha hai, conflict dobara check karo
  if (appointmentDate || startTime || endTime) {
    const newDate = appointmentDate || appointment.appointmentDate;
    const newStart = startTime || appointment.startTime;
    const newEnd = endTime || appointment.endTime;

    if (newStart >= newEnd) {
      throw new AppError(
        "End time must be after start time",
        400,
        ErrorCodes.VALIDATION_ERROR
      );
    }

    const hasConflict = await checkDoctorConflict(
      appointment.doctorId,
      newDate,
      newStart,
      newEnd,
      appointment._id // khud ko exclude karo check se
    );
    if (hasConflict) {
      throw new AppError(
        "Doctor already has an appointment in this time slot",
        409,
        ErrorCodes.VALIDATION_ERROR
      );
    }

    appointment.appointmentDate = newDate;
    appointment.startTime = newStart;
    appointment.endTime = newEnd;
  }

  if (reason !== undefined) appointment.reason = reason;
  if (notes !== undefined) appointment.notes = notes;

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

// ---------------- STATUS CHANGE (complete / cancel / no-show) ----------------
export const changeAppointmentStatus = async (id, newStatus, cancelledReason, currentUser, requestMeta) => {
  const validStatuses = ["completed", "cancelled", "no-show"];
  if (!validStatuses.includes(newStatus)) {
    throw new AppError("Invalid status value", 400, ErrorCodes.VALIDATION_ERROR);
  }

  const appointment = await Appointment.findById(id);
  if (!appointment) {
    throw new AppError("Appointment not found", 404, ErrorCodes.NOT_FOUND);
  }

  if (appointment.status !== "scheduled") {
    throw new AppError(
      "Only scheduled appointments can change status",
      400,
      ErrorCodes.VALIDATION_ERROR
    );
  }

  const oldValue = appointment.toObject();

  appointment.status = newStatus;
  if (newStatus === "cancelled") {
    appointment.cancelledReason = cancelledReason || "Not specified";
  }

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

  // ---------------- NOTIFICATION: agar cancel hui to doctor ko batao ----------------
  if (newStatus === "cancelled") {
    const doctor = await Doctor.findById(appointment.doctorId);
    if (doctor) {
      await createNotification({
        userId: doctor.userId,
        type: "appointment",
        title: "Appointment Cancelled",
        message: `Appointment on ${new Date(appointment.appointmentDate).toLocaleDateString()} was cancelled. Reason: ${cancelledReason || "Not specified"}`,
        metadata: { appointmentId: appointment._id },
      });
    }
  }

  return appointment;
};