import { useState } from "react";
import Modal from "../../../components/ui/Modal.jsx";
import Button from "../../../components/ui/Button.jsx";
import { stockInApi } from "../services/inventory.api.js";
import { ArrowUpRight, PackagePlus } from "lucide-react";

export default function StockInModal({ isOpen, onClose, item, onSuccess }) {
  const [quantity, setQuantity] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  if (!item) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    const qty = Number(quantity);
    if (!qty || qty <= 0) {
      setError("Please enter a valid quantity greater than 0");
      return;
    }

    setLoading(true);
    setError("");
    try {
      await stockInApi(item._id, qty);
      setQuantity("");
      onSuccess();
      onClose();
    } catch (err) {
      setError(err.response?.data?.message || "Failed to update stock");
    } finally {
      setLoading(false);
    }
  };

  const newTotal = (item.quantity || 0) + (Number(quantity) || 0);

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Stock In (Add Stock)">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="bg-purple-50/60 p-3.5 rounded-lg border border-purple-100 flex items-center justify-between">
          <div>
            <h4 className="font-semibold text-gray-900">{item.itemName}</h4>
            <p className="text-xs text-gray-500">
              Category: {item.category} | Unit: {item.unit}
            </p>
          </div>
          <div className="text-right">
            <span className="text-xs text-gray-500 block">Current Stock</span>
            <span className="text-base font-bold text-gray-900">{item.quantity}</span>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Quantity to Add
          </label>
          <div className="relative">
            <input
              type="number"
              min="1"
              step="1"
              value={quantity}
              onChange={(e) => {
                setQuantity(e.target.value);
                setError("");
              }}
              placeholder="e.g. 50"
              className="w-full px-3.5 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none"
              autoFocus
            />
          </div>
          {error && <p className="text-xs text-red-600 mt-1">{error}</p>}
        </div>

        {Number(quantity) > 0 && (
          <div className="flex items-center justify-between bg-emerald-50 text-emerald-800 text-xs px-3 py-2 rounded-md border border-emerald-200">
            <span className="flex items-center gap-1 font-medium">
              <ArrowUpRight className="w-3.5 h-3.5 text-emerald-600" /> New Expected Total:
            </span>
            <span className="font-bold text-sm">{newTotal} {item.unit}s</span>
          </div>
        )}

        <div className="flex justify-end gap-3 pt-2">
          <Button type="button" variant="outline" onClick={onClose} disabled={loading}>
            Cancel
          </Button>
          <Button type="submit" disabled={loading}>
            <span className="flex items-center gap-1.5">
              <PackagePlus className="w-4 h-4" />
              {loading ? "Adding..." : "Add Stock"}
            </span>
          </Button>
        </div>
      </form>
    </Modal>
  );
}
