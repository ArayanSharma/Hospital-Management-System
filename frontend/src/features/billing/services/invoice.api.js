import api from "../../../lib/axios.js";

export const getInvoicesApi = (params) => api.get("/invoices", { params });
export const getInvoiceByIdApi = (id) => api.get(`/invoices/${id}`);
export const createInvoiceApi = (data) => api.post("/invoices", data);
export const cancelInvoiceApi = (id) => api.patch(`/invoices/${id}/cancel`);