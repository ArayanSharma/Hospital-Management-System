import api from "../../../lib/axios.js";

export const getAdmissionsApi = (params) => api.get("/admissions", { params });
export const getAdmissionByIdApi = (id) => api.get(`/admissions/${id}`);
export const createAdmissionApi = (data) => api.post("/admissions", data);
export const dischargePatientApi = (id, dischargeSummary) =>
  api.patch(`/admissions/${id}/discharge`, { dischargeSummary });
