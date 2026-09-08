import api from "../../../lib/axios.js";

export const getInventoryApi = (params) => api.get("/inventory", { params });
export const getInventoryStatsApi = () => api.get("/pharmacy/inventory/stats");
export const createInventoryApi = (data) => api.post("/inventory", data);
export const createStockInTransactionApi = (data) => api.post("/pharmacy/stock-in", data);
export const getStockInTransactionsApi = (params) => api.get("/pharmacy/stock-in", { params });

