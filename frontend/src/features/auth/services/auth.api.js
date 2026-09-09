import api from "../../../lib/axios.js";

export const loginApi = (credentials) => api.post("/auth/login", credentials);
export const googleLoginApi = (payload) => api.post("/auth/google-login", payload);
export const registerApi = (userData) => api.post("/auth/register", userData);
export const getRegistrationOptionsApi = () => api.get("/auth/registration-options");
export const logoutApi = () => api.post("/auth/logout");
export const getMeApi = () => api.get("/auth/me");
export const completeProfileApi = (profileData) => api.put("/auth/complete-profile", profileData);
export const forgotPasswordApi = (email) => api.post("/auth/forgot-password", { email });