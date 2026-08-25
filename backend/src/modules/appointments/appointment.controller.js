import {
  createAppointment,
  getAllAppointments,
  getAppointmentById,
  updateAppointment,
  changeAppointmentStatus,
} from "./appointment.service.js";
import { successResponse } from "../../core/responses/apiResponse.js";
import { asyncHandler } from "../../utils/asyncHandler.js";
import { getRequestMeta } from "../../utils/getRequestMeta.js";

export const create = asyncHandler(async (req, res) => {
  const meta = getRequestMeta(req);
  const appointment = await createAppointment(req.body, req.user, meta);
  return successResponse(res, 201, "Appointment booked successfully", appointment);
});

export const getAll = asyncHandler(async (req, res) => {
  const result = await getAllAppointments(req.query);
  return successResponse(res, 200, "Appointments fetched successfully", result);
});

export const getById = asyncHandler(async (req, res) => {
  const appointment = await getAppointmentById(req.params.id);
  return successResponse(res, 200, "Appointment fetched successfully", appointment);
});

export const update = asyncHandler(async (req, res) => {
  const meta = getRequestMeta(req);
  const appointment = await updateAppointment(req.params.id, req.body, req.user, meta);
  return successResponse(res, 200, "Appointment updated successfully", appointment);
});

export const changeStatus = asyncHandler(async (req, res) => {
  const meta = getRequestMeta(req);
  const { status, cancelledReason } = req.body;
  const appointment = await changeAppointmentStatus(
    req.params.id,
    status,
    cancelledReason,
    req.user,
    meta
  );
  return successResponse(res, 200, `Appointment marked as ${status}`, appointment);
});