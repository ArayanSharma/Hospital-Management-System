# Hospital Management System - Database & Schema Documentation Index

Welcome to the official **Database & Schema Documentation** for the Hospital Management System (HMS). This documentation suite details all MongoDB collections, Mongoose schema models, data types, field validation rules, index strategies, foreign key relationships, and transaction boundaries.

---

## 📚 Database Documentation Index

Click on any guide below to open the complete schema documentation:

| # | Schema Guide | Collections Covered | Key Topics Covered |
| :-: | :--- | :--- | :--- |
| **00** | **[00. Overview & Conventions](file:///c:/Users/Arayan/OneDrive/Documents/HospitalMS/docs/databaseDocs/00_SCHEMA_OVERVIEW_AND_CONVENTIONS.md)** | All Collections | ID generation conventions, timestamps, soft-delete design, indexing rules, ACID session transaction boundaries. |
| **01** | **[01. Auth & Security Schemas](file:///c:/Users/Arayan/OneDrive/Documents/HospitalMS/docs/databaseDocs/01_AUTH_AND_SECURITY_SCHEMAS.md)** | `users`, `roles`, `permissions` | Password hashing hooks, token rotation storage, role-permission references, active/inactive user session toggles. |
| **02** | **[02. Clinical Care Schemas](file:///c:/Users/Arayan/OneDrive/Documents/HospitalMS/docs/databaseDocs/02_CLINICAL_AND_PATIENT_SCHEMAS.md)** | `patients`, `doctors`, `departments`, `opdvisits`, `appointments`, `admissions`, `wards`, `beds` | UHID formatting, HOD assignments, appointment slot overlap guards, IPD bed occupancy locking. |
| **03** | **[03. Medical Records & Diagnostics Schemas](file:///c:/Users/Arayan/OneDrive/Documents/HospitalMS/docs/databaseDocs/03_MEDICAL_RECORDS_AND_DIAGNOSTICS_SCHEMAS.md)** | `medicalrecords`, `prescriptions`, `labtests`, `labreports`, `radiologytests`, `radiologyreports` | EHR timelines, dosage sub-documents, Cloudinary PDF & DICOM attachments, test result entry. |
| **04** | **[04. Pharmacy & Inventory Schemas](file:///c:/Users/Arayan/OneDrive/Documents/HospitalMS/docs/databaseDocs/04_PHARMACY_INVENTORY_AND_SUPPLIER_SCHEMAS.md)** | `medicines`, `pharmacysales`, `inventoryitems`, `suppliers` | Medicine catalog, SKU batch numbers, low-stock thresholds, supplier procurement records. |
| **05** | **[05. Billing, Payments & Insurance Schemas](file:///c:/Users/Arayan/OneDrive/Documents/HospitalMS/docs/databaseDocs/05_BILLING_PAYMENTS_AND_INSURANCE_SCHEMAS.md)** | `invoices`, `payments`, `insurancepolicies`, `insuranceclaims` | Line-item invoice structures, overpayment guards, multi-receipt tracking, policy limits & claim approvals. |
| **06** | **[06. System Logs, Notifications & Settings Schemas](file:///c:/Users/Arayan/OneDrive/Documents/HospitalMS/docs/databaseDocs/06_SYSTEM_LOGS_NOTIFICATIONS_AND_SETTINGS_SCHEMAS.md)** | `auditlogs`, `notifications`, `settings` | Immutable security audit trails, real-time alert sub-documents, global hospital system settings. |

---

## 🗺️ Master Entity Relationship (ER) Map

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
 ┌──────────────┐        │                     ┌──────▼───────┐
 │   Patient    │◄───────┴────────────────────►│ Appointment  │
 └──────┬───────┘                              └──────────────┘
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

## 📋 Collection Inventory & Index Summary

| Collection | Model Class | Mongoose File | Primary Indexes | Key References |
| :--- | :--- | :--- | :--- | :--- |
| `users` | `User` | `users/user.model.js` | `{ email: 1 }` (unique) | `roleId` -> `Role` |
| `roles` | `Role` | `roles/role.model.js` | `{ name: 1 }` (unique) | `permissionIds` -> `Permission` |
| `permissions` | `Permission` | `permissions/permission.model.js` | `{ name: 1 }` (unique) | N/A |
| `patients` | `Patient` | `patients/patient.model.js` | `{ patientId: 1 }`, `{ phone: 1 }` | N/A |
| `doctors` | `Doctor` | `doctors/doctor.model.js` | `{ doctorId: 1 }` | `userId` -> `User`, `departmentId` -> `Department` |
| `departments` | `Department` | `departments/department.model.js` | `{ name: 1 }`, `{ code: 1 }` | `headDoctorId` -> `Doctor` |
| `opdvisits` | `OPDVisit` | `opd/opdVisit.model.js` | `{ visitId: 1 }`, `{ visitDate: 1 }` | `patientId` -> `Patient`, `doctorId` -> `Doctor` |
| `appointments` | `Appointment` | `appointments/appointment.model.js` | `{ doctorId: 1, appointmentDate: 1 }` | `patientId` -> `Patient`, `doctorId` -> `Doctor` |
| `admissions` | `Admission` | `ipd/admission.model.js` | `{ admissionId: 1 }`, `{ status: 1 }` | `patientId` -> `Patient`, `wardId` -> `Ward`, `bedId` -> `Bed` |
| `wards` | `Ward` | `wards/ward.model.js` | `{ name: 1 }` | N/A |
| `beds` | `Bed` | `beds/bed.model.js` | `{ bedNumber: 1, wardId: 1 }` | `wardId` -> `Ward` |
| `medicalrecords` | `MedicalRecord` | `medical-records/medicalRecord.model.js` | `{ patientId: 1, createdAt: -1 }` | `patientId` -> `Patient`, `doctorId` -> `Doctor` |
| `prescriptions` | `Prescription` | `prescriptions/prescription.model.js` | `{ prescriptionId: 1 }` | `patientId` -> `Patient`, `doctorId` -> `Doctor` |
| `labtests` | `LabTest` | `laboratory/labTest.model.js` | `{ testCode: 1 }` | N/A |
| `labreports` | `LabReport` | `laboratory/labReport.model.js` | `{ reportNumber: 1 }` | `patientId` -> `Patient`, `labTestId` -> `LabTest` |
| `radiologytests` | `RadiologyTest` | `radiology/radiologyTest.model.js` | `{ testCode: 1 }` | N/A |
| `radiologyreports` | `RadiologyReport` | `radiology/radiologyReport.model.js` | `{ reportNumber: 1 }` | `patientId` -> `Patient`, `radiologyTestId` -> `RadiologyTest` |
| `medicines` | `Medicine` | `pharmacy/medicine.model.js` | `{ name: 1 }` | N/A |
| `pharmacysales` | `PharmacySale` | `pharmacy/pharmacySale.model.js` | `{ saleId: 1 }` | `patientId` -> `Patient`, `soldBy` -> `User` |
| `inventoryitems` | `InventoryItem` | `inventory/inventoryItem.model.js` | `{ itemCode: 1 }`, `{ expiryDate: 1 }` | `medicineId` -> `Medicine`, `supplierId` -> `Supplier` |
| `suppliers` | `Supplier` | `suppliers/supplier.model.js` | `{ name: 1 }` | N/A |
| `invoices` | `Invoice` | `billing/invoice.model.js` | `{ invoiceNumber: 1 }`, `{ status: 1 }` | `patientId` -> `Patient` |
| `payments` | `Payment` | `payments/payment.model.js` | `{ receiptNumber: 1 }` | `invoiceId` -> `Invoice`, `patientId` -> `Patient` |
| `insurancepolicies`| `InsurancePolicy` | `insurance/insurancePolicy.model.js` | `{ policyNumber: 1 }` | `patientId` -> `Patient` |
| `insuranceclaims` | `InsuranceClaim` | `insurance/insuranceClaim.model.js` | `{ claimNumber: 1 }` | `policyId` -> `InsurancePolicy`, `invoiceId` -> `Invoice` |
| `auditlogs` | `AuditLog` | `audit-logs/audit-log.model.js` | `{ createdAt: -1 }`, `{ userId: 1 }` | `userId` -> `User` |
| `notifications` | `Notification` | `notifications/notification.model.js` | `{ userId: 1, isRead: 1 }` | `userId` -> `User` |
| `settings` | `Setting` | `settings/setting.model.js` | Singleton | N/A |
