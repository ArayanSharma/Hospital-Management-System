import api from "../../../lib/axios.js";

export const getSettingsApi = () => api.get("/settings");
export const updateSettingsApi = (data) => api.patch("/settings", data);