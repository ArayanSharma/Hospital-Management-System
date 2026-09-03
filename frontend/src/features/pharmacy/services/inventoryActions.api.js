import api from "../../../lib/axios.js";

/**
 * Adjust Stock (Physical Audit Variance)
 */
export const adjustStockApi = (medicineId, payload) => {
  return api.patch(`/pharmacy/inventory/${medicineId}/adjust`, payload);
};

/**
 * Get Batch Stock Movement History Audit Trail
 */
export const getStockHistoryApi = (medicineId) => {
  return api.get(`/pharmacy/inventory/${medicineId}/history`);
};

/**
 * Set Reorder Level Threshold
 */
export const setReorderLevelApi = (medicineId, payload) => {
  return api.patch(`/pharmacy/inventory/${medicineId}/reorder-level`, payload);
};

/**
 * Archive Batch
 */
export const archiveBatchApi = (medicineId) => {
  return api.patch(`/pharmacy/inventory/${medicineId}/archive`);
};

/**
 * Restore Batch
 */
export const restoreBatchApi = (medicineId) => {
  return api.patch(`/pharmacy/inventory/${medicineId}/restore`);
};

/**
 * Quarantine / Expire Batch
 */
export const quarantineBatchApi = (medicineId, payload) => {
  return api.patch(`/pharmacy/inventory/${medicineId}/quarantine`, payload);
};
