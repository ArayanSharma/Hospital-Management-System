import api from "../../../lib/axios.js";

export const getPaymentsByInvoiceApi = (invoiceId) => api.get(`/payments/invoice/${invoiceId}`);
export const createPaymentApi = (data) => api.post("/payments", data);