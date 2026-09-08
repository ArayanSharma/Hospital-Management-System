import api from "../../../lib/axios.js";

export const createPaymentApi = (data) => api.post("/payments", data);
export const getAllPaymentsApi = (params) => api.get("/payments", { params });
export const getPaymentsByInvoiceApi = (invoiceId) => api.get(`/payments/invoice/${invoiceId}`);
export const getPaymentByIdApi = (id) => api.get(`/payments/${id}`);