import React, { useState } from "react";
import Modal from "../../../../components/ui/Modal.jsx";
import { ShoppingCart, CheckCircle2 } from "lucide-react";
import CustomDropdown from "../../../../components/ui/CustomDropdown.jsx";

export default function CreatePurchaseOrderModal({ item, isOpen, onClose }) {
  const [vendor, setVendor] = useState(item?.manufacturer || "Cipla Ltd.");
  const [poQty, setPoQty] = useState(500);

  if (!item) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    alert(`Purchase Order created for ${poQty} units of ${item.name} from vendor "${vendor}"!`);
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Create Procurement Purchase Order"
      subtitle={`${item.name} — Reorder Level Triggered`}
      maxWidth="max-w-md"
    >
      <form onSubmit={handleSubmit} className="space-y-4 text-xs font-medium">
        <div>
          <CustomDropdown
            label="Preferred Vendor / Manufacturer"
            value={vendor}
            options={[
              { label: "Cipla Ltd.", value: "Cipla Ltd." },
              { label: "Sun Pharma", value: "Sun Pharma" },
              { label: "Dr. Reddy's", value: "Dr. Reddy's" },
              { label: "Abbott Healthcare", value: "Abbott Healthcare" },
            ]}
            onChange={setVendor}
            fullWidth
          />
        </div>

        <div>
          <label className="block font-bold text-slate-700 mb-1">Reorder Order Quantity</label>
          <input
            type="number"
            min="10"
            step="10"
            value={poQty}
            onChange={(e) => setPoQty(Number(e.target.value))}
            className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-xs font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
          />
        </div>

        <div className="p-3 bg-blue-50/70 border border-blue-100 rounded-xl text-[11px] text-blue-800 space-y-1">
          <p className="font-bold flex items-center gap-1.5">
            <ShoppingCart className="w-3.5 h-3.5" />
            <span>Procurement Summary</span>
          </p>
          <p>Estimated Cost: <strong className="text-slate-900">₹ {((item.purchasePrice || 20) * poQty).toFixed(2)}</strong></p>
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
            <span>Generate Purchase Order</span>
          </button>
        </div>
      </form>
    </Modal>
  );
}
