import api from "../../../lib/axios.js";

export const getClaimsApi = (params) => api.get("/insurance-claims", { params });
export const getClaimByIdApi = (id) => api.get(`/insurance-claims/${id}`);
export const createClaimApi = (data) => api.post("/insurance-claims", data);
export const updateClaimStatusApi = (id, data) => api.patch(`/insurance-claims/${id}/status`, data);
export const updateClaimApi = (id, data) => api.put(`/insurance-claims/${id}`, data);
export const addClaimNoteApi = (id, data) => api.post(`/insurance-claims/${id}/notes`, data);
export const uploadClaimDocumentApi = (id, data) => api.post(`/insurance-claims/${id}/documents`, data);
