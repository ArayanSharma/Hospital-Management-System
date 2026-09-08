import api from "../../../lib/axios.js";

export const getDashboardStatsApi = (params = {}) =>
  api.get("/super-admin/dashboard", { params });

export const getRecentActivityApi = (limit = 10) =>
  api.get(`/super-admin/activity?limit=${limit}`);