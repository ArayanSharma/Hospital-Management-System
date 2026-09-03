import mongoose from "mongoose";
import Doctor from "./doctor.model.js";
import User from "../users/user.model.js";
import Role from "../roles/role.model.js";
import Department from "../departments/department.model.js";
import AppError from "../../core/errors/AppError.js";
import { ErrorCodes } from "../../core/errors/errorCodes.js";
import { createAuditLog } from "../audit-logs/audit-log.service.js";
import { generateSequentialId } from "../../utils/generateId.js";

// ---------------- CREATE (User + Doctor atomic creation with transaction safety) ----------------
export const createDoctor = async (data, currentUser, requestMeta) => {
  const {
    name,
    email,
    password,
    phone,
    departmentId,
    specialization,
    qualification,
    experience,
    consultationFee,
    availability,
    photoUrl,
    additionalInfo,
  } = data;

  const existingUser = await User.findOne({ email: email.toLowerCase() });
  if (existingUser) {
    throw new AppError("User with this email already exists", 409, ErrorCodes.USER_ALREADY_EXISTS);
  }

  const department = await Department.findById(departmentId);
  if (!department) {
    throw new AppError("Invalid departmentId provided", 400, ErrorCodes.NOT_FOUND);
  }

  let doctorRole = await Role.findOne({ name: "DOCTOR" });
  if (!doctorRole) {
    doctorRole = await Role.create({ name: "DOCTOR", permissions: [] });
  }

  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const user = await User.create(
      [
        {
          name,
          email: email.toLowerCase(),
          password: password || "Doctor@123",
          roleId: doctorRole._id,
          phone,
          status: "active",
        },
      ],
      { session }
    );

    const doctorId = await generateSequentialId(Doctor, "DOC", "doctorId");

    const doctor = await Doctor.create(
      [
        {
          userId: user[0]._id,
          doctorId,
          departmentId,
          specialization,
          qualification: qualification || "MBBS",
          experience: experience || 0,
          consultationFee: consultationFee || 500,
          availability: availability || [{ day: "Mon - Sat", startTime: "09:00 AM", endTime: "05:00 PM" }],
          photoUrl: photoUrl || null,
          additionalInfo: additionalInfo || null,
        },
      ],
      { session }
    );

    await session.commitTransaction();

    await createAuditLog({
      userId: currentUser.id,
      action: "CREATE",
      resource: "doctor",
      resourceId: doctor[0]._id,
      newValue: doctor[0].toObject(),
      ipAddress: requestMeta.ipAddress,
      userAgent: requestMeta.userAgent,
    });

    return doctor[0];
  } catch (err) {
    await session.abortTransaction();
    throw err;
  } finally {
    session.endSession();
  }
};

// ---------------- GET ALL (100% Dynamic MongoDB Stats + RegEx Safe Filtering) ----------------
export const getAllDoctors = async ({ page = 1, limit = 10, departmentId, status, search, specialization }) => {
  const query = {};
  if (departmentId && departmentId !== "all") query.departmentId = departmentId;
  if (status && status !== "all") query.status = status;
  if (specialization && specialization !== "all") query.specialization = specialization;

  const skip = (page - 1) * limit;
  const safeSearch = search ? search.replace(/[.*+?^${}()|[\]\\]/g, "\\$&") : "";

  const [doctors, total, activeCount, inactiveCount, totalDeptsCount, feeAgg] = await Promise.all([
    Doctor.find(query)
      .populate("userId", "name email phone")
      .populate("departmentId", "name code")
      .skip(skip)
      .limit(limit)
      .sort({ createdAt: -1 }),
    Doctor.countDocuments(query),
    Doctor.countDocuments({ status: "active" }),
    Doctor.countDocuments({ status: "inactive" }),
    Department.countDocuments(),
    Doctor.aggregate([
      { $group: { _id: null, avgFee: { $avg: "$consultationFee" } } },
    ]),
  ]);

  const filteredDoctors = safeSearch
    ? doctors.filter((d) =>
        d.userId?.name?.toLowerCase().includes(safeSearch.toLowerCase()) ||
        d.specialization?.toLowerCase().includes(safeSearch.toLowerCase()) ||
        d.doctorId?.toLowerCase().includes(safeSearch.toLowerCase())
      )
    : doctors;

  const avgFeeValue = Math.round(feeAgg[0]?.avgFee || 0);

  return {
    doctors: filteredDoctors,
    stats: {
      totalDoctors: total,
      activeDoctors: activeCount,
      inactiveDoctors: inactiveCount,
      totalDepartments: totalDeptsCount,
      avgConsultationFee: avgFeeValue,
      activePercentage: total > 0 ? ((activeCount / total) * 100).toFixed(2) : "0.00",
      inactivePercentage: total > 0 ? ((inactiveCount / total) * 100).toFixed(2) : "0.00",
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
export const getDoctorById = async (id) => {
  const doctor = await Doctor.findById(id)
    .populate("userId", "name email phone status")
    .populate("departmentId", "name code");

  if (!doctor) {
    throw new AppError("Doctor not found", 404, ErrorCodes.NOT_FOUND);
  }

  return doctor;
};

// ---------------- UPDATE ----------------
export const updateDoctor = async (id, data, currentUser, requestMeta) => {
  const doctor = await Doctor.findById(id);
  if (!doctor) {
    throw new AppError("Doctor not found", 404, ErrorCodes.NOT_FOUND);
  }

  const oldValue = doctor.toObject();
  const {
    departmentId,
    specialization,
    qualification,
    experience,
    consultationFee,
    availability,
    photoUrl,
    additionalInfo,
    status,
  } = data;

  if (departmentId !== undefined) {
    const department = await Department.findById(departmentId);
    if (!department) {
      throw new AppError("Invalid departmentId provided", 400, ErrorCodes.NOT_FOUND);
    }
    doctor.departmentId = departmentId;
  }

  if (specialization !== undefined) doctor.specialization = specialization;
  if (qualification !== undefined) doctor.qualification = qualification;
  if (experience !== undefined) doctor.experience = experience;
  if (consultationFee !== undefined) doctor.consultationFee = consultationFee;
  if (availability !== undefined) doctor.availability = availability;
  if (photoUrl !== undefined) doctor.photoUrl = photoUrl;
  if (additionalInfo !== undefined) doctor.additionalInfo = additionalInfo;
  if (status !== undefined) doctor.status = status;

  await doctor.save();

  await createAuditLog({
    userId: currentUser.id,
    action: "UPDATE",
    resource: "doctor",
    resourceId: doctor._id,
    oldValue,
    newValue: doctor.toObject(),
    ipAddress: requestMeta.ipAddress,
    userAgent: requestMeta.userAgent,
  });

  return doctor;
};

// ---------------- DELETE (soft) ----------------
export const deleteDoctor = async (id, currentUser, requestMeta) => {
  const doctor = await Doctor.findById(id);
  if (!doctor) {
    throw new AppError("Doctor not found", 404, ErrorCodes.NOT_FOUND);
  }

  const oldValue = doctor.toObject();

  doctor.status = "inactive";
  await doctor.save();

  if (doctor.userId) {
    await User.findByIdAndUpdate(doctor.userId, { status: "inactive" });
  }

  await createAuditLog({
    userId: currentUser.id,
    action: "DELETE",
    resource: "doctor",
    resourceId: doctor._id,
    oldValue,
    newValue: null,
    ipAddress: requestMeta.ipAddress,
    userAgent: requestMeta.userAgent,
  });

  return { message: "Doctor deactivated successfully" };
};

// ---------------- EXPORT CSV (Backend Controlled) ----------------
export const exportDoctorsService = async (params = {}) => {
  const { departmentId, status, specialization, search } = params;
  const query = {};
  if (departmentId && departmentId !== "all") query.departmentId = departmentId;
  if (status && status !== "all") query.status = status;
  if (specialization && specialization !== "all") query.specialization = specialization;

  const doctors = await Doctor.find(query)
    .populate("userId", "name email phone")
    .populate("departmentId", "name")
    .sort({ createdAt: -1 });

  const safeSearch = search ? search.toLowerCase() : "";
  const filtered = safeSearch
    ? doctors.filter(
        (d) =>
          d.userId?.name?.toLowerCase().includes(safeSearch) ||
          d.specialization?.toLowerCase().includes(safeSearch) ||
          d.doctorId?.toLowerCase().includes(safeSearch)
      )
    : doctors;

  const headers = [
    "Doctor ID",
    "Name",
    "Email",
    "Phone",
    "Department",
    "Specialization",
    "Qualification",
    "Experience (Yrs)",
    "Consultation Fee",
    "Status",
    "Created At",
  ];

  const rows = filtered.map((d) => [
    d.doctorId || d._id,
    `"${(d.userId?.name || d.name || "").replace(/"/g, '""')}"`,
    `"${(d.userId?.email || d.email || "").replace(/"/g, '""')}"`,
    `"${(d.userId?.phone || d.phone || "").replace(/"/g, '""')}"`,
    `"${(d.departmentId?.name || "").replace(/"/g, '""')}"`,
    `"${(d.specialization || "").replace(/"/g, '""')}"`,
    `"${(d.qualification || "").replace(/"/g, '""')}"`,
    d.experience || 0,
    d.consultationFee || 0,
    d.status || "",
    d.createdAt ? new Date(d.createdAt).toISOString().split("T")[0] : "",
  ]);

  return [headers.join(","), ...rows.map((row) => row.join(","))].join("\n");
};