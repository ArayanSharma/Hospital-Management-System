import React, { useState, useEffect, useMemo } from "react";
import { X } from "lucide-react";
import { getMedicinesApi } from "../services/medicine.api.js";
import PosCustomerDetails from "./pos/PosCustomerDetails.jsx";
import PosMedicineCatalog from "./pos/PosMedicineCatalog.jsx";
import PosCartList from "./pos/PosCartList.jsx";
import PosBillCheckout from "./pos/PosBillCheckout.jsx";

export default function NewSalePosModal({ isOpen, onClose, onCompleteSale }) {
  // Left Side State
  const [customerType, setCustomerType] = useState("Walk-in Customer");
  const [customerName, setCustomerName] = useState("Walk-in Customer");
  const [mobileNumber, setMobileNumber] = useState("");
  const [prescriptionNo, setPrescriptionNo] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [manufacturerFilter, setManufacturerFilter] = useState("all");
  const [showOnlyInStock, setShowOnlyInStock] = useState(false);
  const [catalog, setCatalog] = useState([]);

  // Right Side State
  const [cart, setCart] = useState([]);
  const [paymentMethod, setPaymentMethod] = useState("Cash");

  useEffect(() => {
    if (isOpen) {
      getMedicinesApi({ limit: 100 })
        .then((res) => {
          const listData = res?.data?.data;
          const items = listData?.items || listData?.medicines || (Array.isArray(listData) ? listData : []);
          if (Array.isArray(items) && items.length > 0) {
            const formatted = items.map((m, idx) => ({
              id: m._id || m.id || String(idx + 1),
              name: m.name,
              code: m.code || `MED-0${idx + 1}`,
              manufacturer: m.manufacturer || "Vendor",
              mrp: m.mrp || m.unitPrice || m.price || 50,
              stock: m.minStockLevel || 100,
              unit: m.unit || "Strip",
              batchNo: m.code || `PCM${idx + 1}`,
              expiryDate: "31 Dec 2026",
              category: m.category || "Pharmaceuticals",
            }));
            setCatalog(formatted);
          }
        })
        .catch(() => null);
    }
  }, [isOpen]);

  const categoriesList = useMemo(() => Array.from(new Set(catalog.map((c) => c.category).filter(Boolean))), [catalog]);
  const manufacturersList = useMemo(() => Array.from(new Set(catalog.map((c) => c.manufacturer).filter(Boolean))), [catalog]);

  if (!isOpen) return null;

  const filteredCatalog = catalog.filter((item) => {
    if (showOnlyInStock && item.stock <= 0) return false;
    if (categoryFilter !== "all" && item.category !== categoryFilter) return false;
    if (manufacturerFilter !== "all" && item.manufacturer !== manufacturerFilter) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchName = item.name.toLowerCase().includes(q);
      const matchCode = item.code.toLowerCase().includes(q);
      const matchMfg = item.manufacturer.toLowerCase().includes(q);
      if (!matchName && !matchCode && !matchMfg) return false;
    }
    return true;
  });

  const totalItems = cart.length;
  const totalQuantity = cart.reduce((sum, item) => sum + item.quantity, 0);
  const subTotal = cart.reduce((sum, item) => sum + item.amount, 0);
  const gstAmount = subTotal * 0.12;
  const grandTotal = subTotal + gstAmount;

  const handleAddToCart = (med) => {
    if (med.stock <= 0) {
      alert("This medicine is currently out of stock.");
      return;
    }
    const existing = cart.find((it) => it.id === med.id || it.code === med.code);
    if (existing) {
      if (existing.quantity >= med.stock) {
        alert(`Available stock limit reached (${med.stock}).`);
        return;
      }
      setCart(cart.map((it) => (it.id === med.id || it.code === med.code ? { ...it, quantity: it.quantity + 1, amount: (it.quantity + 1) * it.price } : it)));
    } else {
      setCart([...cart, { id: med.id, medicineId: med.id, name: med.name, code: med.code, batchNo: med.batchNo, expiryDate: med.expiryDate, quantity: 1, price: med.mrp, unit: med.unit, amount: med.mrp }]);
    }
  };

  const handleUpdateCartQty = (id, newQty) => {
    if (newQty <= 0) {
      setCart(cart.filter((it) => it.id !== id));
      return;
    }
    const itemInCatalog = catalog.find((c) => c.id === id);
    if (itemInCatalog && newQty > itemInCatalog.stock) {
      alert(`Requested quantity exceeds available stock (${itemInCatalog.stock}).`);
      return;
    }
    setCart(cart.map((it) => (it.id === id ? { ...it, quantity: newQty, amount: newQty * it.price } : it)));
  };

  const handleCompleteSaleSubmit = (e) => {
    e.preventDefault();
    if (cart.length === 0) {
      alert("Cart is empty! Please add medicines before completing sale.");
      return;
    }
    const payload = {
      invoiceNo: `INV-2026-${String(Math.floor(1000 + Math.random() * 9000))}`,
      customerType,
      customerName: customerName || "Walk-in Customer",
      mobileNumber,
      prescriptionNo,
      medicines: cart.map((item) => ({ medicineId: item.medicineId || item.id, medicineName: item.name, batchNo: item.batchNo, expiryDate: item.expiryDate, quantity: item.quantity, unit: item.unit || "Strip", unitPrice: item.price, amount: item.amount })),
      totalItems,
      totalQuantity,
      subTotal,
      gstAmount,
      grandTotal,
      paymentMethod,
      paymentStatus: paymentMethod === "Credit" ? "pending" : "paid",
    };
    onCompleteSale?.(payload);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-slate-900/40 backdrop-blur-xs animate-fadeIn">
      <div className="bg-white rounded-2xl max-w-6xl w-full shadow-2xl border border-slate-100 overflow-hidden flex flex-col max-h-[95vh]">
        {/* Modal Header */}
        <div className="p-4 px-6 border-b border-slate-100 flex items-center justify-between bg-white shrink-0">
          <div>
            <h2 className="text-base font-bold text-slate-900 leading-tight">New Pharmacy Sale (POS)</h2>
            <p className="text-[11px] text-slate-400 font-medium">Create sale, print receipt, and auto-update stock</p>
          </div>
          <button type="button" onClick={onClose} className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-all cursor-pointer">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal 2-Column Body */}
        <div className="grid grid-cols-1 lg:grid-cols-12 overflow-y-auto min-h-0 flex-1 divide-y lg:divide-y-0 lg:divide-x divide-slate-100">
          {/* LEFT SIDE: Customer Info & Catalog (~58% width) */}
          <div className="lg:col-span-7 p-5 space-y-4 overflow-y-auto">
            <PosCustomerDetails
              customerType={customerType}
              setCustomerType={setCustomerType}
              customerName={customerName}
              setCustomerName={setCustomerName}
              mobileNumber={mobileNumber}
              setMobileNumber={setMobileNumber}
              prescriptionNo={prescriptionNo}
              setPrescriptionNo={setPrescriptionNo}
            />

            <PosMedicineCatalog
              searchQuery={searchQuery}
              setSearchQuery={setSearchQuery}
              categoryFilter={categoryFilter}
              setCategoryFilter={setCategoryFilter}
              manufacturerFilter={manufacturerFilter}
              setManufacturerFilter={setManufacturerFilter}
              showOnlyInStock={showOnlyInStock}
              setShowOnlyInStock={setShowOnlyInStock}
              categoriesList={categoriesList}
              manufacturersList={manufacturersList}
              filteredCatalog={filteredCatalog}
              onAddToCart={handleAddToCart}
            />
          </div>

          {/* RIGHT SIDE: Cart & Bill Checkout (~42% width) */}
          <div className="lg:col-span-5 p-5 bg-slate-50/40 flex flex-col justify-between space-y-4">
            <PosCartList
              cart={cart}
              totalItems={totalItems}
              onClearCart={() => setCart([])}
              onUpdateQty={handleUpdateCartQty}
              onRemoveItem={(id) => setCart(cart.filter((it) => it.id !== id))}
            />

            <PosBillCheckout
              subTotal={subTotal}
              gstAmount={gstAmount}
              grandTotal={grandTotal}
              paymentMethod={paymentMethod}
              setPaymentMethod={setPaymentMethod}
              onCompleteSale={handleCompleteSaleSubmit}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
