import api from "../../../lib/axios.js";

export const loginApi = (credentials) => api.post("/auth/login", credentials);
export const logoutApi = () => api.post("/auth/logout");
export const getMeApi = () => api.get("/auth/me");