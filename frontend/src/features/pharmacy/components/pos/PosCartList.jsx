import React from "react";
import { Trash2 } from "lucide-react";

export default function PosCartList({
  cart,
  totalItems,
  onClearCart,
  onUpdateQty,
  onRemoveItem,
}) {
  return (
    <div>
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-xs font-bold text-slate-900">Billing Cart ({totalItems} items)</h3>
        {cart.length > 0 && (
          <button
            type="button"
            onClick={onClearCart}
            className="text-[11px] font-semibold text-rose-600 hover:underline cursor-pointer"
          >
            Clear Cart
          </button>
        )}
      </div>

      {/* Cart Items */}
      <div className="space-y-2 max-h-[260px] overflow-y-auto pr-1">
        {cart.length === 0 ? (
          <div className="text-center py-12 text-slate-400 font-medium text-xs border border-dashed border-slate-200 rounded-xl">
            Cart is empty. Click "+ Add" on medicines to build invoice.
          </div>
        ) : (
          cart.map((item) => (
            <div key={item.id} className="bg-white border border-slate-200/80 rounded-xl p-3 shadow-xs flex items-center justify-between gap-3">
              <div className="min-w-0">
                <p className="text-xs font-bold text-slate-900 truncate leading-tight">{item.name}</p>
                <p className="text-[10px] text-slate-400">₹ {item.price.toFixed(2)} / {item.unit}</p>
              </div>

              <div className="flex items-center gap-3 shrink-0">
                {/* Qty Counter */}
                <div className="flex items-center border border-slate-200 rounded-lg overflow-hidden bg-slate-50">
                  <button
                    type="button"
                    onClick={() => onUpdateQty(item.id, item.quantity - 1)}
                    className="px-2 py-0.5 text-xs font-bold hover:bg-slate-200 transition-colors"
                  >
                    -
                  </button>
                  <span className="px-2.5 text-xs font-bold text-slate-800">{item.quantity}</span>
                  <button
                    type="button"
                    onClick={() => onUpdateQty(item.id, item.quantity + 1)}
                    className="px-2 py-0.5 text-xs font-bold hover:bg-slate-200 transition-colors"
                  >
                    +
                  </button>
                </div>

                <span className="text-xs font-bold text-slate-900 w-16 text-right">₹ {item.amount.toFixed(2)}</span>

                <button
                  type="button"
                  onClick={() => onRemoveItem(item.id)}
                  className="text-slate-400 hover:text-rose-600 transition-colors cursor-pointer"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
