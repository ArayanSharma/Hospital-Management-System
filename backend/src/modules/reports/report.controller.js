import {
  getPatientRegistrationReport,
  getAppointmentReport,
  getRevenueReport,
  getPharmacySalesReport,
  getOccupancyReport,
} from "./report.service.js";
import { successResponse } from "../../core/responses/apiResponse.js";
import { asyncHandler } from "../../utils/asyncHandler.js";

export const patientRegistration = asyncHandler(async (req, res) => {
  const report = await getPatientRegistrationReport(req.query);
  return successResponse(res, 200, "Patient registration report generated", report);
});

export const appointments = asyncHandler(async (req, res) => {
  const report = await getAppointmentReport(req.query);
  return successResponse(res, 200, "Appointment report generated", report);
});

export const revenue = asyncHandler(async (req, res) => {
  const report = await getRevenueReport(req.query);
  return successResponse(res, 200, "Revenue report generated", report);
});

export const pharmacySales = asyncHandler(async (req, res) => {
  const report = await getPharmacySalesReport(req.query);
  return successResponse(res, 200, "Pharmacy sales report generated", report);
});

export const occupancy = asyncHandler(async (req, res) => {
  const report = await getOccupancyReport();
  return successResponse(res, 200, "Occupancy report generated", report);
});