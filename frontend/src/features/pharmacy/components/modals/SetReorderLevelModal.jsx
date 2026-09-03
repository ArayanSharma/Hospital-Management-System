import React, { useState, useEffect } from "react";
import Modal from "../../../../components/ui/Modal.jsx";
import { Bell, CheckCircle2 } from "lucide-react";

export default function SetReorderLevelModal({ item, isOpen, onClose, onSave }) {
  const [minStock, setMinStock] = useState(50);
  const [maxStock, setMaxStock] = useState(500);

  useEffect(() => {
    if (item) {
      setMinStock(item.minStockLevel || item.minStock || 50);
      setMaxStock(item.maxStockLevel || 500);
    }
  }, [item]);

  if (!item) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave?.(item, Number(minStock), Number(maxStock));
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Set Reorder Alert Threshold"
      subtitle={`${item.name} (${item.dosage || "Tablet"}) — Batch #${item.batchNo}`}
      maxWidth="max-w-md"
    >
      <form onSubmit={handleSubmit} className="space-y-4 text-xs font-medium">
        <div>
          <label className="block font-bold text-slate-700 mb-1">Minimum Reorder Stock Level (Threshold)</label>
          <input
            type="number"
            min="1"
            value={minStock}
            onChange={(e) => setMinStock(e.target.value)}
            className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-xs font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-purple-500/20"
          />
          <p className="text-[10.5px] text-slate-400 font-medium mt-1">
            When available stock drops below this number, system automatically triggers a <strong>Low Stock Alert</strong>.
          </p>
        </div>

        <div>
          <label className="block font-bold text-slate-700 mb-1">Maximum Stock Capacity Target</label>
          <input
            type="number"
            min="10"
            value={maxStock}
            onChange={(e) => setMaxStock(e.target.value)}
            className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-xs font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-purple-500/20"
          />
        </div>

        <div className="p-3 bg-purple-50 border border-purple-100 rounded-xl text-[11px] text-purple-800 space-y-1">
          <p className="font-bold flex items-center gap-1.5">
            <Bell className="w-3.5 h-3.5 text-purple-600" />
            <span>Automated Inventory Safety Buffer</span>
          </p>
          <p>Current Available Stock: <strong className="text-slate-900">{item.availableStock} {item.unit}</strong></p>
        </div>

        <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-xl border border-slate-200 font-bold text-slate-600 hover:bg-slate-50 cursor-pointer"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="px-5 py-2 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-bold transition cursor-pointer flex items-center gap-1.5"
          >
            <CheckCircle2 className="w-4 h-4" />
            <span>Save Reorder Threshold</span>
          </button>
        </div>
      </form>
    </Modal>
  );
}
