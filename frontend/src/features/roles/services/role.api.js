import api from "../../../lib/axios.js";

export const getRolesApi = (params) => api.get("/roles", { params });
export const getRoleByIdApi = (id) => api.get(`/roles/${id}`);
export const createRoleApi = (data) => api.post("/roles", data);
export const updateRoleApi = (id, data) => api.patch(`/roles/${id}`, data);
export const updateRolePermissionsApi = (id, permissionIds) =>
  api.patch(`/roles/${id}/permissions`, { permissionIds });
export const deleteRoleApi = (id) => api.delete(`/roles/${id}`);