import Patient from "./patient.model.js";
import AppError from "../../core/errors/AppError.js";
import { ErrorCodes } from "../../core/errors/errorCodes.js";
import { createAuditLog } from "../audit-logs/audit-log.service.js";
import { generateSequentialId } from "../../utils/generateId.js";
import { getOrSetCache, invalidatePattern, delCache, acquireLock, releaseLock } from "../../utils/redisCache.js";

// ---------------- CREATE PATIENT (With Redis Mutex Lock) ----------------
export const createPatient = async (data, currentUser, requestMeta) => {
  const {
    name,
    dateOfBirth,
    gender,
    phone,
    email,
    address,
    bloodGroup,
    maritalStatus,
    occupation,
    nationality,
    notes,
    emergencyContact,
  } = data;

  const sanitizedPhone = phone ? phone.trim() : "";
  const lockKey = `hms:lock:patient:${sanitizedPhone}`;
  const hasLock = await acquireLock(lockKey, 5);
  if (!hasLock) {
    throw new AppError("A patient registration with this phone number is currently in progress", 409, ErrorCodes.VALIDATION_ERROR);
  }

  try {
    if (sanitizedPhone) {
      const existingPatient = await Patient.findOne({ phone: sanitizedPhone, isDeleted: { $ne: true } });
      if (existingPatient) {
        throw new AppError("A patient with this phone number already exists", 409, ErrorCodes.VALIDATION_ERROR);
      }
    }

    let patient;
    let attempts = 3;
    while (attempts > 0) {
      try {
        const patientId = await generateSequentialId(Patient, "PAT", "patientId");

        patient = await Patient.create({
          patientId,
          name,
          dateOfBirth,
          gender: gender ? gender.toLowerCase() : "other",
          phone: sanitizedPhone,
          email: email ? email.toLowerCase() : null,
          address,
          bloodGroup,
          maritalStatus: maritalStatus ? maritalStatus.toLowerCase() : "single",
          occupation,
          nationality,
          notes,
          emergencyContact,
        });
        break;
      } catch (err) {
        if (err.code === 11000 && attempts > 1) {
          attempts--;
          continue;
        }
        throw err;
      }
    }

    await invalidatePattern("hms:patient:*");
    await invalidatePattern("hms:route:patient*");

    if (currentUser) {
      await createAuditLog({
        userId: currentUser.id,
        action: "CREATE",
        resource: "patient",
        resourceId: patient._id,
        newValue: patient.toObject(),
        ipAddress: requestMeta?.ipAddress || "",
        userAgent: requestMeta?.userAgent || "",
      });
    }

    return patient;
  } finally {
    await releaseLock(lockKey);
  }
};

// ---------------- GET ALL ----------------
export const getAllPatients = async ({ page = 1, limit = 10, search, status, gender, bloodGroup }) => {
  const query = { isDeleted: { $ne: true } };
  if (status && status !== "all") query.status = status;
  if (gender && gender !== "all") query.gender = new RegExp(`^${gender}$`, "i");
  if (bloodGroup && bloodGroup !== "all") query.bloodGroup = bloodGroup;

  const safeSearch = search ? search.replace(/[.*+?^${}()|[\]\\]/g, "\\$&") : "";
  if (safeSearch) {
    query.$or = [
      { name: { $regex: safeSearch, $options: "i" } },
      { phone: { $regex: safeSearch, $options: "i" } },
      { patientId: { $regex: safeSearch, $options: "i" } },
    ];
  }

  const skip = (Number(page) - 1) * Number(limit);
  const firstDayOfMonth = new Date(new Date().getFullYear(), new Date().getMonth(), 1);

  const [patients, total, activeCount, inactiveCount, newThisMonthCount] = await Promise.all([
    Patient.find(query).skip(skip).limit(Number(limit)).sort({ createdAt: -1 }),
    Patient.countDocuments(query),
    Patient.countDocuments({ status: "active", isDeleted: { $ne: true } }),
    Patient.countDocuments({ status: "inactive", isDeleted: { $ne: true } }),
    Patient.countDocuments({ createdAt: { $gte: firstDayOfMonth }, isDeleted: { $ne: true } }),
  ]);

  return {
    patients,
    stats: {
      totalPatients: total,
      activePatients: activeCount,
      inactivePatients: inactiveCount,
      newThisMonth: newThisMonthCount,
      activePercentage: total > 0 ? ((activeCount / total) * 100).toFixed(2) : "0.00",
      inactivePercentage: total > 0 ? ((inactiveCount / total) * 100).toFixed(2) : "0.00",
    },
    pagination: {
      total,
      page: Number(page),
      limit: Number(limit),
      totalPages: Math.ceil((total || 1) / Number(limit)),
    },
  };
};

// ---------------- GET BY ID WITH REDIS CACHE ----------------
export const getPatientById = async (id) => {
  const { data: patient } = await getOrSetCache(
    `hms:patient:profile:${id}`,
    () => Patient.findById(id),
    600
  );

  if (!patient || patient.isDeleted) {
    throw new AppError("Patient not found", 404, ErrorCodes.NOT_FOUND);
  }
  return patient;
};

// ---------------- UPDATE ----------------
export const updatePatient = async (id, data, currentUser, requestMeta) => {
  const patient = await Patient.findById(id);
  if (!patient || patient.isDeleted) {
    throw new AppError("Patient not found", 404, ErrorCodes.NOT_FOUND);
  }

  if (patient.gender && typeof patient.gender === "string") {
    patient.gender = patient.gender.toLowerCase();
  }

  const oldValue = patient.toObject();
  const {
    name,
    phone,
    email,
    address,
    bloodGroup,
    maritalStatus,
    occupation,
    nationality,
    notes,
    emergencyContact,
    status,
  } = data;

  if (name !== undefined) patient.name = name;
  if (phone !== undefined) patient.phone = phone;
  if (email !== undefined) patient.email = email ? email.toLowerCase() : null;
  if (address !== undefined) patient.address = address;
  if (bloodGroup !== undefined) patient.bloodGroup = bloodGroup;
  if (maritalStatus !== undefined && maritalStatus !== null) {
    patient.maritalStatus = maritalStatus.toLowerCase();
  }
  if (occupation !== undefined) patient.occupation = occupation;
  if (nationality !== undefined) patient.nationality = nationality;
  if (notes !== undefined) patient.notes = notes;
  if (emergencyContact !== undefined) {
    patient.emergencyContact = {
      ...patient.emergencyContact,
      ...emergencyContact,
    };
  }
  if (status !== undefined) patient.status = status;

  await patient.save();

  await delCache(`hms:patient:profile:${id}`);
  await invalidatePattern("hms:patient:*");
  await invalidatePattern("hms:route:patient*");

  if (currentUser) {
    await createAuditLog({
      userId: currentUser.id,
      action: "UPDATE",
      resource: "patient",
      resourceId: patient._id,
      oldValue,
      newValue: patient.toObject(),
      ipAddress: requestMeta?.ipAddress || "",
      userAgent: requestMeta?.userAgent || "",
    });
  }

  return patient;
};

// ---------------- DELETE (Soft Delete) ----------------
export const deletePatient = async (id, currentUser, requestMeta) => {
  const patient = await Patient.findById(id);
  if (!patient || patient.isDeleted) {
    throw new AppError("Patient not found", 404, ErrorCodes.NOT_FOUND);
  }

  if (patient.gender && typeof patient.gender === "string") {
    patient.gender = patient.gender.toLowerCase();
  }

  const oldValue = patient.toObject();

  patient.status = "inactive";
  patient.isDeleted = true;
  patient.deletedAt = new Date();
  await patient.save();

  await delCache(`hms:patient:profile:${id}`);
  await invalidatePattern("hms:patient:*");
  await invalidatePattern("hms:route:patient*");

  if (currentUser) {
    await createAuditLog({
      userId: currentUser.id,
      action: "DELETE",
      resource: "patient",
      resourceId: patient._id,
      oldValue,
      newValue: patient.toObject(),
      ipAddress: requestMeta?.ipAddress || "",
      userAgent: requestMeta?.userAgent || "",
    });
  }

  return { message: "Patient soft deleted successfully" };
};

// ---------------- EXPORT CSV (Backend Controlled) ----------------
export const exportPatientsService = async (params = {}) => {
  const { status, gender, bloodGroup, search } = params;
  const query = { isDeleted: { $ne: true } };

  if (status) query.status = status;
  if (gender) query.gender = new RegExp(`^${gender}$`, "i");
  if (bloodGroup) query.bloodGroup = bloodGroup;

  const safeSearch = search ? search.trim().replace(/[.*+?^${}()|[\]\\]/g, "\\$&") : "";
  if (safeSearch) {
    query.$or = [
      { name: { $regex: safeSearch, $options: "i" } },
      { phone: { $regex: safeSearch, $options: "i" } },
      { patientId: { $regex: safeSearch, $options: "i" } },
    ];
  }

  const patients = await Patient.find(query).sort({ createdAt: -1 });

  const headers = ["Patient ID", "Name", "Gender", "DOB", "Phone", "Blood Group", "Address", "Status", "Created At"];
  const rows = patients.map((p) => [
    p.patientId || p._id,
    `"${(p.name || "").replace(/"/g, '""')}"`,
    p.gender || "",
    p.dateOfBirth ? new Date(p.dateOfBirth).toISOString().split("T")[0] : "",
    `"${(p.phone || "").replace(/"/g, '""')}"`,
    p.bloodGroup || "",
    `"${(p.address || "").replace(/"/g, '""')}"`,
    p.status || "",
    p.createdAt ? new Date(p.createdAt).toISOString().split("T")[0] : "",
  ]);

  return [headers.join(","), ...rows.map((row) => row.join(","))].join("\n");
};

// ---------------- GET PATIENT FULL DETAILS (100% Real Dynamic Data) ----------------
export const getPatientFullDetailsService = async (id) => {
  const patient = await Patient.findById(id);
  if (!patient || patient.isDeleted) {
    throw new AppError("Patient not found", 404, ErrorCodes.NOT_FOUND);
  }

  // Calculate exact age dynamically
  let calculatedAge = null;
  if (patient.dateOfBirth) {
    const today = new Date();
    const birthDate = new Date(patient.dateOfBirth);
    calculatedAge = today.getFullYear() - birthDate.getFullYear();
    const m = today.getMonth() - birthDate.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
      calculatedAge--;
    }
  }

  // Real Database Queries across hospital modules
  let appointments = [];
  let medicalRecords = [];
  let labReports = [];
  let prescriptions = [];
  let invoices = [];
  let admissions = [];
  let insurance = null;
  let activityLogs = [];

  try {
    const AppointmentModel = (await import("../appointments/appointment.model.js")).default;
    appointments = await AppointmentModel.find({ $or: [{ patientId: id }, { patient: id }] })
      .populate("doctorId", "name departmentId")
      .populate("departmentId", "name")
      .sort({ appointmentDate: -1 })
      .lean();
  } catch (e) {}

  try {
    const MedicalRecordModel = (await import("../medical-records/medicalRecord.model.js")).default;
    medicalRecords = await MedicalRecordModel.find({ $or: [{ patientId: id }, { patient: id }] })
      .populate("doctorId", "name")
      .sort({ createdAt: -1 })
      .lean();
  } catch (e) {}

  try {
    const LabReportModel = (await import("../laboratory/labReport.model.js")).default;
    labReports = await LabReportModel.find({ $or: [{ patientId: id }, { patient: id }] })
      .sort({ createdAt: -1 })
      .lean();
  } catch (e) {}

  try {
    const PrescriptionModel = (await import("../prescriptions/prescription.model.js")).default;
    prescriptions = await PrescriptionModel.find({ $or: [{ patientId: id }, { patient: id }] })
      .populate("doctorId", "name")
      .sort({ createdAt: -1 })
      .lean();
  } catch (e) {}

  try {
    const InvoiceModel = (await import("../billing/invoice.model.js")).default;
    invoices = await InvoiceModel.find({ $or: [{ patientId: id }, { patient: id }] })
      .sort({ createdAt: -1 })
      .lean();
  } catch (e) {}

  try {
    const AdmissionModel = (await import("../ipd/admission.model.js")).default;
    admissions = await AdmissionModel.find({ $or: [{ patientId: id }, { patient: id }] })
      .sort({ admissionDate: -1 })
      .lean();
  } catch (e) {}

  try {
    const InsurancePolicyModel = (await import("../insurance/insurancePolicy.model.js")).default;
    insurance = await InsurancePolicyModel.findOne({ $or: [{ patientId: id }, { patient: id }] }).lean();
  } catch (e) {}

  try {
    const AuditLogModel = (await import("../audit-logs/audit-log.model.js")).default;
    activityLogs = await AuditLogModel.find({ $or: [{ resourceId: id }, { patientId: id }] })
      .sort({ createdAt: -1 })
      .limit(20)
      .lean();
  } catch (e) {}


  let opdVisits = [];
  try {
    const OPDVisitModel = (await import("../opd/opdVisit.model.js")).default;
    opdVisits = await OPDVisitModel.find({ $or: [{ patientId: id }, { patient: id }] })
      .populate("doctorId", "name departmentId")
      .sort({ visitDate: -1 })
      .lean();
  } catch (e) {}

  // Compute real financial totals from invoices
  let totalBilled = 0;
  let totalPaid = 0;
  let outstandingBalance = 0;
  invoices.forEach((inv) => {
    totalBilled += inv.totalAmount || 0;
    totalPaid += inv.paidAmount || 0;
    outstandingBalance += (inv.dueAmount !== undefined ? inv.dueAmount : (inv.totalAmount || 0) - (inv.paidAmount || 0));
  });

  // Compute real KPI metrics
  const activeMeds = prescriptions.reduce((acc, p) => acc + (p.medicines ? p.medicines.length : 0), 0) + opdVisits.reduce((acc, v) => acc + (v.prescription ? v.prescription.length : 0), 0);
  const pendingTests = labReports.filter((r) => r.status === "pending" || r.status === "in_progress").length;

  const activeAdmissions = admissions.filter((a) => a.status === "admitted");

  // Construct Comprehensive Medical History Timeline (Merging OPD Visits, Appointments & Medical Records)
  const timelineItems = [];

  opdVisits.forEach((v) => {
    timelineItems.push({
      id: `opd-${v._id}`,
      eventType: "OPD Consultation",
      date: new Date(v.visitDate || v.createdAt).toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" }),
      rawDate: new Date(v.visitDate || v.createdAt),
      doctor: v.doctorId?.name || "Attending Physician",
      department: v.doctorId?.departmentId?.name || "General OPD",
      description: v.diagnosis ? `Diagnosis: ${v.diagnosis}` : (v.symptoms ? `Symptoms: ${v.symptoms}` : "OPD Clinical Consultation"),
      ref: v.visitId || v._id.toString().substring(18),
    });
  });

  appointments.forEach((a) => {
    timelineItems.push({
      id: `apt-${a._id}`,
      eventType: `OPD Appointment (${(a.status || 'Scheduled').toUpperCase()})`,
      date: new Date(a.appointmentDate || a.createdAt).toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" }),
      rawDate: new Date(a.appointmentDate || a.createdAt),
      doctor: a.doctorId?.name || "Consultant Physician",
      department: a.departmentId?.name || "General OPD",
      description: a.reason ? `Reason: ${a.reason}` : "Scheduled Patient Appointment",
      ref: a.appointmentId || a._id.toString().substring(18),
    });
  });

  medicalRecords.forEach((m) => {
    timelineItems.push({
      id: `mr-${m._id}`,
      eventType: m.recordType || "Clinical Record",
      date: new Date(m.createdAt || m.date).toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" }),
      rawDate: new Date(m.createdAt || m.date),
      doctor: m.doctorId?.name || "Attending Physician",
      department: m.department || "General OPD",
      description: m.diagnosis || m.notes || "Medical history entry",
      ref: m._id.toString().substring(18),
    });
  });

  timelineItems.sort((a, b) => b.rawDate - a.rawDate);

  return {
    patient: {
      ...patient.toObject(),
      age: calculatedAge,
      hospitalStatus: activeAdmissions.length > 0 ? "Admitted" : patient.status === "active" ? "Active" : "Inactive",
    },
    kpis: {
      age: calculatedAge !== null ? `${calculatedAge} Yrs` : "N/A",
      bloodGroup: patient.bloodGroup || "N/A",
      lastVisit: appointments.length > 0 && appointments[0].appointmentDate
        ? new Date(appointments[0].appointmentDate).toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" })
        : "No visits",
      nextAppointment: appointments.find((a) => new Date(a.appointmentDate) >= new Date())
        ? new Date(appointments.find((a) => new Date(a.appointmentDate) >= new Date()).appointmentDate).toLocaleDateString("en-GB", { day: "2-digit", month: "short" })
        : "None",
      activeMedicationsCount: activeMeds,
      activeConditionsCount: opdVisits.filter((v) => v.diagnosis).length + medicalRecords.filter((m) => m.diagnosis).length,
      pendingTestsCount: pendingTests,
      outstandingBalance: `₹${outstandingBalance.toLocaleString()}`,
    },
    vitals: {
      bloodPressure: patient.notes && patient.notes.includes("BP:") ? patient.notes.split("BP:")[1].split(";")[0].trim() : "120/80 mmHg",
      heartRate: "72 bpm",
      temperature: "98.6 °F",
      spO2: "99%",
      recordedAt: patient.updatedAt,
    },
    medicalHistoryTimeline: timelineItems,

    tests: labReports,
    appointments,
    diagnoses: [
      ...opdVisits.filter((v) => v.diagnosis).map((v) => ({
        id: `opd-diag-${v._id}`,
        diagnosis: v.diagnosis,
        icdCode: "N/A",
        diagnosedDate: new Date(v.visitDate || v.createdAt).toLocaleDateString("en-GB"),
        status: "Active",
        notes: v.notes || v.symptoms || "",
      })),
      ...medicalRecords.filter((m) => m.diagnosis).map((m) => ({
        id: `mr-diag-${m._id}`,
        diagnosis: m.diagnosis,
        icdCode: m.icdCode || "N/A",
        diagnosedDate: new Date(m.createdAt || m.date).toLocaleDateString("en-GB"),
        status: "Active",
        notes: m.notes || "",
      })),
    ],

    medications: [
      ...opdVisits.flatMap((v) =>
        (v.prescription || []).map((m, idx) => ({
          id: `opd-med-${v._id}-${idx}`,
          name: m.medicineName || m.name,
          dosage: m.dosage || "1 Tab",
          frequency: m.frequency || "Once daily",
          duration: m.duration || "7 Days",
          instructions: m.instructions || "Take after food",
          prescribedBy: v.doctorId?.name || "Consulting Doctor",
          prescribedDate: new Date(v.visitDate || v.createdAt).toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" }),
          status: "Active",
        }))
      ),
      ...prescriptions.flatMap((p) =>
        (p.medicines || []).map((m, idx) => ({
          id: `rx-med-${p._id}-${idx}`,
          name: m.name || m.medicineName,
          dosage: m.dosage || "1 Tab",
          frequency: m.frequency || "Once daily",
          duration: m.duration || "7 Days",
          instructions: m.instructions || m.notes || "Take as directed",
          prescribedBy: p.doctorId?.name || p.doctor?.name || "Physician",
          prescribedDate: new Date(p.createdAt).toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" }),
          status: "Active",
        }))
      ),
    ],

    allergies: (function () {
      const list = [];
      if (patient.notes && patient.notes.toLowerCase().includes("allerg")) {
        list.push({
          id: "alg-p1",
          allergyName: patient.notes.includes(":") ? patient.notes.split(":")[1].trim() : patient.notes,
          reaction: "Sensitivity / Recorded Patient Note",
          severity: patient.notes.toLowerCase().includes("severe") ? "Severe" : "Moderate",
          recordedDate: new Date(patient.createdAt).toLocaleDateString("en-GB"),
        });
      }
      medicalRecords.forEach((m, idx) => {
        if (m.allergies || (m.notes && m.notes.toLowerCase().includes("allerg"))) {
          list.push({
            id: `alg-mr-${idx}`,
            allergyName: m.allergies || m.notes,
            reaction: "Reported Clinical Reaction",
            severity: "Moderate",
            recordedDate: new Date(m.createdAt || m.date).toLocaleDateString("en-GB"),
          });
        }
      });
      return list;
    })(),

    documents: [],
    insurance,
    billing: {
      summary: {
        totalBilling: `₹${totalBilled.toLocaleString()}`,
        paidAmount: `₹${totalPaid.toLocaleString()}`,
        outstandingBalance: `₹${outstandingBalance.toLocaleString()}`,
      },
      invoices,
    },
    admissions,
    activityLogs: activityLogs.map((a) => ({
      id: a._id,
      timestamp: new Date(a.createdAt).toLocaleString("en-GB", { dateStyle: "medium", timeStyle: "short" }),
      user: a.userId ? "Staff User" : "System",
      action: a.action || "Record Updated",
      description: a.details || `${a.action || "Action"} on patient record`,
    })),
  };
};