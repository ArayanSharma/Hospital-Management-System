import api from "../../../lib/axios.js";

export const getClaimsApi = (params) => api.get("/insurance-claims", { params });
export const getClaimByIdApi = (id) => api.get(`/insurance-claims/${id}`);
export const createClaimApi = (data) => api.post("/insurance-claims", data);
export const updateClaimStatusApi = (id, data) => api.patch(`/insurance-claims/${id}/status`, data);
