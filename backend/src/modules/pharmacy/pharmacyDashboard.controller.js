import {
  getDashboardSummaryService,
  getInventoryStatsService,
  getSalesStatsService,
  getSupplierStatsService,
  getStockStatusService,
  getRecentStockInService,
  getTopSellingService,
  getLowStockService,
  getExpiringSoonService,
} from "./pharmacyDashboard.service.js";

export const getDashboardSummary = async (req, res, next) => {
  try {
    const data = await getDashboardSummaryService();
    res.status(200).json({ success: true, data });
  } catch (error) {
    next(error);
  }
};

export const getInventoryStats = async (req, res, next) => {
  try {
    const data = await getInventoryStatsService();
    res.status(200).json({ success: true, data });
  } catch (error) {
    next(error);
  }
};

export const getSalesStats = async (req, res, next) => {
  try {
    const data = await getSalesStatsService();
    res.status(200).json({ success: true, data });
  } catch (error) {
    next(error);
  }
};

export const getSupplierStats = async (req, res, next) => {
  try {
    const data = await getSupplierStatsService();
    res.status(200).json({ success: true, data });
  } catch (error) {
    next(error);
  }
};

export const getStockStatus = async (req, res, next) => {
  try {
    const data = await getStockStatusService();
    res.status(200).json({ success: true, data });
  } catch (error) {
    next(error);
  }
};

export const getRecentStockIn = async (req, res, next) => {
  try {
    const data = await getRecentStockInService();
    res.status(200).json({ success: true, data });
  } catch (error) {
    next(error);
  }
};

export const getTopSelling = async (req, res, next) => {
  try {
    const data = await getTopSellingService();
    res.status(200).json({ success: true, data });
  } catch (error) {
    next(error);
  }
};

export const getLowStock = async (req, res, next) => {
  try {
    const data = await getLowStockService();
    res.status(200).json({ success: true, data });
  } catch (error) {
    next(error);
  }
};

export const getExpiringSoon = async (req, res, next) => {
  try {
    const data = await getExpiringSoonService();
    res.status(200).json({ success: true, data });
  } catch (error) {
    next(error);
  }
};
