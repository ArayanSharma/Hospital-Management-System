import Appointment from "./appointment.model.js";
import Patient from "../patients/patient.model.js";
import Doctor from "../doctors/doctor.model.js";
import Department from "../departments/department.model.js";
import AppError from "../../core/errors/AppError.js";
import { ErrorCodes } from "../../core/errors/errorCodes.js";
import { createAuditLog } from "../audit-logs/audit-log.service.js";
import { isTimeOverlapping } from "../../utils/timeOverlap.js";
import { notifyAppointmentEvent } from "../../utils/notificationDispatcher.js";
import { dispatchAsyncEmail } from "../../utils/email/emailDispatcher.js";

// Helper: conflict check
const checkDoctorConflict = async (doctorId, appointmentDate, startTime, endTime, excludeId = null) => {
  const query = {
    doctorId,
    appointmentDate,
    status: { $in: ["scheduled", "checked_in", "in_consultation"] },
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

// ---------------- CREATE WITH REDIS ATOMIC LOCK & EDGE CASE GUARDS ----------------
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

  // 1. Time Format Validation (HH:mm)
  const timeRegex = /^([0-1][0-9]|2[0-3]):[0-5][0-9]$/;
  if (!timeRegex.test(startTime) || !timeRegex.test(endTime)) {
    throw new AppError("Invalid time format. Time must be in HH:mm 24-hour format (e.g. 09:30, 14:00)", 400, ErrorCodes.VALIDATION_ERROR);
  }

  if (startTime >= endTime) {
    throw new AppError("End time must be strictly after start time", 400, ErrorCodes.VALIDATION_ERROR);
  }

  // 2. Past Date & Past Time Edge Case Guard
  const apptDateObj = new Date(appointmentDate);
  if (isNaN(apptDateObj.getTime())) {
    throw new AppError("Invalid appointment date format", 400, ErrorCodes.VALIDATION_ERROR);
  }

  const now = new Date();
  const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const apptDayStart = new Date(apptDateObj.getFullYear(), apptDateObj.getMonth(), apptDateObj.getDate());

  if (apptDayStart < todayStart) {
    throw new AppError("Cannot schedule an appointment for a past date", 400, ErrorCodes.VALIDATION_ERROR);
  }

  if (apptDayStart.getTime() === todayStart.getTime()) {
    const currentHHMM = `${String(now.getHours()).padStart(2, "0")}:${String(now.getMinutes()).padStart(2, "0")}`;
    if (startTime < currentHHMM) {
      throw new AppError("Cannot schedule an appointment for a past time slot today", 400, ErrorCodes.VALIDATION_ERROR);
    }
  }

  const formattedDate = apptDateObj.toISOString().slice(0, 10);
  const lockKey = `hms:lock:appt:${doctorId}:${formattedDate}:${startTime}`;

  // 3. Acquire True Atomic Redis Mutex Lock (SET NX EX)
  const hasLock = await acquireLock(lockKey, 10);
  if (!hasLock) {
    throw new AppError("This slot is currently being processed for booking by another user. Please try again in a few seconds.", 409, ErrorCodes.VALIDATION_ERROR);
  }

  try {
    const [patient, doctor] = await Promise.all([
      Patient.findById(patientId),
      Doctor.findById(doctorId).populate("userId", "name email"),
    ]);

    if (!patient || patient.status === "inactive") {
      throw new AppError("Patient not found or inactive", 404, ErrorCodes.NOT_FOUND);
    }
    if (!doctor || doctor.status === "inactive") {
      throw new AppError("Doctor not found or inactive", 404, ErrorCodes.NOT_FOUND);
    }

    const hasConflict = await checkDoctorConflict(doctorId, appointmentDate, startTime, endTime);
    if (hasConflict) {
      throw new AppError("Doctor already has a scheduled appointment in this time slot", 409, ErrorCodes.VALIDATION_ERROR);
    }

    const dateStr = formattedDate.replace(/-/g, "");
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

    // Invalidate cached stats
    await delCache("hms:stats:appointments");

    await createAuditLog({
      userId: currentUser.id,
      action: "CREATE",
      resource: "appointment",
      resourceId: appointment._id,
      newValue: appointment.toObject(),
      ipAddress: requestMeta.ipAddress,
      userAgent: requestMeta.userAgent,
    });

    // Dispatch dual confirmation emails (Patient & Doctor) with .ics calendar invite
    const recipients = [];
    if (patient?.email) recipients.push(patient.email);
    if (doctor?.userId?.email) recipients.push(doctor.userId.email);

    if (recipients.length > 0) {
      dispatchAsyncEmail({
        to: recipients,
        type: "appointment_booked",
        data: {
          appointmentId: appointment.appointmentId,
          patientName: patient.name,
          doctorName: doctor?.userId?.name || doctor?.name || "Specialist",
          rawDateStr: formattedDate,
          startTime,
          endTime,
          date: new Date(appointmentDate).toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" }),
          timeSlot: `${startTime} - ${endTime}`,
          department: doctor?.department || "General OPD",
        },
      });
    }

    return appointment;
  } finally {
    // Release Atomic Redis Lock
    await releaseLock(lockKey);
  }
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

  await delCache("hms:stats:appointments");

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

  // Dispatch Appointment Rescheduled Email if date/time slot was updated
  if (appointmentDate || startTime || endTime) {
    try {
      const [patient, doctor] = await Promise.all([
        Patient.findById(appointment.patientId),
        Doctor.findById(appointment.doctorId).populate("userId", "name email"),
      ]);

      const recipients = [];
      if (patient?.email) recipients.push(patient.email);
      if (doctor?.userId?.email) recipients.push(doctor.userId.email);

      if (recipients.length > 0) {
        dispatchAsyncEmail({
          to: recipients,
          type: "appointment_rescheduled",
          data: {
            appointmentId: appointment.appointmentId,
            patientName: patient?.name || "Patient",
            doctorName: doctor?.userId?.name || doctor?.name || "Specialist",
            oldDate: oldValue.appointmentDate ? new Date(oldValue.appointmentDate).toLocaleDateString("en-GB") : "",
            newDate: new Date(appointment.appointmentDate).toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" }),
            rawDateStr: new Date(appointment.appointmentDate).toISOString().slice(0, 10),
            newTimeSlot: `${appointment.startTime} - ${appointment.endTime}`,
            startTime: appointment.startTime,
            endTime: appointment.endTime,
            reason: appointment.reason || "Slot Rescheduled",
          },
        });
      }
    } catch (emailErr) {
      console.error("Failed to dispatch rescheduled email:", emailErr);
    }
  }

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

  await delCache("hms:stats:appointments");


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

  if (newStatus === "cancelled") {
    try {
      const [patient, doctor] = await Promise.all([
        Patient.findById(appointment.patientId),
        Doctor.findById(appointment.doctorId).populate("userId", "name email"),
      ]);

      const recipients = [];
      if (patient?.email) recipients.push(patient.email);
      if (doctor?.userId?.email) recipients.push(doctor.userId.email);

      if (recipients.length > 0) {
        dispatchAsyncEmail({
          to: recipients,
          type: "appointment_cancel",
          data: {
            patientName: patient?.name || "Patient",
            doctorName: doctor?.userId?.name || doctor?.name || "Specialist",
            date: new Date(appointment.appointmentDate).toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" }),
            reason: appointment.cancelledReason,
          },
        });
      }
    } catch (cancelEmailErr) {
      console.error("Failed to send cancellation email:", cancelEmailErr);
    }
  }

  return appointment;
};