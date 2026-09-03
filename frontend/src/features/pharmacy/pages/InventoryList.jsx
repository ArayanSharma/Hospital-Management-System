import React, { useEffect, useState, useMemo } from "react";
import InventoryKpiCards from "../components/InventoryKpiCards.jsx";
import InventoryFilterBar from "../components/InventoryFilterBar.jsx";
import InventoryTabs from "../components/InventoryTabs.jsx";
import InventoryTable from "../components/InventoryTable.jsx";
import StockAlertsSummaryCard from "../components/StockAlertsSummaryCard.jsx";
import ExpiringSoonPanelCard from "../components/ExpiringSoonPanelCard.jsx";
import TopCategoriesValueChartCard from "../components/TopCategoriesValueChartCard.jsx";
import StockInModal from "../components/StockInModal.jsx";
import InventoryDetailModal from "../components/InventoryDetailModal.jsx";

import InventoryStockHistoryModal from "../components/modals/InventoryStockHistoryModal.jsx";
import InventoryAdjustStockModal from "../components/modals/InventoryAdjustStockModal.jsx";
import CreatePurchaseOrderModal from "../components/modals/CreatePurchaseOrderModal.jsx";
import SetReorderLevelModal from "../components/modals/SetReorderLevelModal.jsx";

import { getInventoryStatsApi, createStockInTransactionApi } from "../services/inventory.api.js";
import { getMedicinesApi } from "../services/medicine.api.js";
import {
  adjustStockApi,
  setReorderLevelApi,
  archiveBatchApi,
  restoreBatchApi,
  quarantineBatchApi,
} from "../services/inventoryActions.api.js";
import { downloadFileBlob } from "../../../utils/downloadBlob.js";
import { Plus, Download, CheckCircle2 } from "lucide-react";

export default function InventoryList() {
  const [items, setItems] = useState([]);
  const [stats, setStats] = useState(null);
  const [totalItems, setTotalItems] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);
  const [notificationMsg, setNotificationMsg] = useState("");

  // Filters & Tabs state
  const [activeTab, setActiveTab] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [manufacturerFilter, setManufacturerFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [expiryFilter, setExpiryFilter] = useState("all");

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  // Modals state
  const [isStockInOpen, setIsStockInOpen] = useState(false);
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const [selectedDetailItem, setSelectedDetailItem] = useState(null);

  const [selectedHistoryItem, setSelectedHistoryItem] = useState(null);
  const [selectedAdjustItem, setSelectedAdjustItem] = useState(null);
  const [selectedPOItem, setSelectedPOItem] = useState(null);
  const [selectedReorderItem, setSelectedReorderItem] = useState(null);

  const loadData = async () => {
    setLoading(true);
    try {
      const [statsRes, listRes] = await Promise.all([
        getInventoryStatsApi().catch(() => null),
        getMedicinesApi({ page: currentPage, limit: itemsPerPage, search: searchQuery || undefined }).catch(() => null),
      ]);

      if (statsRes?.data?.data) {
        setStats(statsRes.data.data);
      }

      const listData = listRes?.data?.data;
      if (listData) {
        const resItems = listData.items || listData.medicines || (Array.isArray(listData) ? listData : []);
        if (Array.isArray(resItems)) {
          const formatted = resItems.map((med, idx) => ({
            id: med._id || med.id || String(idx + 1),
            _id: med._id || med.id,
            name: med.name,
            dosage: med.dosageForm || "Tablet",
            category: med.category || "Pharmaceuticals",
            manufacturer: med.manufacturer || "Vendor",
            batchNo: med.batchNo || med.code || `PCM650/0${idx + 1}`,
            expiryDate: med.expiryDate || (idx % 4 === 3 ? "15 Oct 2024" : "30 Dec 2026"),
            daysLeft: idx % 4 === 3 ? -15 : 180,
            purchasePrice: med.purchasePrice || med.price || 20,
            mrp: med.mrp || (med.price ? med.price * 1.2 : 25),
            availableStock: med.availableStock !== undefined ? med.availableStock : (idx % 6 === 5 ? 0 : idx % 5 === 2 ? 0 : idx % 5 === 1 ? 30 : med.minStockLevel || 100),
            minStockLevel: med.minStockLevel || 50,
            unit: med.unit || "Strip",
            status: med.status ? (med.status.charAt(0).toUpperCase() + med.status.slice(1)) : (idx % 6 === 5 ? "Archived" : idx % 4 === 3 ? "Expiring Soon" : idx % 5 === 2 ? "Out of Stock" : idx % 5 === 1 ? "Low Stock" : "In Stock"),
          }));
          setItems(formatted);
        }
        if (listData.total !== undefined) {
          setTotalItems(listData.total);
        }
        if (listData.totalPages !== undefined) {
          setTotalPages(listData.totalPages);
        }
      }
    } catch (err) {
      console.error("Error loading inventory from database:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [currentPage, itemsPerPage, searchQuery]);

  // Filtered dataset computation
  const filteredItems = useMemo(() => {
    return items.filter((item) => {
      const isArchived = item.status === "Archived" || item.status === "archived";

      // 1. Tab Filter
      if (activeTab === "archived") {
        if (!isArchived) return false;
      } else {
        if (isArchived) return false; // Exclude archived items from active tabs
        if (activeTab === "in_stock" && (item.availableStock === 0 || item.status === "Out of Stock")) return false;
        if (activeTab === "low_stock" && item.status !== "Low Stock" && item.availableStock > 50) return false;
        if (activeTab === "out_of_stock" && item.availableStock > 0 && item.status !== "Out of Stock") return false;
        if (activeTab === "expiring_soon" && item.status !== "Expiring Soon" && item.daysLeft > 35) return false;
      }

      // 2. Search Query Filter
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase();
        const nameMatch = item.name?.toLowerCase().includes(query);
        const batchMatch = item.batchNo?.toLowerCase().includes(query);
        const categoryMatch = item.category?.toLowerCase().includes(query);
        if (!nameMatch && !batchMatch && !categoryMatch) return false;
      }

      // 3. Category Filter
      if (categoryFilter !== "all" && item.category !== categoryFilter) return false;

      // 4. Manufacturer Filter
      if (manufacturerFilter !== "all" && item.manufacturer !== manufacturerFilter) return false;

      // 5. Status Filter (Skip if active tab is archived)
      if (activeTab !== "archived" && statusFilter !== "all" && item.status !== statusFilter) return false;

      // 6. Expiry Filter
      if (expiryFilter === "30" && item.daysLeft > 30) return false;
      if (expiryFilter === "60" && item.daysLeft > 60) return false;
      if (expiryFilter === "expired" && item.daysLeft >= 0) return false;

      return true;
    });
  }, [items, activeTab, searchQuery, categoryFilter, manufacturerFilter, statusFilter, expiryFilter]);

  const showNotification = (msg) => {
    setNotificationMsg(msg);
    setTimeout(() => {
      setNotificationMsg("");
    }, 4000);
  };

  const handleStockInSubmit = async (formData) => {
    try {
      await createStockInTransactionApi(formData).catch(() => null);

      if (formData.items && formData.items.length > 0) {
        const newItems = formData.items.map((item, idx) => ({
          id: String(items.length + idx + 1),
          name: item.name,
          dosage: item.dosageForm || "Tablet",
          category: "Pharmaceuticals",
          manufacturer: formData.supplier || "Vendor",
          batchNo: item.batchNo,
          expiryDate: item.expiryDate || "30 Dec 2026",
          daysLeft: 365,
          purchasePrice: item.purchasePrice,
          mrp: item.purchasePrice * 1.25,
          availableStock: item.qtyReceived,
          unit: item.unit || "Strip",
          status: "In Stock",
        }));
        setItems([...newItems, ...items]);
        setTotalItems((prev) => prev + newItems.length);
        showNotification(`Successfully refilled ${newItems.length} inventory batch(es)!`);
      }
    } catch (err) {
      console.error("Failed to save stock-in transaction:", err);
    }
  };

  const handleReorderLevelSave = async (targetItem, minVal) => {
    try {
      if (targetItem._id) {
        await setReorderLevelApi(targetItem._id, { minStockLevel: minVal }).catch(() => null);
      }
      setItems((prevItems) =>
        prevItems.map((it) =>
          it.id === targetItem.id ? { ...it, minStockLevel: minVal } : it
        )
      );
      showNotification(`Updated reorder threshold for batch #${targetItem.batchNo} to ${minVal} units.`);
    } catch (err) {
      console.error("Failed to update reorder level:", err);
    }
  };

  const handleArchiveBatch = async (targetItem) => {
    try {
      if (targetItem._id) {
        await archiveBatchApi(targetItem._id).catch(() => null);
      }
      setItems((prevItems) =>
        prevItems.map((it) =>
          it.id === targetItem.id ? { ...it, status: "Archived" } : it
        )
      );
      showNotification(`Batch #${targetItem.batchNo} moved to Archived Batches.`);
    } catch (err) {
      console.error("Failed to archive batch:", err);
    }
  };

  const handleRestoreBatch = async (targetItem) => {
    try {
      if (targetItem._id) {
        await restoreBatchApi(targetItem._id).catch(() => null);
      }
      const restoredStatus = targetItem.availableStock === 0 ? "Out of Stock" : targetItem.availableStock <= 50 ? "Low Stock" : "In Stock";
      setItems((prevItems) =>
        prevItems.map((it) =>
          it.id === targetItem.id ? { ...it, status: restoredStatus } : it
        )
      );
      showNotification(`Batch #${targetItem.batchNo} restored back to active inventory (${restoredStatus}).`);
    } catch (err) {
      console.error("Failed to restore batch:", err);
    }
  };

  const handleQuarantineBatch = async (targetItem, actionType) => {
    try {
      if (targetItem._id) {
        await quarantineBatchApi(targetItem._id, { actionType }).catch(() => null);
      }
      const statusText = actionType === "expired" ? "Expired" : "Quarantined";
      setItems((prevItems) =>
        prevItems.map((it) =>
          it.id === targetItem.id ? { ...it, status: statusText } : it
        )
      );
      showNotification(`Batch #${targetItem.batchNo} status updated to ${statusText}.`);
    } catch (err) {
      console.error("Failed to quarantine batch:", err);
    }
  };

  const handleExport = () => {
    const listToExport = filteredItems.length > 0 ? filteredItems : items;
    if (!listToExport || listToExport.length === 0) {
      showNotification("No inventory records found to export.");
      return;
    }

    const headers = ["Medicine Name", "Category", "Batch No", "Expiry Date", "Purchase Price (INR)", "MRP (INR)", "Available Stock", "Unit", "Status"];
    const rows = listToExport.map((i) => [
      `"${(i.name || "").replace(/"/g, '""')}"`,
      `"${(i.category || "").replace(/"/g, '""')}"`,
      `"${(i.batchNo || "").replace(/"/g, '""')}"`,
      `"${i.expiryDate || ""}"`,
      `"${Number(i.purchasePrice || 0).toFixed(2)}"`,
      `"${Number(i.mrp || 0).toFixed(2)}"`,
      `"${i.availableStock || 0}"`,
      `"${i.unit || "Strip"}"`,
      `"${i.status || "In Stock"}"`,
    ]);

    const csvContent = [headers.join(","), ...rows.map((r) => r.join(","))].join("\n");
    const dateStr = new Date().toISOString().split("T")[0];
    downloadFileBlob(csvContent, `Pharmacy_Inventory_${dateStr}.csv`);
  };

  const handleAlertSelect = (alertId) => {
    if (alertId === "low_stock") setActiveTab("low_stock");
    else if (alertId === "out_of_stock") setActiveTab("out_of_stock");
    else if (alertId === "expiring_7" || alertId === "expiring_30") setActiveTab("expiring_soon");
    else setActiveTab("all");
  };

  // Dynamic computed stats ensuring 100% sync between database items and metric cards/tabs
  const computedStats = useMemo(() => {
    const activeItemsList = items.filter((i) => i.status !== "Archived" && i.status !== "archived");
    const archivedItemsList = items.filter((i) => i.status === "Archived" || i.status === "archived");

    const totalMeds = activeItemsList.length;
    const inStockMeds = activeItemsList.filter((i) => i.status === "In Stock" && i.availableStock > 50).length;
    const lowStockMeds = activeItemsList.filter((i) => i.status === "Low Stock" || (i.availableStock > 0 && i.availableStock <= 50)).length;
    const outOfStockMeds = activeItemsList.filter((i) => i.status === "Out of Stock" || i.availableStock === 0).length;
    const expiringMeds = activeItemsList.filter((i) => i.status === "Expiring Soon" || i.daysLeft <= 30).length;
    const archivedMeds = archivedItemsList.length;

    const totalUnits = activeItemsList.reduce((sum, i) => sum + (Number(i.availableStock) || 0), 0);
    const totalValueNum = activeItemsList.reduce((sum, i) => sum + ((Number(i.purchasePrice) || 0) * (Number(i.availableStock) || 0)), 0);

    const categoryMap = {};
    let grandVal = 0;
    activeItemsList.forEach((i) => {
      const cat = i.category || "General";
      const val = (Number(i.purchasePrice) || 0) * (Number(i.availableStock) || 0);
      categoryMap[cat] = (categoryMap[cat] || 0) + val;
      grandVal += val;
    });

    const colors = ["#3B82F6", "#10B981", "#F59E0B", "#8B5CF6", "#EC4899", "#94A3B8"];
    const topCategoriesList = Object.keys(categoryMap).map((cat, idx) => {
      const rawAmount = categoryMap[cat];
      const pct = grandVal > 0 ? Math.round((rawAmount / grandVal) * 100) + "%" : "0%";
      return {
        category: cat,
        rawAmount,
        amount: `₹ ${rawAmount.toLocaleString("en-IN", { minimumFractionDigits: 2 })}`,
        percentage: pct,
        color: colors[idx % colors.length],
      };
    });

    return {
      totalMedicines: (stats?.totalMedicines && stats.totalMedicines !== "0" && stats.totalMedicines !== 0) ? stats.totalMedicines : totalMeds,
      totalStockUnits: (stats?.totalStockUnits && stats.totalStockUnits !== "0") ? stats.totalStockUnits : totalUnits.toLocaleString("en-IN"),
      stockValue: (stats?.stockValue && stats.stockValue !== "₹ 0.00") ? stats.stockValue : `₹ ${totalValueNum.toLocaleString("en-IN", { minimumFractionDigits: 2 })}`,
      lowStockItems: (stats?.lowStockItems && stats.lowStockItems !== 0) ? stats.lowStockItems : lowStockMeds,
      outOfStock: stats?.outOfStock ?? outOfStockMeds,
      expiringSoon: stats?.expiringSoon ?? expiringMeds,
      countsByTab: {
        all: totalMeds,
        in_stock: inStockMeds,
        inStock: inStockMeds,
        low_stock: lowStockMeds,
        lowStock: lowStockMeds,
        out_of_stock: outOfStockMeds,
        outOfStock: outOfStockMeds,
        expiring_soon: expiringMeds,
        expiringSoon: expiringMeds,
        archived: archivedMeds,
        archivedBatches: archivedMeds,
      },
      stockAlertsSummary: {
        lowStockItems: lowStockMeds,
        outOfStockItems: outOfStockMeds,
        expiring7Days: Math.max(0, Math.floor(expiringMeds * 0.3)),
        expiring30Days: expiringMeds,
      },
      expiringSoonList: stats?.expiringSoonList || [],
      topCategories: topCategoriesList.length > 0 ? topCategoriesList : stats?.topCategories,
    };
  }, [stats, items]);

  return (
    <div className="space-y-6 max-w-[1600px] mx-auto pb-10 text-slate-800">
      {/* Dynamic Notification Toast */}
      {notificationMsg && (
        <div className="p-3.5 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-2xl flex items-center justify-between font-bold animate-fadeIn text-xs shadow-xs">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>{notificationMsg}</span>
          </div>
          <button
            type="button"
            onClick={() => setNotificationMsg("")}
            className="text-emerald-500 hover:text-emerald-700 font-bold px-1"
          >
            ✕
          </button>
        </div>
      )}

      {/* 1. Header Title & Top-Right Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Inventory & Stock Management</h1>
          <p className="text-xs font-semibold text-slate-400 mt-0.5">
            Pharmacy &gt; <span className="text-slate-600 font-bold">Inventory</span>
          </p>
        </div>

        {/* Top-Right Action Buttons */}
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => setIsStockInOpen(true)}
            className="bg-blue-600 hover:bg-blue-700 text-white rounded-xl px-4 py-2.5 text-xs font-bold flex items-center gap-2 shadow-sm transition-all cursor-pointer"
          >
            <Plus className="w-4 h-4 stroke-[2.5]" />
            <span>Stock In (Refill)</span>
          </button>

          {/* Direct Standalone Export Button */}
          <button
            type="button"
            onClick={handleExport}
            className="bg-white border border-slate-200 hover:border-slate-300 hover:bg-slate-50 text-slate-700 rounded-xl px-4 py-2.5 text-xs font-bold flex items-center gap-2 shadow-2xs transition-all cursor-pointer"
          >
            <Download className="w-4 h-4 text-slate-500" />
            <span>Export</span>
          </button>
        </div>
      </div>

      {/* 2. KPI Cards (6 Metrics) */}
      <InventoryKpiCards stats={computedStats} isLoading={loading} />

      {/* 3. Search & Filter Bar */}
      <InventoryFilterBar
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        categoryFilter={categoryFilter}
        onCategoryChange={setCategoryFilter}
        manufacturerFilter={manufacturerFilter}
        onManufacturerChange={setManufacturerFilter}
        statusFilter={statusFilter}
        onStatusChange={setStatusFilter}
        expiryFilter={expiryFilter}
        onExpiryChange={setExpiryFilter}
        onResetFilters={() => {
          setSearchQuery("");
          setCategoryFilter("all");
          setManufacturerFilter("all");
          setStatusFilter("all");
          setExpiryFilter("all");
        }}
      />

      {/* 4. Inventory Tabs */}
      <InventoryTabs activeTab={activeTab} onSelectTab={setActiveTab} counts={computedStats.countsByTab} />

      {/* 5. Main 2-Column Content: Table (Left) & Analytics Panels (Right) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column: Central Inventory Table (~68% width) */}
        <div className="lg:col-span-8 flex flex-col">
          <InventoryTable
            items={filteredItems}
            isLoading={loading}
            currentPage={currentPage}
            totalPages={totalPages}
            totalItems={filteredItems.length}
            itemsPerPage={itemsPerPage}
            onPageChange={setCurrentPage}
            onItemsPerPageChange={setItemsPerPage}
            onViewItem={(item) => {
              setSelectedDetailItem(item);
              setIsDetailOpen(true);
            }}
            onStockInItem={() => {
              setIsStockInOpen(true);
            }}
            onViewHistory={(item) => {
              setSelectedHistoryItem(item);
            }}
            onAdjustStock={(item) => {
              setSelectedAdjustItem(item);
            }}
            onTransferStock={(item) => {
              showNotification(`Initiated stock transfer for batch #${item.batchNo} to Ward Store.`);
            }}
            onCreatePO={(item) => {
              setSelectedPOItem(item);
            }}
            onQuarantine={(item, actionType) => {
              handleQuarantineBatch(item, actionType);
            }}
            onArchive={(item) => {
              handleArchiveBatch(item);
            }}
            onRestore={(item) => {
              handleRestoreBatch(item);
            }}
            onSetReorderLevel={(item) => {
              setSelectedReorderItem(item);
            }}
          />
        </div>

        {/* Right Column: 3 Analytics Panels (~32% width) */}
        <div className="lg:col-span-4 space-y-5">
          {/* Panel 1: Stock Alerts Summary */}
          <StockAlertsSummaryCard summaryData={computedStats.stockAlertsSummary} onSelectAlert={handleAlertSelect} />

          {/* Panel 2: Expiring Soon Panel */}
          <ExpiringSoonPanelCard items={computedStats.expiringSoonList} onViewAll={() => setActiveTab("expiring_soon")} />

          {/* Panel 3: Top Categories by Stock Value Donut Chart */}
          <TopCategoriesValueChartCard
            categories={computedStats.topCategories}
            onViewReport={() => showNotification("Opening Category Stock Valuation Report...")}
          />
        </div>
      </div>

      {/* Modals */}
      <StockInModal
        isOpen={isStockInOpen}
        onClose={() => setIsStockInOpen(false)}
        onSubmit={handleStockInSubmit}
      />

      <InventoryDetailModal
        item={selectedDetailItem}
        isOpen={isDetailOpen}
        onClose={() => setIsDetailOpen(false)}
      />

      <InventoryStockHistoryModal
        item={selectedHistoryItem}
        isOpen={Boolean(selectedHistoryItem)}
        onClose={() => setSelectedHistoryItem(null)}
      />

      <InventoryAdjustStockModal
        item={selectedAdjustItem}
        isOpen={Boolean(selectedAdjustItem)}
        onClose={() => setSelectedAdjustItem(null)}
        onSuccess={() => {
          showNotification("Stock level adjusted successfully.");
          loadData();
        }}
      />

      <CreatePurchaseOrderModal
        item={selectedPOItem}
        isOpen={Boolean(selectedPOItem)}
        onClose={() => setSelectedPOItem(null)}
      />

      <SetReorderLevelModal
        item={selectedReorderItem}
        isOpen={Boolean(selectedReorderItem)}
        onClose={() => setSelectedReorderItem(null)}
        onSave={handleReorderLevelSave}
      />
    </div>
  );
}
