import api from "../../../lib/axios.js";

export const getPatientRegistrationReportApi = (params) =>
  api.get("/reports/patient-registration", { params });
export const getAppointmentReportApi = (params) =>
  api.get("/reports/appointments", { params });
export const getRevenueReportApi = (params) =>
  api.get("/reports/revenue", { params });
export const getPharmacySalesReportApi = (params) =>
  api.get("/reports/pharmacy-sales", { params });
export const getOccupancyReportApi = () => api.get("/reports/occupancy");