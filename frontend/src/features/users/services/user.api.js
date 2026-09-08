import api from "../../../lib/axios.js";

export const getUsersApi = (params) => api.get("/users", { params });
export const exportUsersApi = (params) => api.get("/users/export", { params, responseType: "blob" });
export const getUserByIdApi = (id) => api.get(`/users/${id}`);
export const createUserApi = (data) => api.post("/users", data);
export const updateUserApi = (id, data) => api.patch(`/users/${id}`, data);
export const deleteUserApi = (id) => api.delete(`/users/${id}`);