import api from "../../../lib/axios.js";

export const getBedsApi = (params) => api.get("/beds", { params });
export const createBedApi = (data) => api.post("/beds", data);
export const updateBedStatusApi = (id, data) => api.patch(`/beds/${id}/status`, data);
