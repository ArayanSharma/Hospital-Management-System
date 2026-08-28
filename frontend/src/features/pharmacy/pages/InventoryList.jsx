import { useState, useEffect } from "react";
import { Plus, Package, AlertTriangle, ArrowUpRight, Filter, ShieldAlert, CheckCircle2 } from "lucide-react";
import { getInventoryApi, createInventoryApi } from "../services/inventory.api.js";
import { useDebounce } from "../../../hooks/useDebounce.js";
import Table from "../../../components/ui/Table.jsx";
import SearchInput from "../../../components/common/SearchInput.jsx";
import Button from "../../../components/ui/Button.jsx";
import Modal from "../../../components/ui/Modal.jsx";
import Loading from "../../../components/common/Loading.jsx";
import ErrorState from "../../../components/common/ErrorState.jsx";
import InventoryForm from "../components/InventoryForm.jsx";
import StockInModal from "../components/StockInModal.jsx";

export default function InventoryList() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [lowStockOnly, setLowStockOnly] = useState(false);
  const [categoryFilter, setCategoryFilter] = useState("");

  const debouncedSearch = useDebounce(search, 400);

  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const [stockInItem, setStockInItem] = useState(null);

  const fetchInventory = async () => {
    setLoading(true);
    try {
      const params = {};
      if (debouncedSearch) params.search = debouncedSearch;
      if (lowStockOnly) params.lowStock = "true";
      if (categoryFilter) params.category = categoryFilter;

      const { data } = await getInventoryApi(params);
      const inventoryData = data.data?.items || data.data || [];
      setItems(inventoryData);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to load inventory");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchInventory();
  }, [debouncedSearch, lowStockOnly, categoryFilter]);

  const handleCreateSubmit = async (formData) => {
    setSubmitting(true);
    try {
      await createInventoryApi(formData);
      setCreateModalOpen(false);
      fetchInventory();
    } catch (err) {
      alert(err.response?.data?.message || "Failed to create inventory item");
    } finally {
      setSubmitting(false);
    }
  };

  // Metrics calculation
  const lowStockCount = items.filter((item) => item.quantity <= item.minimumStock).length;
  const outOfStockCount = items.filter((item) => item.quantity === 0).length;

  const columns = [
    {
      key: "itemName",
      label: "Item Name",
      render: (row) => {
        const isLow = row.quantity <= row.minimumStock;
        return (
          <div className="flex items-center gap-2.5">
            <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${
              isLow ? "bg-amber-100 text-amber-700" : "bg-purple-50 text-purple-600"
            }`}>
              {isLow ? <AlertTriangle className="w-4 h-4 text-amber-600 animate-pulse" /> : <Package className="w-4 h-4" />}
            </div>
            <div>
              <p className="font-semibold text-gray-900 flex items-center gap-1.5">
                {row.itemName}
                {isLow && (
                  <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-red-100 text-red-700 border border-red-200">
                    <ShieldAlert className="w-3 h-3 text-red-600" /> LOW STOCK
                  </span>
                )}
              </p>
              <p className="text-xs text-gray-400">
                Supplier: {row.supplierId?.name || row.supplierId?.company || "N/A"}
              </p>
            </div>
          </div>
        );
      },
    },
    { key: "category", label: "Category", render: (row) => row.category || "—" },
    {
      key: "quantity",
      label: "Stock Level",
      render: (row) => {
        const isLow = row.quantity <= row.minimumStock;
        return (
          <div>
            <div className="flex items-baseline gap-1">
              <span className={`text-base font-bold ${isLow ? "text-red-600" : "text-gray-900"}`}>
                {row.quantity}
              </span>
              <span className="text-xs text-gray-500">{row.unit}s</span>
            </div>
            <p className="text-[11px] text-gray-400">Min limit: {row.minimumStock}</p>
          </div>
        );
      },
    },
    {
      key: "batchNumber",
      label: "Batch / Expiry",
      render: (row) => (
        <div className="text-xs text-gray-600">
          <p className="font-medium">{row.batchNumber || "—"}</p>
          {row.expiryDate ? (
            <p className="text-gray-400">Exp: {new Date(row.expiryDate).toLocaleDateString()}</p>
          ) : (
            <p className="text-gray-400">No exp date</p>
          )}
        </div>
      ),
    },
    {
      key: "status",
      label: "Alert Status",
      render: (row) => {
        const isLow = row.quantity <= row.minimumStock;
        if (row.quantity === 0) {
          return (
            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-red-600 text-white">
              <AlertTriangle className="w-3.5 h-3.5" /> Out of Stock
            </span>
          );
        }
        if (isLow) {
          return (
            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-amber-100 text-amber-800 border border-amber-300">
              <AlertTriangle className="w-3.5 h-3.5 text-amber-600" /> Reorder Required
            </span>
          );
        }
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium bg-emerald-50 text-emerald-700">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" /> Healthy Stock
          </span>
        );
      },
    },
    {
      key: "actions",
      label: "",
      render: (row) => (
        <button
          onClick={() => setStockInItem(row)}
          className="inline-flex items-center gap-1 px-3 py-1 rounded-md text-xs font-semibold bg-purple-50 text-purple-700 hover:bg-purple-100 transition-colors border border-purple-200"
        >
          <ArrowUpRight className="w-3.5 h-3.5" /> Stock In
        </button>
      ),
    },
  ];

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-semibold text-gray-900">Inventory Management</h1>
          <p className="text-sm text-gray-500">Track stock levels, reorder thresholds & low-stock alerts</p>
        </div>
        <Button onClick={() => setCreateModalOpen(true)}>
          <span className="flex items-center gap-1.5">
            <Plus className="w-4 h-4" /> Add Inventory Item
          </span>
        </Button>
      </div>

      {/* Low-Stock Alert Visual Banner */}
      {lowStockCount > 0 && (
        <div className="bg-amber-50 border-l-4 border-amber-500 p-4 rounded-r-lg shadow-sm flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-amber-100 rounded-full text-amber-700">
              <AlertTriangle className="w-6 h-6 animate-pulse text-amber-600" />
            </div>
            <div>
              <h3 className="font-semibold text-amber-900 text-sm">
                Low Stock Alert ({lowStockCount} {lowStockCount === 1 ? "item" : "items"} need attention)
              </h3>
              <p className="text-xs text-amber-700">
                {outOfStockCount > 0
                  ? `${outOfStockCount} item(s) completely out of stock! Perform stock-in to prevent shortage.`
                  : "Stock levels for these items have dropped below minimum threshold limits."}
              </p>
            </div>
          </div>
          <button
            onClick={() => setLowStockOnly((prev) => !prev)}
            className={`px-3 py-1.5 rounded-md text-xs font-semibold transition-all border ${
              lowStockOnly
                ? "bg-amber-600 text-white border-amber-700"
                : "bg-white text-amber-900 border-amber-300 hover:bg-amber-100"
            }`}
          >
            {lowStockOnly ? "Showing Low Stock Only" : "Filter Low Stock Items"}
          </button>
        </div>
      )}

      {/* Filters and Controls */}
      <div className="flex flex-wrap items-center justify-between gap-3 bg-white p-3 rounded-lg border border-gray-200">
        <div className="w-72">
          <SearchInput value={search} onChange={setSearch} placeholder="Search inventory items..." />
        </div>

        <div className="flex items-center gap-3">
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-lg text-xs font-medium text-gray-700 outline-none focus:ring-2 focus:ring-purple-500 bg-white"
          >
            <option value="">All Categories</option>
            <option value="Medicine">Medicine</option>
            <option value="Surgical Equipment">Surgical Equipment</option>
            <option value="Consumables">Consumables</option>
            <option value="Lab Supplies">Lab Supplies</option>
            <option value="General">General</option>
          </select>

          <button
            onClick={() => setLowStockOnly((prev) => !prev)}
            className={`inline-flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-semibold transition-colors border ${
              lowStockOnly
                ? "bg-red-50 text-red-700 border-red-300"
                : "bg-gray-50 text-gray-700 border-gray-200 hover:bg-gray-100"
            }`}
          >
            <Filter className="w-3.5 h-3.5" />
            Low Stock Only
            {lowStockCount > 0 && (
              <span className="ml-1 px-1.5 py-0.5 rounded-full text-[10px] bg-red-600 text-white font-bold">
                {lowStockCount}
              </span>
            )}
          </button>
        </div>
      </div>

      {/* Table view */}
      {loading ? (
        <Loading />
      ) : error ? (
        <ErrorState message={error} />
      ) : (
        <Table
          columns={columns}
          data={items}
          emptyMessage={
            lowStockOnly
              ? "No items are currently below minimum stock limits."
              : "No inventory items found."
          }
        />
      )}

      {/* Create Inventory Item Modal */}
      <Modal isOpen={createModalOpen} onClose={() => setCreateModalOpen(false)} title="Add New Inventory Item">
        <InventoryForm
          onSubmit={handleCreateSubmit}
          onCancel={() => setCreateModalOpen(false)}
          submitting={submitting}
        />
      </Modal>

      {/* Stock In Modal */}
      <StockInModal
        isOpen={Boolean(stockInItem)}
        onClose={() => setStockInItem(null)}
        item={stockInItem}
        onSuccess={fetchInventory}
      />
    </div>
  );
}
