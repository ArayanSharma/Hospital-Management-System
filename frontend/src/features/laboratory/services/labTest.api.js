import api from "../../../lib/axios.js";

export const getLabTestsApi = (params) => api.get("/lab-tests", { params });
export const getLabTestByIdApi = (id) => api.get(`/lab-tests/${id}`);
export const createLabTestApi = (data) => api.post("/lab-tests", data);
export const updateLabTestStatusApi = (id, data) => api.patch(`/lab-tests/${id}/status`, data);
