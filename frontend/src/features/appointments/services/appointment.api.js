import api from "../../../lib/axios.js";

export const getAppointmentsApi = (params) => api.get("/appointments", { params });
export const getAppointmentByIdApi = (id) => api.get(`/appointments/${id}`);
export const createAppointmentApi = (data) => api.post("/appointments", data);
export const updateAppointmentApi = (id, data) => api.patch(`/appointments/${id}`, data);
export const changeAppointmentStatusApi = (id, payload) =>
  api.patch(`/appointments/${id}/status`, payload);