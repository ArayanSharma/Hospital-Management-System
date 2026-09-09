# 05. Billing, Payments & Insurance Schemas Documentation

This document provides complete Mongoose schema specifications for patient invoicing, payment processing, insurance policies, and claim settlements:
1. **`Invoice` (`invoices`)**
2. **`Payment` (`payments`)**
3. **`InsurancePolicy` (`insurancepolicies`)**
4. **`InsuranceClaim` (`insuranceclaims`)**

---

## 1. Invoice Model (`Invoice` -> `invoices` collection)

### Mongoose File Path
`src/modules/billing/invoice.model.js`

### Schema Definition & Field Matrix

| Field Name | Data Type | Validation / Constraints | Default Value | Description |
| :--- | :--- | :--- | :--- | :--- |
| `_id` | `ObjectId` | Auto-generated Primary Key | Auto | Unique Identifier |
| `invoiceNumber` | `String` | Required, unique | N/A | Sequential Invoice ID (`INV-YYYY-XXXX`) |
| `patientId` | `ObjectId` | Required, ref: `Patient` | N/A | Billed patient |
| `items` | `[Subdocument]`| Array of `{ description, unitPrice, quantity, amount }` | `[]` | Line-item charges |
| `subtotal` | `Number` | Required, min 0 | N/A | Sum of line items |
| `discount` | `Number` | Min 0 | `0` | Monetary discount applied |
| `tax` | `Number` | Min 0 | `0` | Tax amount |
| `total` | `Number` | Required, min 0 | N/A | Final total amount (`subtotal - discount + tax`) |
| `amountPaid` | `Number` | Min 0 | `0` | Running sum of collected payments |
| `status` | `String` | Enum: `["unpaid", "partially-paid", "paid", "cancelled"]` | `"unpaid"` | Payment clearance status |
| `dueDate` | `Date` | Date object | `Date.now + 30 days` | Payment due date |

---

## 2. Payment Model (`Payment` -> `payments` collection)

### Mongoose File Path
`src/modules/payments/payment.model.js`

### Schema Definition & Field Matrix

| Field Name | Data Type | Validation / Constraints | Default Value | Description |
| :--- | :--- | :--- | :--- | :--- |
| `_id` | `ObjectId` | Auto-generated Primary Key | Auto | Unique Identifier |
| `receiptNumber` | `String` | Required, unique | N/A | Receipt number (`RCP-YYYY-XXXX`) |
| `invoiceId` | `ObjectId` | Required, ref: `Invoice` | N/A | Parent invoice reference |
| `patientId` | `ObjectId` | Required, ref: `Patient` | N/A | Paying patient |
| `amount` | `Number` | Required, min 0.01 | N/A | Payment amount collected |
| `paymentMethod` | `String` | Enum: `["cash", "card", "upi", "netbanking", "cheque"]` | `"cash"` | Payment channel |
| `transactionReference`| `String` | Trim | `""` | Bank reference / UPI txn ID / Cheque number |
| `receivedBy` | `ObjectId` | Required, ref: `User` | N/A | Cashier staff ID |
| `paymentDate` | `Date` | Date object | `Date.now` | Payment timestamp |

---

## 3. InsurancePolicy Model (`InsurancePolicy` -> `insurancepolicies` collection)

### Mongoose File Path
`src/modules/insurance/insurancePolicy.model.js`

### Schema Definition & Field Matrix

| Field Name | Data Type | Validation / Constraints | Default Value | Description |
| :--- | :--- | :--- | :--- | :--- |
| `_id` | `ObjectId` | Auto-generated Primary Key | Auto | Unique Identifier |
| `policyNumber` | `String` | Required, unique, trim | N/A | Insurance policy identifier |
| `patientId` | `ObjectId` | Required, ref: `Patient` | N/A | Insured patient |
| `providerName` | `String` | Required, trim | N/A | Insurance company / TPA name |
| `coverageAmount`| `Number` | Required, min 0 | N/A | Maximum policy coverage cap |
| `validUntil` | `Date` | Required | N/A | Policy expiration date |
| `status` | `String` | Enum: `["active", "expired"]` | `"active"` | Policy validity status |

---

## 4. InsuranceClaim Model (`InsuranceClaim` -> `insuranceclaims` collection)

### Mongoose File Path
`src/modules/insurance/insuranceClaim.model.js`

### Schema Definition & Field Matrix

| Field Name | Data Type | Validation / Constraints | Default Value | Description |
| :--- | :--- | :--- | :--- | :--- |
| `_id` | `ObjectId` | Auto-generated Primary Key | Auto | Unique Identifier |
| `claimNumber` | `String` | Required, unique | N/A | Sequential Claim ID (`CLM-YYYY-XXXX`) |
| `policyId` | `ObjectId` | Required, ref: `InsurancePolicy` | N/A | Linked insurance policy |
| `patientId` | `ObjectId` | Required, ref: `Patient` | N/A | Insured patient |
| `admissionId` | `ObjectId` | Ref: `Admission` | `null` | Optional IPD admission stay link |
| `invoiceId` | `ObjectId` | Required, ref: `Invoice` | N/A | Target hospital invoice link |
| `claimedAmount` | `Number` | Required, min 0 | N/A | Amount claimed from insurer |
| `approvedAmount`| `Number` | Min 0 | `0` | Insurer approved payout amount |
| `status` | `String` | Enum: `["submitted", "pre-authorized", "approved", "rejected", "settled"]` | `"submitted"` | Claim settlement state |
| `rejectionReason`| `String` | Trim | `""` | Explanation if claim rejected |
