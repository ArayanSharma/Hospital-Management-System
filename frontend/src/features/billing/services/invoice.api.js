import api from "../../../lib/axios.js";

export const getInvoicesApi = (params) => api.get("/invoices", { params });
export const getInvoiceByIdApi = (id) => api.get(`/invoices/${id}`);
export const createInvoiceApi = (data) => api.post("/invoices", data);
export const cancelInvoiceApi = (id) => api.patch(`/invoices/${id}/cancel`);

export const getNextInvoiceNumberApi = () => api.get("/invoices/next-number");
export const getPatientEncountersApi = (patientId) => api.get(`/invoices/patient-encounters/${patientId}`);
export const getBillableCatalogApi = (category) => api.get("/invoices/catalog", { params: { category } });