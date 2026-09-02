import api from "../../../lib/axios.js";

export const getSuppliersApi = (params) => api.get("/suppliers", { params });
export const getSupplierStatsApi = () => api.get("/pharmacy/suppliers/stats");
export const createSupplierApi = (data) => api.post("/suppliers", data);
export const updateSupplierApi = (id, data) => api.patch(`/suppliers/${id}`, data);
export const deleteSupplierApi = (id) => api.delete(`/suppliers/${id}`);
