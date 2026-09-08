import api from "../../../lib/axios.js";

export const getPharmacyDashboardApi = () => api.get("/pharmacy/dashboard");
export const getStockStatusApi = () => api.get("/pharmacy/stock-status");
export const getRecentStockInApi = () => api.get("/pharmacy/recent-stock-in");
export const getTopSellingApi = () => api.get("/pharmacy/top-selling");
export const getLowStockApi = () => api.get("/pharmacy/low-stock");
export const getExpiringSoonApi = () => api.get("/pharmacy/expiring-soon");
