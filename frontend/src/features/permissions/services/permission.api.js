import api from "../../../lib/axios.js";

export const getPermissionsApi = () => api.get("/permissions");
export const createPermissionApi = (data) => api.post("/permissions", data);
export const deletePermissionApi = (id) => api.delete(`/permissions/${id}`);
