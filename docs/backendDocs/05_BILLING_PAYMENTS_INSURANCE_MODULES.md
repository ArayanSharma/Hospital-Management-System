# 05. Billing, Payments & Insurance Modules Documentation

This document covers hospital financial operations, invoicing, cash/card/digital payment processing, and health insurance claim management:
1. **Billing (`billing`)**
2. **Payments (`payments`)**
3. **Insurance (`insurance`)**

---

## 1. Billing Module (`src/modules/billing`)

### Purpose & Business Motivation
Consolidates hospital charges (consultations, room stay, laboratory tests, surgical fees, procedures) into line-itemized Invoices, calculates subtotal, discounts, taxes, and tracks invoice payment status (`unpaid`, `partially-paid`, `paid`, `cancelled`).

### Data Model (`invoice.model.js`)
- `invoiceNumber`: Unique ID (`INV-2026-0104`). Generated sequentially.
- `patientId`: Ref `Patient` (Required).
- `items`: Array of charge line items:
  - `description`: String (e.g. "OPD Consultation - Dr. Sharma", "Blood Test CBC").
  - `unitPrice`: Number.
  - `quantity`: Number (default: 1).
  - `amount`: Number (`unitPrice * quantity`).
- `subtotal`: Number (Sum of item amounts).
- `discount`: Number (Fixed monetary discount amount).
- `tax`: Number (Applicable tax amount).
- `total`: Number (`subtotal - discount + tax`).
- `amountPaid`: Number (Running total of collected payments).
- `status`: Enum (`"unpaid"`, `"partially-paid"`, `"paid"`, `"cancelled"`).
- `dueDate`: Date.

---

### Key Functions & Business Logic (`invoice.service.js`)

1. **`createInvoice(data, currentUser, requestMeta)`**:
   - Computes `item.amount = unitPrice * quantity` for each line item.
   - Calculates `subtotal = sum(item.amount)`.
   - Calculates final `total = subtotal - discount + tax`. Validates `total >= 0`.
   - Generates sequential `invoiceNumber` (`INV-YYYY-XXXX`).
   - Sets default `amountPaid = 0` and `status = "unpaid"`.

2. **`updateInvoicePaymentStatus(invoiceId, paidAmount, session)`**:
   - Called internally by the Payment module during payment transactions.
   - Increments `invoice.amountPaid += paidAmount`.
   - Evaluates status transitions:
     - If `amountPaid >= total` -> `status = "paid"`.
     - Else if `amountPaid > 0` -> `status = "partially-paid"`.
   - Supports Mongoose transaction sessions.

3. **`cancelInvoice(id, currentUser, requestMeta)`**:
   - Guards against cancellation if payments have already been collected (`amountPaid > 0`). Throws `400 Validation Error`.

---

## 2. Payments Module (`src/modules/payments`)

### Purpose & Business Motivation
Processes incoming customer payments against unpaid invoices via Cash, Card, UPI, NetBanking, or Cheque. Generates payment receipts and handles partial payment installments.

### Data Model (`payment.model.js`)
- `receiptNumber`: Unique ID (`RCP-2026-0091`).
- `invoiceId`: Ref `Invoice` (Required).
- `patientId`: Ref `Patient` (Required).
- `amount`: Number (Payment transaction amount).
- `paymentMethod`: Enum (`"cash"`, `"card"`, `"upi"`, `"netbanking"`, `"cheque"`).
- `transactionReference`: String (Upi Ref ID / Card Auth Code / Cheque No).
- `receivedBy`: Ref `User` (Cashier staff ID).
- `paymentDate`: Date (default: `Date.now`).

---

### Key Functions & Transaction Logic (`payment.service.js`)

1. **`processPayment(data, currentUser, requestMeta)`**:
   - Fetches associated `Invoice`.
   - Validates payment amount: ensures `amount <= (invoice.total - invoice.amountPaid)`. Throws `400 Overpayment Error` if payment exceeds remaining balance!
   - **ACID Transaction Boundary**:
     - Starts Mongoose Session (`session.startTransaction()`).
     - Creates `Payment` receipt record.
     - Calls `updateInvoicePaymentStatus(invoiceId, amount, session)` to update invoice ledger.
     - Commits transaction.
   - Records audit log and sends payment receipt notification to patient.

---

## 3. Insurance Module (`src/modules/insurance`)

### Purpose & Business Motivation
Manages third-party health insurance policies, pre-authorizations, coverage limits, claim submission, and claim approval/rejection settlement workflows.

### Sub-Entities & Models

#### 1. `InsurancePolicy` (`insurancePolicy.model.js`)
- `policyNumber`: String (Unique policy identifier).
- `patientId`: Ref `Patient`.
- `providerName`: String (e.g. "Star Health", "HDFC ERGO", "Ayushman Bharat").
- `coverageAmount`: Number (Maximum claimable limit).
- `validUntil`: Date.
- `status`: Enum (`"active"`, `"expired"`).

#### 2. `InsuranceClaim` (`insuranceClaim.model.js`)
- `claimNumber`: Unique ID (`CLM-2026-0034`).
- `policyId`: Ref `InsurancePolicy`.
- `patientId`: Ref `Patient`.
- `admissionId`: Ref `Admission` (Optional IPD stay link).
- `invoiceId`: Ref `Invoice`.
- `claimedAmount`: Number.
- `approvedAmount`: Number (Default: 0).
- `status`: Enum (`"submitted"`, `"pre-authorized"`, `"approved"`, `"rejected"`, `"settled"`).
- `rejectionReason`: String.

---

### Key Functions & Logic (`insuranceClaim.service.js`)

1. **`submitClaim(data)`**:
   - Validates that `claimedAmount <= policy.coverageAmount`.
   - Submits claim in `"submitted"` state.

2. **`approveClaim(claimId, approvedAmount)`**:
   - Sets `approvedAmount` and updates status to `"approved"`.
   - Updates target Invoice: subtracts `approvedAmount` from patient payable balance or attaches insurance credit.

---

## API Endpoints Quick Reference

| Module | Method | Endpoint | Description |
| :--- | :--- | :--- | :--- |
| **Billing** | `POST` | `/api/v1/invoices` | Generate new line-itemized patient invoice |
| **Billing** | `GET` | `/api/v1/invoices` | List invoices with status filter |
| **Payments** | `POST` | `/api/v1/payments` | Process payment & update invoice state |
| **Payments** | `GET` | `/api/v1/payments/invoice/:id` | Get all receipts for an invoice |
| **Insurance** | `POST` | `/api/v1/insurance-policies` | Register patient insurance policy |
| **Insurance** | `POST` | `/api/v1/insurance-claims` | Submit insurance claim |
| **Insurance** | `PATCH` | `/api/v1/insurance-claims/:id/approve` | Approve insurance claim & set amount |

---

## Senior Developer Notes & Edge Cases

- **Preventing Overpayment**: The payment processor strictly verifies `amount <= remaining_balance`. It is mathematically impossible to overpay an invoice.
- **Partial Payment Multi-Receipts**: Multiple payments can be made against a single invoice (e.g. $100 initial deposit + $200 final clearance). Each transaction receives a distinct receipt number (`RCP-XXXX`) while updating the central invoice's `amountPaid` sum.
