import { baseEmailLayout } from "./baseLayout.js";

export const renderInvoiceEmail = ({ patientName, invoiceNo, totalAmount, paymentStatus }) => {
  const bodyHtml = `
    <span class="badge">Billing Receipt</span>
    <h2>Medical Invoice Statement 💳</h2>
    <p>Dear <strong>${patientName}</strong>, here is the billing summary for your medical invoice.</p>
    <div class="card">
      <div class="card-row"><span>Invoice Number:</span> <strong>${invoiceNo}</strong></div>
      <div class="card-row"><span>Total Amount:</span> <strong>₹${totalAmount}</strong></div>
      <div class="card-row"><span>Payment Status:</span> <strong>${paymentStatus}</strong></div>
    </div>
    <p>Thank you for choosing CityCare Hospital for your healthcare needs.</p>
    <a href="http://localhost:5173/billing" class="btn">View Billing Statement →</a>
  `;
  return baseEmailLayout({ title: "Billing Invoice Statement", bodyHtml });
};

export const renderInvoiceGeneratedEmail = ({ patientName, invoiceNo, items = [], subtotal, taxAmount, grandTotal, dueDate, paymentTerms }) => {
  const itemRows = Array.isArray(items) && items.length > 0
    ? items.map((i) => `<div class="card-row"><span>${i.description} (x${i.quantity || 1})</span> <strong>₹${i.amount || i.unitPrice}</strong></div>`).join("")
    : `<div class="card-row"><span>Hospital Services & Consultation</span> <strong>₹${grandTotal}</strong></div>`;

  const bodyHtml = `
    <span class="badge" style="background:#dbeafe; color:#1d4ed8;">Medical Invoice Statement</span>
    <h2>New Hospital Invoice Statement 🧾</h2>
    <p>Dear <strong>${patientName}</strong>, a new medical invoice statement <strong>${invoiceNo}</strong> has been generated.</p>
    <div class="card">
      <div class="card-row"><span>Invoice Number:</span> <strong>${invoiceNo}</strong></div>
      <div class="card-row"><span>Payment Terms:</span> <strong>${paymentTerms || "Immediate"}</strong></div>
      <div class="card-row"><span>Due Date:</span> <strong>${dueDate || new Date().toLocaleDateString()}</strong></div>
      <div style="border-top:1px solid #e2e8f0; margin:12px 0 8px 0; padding-top:8px;">${itemRows}</div>
      <div class="card-row"><span>Subtotal:</span> <span>₹${subtotal || grandTotal}</span></div>
      <div class="card-row"><span>GST / Taxes:</span> <span>₹${taxAmount || 0}</span></div>
      <div class="card-row" style="font-size:16px;"><span style="font-weight:700;">Grand Total Amount:</span> <strong style="color:#2563eb;">₹${grandTotal}</strong></div>
    </div>
    <p>Your official PDF invoice statement is attached. You can pay online or at the hospital billing counter.</p>
    <a href="http://localhost:5173/billing" class="btn">View & Pay Invoice Online →</a>
  `;
  return baseEmailLayout({ title: `Medical Invoice Statement #${invoiceNo}`, bodyHtml });
};

export const renderPaymentReceiptSuccessEmail = ({ patientName, receiptNo, invoiceNo, amountPaid, paymentMethod, transactionId, gstNumber = "27AAAAA0000A1Z5", receiptDate }) => {
  const bodyHtml = `
    <span class="badge" style="background:#dcfce7; color:#15803d;">Payment Successful</span>
    <h2>Official Payment Receipt 💳</h2>
    <p>Dear <strong>${patientName}</strong>, thank you! Your payment has been successfully received and settled.</p>
    <div class="card">
      <div class="card-row"><span>Receipt Number:</span> <strong>${receiptNo || "RCP-2026-0001"}</strong></div>
      <div class="card-row"><span>Invoice Reference:</span> <strong>${invoiceNo}</strong></div>
      <div class="card-row"><span>Amount Paid:</span> <strong style="color:#16a34a; font-size:16px;">₹${amountPaid}</strong></div>
      <div class="card-row"><span>Payment Method:</span> <strong>${(paymentMethod || "Cash").toUpperCase()}</strong></div>
      <div class="card-row"><span>Transaction ID:</span> <strong>${transactionId || "TXN-LOCAL-001"}</strong></div>
      <div class="card-row"><span>Hospital GSTIN:</span> <strong>${gstNumber}</strong></div>
      <div class="card-row"><span>Receipt Timestamp:</span> <strong>${receiptDate || new Date().toLocaleString()}</strong></div>
    </div>
    <p>This is an official tax invoice receipt. You can download your GST statement directly from the billing portal.</p>
    <a href="http://localhost:5173/billing" class="btn" style="background:#16a34a;">View Billing Statements →</a>
  `;
  return baseEmailLayout({ title: `Payment Receipt ${receiptNo ? "#" + receiptNo : ""} - CityCare`, bodyHtml });
};

export const renderPaymentOverdueNoticeEmail = ({ patientName, invoiceNo, dueAmount, dueDate, daysOverdue }) => {
  const bodyHtml = `
    <span class="badge" style="background:#fef3c7; color:#d97706;">Payment Due Reminder</span>
    <h2>Hospital Balance Payment Reminder ⚠️</h2>
    <p>Dear <strong>${patientName}</strong>, this is a reminder regarding your pending balance for invoice <strong>${invoiceNo}</strong>.</p>
    <div class="card" style="border:1px solid #fde68a; background:#fffbeb;">
      <div class="card-row"><span>Invoice Reference:</span> <strong>${invoiceNo}</strong></div>
      <div class="card-row"><span>Outstanding Balance Due:</span> <strong style="color:#dc2626; font-size:16px;">₹${dueAmount}</strong></div>
      <div class="card-row"><span>Original Due Date:</span> <strong>${dueDate || "Past Due"}</strong></div>
      <div class="card-row"><span>Overdue Duration:</span> <strong>${daysOverdue || "Overdue"} Days</strong></div>
    </div>
    <p>Please clear your pending hospital dues to ensure uninterrupted access to medical records and portal features.</p>
    <a href="http://localhost:5173/billing" class="btn" style="background:#d97706;">Settle Hospital Balance Now →</a>
  `;
  return baseEmailLayout({ title: `Payment Reminder: Invoice #${invoiceNo}`, bodyHtml });
};
