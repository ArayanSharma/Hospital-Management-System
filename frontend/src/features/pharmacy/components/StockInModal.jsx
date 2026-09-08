import React, { useState, useEffect } from "react";
import { X, Plus, Trash2 } from "lucide-react";
import CustomDropdown from "../../../components/ui/CustomDropdown.jsx";
import { getSuppliersApi } from "../../suppliers/services/supplier.api.js";
import { getMedicinesApi } from "../services/medicine.api.js";

const INITIAL_ADDED_ITEMS = [];

export default function StockInModal({ isOpen, onClose, onSubmit }) {
  // Dynamic datasets from Database
  const [supplierList, setSupplierList] = useState([]);
  const [medicineList, setMedicineList] = useState([]);

  // Purchase Information state
  const [purchaseInfo, setPurchaseInfo] = useState({
    supplier: "",
    invoiceNo: "",
    invoiceDate: new Date().toISOString().split("T")[0],
    purchaseType: "Cash Purchase",
    referenceChallanNo: "",
    paymentTerms: "Net 30",
    expectedDeliveryDate: new Date().toISOString().split("T")[0],
    notes: "",
  });

  // Active Item Input Row state
  const [currentItem, setCurrentItem] = useState({
    medicineId: "",
    medicineName: "",
    dosageForm: "Tablet",
    batchNo: "",
    expiryDate: "",
    purchasePrice: "",
    qtyReceived: "",
    unit: "Strip",
    gstRate: 12,
  });

  // Added Items List
  const [addedItems, setAddedItems] = useState(INITIAL_ADDED_ITEMS);

  // Additional Information state
  const [additionalInfo] = useState({
    receivedBy: "Pharmacist Admin",
    checkedBy: "",
    storeLocation: "Main Pharmacy Store",
    remarks: "",
    printGrn: false,
  });

  // Fetch dynamic suppliers & medicines on modal open from DB
  useEffect(() => {
    if (isOpen) {
      getSuppliersApi({ limit: 100 })
        .then((res) => {
          const data = res?.data?.data;
          const suppliers = data?.suppliers || data?.items || (Array.isArray(data) ? data : []);
          if (Array.isArray(suppliers) && suppliers.length > 0) {
            setSupplierList(suppliers);
          }
        })
        .catch(() => null);

      getMedicinesApi({ limit: 100 })
        .then((res) => {
          const data = res?.data?.data;
          const medicines = data?.items || data?.medicines || (Array.isArray(data) ? data : []);
          if (Array.isArray(medicines) && medicines.length > 0) {
            setMedicineList(medicines);
          }
        })
        .catch(() => null);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  // Calculate totals
  const subTotalExclTax = addedItems.reduce((sum, item) => sum + item.purchasePrice * item.qtyReceived, 0);
  const totalGst = addedItems.reduce((sum, item) => sum + item.purchasePrice * item.qtyReceived * (item.gstRate / 100), 0);
  const grandTotal = subTotalExclTax + totalGst;

  const supplierOptions = [
    { label: "Select supplier", value: "" },
    ...supplierList.map((s) => ({ label: `${s.name} ${s.code ? `(${s.code})` : ""}`, value: s.name })),
    { label: "Medilife Pharma Pvt. Ltd.", value: "Medilife Pharma Pvt. Ltd." },
    { label: "HealthCare Distributors", value: "HealthCare Distributors" },
    { label: "MediSupplies India", value: "MediSupplies India" },
  ].filter((v, i, a) => a.findIndex((t) => t.value === v.value) === i);

  const medicineOptions = [
    { label: "Select Medicine", value: "" },
    ...medicineList.map((m) => ({ label: `${m.name} (${m.category || "Med"})`, value: m._id || m.id })),
  ];

  const handleSelectMedicineVal = (medId) => {
    const selected = medicineList.find((m) => (m._id || m.id) === medId);
    if (selected) {
      setCurrentItem({
        ...currentItem,
        medicineId: medId,
        medicineName: selected.name,
        dosageForm: selected.dosageForm || "Tablet",
        purchasePrice: selected.unitPrice || selected.price || "",
        unit: selected.unit || "Strip",
        gstRate: selected.gstRate || 12,
      });
    } else {
      setCurrentItem({
        ...currentItem,
        medicineId: "",
        medicineName: medId,
      });
    }
  };

  const handleAddItem = () => {
    if (!currentItem.medicineName || !currentItem.batchNo) {
      alert("Please select / enter Medicine Name and Batch Number.");
      return;
    }

    const price = parseFloat(currentItem.purchasePrice) || 0;
    const qty = parseInt(currentItem.qtyReceived, 10) || 0;
    const gst = parseFloat(currentItem.gstRate) || 12;
    const itemAmount = price * qty * (1 + gst / 100);

    const newItem = {
      id: String(Date.now()),
      medicineId: currentItem.medicineId,
      name: currentItem.medicineName,
      dosageForm: currentItem.dosageForm || "Tablet",
      batchNo: currentItem.batchNo,
      expiryDate: currentItem.expiryDate || "2026-12-30",
      daysLeft: "365 days left",
      daysLeftColor: "text-emerald-600",
      purchasePrice: price,
      qtyReceived: qty,
      unit: currentItem.unit || "Strip",
      gstRate: gst,
      amount: itemAmount,
    };

    setAddedItems([...addedItems, newItem]);
    setCurrentItem({
      medicineId: "",
      medicineName: "",
      dosageForm: "Tablet",
      batchNo: "",
      expiryDate: "",
      purchasePrice: "",
      qtyReceived: "",
      unit: "Strip",
      gstRate: 12,
    });
  };

  const handleDeleteItem = (id) => {
    setAddedItems(addedItems.filter((it) => it.id !== id));
  };

  const handleSaveStockIn = (e) => {
    e.preventDefault();
    if (!purchaseInfo.supplier) {
      alert("Please select a Supplier.");
      return;
    }
    if (!purchaseInfo.invoiceNo) {
      alert("Please enter Invoice / Bill Number.");
      return;
    }
    if (addedItems.length === 0) {
      alert("Please add at least one medicine item before saving.");
      return;
    }

    const payload = {
      ...purchaseInfo,
      items: addedItems,
      ...additionalInfo,
      subTotal: subTotalExclTax,
      totalGst,
      grandTotal,
    };

    onSubmit?.(payload);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-xs animate-fadeIn">
      <div className="bg-white rounded-2xl max-w-4xl w-full shadow-2xl border border-slate-100 overflow-hidden flex flex-col max-h-[92vh]">
        {/* Modal Header */}
        <div className="p-4 px-6 border-b border-slate-100 flex items-center justify-between bg-white">
          <h2 className="text-base font-bold text-slate-900">Stock In (Refill Inventory)</h2>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-all cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Scrollable Body */}
        <form onSubmit={handleSaveStockIn} className="p-6 overflow-y-auto space-y-6 text-xs text-slate-700 font-medium">
          {/* SECTION 1: Purchase Information */}
          <div className="space-y-3.5">
            <h3 className="text-xs font-bold text-blue-600 flex items-center gap-1.5">
              <span>1. Purchase Information</span>
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-4 gap-3.5">
              {/* Dynamic Supplier CustomDropdown */}
              <div>
                <CustomDropdown
                  label="Supplier *"
                  value={purchaseInfo.supplier}
                  options={supplierOptions}
                  onChange={(val) => setPurchaseInfo({ ...purchaseInfo, supplier: val })}
                  fullWidth
                />
              </div>

              {/* Invoice / Bill No. */}
              <div>
                <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                  Invoice / Bill No. <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  value={purchaseInfo.invoiceNo}
                  onChange={(e) => setPurchaseInfo({ ...purchaseInfo, invoiceNo: e.target.value })}
                  placeholder="e.g. INV-2026-088"
                  className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-xs focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all placeholder:text-slate-400"
                />
              </div>

              {/* Invoice Date */}
              <div>
                <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                  Invoice Date <span className="text-rose-500">*</span>
                </label>
                <input
                  type="date"
                  value={purchaseInfo.invoiceDate}
                  onChange={(e) => setPurchaseInfo({ ...purchaseInfo, invoiceDate: e.target.value })}
                  className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-xs focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all text-slate-700"
                />
              </div>

              {/* Purchase Type CustomDropdown */}
              <div>
                <CustomDropdown
                  label="Purchase Type *"
                  value={purchaseInfo.purchaseType}
                  options={[
                    { label: "Cash Purchase", value: "Cash Purchase" },
                    { label: "Credit Purchase", value: "Credit Purchase" },
                    { label: "Advance Payment", value: "Advance Payment" },
                  ]}
                  onChange={(val) => setPurchaseInfo({ ...purchaseInfo, purchaseType: val })}
                  fullWidth
                />
              </div>
            </div>
          </div>

          {/* SECTION 2: Add Medicine Items */}
          <div className="space-y-3.5 pt-2 border-t border-slate-100">
            <h3 className="text-xs font-bold text-blue-600 flex items-center gap-1.5">
              <span>2. Add Medicine Items</span>
            </h3>

            {/* Input Row */}
            <div className="bg-slate-50/70 border border-slate-200/80 rounded-xl p-3.5 grid grid-cols-1 sm:grid-cols-12 gap-3 items-end">
              {/* Medicine Select CustomDropdown */}
              <div className="sm:col-span-3">
                <CustomDropdown
                  label="Select / Type Medicine"
                  value={currentItem.medicineId || currentItem.medicineName}
                  options={medicineOptions}
                  onChange={handleSelectMedicineVal}
                  fullWidth
                />
              </div>

              {/* Batch No */}
              <div className="sm:col-span-2">
                <label className="block text-[11px] font-semibold text-slate-700 mb-1">Batch No.</label>
                <input
                  type="text"
                  value={currentItem.batchNo}
                  onChange={(e) => setCurrentItem({ ...currentItem, batchNo: e.target.value })}
                  placeholder="e.g. PCM65005"
                  className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-xs focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
                />
              </div>

              {/* Expiry Date */}
              <div className="sm:col-span-2">
                <label className="block text-[11px] font-semibold text-slate-700 mb-1">Expiry Date</label>
                <input
                  type="date"
                  value={currentItem.expiryDate}
                  onChange={(e) => setCurrentItem({ ...currentItem, expiryDate: e.target.value })}
                  className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-xs focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
                />
              </div>

              {/* Price */}
              <div className="sm:col-span-2">
                <label className="block text-[11px] font-semibold text-slate-700 mb-1">Price (₹)</label>
                <input
                  type="number"
                  step="0.01"
                  value={currentItem.purchasePrice}
                  onChange={(e) => setCurrentItem({ ...currentItem, purchasePrice: e.target.value })}
                  placeholder="0.00"
                  className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-xs focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all text-right font-bold text-slate-900"
                />
              </div>

              {/* Qty Received */}
              <div className="sm:col-span-2">
                <label className="block text-[11px] font-semibold text-slate-700 mb-1">Qty Received</label>
                <input
                  type="number"
                  value={currentItem.qtyReceived}
                  onChange={(e) => setCurrentItem({ ...currentItem, qtyReceived: e.target.value })}
                  placeholder="0"
                  className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-xs focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all text-right font-bold text-slate-900"
                />
              </div>

              {/* Add Button */}
              <div className="sm:col-span-1">
                <button
                  type="button"
                  onClick={handleAddItem}
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white rounded-xl py-2 flex items-center justify-center font-bold text-xs shadow-xs transition-all cursor-pointer"
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Added Items Table */}
            {addedItems.length > 0 && (
              <div className="border border-slate-200/80 rounded-xl overflow-hidden shadow-xs mt-3">
                <table className="w-full text-left border-collapse text-xs">
                  <thead>
                    <tr className="bg-slate-50 border-b border-slate-100 text-[11px] font-semibold text-slate-500">
                      <th className="py-2.5 px-3">Medicine</th>
                      <th className="py-2.5 px-3">Batch No</th>
                      <th className="py-2.5 px-3">Expiry</th>
                      <th className="py-2.5 px-3 text-right">Price (₹)</th>
                      <th className="py-2.5 px-3 text-center">Qty</th>
                      <th className="py-2.5 px-3 text-right">Amount (₹)</th>
                      <th className="py-2.5 px-3 text-center">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 font-medium">
                    {addedItems.map((item) => (
                      <tr key={item.id} className="hover:bg-slate-50/50">
                        <td className="py-2.5 px-3 font-bold text-slate-800">{item.name}</td>
                        <td className="py-2.5 px-3 text-slate-600">{item.batchNo}</td>
                        <td className="py-2.5 px-3 text-slate-600">{item.expiryDate}</td>
                        <td className="py-2.5 px-3 text-right font-semibold">₹ {item.purchasePrice.toFixed(2)}</td>
                        <td className="py-2.5 px-3 text-center font-bold text-blue-600">{item.qtyReceived}</td>
                        <td className="py-2.5 px-3 text-right font-bold text-slate-900">₹ {item.amount.toFixed(2)}</td>
                        <td className="py-2.5 px-3 text-center">
                          <button
                            type="button"
                            onClick={() => handleDeleteItem(item.id)}
                            className="p-1 text-rose-500 hover:text-rose-700 hover:bg-rose-50 rounded-lg transition-colors cursor-pointer"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>

          {/* SECTION 3: Summary Totals */}
          <div className="pt-3 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-4 bg-slate-50/60 p-4 rounded-xl">
            <div className="text-xs text-slate-500">
              <span>Total Items: <strong className="text-slate-800">{addedItems.length}</strong></span>
            </div>
            <div className="flex items-center gap-6 text-xs">
              <div>Subtotal: <strong className="text-slate-800 font-bold">₹ {subTotalExclTax.toLocaleString("en-IN", { minimumFractionDigits: 2 })}</strong></div>
              <div>GST (12%): <strong className="text-slate-800 font-bold">₹ {totalGst.toLocaleString("en-IN", { minimumFractionDigits: 2 })}</strong></div>
              <div className="text-sm">Grand Total: <strong className="text-blue-600 font-extrabold text-base">₹ {grandTotal.toLocaleString("en-IN", { minimumFractionDigits: 2 })}</strong></div>
            </div>
          </div>

          {/* Action Footer */}
          <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-xl transition-all cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 rounded-xl shadow-xs transition-all cursor-pointer"
            >
              Save Stock In (Refill)
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
