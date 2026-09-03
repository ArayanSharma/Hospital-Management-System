import {
  adjustStockService,
  getStockHistoryService,
  setReorderLevelService,
  archiveBatchService,
  restoreBatchService,
  quarantineBatchService,
} from "./inventory.service.js";

export const adjustStockController = async (req, res, next) => {
  try {
    const { id } = req.params;
    const result = await adjustStockService(id, req.body);
    res.status(200).json({ success: true, message: "Stock adjusted successfully", data: result });
  } catch (err) {
    next(err);
  }
};

export const getStockHistoryController = async (req, res, next) => {
  try {
    const { id } = req.params;
    const result = await getStockHistoryService(id);
    res.status(200).json({ success: true, data: result });
  } catch (err) {
    next(err);
  }
};

export const setReorderLevelController = async (req, res, next) => {
  try {
    const { id } = req.params;
    const result = await setReorderLevelService(id, req.body);
    res.status(200).json({ success: true, message: "Reorder level updated successfully", data: result });
  } catch (err) {
    next(err);
  }
};

export const archiveBatchController = async (req, res, next) => {
  try {
    const { id } = req.params;
    const result = await archiveBatchService(id);
    res.status(200).json({ success: true, message: "Batch archived successfully", data: result });
  } catch (err) {
    next(err);
  }
};

export const restoreBatchController = async (req, res, next) => {
  try {
    const { id } = req.params;
    const result = await restoreBatchService(id);
    res.status(200).json({ success: true, message: "Batch restored successfully", data: result });
  } catch (err) {
    next(err);
  }
};

export const quarantineBatchController = async (req, res, next) => {
  try {
    const { id } = req.params;
    const result = await quarantineBatchService(id, req.body);
    res.status(200).json({ success: true, message: "Batch status updated successfully", data: result });
  } catch (err) {
    next(err);
  }
};
