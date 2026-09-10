# 04. Pharmacy, Inventory & Supplier Schemas Documentation

This document provides complete Mongoose schema specifications for pharmaceutical products, pharmacy sales, inventory batch tracking, and vendor procurement:
1. **`Medicine` (`medicines`)**
2. **`PharmacySale` (`pharmacysales`)**
3. **`InventoryItem` (`inventoryitems`)**
4. **`Supplier` (`suppliers`)**

---

## 1. Medicine Model (`Medicine` -> `medicines` collection)

### Mongoose File Path
`src/modules/pharmacy/medicine.model.js`

### Schema Definition & Field Matrix

| Field Name | Data Type | Validation / Constraints | Default Value | Description |
| :--- | :--- | :--- | :--- | :--- |
| `_id` | `ObjectId` | Auto-generated Primary Key | Auto | Unique Identifier |
| `name` | `String` | Required, trim | N/A | Brand name (e.g. "Paracetamol 500mg") |
| `genericName` | `String` | Required, trim | N/A | Generic chemical name (e.g. "Acetaminophen") |
| `category` | `String` | Enum: `["tablet", "capsule", "syrup", "injection", "ointment", "drops"]` | N/A | Dosage form |
| `manufacturer` | `String` | Trim | `""` | Pharmaceutical manufacturer |
| `unit` | `String` | Trim | `"strip"` | Unit of measure (e.g. "strip", "bottle") |
| `price` | `Number` | Required, min 0 | N/A | Retail price per unit |
| `status` | `String` | Enum: `["active", "inactive"]` | `"active"` | Catalog status |

---

## 2. PharmacySale Model (`PharmacySale` -> `pharmacysales` collection)

### Mongoose File Path
`src/modules/pharmacy/pharmacySale.model.js`

### Schema Definition & Field Matrix

| Field Name | Data Type | Validation / Constraints | Default Value | Description |
| :--- | :--- | :--- | :--- | :--- |
| `_id` | `ObjectId` | Auto-generated Primary Key | Auto | Unique Identifier |
| `saleId` | `String` | Required, unique | N/A | Sale receipt ID (`SALE-YYYY-XXXX`) |
| `patientId` | `ObjectId` | Ref: `Patient` | `null` | Customer patient (null for OTC walk-ins) |
| `prescriptionId`| `ObjectId` | Ref: `Prescription` | `null` | Linked prescription (if applicable) |
| `medicines` | `[Subdocument]`| Array of `{ medicineId, inventoryItemId, quantity, unitPrice, subtotal }` | `[]` | Sold medicine line items |
| `totalAmount` | `Number` | Required, min 0 | N/A | Total sale bill amount |
| `paymentStatus` | `String` | Enum: `["pending", "paid"]` | `"pending"` | Payment status |
| `soldBy` | `ObjectId` | Required, ref: `User` | N/A | Pharmacist staff ID who processed sale |

---

## 3. InventoryItem Model (`InventoryItem` -> `inventoryitems` collection)

### Mongoose File Path
`src/modules/inventory/inventoryItem.model.js`

### Schema Definition & Field Matrix

| Field Name | Data Type | Validation / Constraints | Default Value | Description |
| :--- | :--- | :--- | :--- | :--- |
| `_id` | `ObjectId` | Auto-generated Primary Key | Auto | Unique Identifier |
| `itemCode` | `String` | Required, unique, uppercase | N/A | Unique SKU code |
| `medicineId` | `ObjectId` | Ref: `Medicine` | `null` | Optional linked medicine |
| `itemName` | `String` | Required, trim | N/A | Item description |
| `batchNumber` | `String` | Required, trim | N/A | Batch number for expiry tracking |
| `quantity` | `Number` | Required, min 0 | N/A | Physical stock count |
| `minStockLevel` | `Number` | Required, min 0 | N/A | Low-stock alert threshold |
| `expiryDate` | `Date` | Required | N/A | Batch expiration date |
| `unitCost` | `Number` | Required, min 0 | N/A | Purchase cost from supplier |
| `supplierId` | `ObjectId` | Required, ref: `Supplier` | N/A | Vendor reference |
| `status` | `String` | Enum: `["in-stock", "low-stock", "out-of-stock", "expired"]` | `"in-stock"` | Current stock status |

---

## 4. Supplier Model (`Supplier` -> `suppliers` collection)

### Mongoose File Path
`src/modules/suppliers/supplier.model.js`

### Schema Definition & Field Matrix

| Field Name | Data Type | Validation / Constraints | Default Value | Description |
| :--- | :--- | :--- | :--- | :--- |
| `_id` | `ObjectId` | Auto-generated Primary Key | Auto | Unique Identifier |
| `name` | `String` | Required, trim | N/A | Vendor company name |
| `contactPerson`| `String` | Trim | `""` | Primary contact name |
| `phone` | `String` | Required, trim | N/A | Contact phone |
| `email` | `String` | Lowercase, trim | `""` | Contact email |
| `address` | `String` | Trim | `""` | Office address |
| `taxId` | `String` | Trim | `""` | Vendor GSTIN / Tax ID |
| `status` | `String` | Enum: `["active", "inactive"]` | `"active"` | Vendor status |
