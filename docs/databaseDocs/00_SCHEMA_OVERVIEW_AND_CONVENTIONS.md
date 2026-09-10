# 00. Database Schema Overview & Architectural Conventions

This document outlines the core database conventions, field data types, index design, soft deletion strategies, and Mongoose ACID transaction boundaries used throughout the Hospital Management System MongoDB database.

---

## 1. Core Data Conventions

### 1. MongoDB ObjectIds
- Primary keys are auto-generated 24-character hexadecimal Mongoose `Schema.Types.ObjectId` instances.
- Foreign keys use Mongoose `.populate()` references (`ref: "ModelName"`).

### 2. Standard Timestamps
All Mongoose schemas enable standard Mongoose timestamps:
```javascript
{ timestamps: true }
```
- `createdAt`: ISO 8601 Date timestamp recorded automatically on document insertion.
- `updatedAt`: ISO 8601 Date timestamp updated automatically on document modification.

### 3. Human-Readable Sequential IDs
To support hospital physical printouts, wristbands, and cashier receipts, human-readable sequential tracking IDs are generated using utility helpers (`src/utils/generateId.js`):
- **Patient UHID**: `PAT-YYYYMMDD-XXXX` (e.g. `PAT-20260909-0012`)
- **Doctor ID**: `DOC-XXXX` (e.g. `DOC-0042`)
- **OPD Visit Token**: `OPD-YYYYMMDD-XXX` (e.g. `OPD-20260909-015`)
- **IPD Admission ID**: `IPD-YYYY-XXXX` (e.g. `IPD-2026-0089`)
- **Prescription ID**: `RX-YYYY-XXXX` (e.g. `RX-2026-0104`)
- **Invoice Number**: `INV-YYYY-XXXX` (e.g. `INV-2026-0512`)
- **Receipt Number**: `RCP-YYYY-XXXX` (e.g. `RCP-2026-0320`)
- **Insurance Claim ID**: `CLM-YYYY-XXXX` (e.g. `CLM-2026-0045`)

---

## 2. Soft Deletion & Healthcare Compliance

Healthcare regulations require retaining patient treatment history, invoices, and diagnostic records indefinitely for legal compliance.
- Clinical entities (`Patient`, `Doctor`, `Admission`, `Department`) **NEVER** use Mongoose `deleteOne()` or `findOneAndDelete()`.
- Instead, records utilize a **Soft Delete** pattern:
  - `status`: Enum (`"active"`, `"inactive"`, `"discharged"`, `"cancelled"`).
  - `isDeleted`: Boolean (default: `false`).

---

## 3. Indexing Strategy

1. **Unique Indexes**: Applied to unique identifiers to prevent race-condition duplicates:
   - `User`: `{ email: 1 }` (unique, lowercase).
   - `Role`: `{ name: 1 }` (unique).
   - `Permission`: `{ name: 1 }` (unique).
   - `Department`: `{ name: 1 }`, `{ code: 1 }` (unique, case-insensitive).
   - `Patient`: `{ patientId: 1 }` (unique).
2. **Compound & Query Performance Indexes**:
   - `Appointment`: `{ doctorId: 1, appointmentDate: 1 }` (Optimizes slot collision checks).
   - `AuditLog`: `{ createdAt: -1 }`, `{ userId: 1 }` (Optimizes chronological audit trail pagination).
   - `PharmacySale`: `{ saleId: 1 }`, `{ createdAt: -1 }`.
   - `InventoryItem`: `{ expiryDate: 1 }`, `{ quantity: 1 }` (Optimizes low-stock and expiry alert alerts).

---

## 4. ACID Mongoose Session Transactions

Critical financial and stock mutation operations (e.g. Pharmacy checkout, Invoice payment) use **Mongoose Transactions** (`startSession() -> startTransaction()`) to guarantee atomicity:

```javascript
const session = await mongoose.startSession();
session.startTransaction();
try {
  // 1. Create Sale Document
  await PharmacySale.create([saleData], { session });

  // 2. Atomically Decrement Inventory Batch Quantity
  await stockOut(inventoryItemId, quantity, session);

  await session.commitTransaction();
} catch (error) {
  await session.abortTransaction();
  throw error;
} finally {
  session.endSession();
}
```
