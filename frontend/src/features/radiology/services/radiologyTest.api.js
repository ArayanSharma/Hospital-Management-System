import api from "../../../lib/axios.js";

export const getRadiologyTestsApi = (params) => api.get("/radiology-tests", { params });
export const getRadiologyTestByIdApi = (id) => api.get(`/radiology-tests/${id}`);
export const createRadiologyTestApi = (data) => api.post("/radiology-tests", data);
export const updateRadiologyTestStatusApi = (id, data) => api.patch(`/radiology-tests/${id}/status`, data);
export const deleteRadiologyTestApi = (id) => api.delete(`/radiology-tests/${id}`);
