import OPDVisit from "./opdVisit.model.js";
import Patient from "../patients/patient.model.js";
import Doctor from "../doctors/doctor.model.js";
import Appointment from "../appointments/appointment.model.js";
import AppError from "../../core/errors/AppError.js";
import { ErrorCodes } from "../../core/errors/errorCodes.js";
import { createAuditLog } from "../audit-logs/audit-log.service.js";

// ---------------- CREATE ----------------
export const createOPDVisit = async (data, currentUser, requestMeta) => {
  const { patientId, doctorId, appointmentId, symptoms, vitals } = data;

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

  // Agar appointmentId diya hai, to valid hona chahiye aur "scheduled" status mein
  if (appointmentId) {
    const appointment = await Appointment.findById(appointmentId);
    if (!appointment) {
      throw new AppError("Appointment not found", 404, ErrorCodes.NOT_FOUND);
    }
    if (appointment.status !== "scheduled") {
      throw new AppError(
        "Appointment is not in scheduled state",
        400,
        ErrorCodes.VALIDATION_ERROR
      );
    }
  }

  const opdVisit = await OPDVisit.create({
    patientId,
    doctorId,
    appointmentId: appointmentId || null,
    symptoms,
    vitals,
    status: "in-progress",
  });

  // Agar appointment se link hai, to appointment ko "completed" mark kar do
  if (appointmentId) {
    await Appointment.findByIdAndUpdate(appointmentId, { status: "completed" });
  }

  await createAuditLog({
    userId: currentUser.id,
    action: "CREATE",
    resource: "opd_visit",
    resourceId: opdVisit._id,
    newValue: opdVisit.toObject(),
    ipAddress: requestMeta.ipAddress,
    userAgent: requestMeta.userAgent,
  });

  return opdVisit;
};

// ---------------- GET ALL ----------------
export const getAllOPDVisits = async ({ page = 1, limit = 10, patientId, doctorId, status, date }) => {
  const query = {};
  if (patientId) query.patientId = patientId;
  if (doctorId) query.doctorId = doctorId;
  if (status) query.status = status;
  if (date) {
    const startOfDay = new Date(date);
    startOfDay.setHours(0, 0, 0, 0);
    const endOfDay = new Date(date);
    endOfDay.setHours(23, 59, 59, 999);
    query.visitDate = { $gte: startOfDay, $lte: endOfDay };
  }

  const skip = (page - 1) * limit;

  const [visits, total] = await Promise.all([
    OPDVisit.find(query)
      .populate("patientId", "name patientId phone")
      .populate({
        path: "doctorId",
        select: "doctorId specialization",
        populate: { path: "userId", select: "name" },
      })
      .skip(skip)
      .limit(limit)
      .sort({ visitDate: -1 }),
    OPDVisit.countDocuments(query),
  ]);

  return {
    visits,
    pagination: { total, page: Number(page), limit: Number(limit), totalPages: Math.ceil(total / limit) },
  };
};

// ---------------- GET BY ID ----------------
export const getOPDVisitById = async (id) => {
  const visit = await OPDVisit.findById(id)
    .populate("patientId", "name patientId phone dateOfBirth gender")
    .populate({
      path: "doctorId",
      select: "doctorId specialization",
      populate: { path: "userId", select: "name" },
    });

  if (!visit) {
    throw new AppError("OPD visit not found", 404, ErrorCodes.NOT_FOUND);
  }

  return visit;
};

// ---------------- UPDATE (diagnosis add karna, complete karna) ----------------
export const updateOPDVisit = async (id, data, currentUser, requestMeta) => {
  const visit = await OPDVisit.findById(id);
  if (!visit) {
    throw new AppError("OPD visit not found", 404, ErrorCodes.NOT_FOUND);
  }

  if (visit.status === "completed") {
    throw new AppError(
      "Cannot update a completed OPD visit",
      400,
      ErrorCodes.VALIDATION_ERROR
    );
  }

  const oldValue = visit.toObject();
  const { symptoms, diagnosis, notes, vitals, status } = data;

  if (symptoms !== undefined) visit.symptoms = symptoms;
  if (diagnosis !== undefined) visit.diagnosis = diagnosis;
  if (notes !== undefined) visit.notes = notes;
  if (vitals !== undefined) visit.vitals = { ...visit.vitals.toObject(), ...vitals };
  if (status !== undefined) visit.status = status;

  await visit.save();

  await createAuditLog({
    userId: currentUser.id,
    action: "UPDATE",
    resource: "opd_visit",
    resourceId: visit._id,
    oldValue,
    newValue: visit.toObject(),
    ipAddress: requestMeta.ipAddress,
    userAgent: requestMeta.userAgent,
  });

  return visit;
};