import api from "../../../lib/axios.js";

export const getPoliciesApi = (params) => api.get("/insurance-policies", { params });
export const getPoliciesByPatientApi = (patientId) => api.get(`/insurance-policies/patient/${patientId}`);
export const getPolicyByIdApi = (id) => api.get(`/insurance-policies/${id}`);
export const createPolicyApi = (data) => api.post("/insurance-policies", data);
export const updatePolicyApi = (id, data) => api.patch(`/insurance-policies/${id}`, data);
