# 04. Pharmacy & Inventory Modules Documentation

This document covers hospital supply chain, stock control, pharmacy sales, and vendor procurement modules:
1. **Pharmacy (`pharmacy`)**
2. **Inventory (`inventory`)**
3. **Suppliers (`suppliers`)**

---

## 1. Pharmacy Module (`src/modules/pharmacy`)

### Purpose & Business Motivation
Manages the drug catalog, pricing, OTC (over-the-counter) and prescription medicine sales, and automated stock integration with hospital inventory batches.

### Sub-Entities & Models

#### 1. `Medicine` (`medicine.model.js`)
- `name`: String (e.g. "Paracetamol 500mg").
- `genericName`: String (e.g. "Acetaminophen").
- `category`: Enum (`"tablet"`, `"capsule"`, `"syrup"`, `"injection"`, `"ointment"`, `"drops"`).
- `manufacturer`: String.
- `unit`: String (e.g. "strip", "bottle", "vial").
- `price`: Number (Selling price per unit).
- `status`: Enum (`"active"`, `"inactive"`).

#### 2. `PharmacySale` (`pharmacySale.model.js`)
- `saleId`: Unique ID (`SALE-2026-0812`).
- `patientId`: Ref `Patient` (Optional for walk-in OTC customers).
- `prescriptionId`: Ref `Prescription` (Optional).
- `medicines`: Array of items:
  - `medicineId`: Ref `Medicine`.
  - `inventoryItemId`: Ref `InventoryItem`.
  - `quantity`: Number.
  - `unitPrice`: Number.
  - `subtotal`: Number.
- `totalAmount`: Number.
- `paymentStatus`: Enum (`"pending"`, `"paid"`).
- `soldBy`: Ref `User` (Pharmacist user ID).

---

### Functions & Transaction Logic (`pharmacySale.service.js`)

1. **`createPharmacySale(data, currentUser, requestMeta)`**:
   - Iterates through requested `medicines` array. Checks `InventoryItem.quantity >= quantity`. Throws `400 Insufficient Stock` if quantity is inadequate.
   - Computes `subtotal` (`unitPrice * quantity`) and accumulates `totalAmount`.
   - **ACID Transaction Boundary**:
     - Starts Mongoose Session: `mongoose.startSession() -> startTransaction()`.
     - Inserts `PharmacySale` document.
     - Calls `stockOut(inventoryItemId, quantity, session)` to decrement batch stock.
     - If any step fails, triggers `session.abortTransaction()`. If successful, commits transaction.
   - Logs audit trail entry.

2. **`markSaleAsPaid(id)`**:
   - Updates sale status to `"paid"` and links transaction reference to central Revenue & Billing ledger.

---

## 2. Inventory Module (`src/modules/inventory`)

### Purpose & Business Motivation
Tracks physical stock levels, batch numbers, manufacturing/expiry dates, low-stock threshold alerts, and stock-in/stock-out audit adjustments for hospital consumables and medicines.

### Data Model (`inventoryItem.model.js`)
- `itemCode`: String (Unique item SKU).
- `medicineId`: Ref `Medicine` (Optional link if item is a pharmaceutical).
- `itemName`: String (e.g. "Surgical Gloves Size M", "Paracetamol Batch A").
- `batchNumber`: String (Crucial for recall and expiry management).
- `quantity`: Number (Current available physical stock).
- `minStockLevel`: Number (Reorder trigger threshold).
- `expiryDate`: Date.
- `unitCost`: Number (Purchase cost from supplier).
- `supplierId`: Ref `Supplier`.
- `status`: Enum (`"in-stock"`, `"low-stock"`, `"out-of-stock"`, `"expired"`).

---

### Key Functions & Business Logic (`inventoryItem.service.js`)

1. **`stockIn(data)`**:
   - Records new shipment arrival. Increments batch `quantity` or creates new batch entry.

2. **`stockOut(inventoryItemId, quantity, session)`**:
   - Decrements stock count atomically inside Mongoose session.
   - Automatically recalculates status:
     - If `quantity === 0` -> Sets `status = "out-of-stock"`.
     - Else if `quantity <= minStockLevel` -> Sets `status = "low-stock"`.

3. **`getLowStockAlerts()`**:
   - Queries items where `quantity <= minStockLevel` or `expiryDate <= current_date + 30_days`.
   - Generates automated alert notification for Pharmacist & Store Manager.

---

## 3. Suppliers Module (`src/modules/suppliers`)

### Purpose & Business Motivation
Stores vendor directory, contact details, tax numbers (GSTIN/Tax ID), lead times, and procurement histories.

### Data Model (`supplier.model.js`)
- `name`: String (Vendor Company Name).
- `contactPerson`: String.
- `phone`: String.
- `email`: String.
- `address`: String.
- `taxId`: String.
- `status`: Enum (`"active"`, `"inactive"`).

---

## API Endpoints Summary

| Module | Method | Endpoint | Description |
| :--- | :--- | :--- | :--- |
| **Pharmacy** | `POST` | `/api/v1/medicines` | Add new medicine to catalog |
| **Pharmacy** | `POST` | `/api/v1/pharmacy-sales` | Process medicine sale & deduct stock |
| **Pharmacy** | `PATCH` | `/api/v1/pharmacy-sales/:id/pay` | Mark pharmacy sale as paid |
| **Inventory** | `GET` | `/api/v1/inventory` | View current stock inventory |
| **Inventory** | `POST` | `/api/v1/inventory/stock-in` | Record new inventory stock intake |
| **Inventory** | `GET` | `/api/v1/inventory/alerts` | Get low stock & expiring item alerts |
| **Suppliers** | `POST` | `/api/v1/suppliers` | Register new pharmaceutical vendor |

---

## Senior Developer Notes & Edge Cases

- **Race Condition Prevention**: Stock deduction during high-volume sales is protected via Mongoose Sessions. Without transactions, concurrent checkout operations could reduce stock below 0.
- **Expiry Enforcement**: During sales, the system sorts available batches using **FIFO / FEFO** (First Expiring, First Out) to ensure oldest batches are dispensed first.
