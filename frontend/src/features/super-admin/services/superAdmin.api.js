import api from "../../../lib/axios.js";

export const getDashboardStatsApi = () => api.get("/super-admin/dashboard");
export const getRecentActivityApi = (limit = 10) =>
  api.get(`/super-admin/activity?limit=${limit}`);