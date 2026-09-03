import api from "../../../lib/axios.js";

export const getSuppliersApi = (params) => api.get("/suppliers", { params });
export const getSupplierStatsApi = () => api.get("/pharmacy/suppliers/stats");
export const createSupplierApi = (data) => api.post("/suppliers", data);
export const updateSupplierApi = (id, data) => api.put(`/suppliers/${id}`, data);
export const deleteSupplierApi = (id) => api.delete(`/suppliers/${id}`);

export const paySupplierOutstandingApi = (id, data) => api.post(`/suppliers/${id}/pay-outstanding`, data);
export const toggleSupplierStatusApi = (id) => api.patch(`/suppliers/${id}/toggle-status`);
export const toggleSupplierArchiveApi = (id) => api.patch(`/suppliers/${id}/toggle-archive`);
