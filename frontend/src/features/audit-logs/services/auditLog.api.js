import api from "../../../lib/axios.js";

export const getAuditLogsApi = (params) => api.get("/audit-logs", { params });
