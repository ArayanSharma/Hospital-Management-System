import api from "../../../lib/axios.js";

export const getPrescriptionsByVisitApi = (visitId) =>
  api.get(`/prescriptions/visit/${visitId}`);
export const createPrescriptionApi = (data) => api.post("/prescriptions", data);
export const updatePrescriptionApi = (id, data) => api.patch(`/prescriptions/${id}`, data);