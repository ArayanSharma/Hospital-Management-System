import api from "../../../lib/axios.js";

export const getWardsApi = (params) => api.get("/wards", { params });
export const getWardByIdApi = (id) => api.get(`/wards/${id}`);
export const createWardApi = (data) => api.post("/wards", data);
export const updateWardApi = (id, data) => api.patch(`/wards/${id}`, data);
