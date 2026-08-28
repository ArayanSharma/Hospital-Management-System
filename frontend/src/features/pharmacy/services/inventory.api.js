import api from "../../../lib/axios.js";

export const getInventoryApi = (params) => api.get("/inventory", { params });
export const createInventoryApi = (data) => api.post("/inventory", data);
export const stockInApi = (id, quantity) => api.patch(`/inventory/${id}/stock-in`, { quantity });
export const getSuppliersApi = (params) => api.get("/suppliers", { params });
