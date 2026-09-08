import api from "../../../lib/axios.js";

export const getDoctorsApi = (params) => api.get("/doctors", { params });
export const exportDoctorsApi = (params) => api.get("/doctors/export", { params, responseType: "blob" });
export const getDoctorByIdApi = (id) => api.get(`/doctors/${id}`);
export const createDoctorApi = (data) => api.post("/doctors", data);
export const updateDoctorApi = (id, data) => api.patch(`/doctors/${id}`, data);
export const deleteDoctorApi = (id) => api.delete(`/doctors/${id}`);