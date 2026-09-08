import React, { useState } from "react";
import Modal from "../../../../components/ui/Modal.jsx";
import { Scale, CheckCircle2 } from "lucide-react";
import CustomDropdown from "../../../../components/ui/CustomDropdown.jsx";

export default function InventoryAdjustStockModal({ item, isOpen, onClose, onSuccess }) {
  const [adjustmentType, setAdjustmentType] = useState("add");
  const [qty, setQty] = useState(1);
  const [reason, setReason] = useState("Physical Audit Variance");

  if (!item) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    alert(`Adjusted ${item.name} (Batch #${item.batchNo}) by ${adjustmentType === "add" ? "+" : "-"}${qty} units.`);
    onClose();
    if (onSuccess) onSuccess();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Adjust Inventory Stock Quantity"
      subtitle={`${item.name} — Current Available: ${item.availableStock} ${item.unit}`}
      maxWidth="max-w-md"
    >
      <form onSubmit={handleSubmit} className="space-y-4 text-xs font-medium">
        <div>
          <CustomDropdown
            label="Adjustment Type"
            value={adjustmentType}
            options={[
              { label: "+ Add Stock Count (Physical Found)", value: "add" },
              { label: "- Deduct Stock Count (Damage / Wastage)", value: "deduct" },
            ]}
            onChange={setAdjustmentType}
            fullWidth
          />
        </div>

        <div>
          <label className="block font-bold text-slate-700 mb-1">Adjustment Quantity</label>
          <input
            type="number"
            min="1"
            value={qty}
            onChange={(e) => setQty(Number(e.target.value))}
            className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-xs font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
          />
        </div>

        <div>
          <label className="block font-bold text-slate-700 mb-1">Adjustment Reason / Notes</label>
          <textarea
            rows={2}
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            placeholder="e.g. Physical inventory count discrepancy, broken seal..."
            className="w-full bg-white border border-slate-200 rounded-xl p-2.5 text-xs focus:outline-none resize-none"
          />
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
            className="px-5 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold transition cursor-pointer flex items-center gap-1.5"
          >
            <CheckCircle2 className="w-4 h-4" />
            <span>Save Stock Adjustment</span>
          </button>
        </div>
      </form>
    </Modal>
  );
}
