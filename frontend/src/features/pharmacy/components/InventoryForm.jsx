import { useState, useEffect } from "react";
import Button from "../../../components/ui/Button.jsx";
import { getSuppliersApi } from "../services/inventory.api.js";

export default function InventoryForm({ onSubmit, onCancel, submitting }) {
  const [formData, setFormData] = useState({
    itemName: "",
    category: "Medicine",
    quantity: 0,
    unit: "box",
    minimumStock: 10,
    supplierId: "",
    batchNumber: "",
    expiryDate: "",
  });

  const [suppliers, setSuppliers] = useState([]);
  const [loadingSuppliers, setLoadingSuppliers] = useState(true);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    async function fetchSuppliers() {
      try {
        const { data } = await getSuppliersApi({ limit: 100 });
        const list = data.data?.items || data.data || [];
        setSuppliers(list);
        if (list.length > 0) {
          setFormData((prev) => ({ ...prev, supplierId: list[0]._id }));
        }
      } catch (err) {
        console.error("Failed to load suppliers", err);
      } finally {
        setLoadingSuppliers(false);
      }
    }
    fetchSuppliers();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const validate = () => {
    const errs = {};
    if (!formData.itemName.trim()) errs.itemName = "Item name is required";
    if (!formData.category.trim()) errs.category = "Category is required";
    if (!formData.unit.trim()) errs.unit = "Unit is required";
    if (formData.minimumStock === "" || Number(formData.minimumStock) < 0) {
      errs.minimumStock = "Minimum stock threshold is required (>= 0)";
    }
    if (!formData.supplierId)
      errs.supplierId = "Supplier selection is required";
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validate()) return;

    const payload = {
      ...formData,
      quantity: Number(formData.quantity) || 0,
      minimumStock: Number(formData.minimumStock) || 0,
      expiryDate: formData.expiryDate || undefined,
    };
    onSubmit(payload);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Item Name <span className="text-red-500">*</span>
        </label>
        <input
          type="text"
          name="itemName"
          value={formData.itemName}
          onChange={handleChange}
          placeholder="e.g. Paracetamol 500mg"
          className="w-full px-3.5 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-purple-500 outline-none"
        />
        {errors.itemName && (
          <p className="text-xs text-red-600 mt-1">{errors.itemName}</p>
        )}
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Category <span className="text-red-500">*</span>
          </label>
          <select
            name="category"
            value={formData.category}
            onChange={handleChange}
            className="w-full px-3.5 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-purple-500 outline-none"
          >
            <option value="Medicine">Medicine</option>
            <option value="Surgical Equipment">Surgical Equipment</option>
            <option value="Consumables">Consumables</option>
            <option value="Lab Supplies">Lab Supplies</option>
            <option value="General">General</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Unit <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            name="unit"
            value={formData.unit}
            onChange={handleChange}
            placeholder="e.g. box, piece, strip"
            className="w-full px-3.5 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-purple-500 outline-none"
          />
          {errors.unit && (
            <p className="text-xs text-red-600 mt-1">{errors.unit}</p>
          )}
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Initial Quantity
          </label>
          <input
            type="number"
            name="quantity"
            min="0"
            value={formData.quantity}
            onChange={handleChange}
            className="w-full px-3.5 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-purple-500 outline-none"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Min. Stock Alert Limit <span className="text-red-500">*</span>
          </label>
          <input
            type="number"
            name="minimumStock"
            min="0"
            value={formData.minimumStock}
            onChange={handleChange}
            placeholder="Alert threshold"
            className="w-full px-3.5 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-purple-500 outline-none"
          />
          {errors.minimumStock && (
            <p className="text-xs text-red-600 mt-1">{errors.minimumStock}</p>
          )}
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Supplier <span className="text-red-500">*</span>
        </label>
        {loadingSuppliers ? (
          <p className="text-xs text-gray-500">Loading suppliers...</p>
        ) : suppliers.length === 0 ? (
          <p className="text-xs text-amber-600">
            No suppliers available in backend. Please register a supplier first.
          </p>
        ) : (
          <select
            name="supplierId"
            value={formData.supplierId}
            onChange={handleChange}
            className="w-full px-3.5 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-purple-500 outline-none"
          >
            {suppliers.map((sup) => (
              <option key={sup._id} value={sup._id}>
                {sup.name} ({sup.company || "Supplier"})
              </option>
            ))}
          </select>
        )}
        {errors.supplierId && (
          <p className="text-xs text-red-600 mt-1">{errors.supplierId}</p>
        )}
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Batch Number
          </label>
          <input
            type="text"
            name="batchNumber"
            value={formData.batchNumber}
            onChange={handleChange}
            placeholder="e.g. BATCH-2026-X"
            className="w-full px-3.5 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-purple-500 outline-none"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Expiry Date
          </label>
          <input
            type="date"
            name="expiryDate"
            value={formData.expiryDate}
            onChange={handleChange}
            className="w-full px-3.5 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-purple-500 outline-none"
          />
        </div>
      </div>

      <div className="flex justify-end gap-3 pt-3">
        <Button
          type="button"
          variant="outline"
          onClick={onCancel}
          disabled={submitting}
        >
          Cancel
        </Button>
        <Button type="submit" disabled={submitting}>
          {submitting ? "Saving..." : "Create Inventory Item"}
        </Button>
      </div>
    </form>
  );
}
