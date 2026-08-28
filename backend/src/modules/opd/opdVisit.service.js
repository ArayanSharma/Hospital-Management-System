import OPDVisit from "./opdVisit.model.js";
import Patient from "../patients/patient.model.js";
import Doctor from "../doctors/doctor.model.js";
import Appointment from "../appointments/appointment.model.js";
import AppError from "../../core/errors/AppError.js";
import { ErrorCodes } from "../../core/errors/errorCodes.js";
import { createAuditLog } from "../audit-logs/audit-log.service.js";
import { generateSequentialId } from "../../utils/generateId.js";

// ---------------- CREATE ----------------
export const createOPDVisit = async (data, currentUser, requestMeta) => {
  const { patientId, doctorId, appointmentId, symptoms, notes, vitals, visitType, visitDate } = data;

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

  if (appointmentId) {
    const appointment = await Appointment.findById(appointmentId);
    if (!appointment) {
      throw new AppError("Appointment not found", 404, ErrorCodes.NOT_FOUND);
    }
  }

  const dateStr = new Date().toISOString().slice(0, 10).replace(/-/g, "");
  const visitId = await generateSequentialId(OPDVisit, `VIS-${dateStr}`, "visitId");

  const resolvedVisitType = visitType || (appointmentId ? "appointment" : "walk-in");
  const initialStatus = resolvedVisitType === "walk-in" ? "walk-in" : "in-progress";

  const opdVisit = await OPDVisit.create({
    visitId,
    patientId,
    doctorId,
    appointmentId: appointmentId || null,
    visitType: resolvedVisitType,
    symptoms: symptoms || "Routine OPD Consultation",
    notes: notes || "",
    vitals: vitals || {
      temperature: 98.6,
      bloodPressure: "120/80",
      pulse: 78,
      weight: 65.2,
      height: 165,
      spO2: 98,
    },
    visitDate: visitDate ? new Date(visitDate) : new Date(),
    status: initialStatus,
  });

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

// ---------------- GET ALL (Dynamic MongoDB Stats & Tab Filtering) ----------------
export const getAllOPDVisits = async ({
  page = 1,
  limit = 10,
  patientId,
  doctorId,
  status,
  tab,
  date,
  search,
}) => {
  const query = {};
  if (patientId && patientId !== "all") query.patientId = patientId;
  if (doctorId && doctorId !== "all") query.doctorId = doctorId;
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
    query.visitDate = { $gte: startOfDay, $lte: endOfDay };
  }

  // Tab filters
  if (tab === "in-progress") {
    query.status = "in-progress";
  } else if (tab === "completed") {
    query.status = "completed";
  } else if (tab === "walk-in") {
    query.$or = [{ status: "walk-in" }, { visitType: "walk-in" }];
  }

  const safeSearch = search ? search.replace(/[.*+?^${}()|[\]\\]/g, "\\$&") : "";
  const skip = (page - 1) * limit;

  const [visits, total, todayCount, inProgressCount, completedCount, walkInCount] = await Promise.all([
    OPDVisit.find(query)
      .populate("patientId", "name patientId phone email bloodGroup gender dateOfBirth photoUrl")
      .populate({
        path: "doctorId",
        select: "doctorId specialization photoUrl userId departmentId",
        populate: [
          { path: "userId", select: "name" },
          { path: "departmentId", select: "name code" },
        ],
      })
      .populate("appointmentId", "appointmentId appointmentDate startTime")
      .skip(skip)
      .limit(limit)
      .sort({ visitDate: -1 }),
    OPDVisit.countDocuments(query),
    OPDVisit.countDocuments({ visitDate: { $gte: todayStart, $lte: todayEnd } }),
    OPDVisit.countDocuments({ status: "in-progress" }),
    OPDVisit.countDocuments({ status: "completed" }),
    OPDVisit.countDocuments({ $or: [{ status: "walk-in" }, { visitType: "walk-in" }] }),
  ]);

  const filteredVisits = safeSearch
    ? visits.filter((v) =>
        v.patientId?.name?.toLowerCase().includes(safeSearch.toLowerCase()) ||
        v.patientId?.patientId?.toLowerCase().includes(safeSearch.toLowerCase()) ||
        v.doctorId?.userId?.name?.toLowerCase().includes(safeSearch.toLowerCase()) ||
        v.visitId?.toLowerCase().includes(safeSearch.toLowerCase()) ||
        v.symptoms?.toLowerCase().includes(safeSearch.toLowerCase()) ||
        v.diagnosis?.toLowerCase().includes(safeSearch.toLowerCase())
      )
    : visits;

  return {
    visits: filteredVisits,
    stats: {
      totalVisits: total,
      todayCount,
      inProgressCount,
      completedCount,
      walkInCount,
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
export const getOPDVisitById = async (id) => {
  const visit = await OPDVisit.findById(id)
    .populate("patientId", "name patientId phone email bloodGroup gender dateOfBirth photoUrl")
    .populate({
      path: "doctorId",
      select: "doctorId specialization photoUrl userId departmentId",
      populate: [
        { path: "userId", select: "name" },
        { path: "departmentId", select: "name code" },
      ],
    })
    .populate("appointmentId", "appointmentId appointmentDate startTime");

  if (!visit) {
    throw new AppError("OPD visit not found", 404, ErrorCodes.NOT_FOUND);
  }

  return visit;
};

// ---------------- UPDATE ----------------
export const updateOPDVisit = async (id, data, currentUser, requestMeta) => {
  const visit = await OPDVisit.findById(id);
  if (!visit) {
    throw new AppError("OPD visit not found", 404, ErrorCodes.NOT_FOUND);
  }

  const oldValue = visit.toObject();
  const { symptoms, diagnosis, notes, vitals, clinicalNotes, prescription, status } = data;

  if (symptoms !== undefined) visit.symptoms = symptoms;
  if (diagnosis !== undefined) visit.diagnosis = diagnosis;
  if (notes !== undefined) visit.notes = notes;
  if (vitals !== undefined) visit.vitals = { ...visit.vitals, ...vitals };
  if (clinicalNotes !== undefined) visit.clinicalNotes = { ...visit.clinicalNotes, ...clinicalNotes };
  if (prescription !== undefined) visit.prescription = prescription;
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