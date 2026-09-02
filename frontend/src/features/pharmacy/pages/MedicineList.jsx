import React, { useState, useEffect, useMemo } from "react";
import { Plus, Download, ChevronDown } from "lucide-react";
import { getMedicinesApi, getMedicineStatsApi, createMedicineApi, updateMedicineApi } from "../services/medicine.api.js";

import MedicineKpiCards from "../components/MedicineKpiCards.jsx";
import MedicineFilterBar from "../components/MedicineFilterBar.jsx";
import MedicineTabs from "../components/MedicineTabs.jsx";
import MedicineTable from "../components/MedicineTable.jsx";
import TherapeuticCategoriesChartCard from "../components/TherapeuticCategoriesChartCard.jsx";
import TopManufacturersCard from "../components/TopManufacturersCard.jsx";
import GstDistributionCard from "../components/GstDistributionCard.jsx";
import MedicineDetailModal from "../components/MedicineDetailModal.jsx";
import MedicineForm from "../components/MedicineForm.jsx";
import Modal from "../../../components/ui/Modal.jsx";

export default function MedicineList() {
  const [items, setItems] = useState([]);
  const [stats, setStats] = useState(null);
  const [totalItems, setTotalItems] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);

  // Filter & Search states
  const [activeTab, setActiveTab] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [manufacturerFilter, setManufacturerFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [dosageFormFilter, setDosageFormFilter] = useState("all");
  const [gstFilter, setGstFilter] = useState("all");

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  // Modals state
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const [selectedDetailItem, setSelectedDetailItem] = useState(null);
  const [isExportOpen, setIsExportOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  // Fetch stats and data live from backend DB
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const [statsRes, listRes] = await Promise.all([
          getMedicineStatsApi().catch(() => null),
          getMedicinesApi({ page: currentPage, limit: itemsPerPage, search: searchQuery || undefined }).catch(() => null),
        ]);

        if (statsRes?.data?.data) {
          setStats(statsRes.data.data);
        }

        const listData = listRes?.data?.data;
        if (listData) {
          const resItems = listData.items || listData.medicines || (Array.isArray(listData) ? listData : []);
          if (Array.isArray(resItems)) {
            setItems(resItems);
          }
          if (listData.total !== undefined) {
            setTotalItems(listData.total);
          } else if (Array.isArray(resItems)) {
            setTotalItems(resItems.length);
          }
          if (listData.totalPages !== undefined) {
            setTotalPages(listData.totalPages);
          }
        }
      } catch (err) {
        console.error("Error loading medicines from database:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [currentPage, itemsPerPage, searchQuery]);

  // Compute filtered dataset
  const filteredItems = useMemo(() => {
    return items.filter((item) => {
      // 1. Tab Filter
      if (activeTab === "active" && (item.status === "Inactive" || item.status === "inactive")) return false;
      if (activeTab === "inactive" && (item.status === "Active" || item.status === "active")) return false;

      // 2. Search Query
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase();
        const nameMatch = item.name?.toLowerCase().includes(query);
        const codeMatch = item.code?.toLowerCase().includes(query);
        const brandMatch = item.brandName?.toLowerCase().includes(query);
        const genericMatch = item.genericName?.toLowerCase().includes(query);
        const mfgMatch = item.manufacturer?.toLowerCase().includes(query);
        if (!nameMatch && !codeMatch && !brandMatch && !genericMatch && !mfgMatch) return false;
      }

      // 3. Category Filter
      if (categoryFilter !== "all" && item.category !== categoryFilter) return false;

      // 4. Manufacturer Filter
      if (manufacturerFilter !== "all" && item.manufacturer !== manufacturerFilter) return false;

      // 5. Status Filter
      if (statusFilter !== "all") {
        if (statusFilter === "Active" && item.status !== "Active" && item.status !== "active") return false;
        if (statusFilter === "Inactive" && item.status !== "Inactive" && item.status !== "inactive") return false;
      }

      // 6. Dosage Form Filter
      if (dosageFormFilter !== "all" && item.dosageForm !== dosageFormFilter) return false;

      // 7. GST Filter
      if (gstFilter !== "all" && String(item.gstRate || item.gst) !== String(gstFilter)) return false;

      return true;
    });
  }, [items, activeTab, searchQuery, categoryFilter, manufacturerFilter, statusFilter, dosageFormFilter, gstFilter]);

  const handleToggleStatus = async (item) => {
    const newStatus = item.status === "Active" || item.status === "active" ? "inactive" : "active";
    try {
      await updateMedicineApi(item._id || item.id, { status: newStatus }).catch(() => null);
      setItems(
        items.map((it) => ((it.id === item.id || it._id === item._id) ? { ...it, status: newStatus } : it))
      );
    } catch (err) {
      console.error("Failed to toggle status:", err);
    }
  };

  const handleCreateOrUpdate = async (formData) => {
    setSubmitting(true);
    try {
      if (editingItem) {
        await updateMedicineApi(editingItem._id || editingItem.id, formData).catch(() => null);
        setItems(
          items.map((it) => ((it.id === editingItem.id || it._id === editingItem._id) ? { ...it, ...formData } : it))
        );
      } else {
        const res = await createMedicineApi(formData).catch(() => null);
        const newItem = res?.data?.data || {
          id: String(items.length + 1),
          ...formData,
          colorBg: "bg-blue-100 text-blue-600",
        };
        setItems([newItem, ...items]);
        setTotalItems((prev) => prev + 1);
      }

      if (formData.addAnother) {
        setEditingItem(null);
      } else {
        setIsFormOpen(false);
        setEditingItem(null);
      }
    } catch (err) {
      alert("Failed to save medicine: " + (err.message || "Error"));
    } finally {
      setSubmitting(false);
    }
  };

  const handleExport = (type) => {
    setIsExportOpen(false);
    alert(`Downloading Master Catalog (${type.toUpperCase()})...`);
  };

  return (
    <div className="space-y-6 max-w-[1600px] mx-auto pb-10 text-slate-800">
      {/* 1. Title & Primary Action Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Medicines Master Catalog</h1>
          <p className="text-xs font-semibold text-slate-400 mt-0.5">
            Pharmacy &gt; <span className="text-slate-600 font-bold">Medicines</span>
          </p>
        </div>

        {/* Top-Right Action Buttons */}
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => {
              setEditingItem(null);
              setIsFormOpen(true);
            }}
            className="bg-blue-600 hover:bg-blue-700 text-white rounded-xl px-4 py-2.5 text-xs font-bold flex items-center gap-2 shadow-sm transition-all cursor-pointer"
          >
            <Plus className="w-4 h-4 stroke-[2.5]" />
            <span>+ Add Medicine</span>
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

      {/* 2. KPI Cards Row */}
      <MedicineKpiCards stats={stats} isLoading={loading} />

      {/* 3. Search & Filter Controls Bar */}
      <MedicineFilterBar
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        categoryFilter={categoryFilter}
        onCategoryChange={setCategoryFilter}
        manufacturerFilter={manufacturerFilter}
        onManufacturerChange={setManufacturerFilter}
        statusFilter={statusFilter}
        onStatusChange={setStatusFilter}
        dosageFormFilter={dosageFormFilter}
        onDosageFormChange={setDosageFormFilter}
        gstFilter={gstFilter}
        onGstChange={setGstFilter}
        onResetFilters={() => {
          setSearchQuery("");
          setCategoryFilter("all");
          setManufacturerFilter("all");
          setStatusFilter("all");
          setDosageFormFilter("all");
          setGstFilter("all");
        }}
      />

      {/* 4. Tab Navigation */}
      <MedicineTabs
        activeTab={activeTab}
        onSelectTab={setActiveTab}
        counts={stats?.countsByTab || { all: totalItems, active: stats?.activeMedicines || 0, inactive: stats?.inactiveMedicines || 0 }}
      />

      {/* 5. Main 2-Column Section */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column: Main Medicine Table (~68% width) */}
        <div className="lg:col-span-8 flex flex-col">
          <MedicineTable
            items={filteredItems}
            isLoading={loading}
            currentPage={currentPage}
            totalPages={totalPages}
            totalItems={totalItems}
            itemsPerPage={itemsPerPage}
            onPageChange={setCurrentPage}
            onItemsPerPageChange={setItemsPerPage}
            onViewItem={(item) => {
              setSelectedDetailItem(item);
              setIsDetailOpen(true);
            }}
            onEditItem={(item) => {
              setEditingItem(item);
              setIsFormOpen(true);
            }}
            onToggleStatusItem={handleToggleStatus}
          />
        </div>

        {/* Right Column: 3 Analytics Cards (~32% width) */}
        <div className="lg:col-span-4 space-y-5">
          {/* Card 1: Top Therapeutic Categories (Donut Chart) */}
          <TherapeuticCategoriesChartCard
            categories={stats?.therapeuticCategories}
            onViewAll={() => alert("Opening Therapeutic Categories Report...")}
          />

          {/* Card 2: Top Manufacturers */}
          <TopManufacturersCard
            manufacturers={stats?.topManufacturers}
            onViewAll={() => alert("Opening Manufacturers Directory...")}
          />

          {/* Card 3: GST Distribution Table */}
          <GstDistributionCard
            gstData={stats?.gstDistribution}
            onViewAll={() => alert("Opening GST Distribution Report...")}
          />
        </div>
      </div>

      {/* Modals */}
      <Modal
        isOpen={isFormOpen}
        onClose={() => setIsFormOpen(false)}
        title={editingItem ? "Edit Medicine Master Record" : "Add New Medicine Master Record"}
      >
        <MedicineForm
          defaultValues={editingItem}
          onSubmit={handleCreateOrUpdate}
          onCancel={() => setIsFormOpen(false)}
          submitting={submitting}
        />
      </Modal>

      <MedicineDetailModal
        item={selectedDetailItem}
        isOpen={isDetailOpen}
        onClose={() => setIsDetailOpen(false)}
      />
    </div>
  );
}