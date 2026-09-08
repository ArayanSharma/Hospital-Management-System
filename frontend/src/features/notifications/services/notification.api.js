import api from "../../../lib/axios.js";

export const getNotificationsApi = (params) => api.get("/notifications", { params });
export const markAsReadApi = (id) => api.patch(`/notifications/${id}/read`);
export const markAllAsReadApi = () => api.patch("/notifications/mark-all-read");