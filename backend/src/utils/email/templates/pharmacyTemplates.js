import { baseEmailLayout } from "./baseLayout.js";

export const renderPharmacySaleReceiptEmail = ({ customerName, saleInvoiceNo, items = [], totalAmount, paymentMethod, saleDate }) => {
  const itemRows = Array.isArray(items) && items.length > 0
    ? items.map((i) => `<div class="card-row"><span>${i.name || i.medicineName} (x${i.quantity})</span> <strong>₹${i.amount || (i.price * i.quantity)}</strong></div>`).join("")
    : `<div class="card-row"><span>Prescribed Medicines</span> <strong>₹${totalAmount}</strong></div>`;

  const bodyHtml = `
    <span class="badge" style="background:#dcfce7; color:#15803d;">Pharmacy Sale Receipt</span>
    <h2>Pharmacy Digital Purchase Receipt 💊</h2>
    <p>Dear <strong>${customerName || "Valued Customer"}</strong>, thank you for purchasing medicines at CityCare Pharmacy.</p>
    <div class="card">
      <div class="card-row"><span>Receipt Invoice:</span> <strong>${saleInvoiceNo}</strong></div>
      <div class="card-row"><span>Payment Method:</span> <strong>${(paymentMethod || "Cash").toUpperCase()}</strong></div>
      <div class="card-row"><span>Transaction Date:</span> <strong>${saleDate || new Date().toLocaleString()}</strong></div>
      <div style="border-top:1px solid #e2e8f0; margin:12px 0 8px 0; padding-top:8px;">${itemRows}</div>
      <div class="card-row" style="font-size:16px;"><span style="font-weight:700;">Total Amount Paid:</span> <strong style="color:#16a34a;">₹${totalAmount}</strong></div>
    </div>
    <p>Keep this digital receipt for your health record and tax deductions.</p>
    <a href="http://localhost:5173/pharmacy" class="btn" style="background:#16a34a;">View Pharmacy Purchase History →</a>
  `;
  return baseEmailLayout({ title: `Pharmacy Purchase Receipt #${saleInvoiceNo}`, bodyHtml });
};

export const renderLowStockAlertEmail = ({ medicineName, currentStock, reorderLevel, category, supplierName }) => {
  const bodyHtml = `
    <span class="badge" style="background:#fee2e2; color:#dc2626;">Stock Alert</span>
    <h2 style="color:#dc2626;">Low Inventory Alert 🚨</h2>
    <p>Attention Pharmacy Manager / Inventory Admin, a critical medicine stock level has hit or dropped below reorder thresholds.</p>
    <div class="card" style="border:2px solid #fca5a5; background:#fff5f5;">
      <div class="card-row"><span>Medicine / Item:</span> <strong style="font-size:15px; color:#991b1b;">${medicineName}</strong></div>
      <div class="card-row"><span>Category:</span> <strong>${category || "Pharmaceuticals"}</strong></div>
      <div class="card-row"><span>Current Stock Level:</span> <strong style="color:#dc2626; font-size:16px;">${currentStock} Units</strong></div>
      <div class="card-row"><span>Minimum Reorder Level:</span> <strong>${reorderLevel} Units</strong></div>
      <div class="card-row"><span>Primary Supplier:</span> <strong>${supplierName || "Default Vendor"}</strong></div>
    </div>
    <div style="background:#fee2e2; border-left:4px solid #dc2626; padding:12px; margin:16px 0; border-radius:8px;">
      <p style="margin:0; font-size:13px; color:#991b1b; font-weight:600;">Recommended Action: Trigger automatic Purchase Order (PO) to vendor for stock replenishment immediately.</p>
    </div>
    <a href="http://localhost:5173/inventory" class="btn" style="background:#dc2626;">Restock Medicine Inventory Now →</a>
  `;
  return baseEmailLayout({ title: `🚨 LOW STOCK ALERT: ${medicineName} (${currentStock} left)`, bodyHtml, footerSubtext: "Automated Pharmacy Inventory Control Notification" });
};

export const renderSupplierPurchaseOrderEmail = ({ supplierName, poNumber, items = [], totalOrderValue, expectedDeliveryDate }) => {
  const itemRows = Array.isArray(items) && items.length > 0
    ? items.map((i) => `<div class="card-row"><span>${i.medicineName || i.name} (Qty: ${i.quantity})</span> <strong>₹${i.unitPrice * i.quantity}</strong></div>`).join("")
    : `<div class="card-row"><span>Pharmaceutical Inventory Replenishment</span> <strong>₹${totalOrderValue}</strong></div>`;

  const bodyHtml = `
    <span class="badge" style="background:#dbeafe; color:#1d4ed8;">Official Purchase Order</span>
    <h2>Purchase Order (PO) Replenishment Request 📦</h2>
    <p>Dear <strong>${supplierName}</strong>,</p>
    <p>CityCare Central Pharmacy is placing an official purchase order <strong>${poNumber}</strong> for medicine inventory replenishment.</p>
    <div class="card">
      <div class="card-row"><span>PO Reference Number:</span> <strong>${poNumber}</strong></div>
      <div class="card-row"><span>Expected Delivery Date:</span> <strong>${expectedDeliveryDate || "Within 3 Business Days"}</strong></div>
      <div style="border-top:1px solid #e2e8f0; margin:12px 0 8px 0; padding-top:8px;">${itemRows}</div>
      <div class="card-row" style="font-size:16px;"><span style="font-weight:700;">Total Estimated PO Value:</span> <strong style="color:#2563eb;">₹${totalOrderValue}</strong></div>
    </div>
    <p>Please confirm receipt of this Purchase Order and dispatch the requested stock at your earliest convenience.</p>
    <a href="http://localhost:5173/suppliers" class="btn">Acknowledge Purchase Order →</a>
  `;
  return baseEmailLayout({ title: `Purchase Order #${poNumber} - CityCare Hospital Pharmacy`, bodyHtml });
};
