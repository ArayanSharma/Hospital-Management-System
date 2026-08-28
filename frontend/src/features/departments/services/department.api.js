import api from "../../../lib/axios.js";

export const getDepartmentsApi = (params) => api.get("/departments", { params });
export const getDepartmentByIdApi = (id) => api.get(`/departments/${id}`);
export const createDepartmentApi = (data) => api.post("/departments", data);
export const updateDepartmentApi = (id, data) => api.patch(`/departments/${id}`, data);
export const deleteDepartmentApi = (id) => api.delete(`/departments/${id}`);