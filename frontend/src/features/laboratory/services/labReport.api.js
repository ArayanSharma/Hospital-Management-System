import api from "../../../lib/axios.js";

export const getLabReportByTestIdApi = (testId) => api.get(`/lab-reports/test/${testId}`);
export const createLabReportApi = (data) => api.post("/lab-reports", data);
export const finalizeLabReportApi = (id) => api.patch(`/lab-reports/${id}/finalize`);
export const updateLabReportApi = (id, data) => api.patch(`/lab-reports/${id}`, data);
