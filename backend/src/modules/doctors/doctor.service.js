import mongoose from "mongoose";
import Doctor from "./doctor.model.js";
import User from "../users/user.model.js";
import Role from "../roles/role.model.js";
import Department from "../departments/department.model.js";
import AppError from "../../core/errors/AppError.js";
import { ErrorCodes } from "../../core/errors/errorCodes.js";
import { createAuditLog } from "../audit-logs/audit-log.service.js";
import { generateSequentialId } from "../../utils/generateId.js";

// ---------------- CREATE (User + Doctor dono ek saath) ----------------
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
  } = data;

  // 1. Duplicate email check
  const existingUser = await User.findOne({ email });
  if (existingUser) {
    throw new AppError(
      "User with this email already exists",
      409,
      ErrorCodes.USER_ALREADY_EXISTS
    );
  }

  // 2. Department valid hai ya nahi
  const department = await Department.findById(departmentId);
  if (!department) {
    throw new AppError("Invalid departmentId provided", 400, ErrorCodes.NOT_FOUND);
  }

  // 3. DOCTOR role dhoondo (system role, already seeded honi chahiye)
  const doctorRole = await Role.findOne({ name: "DOCTOR" });
  if (!doctorRole) {
    throw new AppError(
      "DOCTOR role not found. Please create it first.",
      500,
      ErrorCodes.NOT_FOUND
    );
  }

  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    // 4. User create karo (transaction ke andar)
    const user = await User.create(
      [
        {
          name,
          email,
          password,
          roleId: doctorRole._id,
          phone,
          status: "active",
        },
      ],
      { session }
    );

    // 5. doctorId generate karo
    const doctorId = await generateSequentialId(Doctor, "DOC");

    // 6. Doctor profile create karo (transaction ke andar)
    const doctor = await Doctor.create(
      [
        {
          userId: user[0]._id,
          doctorId,
          departmentId,
          specialization,
          qualification,
          experience,
          consultationFee,
          availability,
        },
      ],
      { session }
    );

    await session.commitTransaction();
    session.endSession();

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
    session.endSession();
    throw err;
  }
};

// ---------------- GET ALL ----------------
export const getAllDoctors = async ({ page = 1, limit = 10, departmentId, status, search }) => {
  const query = {};
  if (departmentId) query.departmentId = departmentId;
  if (status) query.status = status;

  const skip = (page - 1) * limit;

  let doctorQuery = Doctor.find(query)
    .populate("userId", "name email phone")
    .populate("departmentId", "name code")
    .skip(skip)
    .limit(limit)
    .sort({ createdAt: -1 });

  const [doctors, total] = await Promise.all([
    doctorQuery,
    Doctor.countDocuments(query),
  ]);

  // Search by name — User collection mein hai, isliye post-filter (chhota dataset ke liye theek hai)
  const filteredDoctors = search
    ? doctors.filter((d) =>
        d.userId?.name?.toLowerCase().includes(search.toLowerCase())
      )
    : doctors;

  return {
    doctors: filteredDoctors,
    pagination: {
      total,
      page: Number(page),
      limit: Number(limit),
      totalPages: Math.ceil(total / limit),
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

// ---------------- UPDATE (sirf professional details — User info alag se) ----------------
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

// ---------------- DELETE (soft — Doctor + User dono deactivate) ----------------
export const deleteDoctor = async (id, currentUser, requestMeta) => {
  const doctor = await Doctor.findById(id);
  if (!doctor) {
    throw new AppError("Doctor not found", 404, ErrorCodes.NOT_FOUND);
  }

  const oldValue = doctor.toObject();

  doctor.status = "inactive";
  await doctor.save();

  // Corresponding User bhi deactivate karo — doctor login na kar sake
  await User.findByIdAndUpdate(doctor.userId, { status: "inactive" });

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