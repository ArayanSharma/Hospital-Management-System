# 02. Data Architecture & Storage Strategy

This document details MongoDB data modeling principles, Mongoose transaction boundaries, Redis caching invalidation, and Cloudinary cloud file storage architecture.

---

## 1. Primary Database Store: MongoDB & Mongoose ODM

### Why MongoDB for Healthcare Systems?
1. **Schema Flexibility for Clinical Records**: Medical records (`MedicalRecord`), prescription drug lists (`Prescription`), and vital sign logs (`vitals`) vary significantly across specialties. MongoDB's flexible BSON document format allows storing nested sub-documents without schema rigidness.
2. **High-Performance Read/Write Throughput**: Handles high-concurrency patient check-ins and vital sign logging.

### Document Embedding vs Referencing Strategy

```
                          ┌───────────────────────────┐
                          │     Patient Document      │
                          │ (Demographics & Metadata) │
                          └─────────────┬─────────────┘
                                        │
             ┌──────────────────────────┴──────────────────────────┐
             ▼                                                     ▼
┌─────────────────────────┐                               ┌─────────────────────────┐
│   Embedded Subdocument  │                               │ Referenced Collections  │
│ (Emergency Contact)     │                               │ (Appointments, Invoices)│
│ - name, phone, relation │                               │ - Referenced via        │
│                         │                               │   patientId ObjectId    │
└─────────────────────────┘                               └─────────────────────────┘
```

- **Embedding (Subdocuments)**: Used when data is tightly bound, small in size, and always read together (e.g. `Patient.emergencyContact`, `Invoice.items`, `Prescription.medicines`).
- **Referencing (`ref: "Model"`)**: Used when data grows independently or needs cross-module queries (e.g. `Appointment.patientId`, `Doctor.userId`, `PharmacySale.soldBy`).

---

## 2. Mongoose Session ACID Transactions

To prevent race conditions during inventory stock deduction or IPD bed allocations, Mongoose Session transactions enforce full **ACID compliance**:

```javascript
// Example: Pharmacy Checkout Transaction
export const createPharmacySale = async (saleData, currentUser) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    // Step 1: Insert Sale Document with session
    const [sale] = await PharmacySale.create([saleData], { session });

    // Step 2: Decrement Batch Stock Quantity with session
    for (const item of saleData.medicines) {
      const inventoryItem = await InventoryItem.findById(item.inventoryItemId).session(session);
      if (inventoryItem.quantity < item.quantity) {
        throw new AppError(`Insufficient stock for ${item.name}`, 400);
      }
      inventoryItem.quantity -= item.quantity;
      await inventoryItem.save({ session });
    }

    await session.commitTransaction();
    return sale;
  } catch (error) {
    await session.abortTransaction();
    throw error;
  } finally {
    session.endSession();
  }
};
```

---

## 3. Redis In-Memory Cache Engine

### Use Cases
1. **Super Admin Dashboard Aggregation**: Caches heavy multi-collection pipeline results for 300 seconds.
2. **Session Token Revocation**: Stores revoked refresh tokens for instant forced logouts.
3. **Global System Settings**: Caches hospital configuration settings (`Setting.model.js`).

### Cache Invalidation Pattern (`redisCache.js`)

```javascript
// Invalidate cache when mutations occur
export const invalidatePattern = async (pattern) => {
  const keys = await redisClient.keys(pattern);
  if (keys.length > 0) {
    await redisClient.del(keys);
  }
};

// Usage during department creation / update:
await invalidatePattern("hms:dept:*");
```

---

## 4. Cloud Object Storage: Cloudinary Pipeline

To avoid clogging MongoDB with binary BLOBs or filling local disk storage:
- Pathology lab PDF reports (`LabReport.reportFileUrl`) and Radiology scan images (`RadiologyReport.imageUrls`) are uploaded directly to **Cloudinary** via `upload.middleware.js` (Multer Cloudinary Storage engine).
- Only public Cloudinary HTTPS URLs are stored in MongoDB document fields.
