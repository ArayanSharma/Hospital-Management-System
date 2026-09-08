import api from "../../../lib/axios.js";

export const getPatientsApi = (params) => api.get("/patients", { params });
export const exportPatientsApi = (params) => api.get("/patients/export", { params, responseType: "blob" });
export const getPatientByIdApi = (id) => api.get(`/patients/${id}`);
export const createPatientApi = (data) => api.post("/patients", data);
export const updatePatientApi = (id, data) => api.patch(`/patients/${id}`, data);
export const deletePatientApi = (id) => api.delete(`/patients/${id}`);