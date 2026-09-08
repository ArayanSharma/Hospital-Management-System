import api from "../../../lib/axios.js";

export const getOPDVisitsApi = (params) => api.get("/opd-visits", { params });
export const getOPDVisitByIdApi = (id) => api.get(`/opd-visits/${id}`);
export const createOPDVisitApi = (data) => api.post("/opd-visits", data);
export const updateOPDVisitApi = (id, data) => api.patch(`/opd-visits/${id}`, data);