import api from "../../../lib/axios.js";

export const getPharmacySalesApi = (params) => api.get("/pharmacy-sales", { params });
export const createPharmacySaleApi = (data) => api.post("/pharmacy-sales", data);
export const markSaleAsPaidApi = (id) => api.patch(`/pharmacy-sales/${id}/mark-paid`);