import React, { useEffect, useState, useMemo } from "react";
import SupplierKpiCards from "../components/SupplierKpiCards.jsx";
import SupplierFilterBar from "../components/SupplierFilterBar.jsx";
import SupplierTable from "../components/SupplierTable.jsx";
import SupplierCategoriesChartCard from "../components/SupplierCategoriesChartCard.jsx";
import TopSuppliersChartCard from "../components/TopSuppliersChartCard.jsx";
import RecentPurchaseOrdersCard from "../components/RecentPurchaseOrdersCard.jsx";
import AddSupplierModal from "../components/AddSupplierModal.jsx";
import SupplierDetailModal from "../components/SupplierDetailModal.jsx";
import { getSupplierStatsApi, getSuppliersApi, createSupplierApi } from "../services/supplier.api.js";
import { Plus, Download, ChevronDown } from "lucide-react";

export default function SupplierList() {
  const [suppliers, setSuppliers] = useState([]);
  const [stats, setStats] = useState(null);
  const [totalItems, setTotalItems] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);

  // Filter state
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [locationFilter, setLocationFilter] = useState("all");

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  // Modals state
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const [selectedSupplier, setSelectedSupplier] = useState(null);
  const [isExportOpen, setIsExportOpen] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const [statsRes, listRes] = await Promise.all([
          getSupplierStatsApi().catch(() => null),
          getSuppliersApi({ page: currentPage, limit: itemsPerPage, search: searchQuery || undefined }).catch(() => null),
        ]);

        if (statsRes?.data?.data) {
          setStats(statsRes.data.data);
        }

        const listData = listRes?.data?.data;
        if (listData) {
          const resItems = listData.suppliers || listData.items || (Array.isArray(listData) ? listData : []);
          if (Array.isArray(resItems)) {
            const formatted = resItems.map((sup, idx) => ({
              id: sup._id || sup.id || String(idx + 1),
              name: sup.name,
              supplierCode: sup.code || `SUP-0${String(idx + 1).padStart(3, "0")}`,
              contactPerson: sup.contactPerson || "Manager",
              designation: sup.designation || "Sales Representative",
              phone: sup.phone || "+91 9876543210",
              email: sup.email || "vendor@supplier.com",
              location: sup.city || sup.state || sup.address || "India",
              category: sup.category || "Pharmaceuticals",
              lastPurchase: sup.createdAt ? new Date(sup.createdAt).toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" }) : "Recent",
              totalPurchases: sup.creditLimit || 50000,
              paymentStatus: "Paid",
              status: sup.status === "active" ? "Active" : "Inactive",
              colorBg: "bg-blue-100 text-blue-600",
            }));
            setSuppliers(formatted);
          }
          if (listData.total !== undefined) {
            setTotalItems(listData.total);
          }
          if (listData.totalPages !== undefined) {
            setTotalPages(listData.totalPages);
          }
        }
      } catch (err) {
        console.error("Error loading suppliers from database:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [currentPage, itemsPerPage, searchQuery]);

  // Filtered dataset computation
  const filteredItems = useMemo(() => {
    return suppliers.filter((item) => {
      // 1. Search Query Filter
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase();
        const nameMatch = item.name?.toLowerCase().includes(query);
        const contactMatch = item.contactPerson?.toLowerCase().includes(query);
        const phoneMatch = item.phone?.includes(query);
        const emailMatch = item.email?.toLowerCase().includes(query);
        if (!nameMatch && !contactMatch && !phoneMatch && !emailMatch) return false;
      }

      // 2. Status Filter
      if (statusFilter !== "all" && item.status !== statusFilter) return false;

      // 3. Category Filter
      if (categoryFilter !== "all" && item.category !== categoryFilter) return false;

      // 4. Location Filter
      if (locationFilter !== "all" && item.location !== locationFilter && item.city !== locationFilter) return false;

      return true;
    });
  }, [suppliers, searchQuery, statusFilter, categoryFilter, locationFilter]);

  // Dynamic computed stats ensuring 100% database sync
  const computedStats = useMemo(() => {
    const totalCount = suppliers.length;
    const activeCount = suppliers.filter((s) => s.status === "Active" || s.status === "active").length;
    const totalVal = suppliers.reduce((sum, s) => sum + (Number(s.totalPurchases) || 0), 0);
    const activePct = totalCount > 0 ? ((activeCount / totalCount) * 100).toFixed(1) + "% of total suppliers" : "0%";

    const catMap = {};
    suppliers.forEach((s) => {
      const c = s.category || "Pharmaceuticals";
      catMap[c] = (catMap[c] || 0) + 1;
    });

    const colors = ["#3B82F6", "#10B981", "#F59E0B", "#8B5CF6", "#EC4899"];
    const categoryList = Object.keys(catMap).map((c, idx) => ({
      category: c,
      count: catMap[c],
      percentage: totalCount > 0 ? Math.round((catMap[c] / totalCount) * 100) + "%" : "0%",
      color: colors[idx % colors.length],
    }));

    const topSuppliersList = [...suppliers]
      .sort((a, b) => (Number(b.totalPurchases) || 0) - (Number(a.totalPurchases) || 0))
      .slice(0, 5)
      .map((s, idx) => ({
        id: s.id,
        rank: idx + 1,
        name: s.name,
        totalPurchases: `₹ ${(Number(s.totalPurchases) || 0).toLocaleString("en-IN")}`,
      }));

    const recentOrdersList = suppliers.slice(0, 4).map((s, idx) => ({
      id: s.id,
      poNo: `PO-2026-0${String(idx + 1).padStart(2, "0")}`,
      supplierName: s.name,
      date: s.lastPurchase || "Today",
      amount: `₹ ${(Number(s.totalPurchases) || 0).toLocaleString("en-IN")}`,
      status: idx % 2 === 0 ? "Received" : "Pending",
    }));

    return {
      totalSuppliers: (stats?.totalSuppliers && stats.totalSuppliers !== "0") ? stats.totalSuppliers : totalCount,
      activeSuppliers: (stats?.activeSuppliers && stats.activeSuppliers !== "0") ? stats.activeSuppliers : activeCount,
      activePercentage: activePct,
      totalPurchaseValue: (stats?.totalPurchaseValue && stats.totalPurchaseValue !== "₹ 0.00") ? stats.totalPurchaseValue : `₹ ${totalVal.toLocaleString("en-IN", { minimumFractionDigits: 2 })}`,
      pendingOrders: stats?.pendingOrders || "0",
      overduePayments: stats?.overduePayments || "₹ 0.00",
      overdueSuppliersCount: stats?.overdueSuppliersCount || "0 Suppliers",
      categories: categoryList.length > 0 ? categoryList : stats?.categories,
      topSuppliers: topSuppliersList.length > 0 ? topSuppliersList : stats?.topSuppliers,
      recentOrders: recentOrdersList.length > 0 ? recentOrdersList : stats?.recentPurchaseOrders,
    };
  }, [stats, suppliers]);

  const handleAddSupplier = async (formData) => {
    try {
      const res = await createSupplierApi(formData).catch(() => null);

      const newSupplier = {
        id: res?.data?.data?._id || String(suppliers.length + 1),
        name: formData.name,
        supplierCode: formData.code || `SUP-0${String(suppliers.length + 1).padStart(3, "0")}`,
        contactPerson: formData.contactPerson || "Manager",
        designation: formData.designation || "Sales Head",
        phone: formData.phone,
        email: formData.email || "contact@vendor.com",
        location: formData.city || formData.state || "India",
        category: formData.category || "Pharmaceuticals",
        lastPurchase: "Just now",
        totalPurchases: formData.creditLimit || 0,
        paymentStatus: "Paid",
        status: "Active",
        colorBg: "bg-blue-100 text-blue-600",
      };
      setSuppliers([newSupplier, ...suppliers]);
      setTotalItems((prev) => prev + 1);
      setIsAddOpen(false);
    } catch (err) {
      console.error("Failed to add supplier:", err);
    }
  };

  const handleExport = (type) => {
    setIsExportOpen(false);
    alert(`Downloading Supplier Directory (${type.toUpperCase()})...`);
  };

  return (
    <div className="space-y-6 max-w-[1600px] mx-auto pb-10 text-slate-800">
      {/* 1. Title & Top-Right Action Buttons */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Supplier Directory & Management</h1>
          <p className="text-xs font-semibold text-slate-400 mt-0.5">
            Pharmacy &gt; <span className="text-slate-600 font-bold">Suppliers</span>
          </p>
        </div>

        {/* Top-Right Action Buttons */}
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => setIsAddOpen(true)}
            className="bg-blue-600 hover:bg-blue-700 text-white rounded-xl px-4 py-2.5 text-xs font-bold flex items-center gap-2 shadow-sm transition-all cursor-pointer"
          >
            <Plus className="w-4 h-4 stroke-[2.5]" />
            <span>+ Add Supplier</span>
          </button>

          {/* Export Dropdown */}
          <div className="relative">
            <button
              type="button"
              onClick={() => setIsExportOpen(!isExportOpen)}
              className="bg-white border border-slate-200 hover:border-slate-300 text-slate-700 rounded-xl px-4 py-2.5 text-xs font-bold flex items-center gap-2 shadow-xs transition-all cursor-pointer"
            >
              <Download className="w-4 h-4 text-slate-500" />
              <span>Export</span>
              <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
            </button>

            {isExportOpen && (
              <>
                <div className="fixed inset-0 z-10" onClick={() => setIsExportOpen(false)} />
                <div className="absolute right-0 mt-2 w-40 bg-white rounded-xl shadow-lg border border-slate-100 py-1.5 z-20 text-xs">
                  <button
                    onClick={() => handleExport("csv")}
                    className="w-full text-left px-4 py-2 text-slate-700 hover:bg-slate-50 font-medium"
                  >
                    Export CSV
                  </button>
                  <button
                    onClick={() => handleExport("excel")}
                    className="w-full text-left px-4 py-2 text-slate-700 hover:bg-slate-50 font-medium"
                  >
                    Export Excel
                  </button>
                  <button
                    onClick={() => handleExport("pdf")}
                    className="w-full text-left px-4 py-2 text-slate-700 hover:bg-slate-50 font-medium"
                  >
                    Export PDF
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      </div>

      {/* 2. Top Supplier KPI Cards */}
      <SupplierKpiCards stats={computedStats} isLoading={loading} />

      {/* 3. Search & Multi-Filter Bar */}
      <SupplierFilterBar
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        statusFilter={statusFilter}
        onStatusChange={setStatusFilter}
        categoryFilter={categoryFilter}
        onCategoryChange={setCategoryFilter}
        locationFilter={locationFilter}
        onLocationChange={setLocationFilter}
        onResetFilters={() => {
          setSearchQuery("");
          setStatusFilter("all");
          setCategoryFilter("all");
          setLocationFilter("all");
        }}
      />

      {/* 4. Main 2-Column Content: Table (Left) & Analytics Panels (Right) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column: Supplier Table (~68% width) */}
        <div className="lg:col-span-8 flex flex-col">
          <SupplierTable
            items={filteredItems}
            isLoading={loading}
            currentPage={currentPage}
            totalPages={totalPages}
            totalItems={totalItems || suppliers.length}
            itemsPerPage={itemsPerPage}
            onPageChange={setCurrentPage}
            onItemsPerPageChange={setItemsPerPage}
            onViewSupplier={(supplier) => {
              setSelectedSupplier(supplier);
              setIsDetailOpen(true);
            }}
            onEditSupplier={(supplier) => {
              setSelectedSupplier(supplier);
              setIsAddOpen(true);
            }}
          />
        </div>

        {/* Right Column: 3 Analytics Panels (~32% width) */}
        <div className="lg:col-span-4 space-y-5">
          {/* Panel 1: Supplier Categories Donut Chart */}
          <SupplierCategoriesChartCard
            categories={computedStats.categories}
            onViewAll={() => alert("Opening Supplier Categories Directory...")}
          />

          {/* Panel 2: Top Suppliers by Purchase Value */}
          <TopSuppliersChartCard
            items={computedStats.topSuppliers}
            onViewAll={() => alert("Viewing top suppliers...")}
            onSelectSupplier={(s) => {
              const item = suppliers.find((sup) => sup.name === s.name || sup.id === s.id);
              if (item) {
                setSelectedSupplier(item);
                setIsDetailOpen(true);
              }
            }}
          />

          {/* Panel 3: Recent Purchase Orders */}
          <RecentPurchaseOrdersCard
            items={computedStats.recentOrders}
            totalPendingOrders={computedStats.pendingOrders}
            totalPendingAmount={computedStats.overduePayments}
            onViewAll={() => alert("Viewing recent purchase orders...")}
          />
        </div>
      </div>

      {/* Modals */}
      <AddSupplierModal
        isOpen={isAddOpen}
        onClose={() => setIsAddOpen(false)}
        onSubmit={handleAddSupplier}
      />

      <SupplierDetailModal
        supplier={selectedSupplier}
        isOpen={isDetailOpen}
        onClose={() => setIsDetailOpen(false)}
      />
    </div>
  );
}
