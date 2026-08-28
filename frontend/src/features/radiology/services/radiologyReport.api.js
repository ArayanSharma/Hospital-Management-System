import api from "../../../lib/axios.js";

export const getRadiologyReportByTestIdApi = (testId) => api.get(`/radiology-reports/test/${testId}`);
export const createRadiologyReportApi = (data) => api.post("/radiology-reports", data);
export const finalizeRadiologyReportApi = (id) => api.patch(`/radiology-reports/${id}/finalize`);
