# QA & System Architecture Specification Guide

Welcome to the **QA & System Architecture Specification Guide** for the Hospital Management System (HMS). This document is crafted from the perspective of a **Senior QA Expert + Senior Full-Stack Engineer + Senior UI/UX Engineer + System Architect** with real-world production experience.

---

## 🧪 1. QA Verification Strategy & Test Matrix

The system includes automated verification scripts located in `backend/src/config/` for end-to-end data integrity validation across clinical, diagnostic, and financial domains.

### Master QA Test Matrix

| QA Test Area | Script / Handler | Key Assertions & Business Rules Verified | Pass Criteria |
| :--- | :--- | :--- | :--- |
| **IPD Ward & Bed Occupancy** | `verify_full_system_qa.js` | Occupied bed count (`status: "occupied"`) must match active IPD admissions (`status: "admitted"`) 1:1. | 100% Match (0 discrepancies) |
| **Pharmacy Sales Financial Math** | `verify_medicine_qa.js` | Item amounts (`qty * unitPrice`), subtotal, GST (12%), and grand total calculations. | Math difference < ₹0.05 |
| **General Invoice Math** | `verify_full_system_qa.js` | Line totals, discount, GST (5%), total, amount paid, and due amount relationship (`paid + due == total`). | Math difference < ₹0.05 |
| **Inventory Stock Level Alerts** | `verify_full_system_qa.js` | Items with `quantity <= minimumStock` generate low-stock alert triggers. | Valid alert case generation |
| **Foreign Key Reference Integrity** | `verify_full_system_qa.js` | Zero orphan references between Patients, Doctors, Medicines, Invoices, & Claims. | 0 Orphan FK references |

---

## 🔒 2. Transaction Isolation & Business Edge Cases

### A. Financial Floating-Point Rounding Guard
JavaScript floating-point arithmetic (`0.1 + 0.2 !== 0.3`) is guarded across all financial services (`billing`, `pharmacy`, `payments`) using fixed precision string conversion before parsing:
```javascript
const roundedAmount = Number((quantity * unitPrice).toFixed(2));
```

### B. Concurrency & Stock Deduction Locking
When multiple pharmacy sales or inventory requests occur simultaneously for the same medicine:
1. Mongoose sessions start an ACID transaction (`session.startTransaction()`).
2. Mongoose `$inc` operators deduct stock atomically:
   ```javascript
   await InventoryItem.updateOne(
     { _id: itemId, quantity: { $gte: requiredQty } },
     { $inc: { quantity: -requiredQty } },
     { session }
   );
   ```
3. If stock drops below `requiredQty`, transaction aborts and throws a `400 Insufficient Stock` error.

---

## ⚡ 3. Caching & Performance Architecture

### Redis Caching Strategy

```
  Client Request (GET /super-admin/dashboard)
                       │
             Check Redis Cache Key
  (`hms:superadmin:dashboard:<start>:<end>:<dept>`)
                       │
        ┌──────────────┴──────────────┐
        ▼                             ▼
   [Cache HIT]                   [Cache MISS]
        │                             │
 Return Cached JSON          Query MongoDB Aggregations
 (Latency < 5ms)                      │
                             Write Result to Redis
                                  (TTL = 300s)
                                      │
                             Return Data to Client
```

### Cache Invalidation Hooks
Whenever an invoice is paid, IPD bed status changes, or pharmacy sale is completed, background invalidation invalidates matching key prefixes (`hms:superadmin:*`).

---

## 🚀 4. Production Deployment Checklist

### Pre-Deployment Verification Checklist
- [x] **Environment Variables**: Configure `PORT`, `MONGO_URI`, `JWT_ACCESS_SECRET`, `REDIS_URL`, `CLOUDINARY_*`, and `RESEND_API_KEY`.
- [x] **Git Tracking Cleanliness**: Ensure `.env` is listed in `.gitignore` and removed from git index.
- [x] **Vite Bundle Build**: Execute `npm run build` in `/frontend` to verify 0 JSX / TypeScript syntax errors.
- [x] **Database Indexing**: Verify MongoDB compound indexes on `patientId`, `createdAt`, `status`, and `UHID`.
- [x] **Security Headers**: Enable `helmet` HTTP headers and strict CORS origin whitelisting in `backend/src/server.js`.
