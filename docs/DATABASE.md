# Master Database & Schema Blueprint (`DATABASE.md`)

This document serves as the master technical schema blueprint for the Hospital Management System MongoDB database, detailing collection relationships, Mongoose schemas, field definitions, indexing strategies, and data flows.

---

## 🗺️ Master Entity-Relationship Data Flows

```
                           ┌──────────────┐
                           │  Permission  │
                           └──────┬───────┘
                                  │ (ref)
                           ┌──────▼───────┐             ┌──────────────┐
                           │     Role     ├────────────►│  Department  │
                           └──────┬───────┘             └──────┬───────┘
                                  │ (ref)                      │ (headDoctorId)
                           ┌──────▼───────┐             ┌──────▼───────┐
                           │     User     ├────────────►│    Doctor    │
                           └──────┬───────┘             └──────┬───────┘
                                  │                            │
  ┌──────────────┐                │                     ┌──────▼───────┐
  │   Patient    │◄───────────────┴────────────────────►│ Appointment  │
  └──────┬───────┘                                      └──────────────┘
         │
         ├──────────────────────┬──────────────────────┬──────────────────────┐
         │                      │                      │                      │
  ┌──────▼───────┐       ┌──────▼───────┐       ┌──────▼───────┐       ┌──────▼───────┐
  │   OPDVisit   │       │  Admission   │       │Prescription  │       │   Invoice    │
  └──────────────┘       └──────┬───────┘       └──────┬───────┘       └──────┬───────┘
                                │                      │                      │
                         ┌──────▼───────┐       ┌──────▼───────┐       ┌──────▼───────┐
                         │     Bed      │       │ PharmacySale │       │   Payment    │
                         └──────────────┘       └──────┬───────┘       └──────────────┘
                                                       │
                                                ┌──────▼───────┐
                                                │InventoryItem │
                                                └──────────────┘
```

---

## 🏗️ Complete Mongoose Schema Specifications

### 🔐 1. Authentication & RBAC

#### 1. `User` (`users` collection) — `backend/src/modules/users/user.model.js`
- **Fields**: `name` (String, required), `email` (String, required, unique, lowercase), `password` (String, required, select: false), `roleId` (Ref: `Role`), `roleName` (String, default: "DOCTOR"), `department` (String), `designation` (String), `employeeId` (String), `phone` (String), `countryCode` (String), `dateOfBirth` (String), `gender` (Enum: `["Male", "Female", "Other", ""]`), `avatar` (String), `bloodGroup` (Enum: `["A+", "A-", "B+", "B-", "O+", "O-", "AB+", "AB-", ""]`), `maritalStatus` (Enum), `nationality` (String), `currentAddress` (String), `joiningDate` (String), `isProfileComplete` (Boolean), `status` (Enum: `["active", "inactive", "suspended", "blocked", "deleted"]`), `emailVerified` (String), `loginAccess` (String), `forcePasswordChange` (Boolean), `sendWelcomeEmail` (Boolean), `notes` (String), `isVerified` (Boolean), `lastLoginAt` (Date), `authProvider` (Enum: `["local", "google"]`), `firebaseUid` (String), `refreshToken` (String, select: false).
- **Indexes**: `{ email: 1 }` (unique), `{ username: 1 }`, `{ status: 1 }`, `{ department: 1 }`.
- **Hooks**: `pre("save")` hashes password via `bcrypt.hash(password, 10)` if modified.

#### 2. `Role` (`roles` collection) — `backend/src/modules/roles/role.model.js`
- **Fields**: `name` (String, required, unique, uppercase), `description` (String), `permissionIds` ([Ref: `Permission`]), `isSystemRole` (Boolean, default: false).

#### 3. `Permission` (`permissions` collection) — `backend/src/modules/permissions/permission.model.js`
- **Fields**: `name` (String, required, unique, lowercase), `module` (String, required), `description` (String).

---

### 🏥 2. Clinical Care & Patient Infrastructure

#### 4. `Patient` (`patients` collection) — `backend/src/modules/patients/patient.model.js`
- **Fields**: `patientId` (String, required, unique, UHID format `PAT-YYYYMMDD-XXXX`), `name` (String, required), `dateOfBirth` (Date, required), `gender` (Enum: `["male", "female", "other"]`), `phone` (String, required), `email` (String), `address` (String), `bloodGroup` (Enum), `maritalStatus` (Enum), `occupation` (String), `nationality` (String), `notes` (String), `emergencyContact` (`{ name, phone, relation }`), `status` (Enum: `["active", "inactive"]`), `isDeleted` (Boolean), `deletedAt` (Date).
- **Virtuals**: `age` (Dynamic age calculation from `dateOfBirth`).
- **Indexes**: `{ name: "text", phone: "text" }`, `{ isDeleted: 1, status: 1, createdAt: -1 }`, `{ phone: 1, isDeleted: 1 }`.

#### 5. `Doctor` (`doctors` collection) — `backend/src/modules/doctors/doctor.model.js`
- **Fields**: `doctorId` (String, unique, format `DOC-XXXX`), `userId` (Ref: `User`), `departmentId` (Ref: `Department`), `specialization` (String, required), `licenseNumber` (String, required), `consultationFee` (Number, required), `availability` ([`{ dayOfWeek, startTime, endTime, maxPatients }`]), `status` (Enum: `["active", "inactive"]`).

#### 6. `Department` (`departments` collection) — `backend/src/modules/departments/department.model.js`
- **Fields**: `name` (String, required, unique, case-insensitive), `code` (String, required, unique, uppercase), `description` (String), `headDoctorId` (Ref: `Doctor`), `status` (Enum: `["active", "inactive"]`).

#### 7. `Appointment` (`appointments` collection) — `backend/src/modules/appointments/appointment.model.js`
- **Fields**: `patientId` (Ref: `Patient`), `doctorId` (Ref: `Doctor`), `departmentId` (Ref: `Department`), `appointmentDate` (Date), `startTime` (String, format "HH:MM"), `endTime` (String, format "HH:MM"), `reason` (String), `status` (Enum: `["scheduled", "completed", "cancelled", "no-show"]`), `cancelledReason` (String).
- **Indexes**: `{ doctorId: 1, appointmentDate: 1 }` (Slot collision check optimization).

---

### 🩺 3. Outpatient & Inpatient Clinical Care

#### 8. `OPDVisit` (`opdvisits` collection) — `backend/src/modules/opd/opdVisit.model.js`
- **Fields**: `visitId` (String, unique, format `OPD-YYYYMMDD-XXX`), `patientId` (Ref: `Patient`), `doctorId` (Ref: `Doctor`), `queueNumber` (Number), `vitals` (`{ bp, pulse, temperature, weight, height, spo2 }`), `symptoms` (String), `status` (Enum: `["waiting", "in-consultation", "completed", "cancelled"]`), `visitDate` (Date).

#### 9. `Admission` (`admissions` collection) — `backend/src/modules/ipd/admission.model.js`
- **Fields**: `admissionId` (String, unique, format `IPD-YYYY-XXXX`), `patientId` (Ref: `Patient`), `doctorId` (Ref: `Doctor`), `wardId` (Ref: `Ward`), `bedId` (Ref: `Bed`), `admissionDate` (Date), `dischargeDate` (Date), `admissionReason` (String), `status` (Enum: `["admitted", "discharged", "transferred"]`), `dischargeSummary` (`{ diagnosis, treatmentGiven, adviceOnDischarge, followUpDate }`).

#### 10. `Ward` (`wards` collection) — `backend/src/modules/wards/ward.model.js`
- **Fields**: `name` (String, required), `type` (Enum: `["general", "semi-private", "private", "icu", "emergency"]`), `floor` (String), `capacity` (Number, required), `dailyRate` (Number, required).

#### 11. `Bed` (`beds` collection) — `backend/src/modules/beds/bed.model.js`
- **Fields**: `bedNumber` (String, required), `wardId` (Ref: `Ward`), `status` (Enum: `["available", "occupied", "maintenance"]`).

#### 12. `Prescription` (`prescriptions` collection) — `backend/src/modules/prescriptions/prescription.model.js`
- **Fields**: `prescriptionId` (String, unique, format `RX-YYYY-XXXX`), `patientId` (Ref: `Patient`), `doctorId` (Ref: `Doctor`), `visitId` (Ref: `OPDVisit`), `admissionId` (Ref: `Admission`), `medicines` ([`{ medicineId, name, dosage, frequency, duration, instructions }`]), `notes` (String), `status` (Enum: `["active", "dispensed", "cancelled"]`).

#### 13. `MedicalRecord` (`medicalrecords` collection) — `backend/src/modules/medical-records/medicalRecord.model.js`
- **Fields**: `patientId` (Ref: `Patient`), `doctorId` (Ref: `Doctor`), `recordType` (Enum: `["opd_consultation", "ipd_summary", "progress_note", "discharge_summary", "history"]`), `diagnosis` (String), `clinicalNotes` (String), `vitals` (`{ bp, pulse, temperature, weight, spo2 }`), `attachments` ([`{ fileUrl, fileName, fileType, uploadedAt }`]).

---

### 🧪 4. Pathology & Radiology Diagnostics

#### 14. `LabTest` (`labtests` collection) — `backend/src/modules/laboratory/labTest.model.js`
- **Fields**: `testCode` (String, unique, uppercase), `name` (String, required), `category` (Enum: `["pathology", "biochemistry", "microbiology", "hematology"]`), `price` (Number, required), `normalRange` (String), `unit` (String).

#### 15. `LabReport` (`labreports` collection) — `backend/src/modules/laboratory/labReport.model.js`
- **Fields**: `reportNumber` (String, unique, format `LAB-YYYY-XXXX`), `patientId` (Ref: `Patient`), `doctorId` (Ref: `Doctor`), `labTestId` (Ref: `LabTest`), `sampleType` (String), `sampleCollectedAt` (Date), `resultValue` (String), `remarks` (String), `reportFileUrl` (Cloudinary PDF URL), `status` (Enum: `["requested", "sample_collected", "completed", "cancelled"]`).

#### 16. `RadiologyTest` (`radiologytests` collection) — `backend/src/modules/radiology/radiologyTest.model.js`
- **Fields**: `testCode` (String, unique, uppercase), `name` (String, required), `modality` (Enum: `["X-Ray", "MRI", "CT Scan", "Ultrasound", "ECG"]`), `price` (Number, required).

#### 17. `RadiologyReport` (`radiologyreports` collection) — `backend/src/modules/radiology/radiologyReport.model.js`
- **Fields**: `reportNumber` (String, unique, format `RAD-YYYY-XXXX`), `patientId` (Ref: `Patient`), `doctorId` (Ref: `Doctor`), `radiologyTestId` (Ref: `RadiologyTest`), `findings` (String), `impression` (String), `imageUrls` ([Cloudinary DICOM/PNG URLs]), `status` (Enum: `["scheduled", "in-progress", "completed"]`).

---

### 💊 5. Pharmacy & Supply Chain

#### 18. `Medicine` (`medicines` collection) — `backend/src/modules/pharmacy/medicine.model.js`
- **Fields**: `name` (String, required), `genericName` (String, required), `category` (Enum: `["tablet", "capsule", "syrup", "injection", "ointment", "drops"]`), `manufacturer` (String), `unit` (String), `price` (Number, required), `status` (Enum: `["active", "inactive"]`).

#### 19. `PharmacySale` (`pharmacysales` collection) — `backend/src/modules/pharmacy/pharmacySale.model.js`
- **Fields**: `saleId` (String, unique, format `SALE-YYYY-XXXX`), `patientId` (Ref: `Patient`), `prescriptionId` (Ref: `Prescription`), `medicines` ([`{ medicineId, inventoryItemId, quantity, unitPrice, subtotal }`]), `totalAmount` (Number, required), `paymentStatus` (Enum: `["pending", "paid"]`), `soldBy` (Ref: `User`).

#### 20. `InventoryItem` (`inventoryitems` collection) — `backend/src/modules/inventory/inventoryItem.model.js`
- **Fields**: `itemCode` (String, unique, uppercase), `medicineId` (Ref: `Medicine`), `itemName` (String, required), `batchNumber` (String, required), `quantity` (Number, required), `minStockLevel` (Number, required), `expiryDate` (Date, required), `unitCost` (Number, required), `supplierId` (Ref: `Supplier`), `status` (Enum: `["in-stock", "low-stock", "out-of-stock", "expired"]`).

#### 21. `Supplier` (`suppliers` collection) — `backend/src/modules/suppliers/supplier.model.js`
- **Fields**: `name` (String, required), `contactPerson` (String), `phone` (String, required), `email` (String), `address` (String), `taxId` (String), `status` (Enum: `["active", "inactive"]`).

---

### 💰 6. Financials, Insurance & System Governance

#### 22. `Invoice` (`invoices` collection) — `backend/src/modules/billing/invoice.model.js`
- **Fields**: `invoiceNumber` (String, unique, format `INV-YYYY-XXXX`), `patientId` (Ref: `Patient`), `items` ([`{ description, unitPrice, quantity, amount }`]), `subtotal` (Number), `discount` (Number), `tax` (Number), `total` (Number), `amountPaid` (Number, default: 0), `status` (Enum: `["unpaid", "partially-paid", "paid", "cancelled"]`), `dueDate` (Date).

#### 23. `Payment` (`payments` collection) — `backend/src/modules/payments/payment.model.js`
- **Fields**: `receiptNumber` (String, unique, format `RCP-YYYY-XXXX`), `invoiceId` (Ref: `Invoice`), `patientId` (Ref: `Patient`), `amount` (Number, required), `paymentMethod` (Enum: `["cash", "card", "upi", "netbanking", "cheque"]`), `transactionReference` (String), `receivedBy` (Ref: `User`), `paymentDate` (Date).

#### 24. `InsurancePolicy` (`insurancepolicies` collection) — `backend/src/modules/insurance/insurancePolicy.model.js`
- **Fields**: `policyNumber` (String, unique), `patientId` (Ref: `Patient`), `providerName` (String, required), `coverageAmount` (Number, required), `validUntil` (Date, required), `status` (Enum: `["active", "expired"]`).

#### 25. `InsuranceClaim` (`insuranceclaims` collection) — `backend/src/modules/insurance/insuranceClaim.model.js`
- **Fields**: `claimNumber` (String, unique, format `CLM-YYYY-XXXX`), `policyId` (Ref: `InsurancePolicy`), `patientId` (Ref: `Patient`), `admissionId` (Ref: `Admission`), `invoiceId` (Ref: `Invoice`), `claimedAmount` (Number, required), `approvedAmount` (Number, default: 0), `status` (Enum: `["submitted", "pre-authorized", "approved", "rejected", "settled"]`), `rejectionReason` (String).

#### 26. `AuditLog` (`auditlogs` collection) — `backend/src/modules/audit-logs/audit-log.model.js`
- **Fields**: `userId` (Ref: `User`), `action` (Enum: `["CREATE", "UPDATE", "DELETE", "LOGIN", "LOGOUT"]`), `resource` (String), `resourceId` (Mixed), `oldValue` (Object), `newValue` (Object), `ipAddress` (String), `userAgent` (String), `createdAt` (Date, indexed).

#### 27. `Notification` (`notifications` collection) — `backend/src/modules/notifications/notification.model.js`
- **Fields**: `userId` (Ref: `User`), `type` (Enum: `["appointment", "prescription", "lab", "inventory", "system"]`), `title` (String), `message` (String), `isRead` (Boolean, default: false), `metadata` (Object), `createdAt` (Date).

#### 28. `Setting` (`settings` collection) — `backend/src/modules/settings/setting.model.js`
- **Fields**: `hospitalName` (String), `logoUrl` (String), `address` (String), `contactEmail` (String), `contactPhone` (String), `currency` (String, default: "INR"), `taxRate` (Number, default: 18), `appointmentSlotDuration` (Number, default: 15).

---

## 📊 Analytics Aggregations & Redis Caching

1. **`Reports` Module**: Does **NOT** store static database documents. It dynamically executes MongoDB Aggregation Pipelines across `invoices`, `pharmacysales`, `patients`, `appointments`, and `inventoryitems` collections to compute real-time revenue and occupancy metrics.
2. **`SuperAdmin` Dashboard**: Aggregates collection counts and revenue totals, caching output in **Redis** (`hms:superadmin:dashboard:*`) with a 300-second TTL to deliver sub-millisecond dashboard page loads.