import api from "../../../lib/axios.js";

export const getMedicinesApi = (params) => api.get("/medicines", { params });
export const getMedicineStatsApi = () => api.get("/medicines/stats");
export const createMedicineApi = (data) => api.post("/medicines", data);
export const updateMedicineApi = (id, data) => api.patch(`/medicines/${id}`, data);