# Hospital Management System - Backend Documentation Index

Welcome to the official **Backend Architecture & Module Documentation** for the Hospital Management System (HMS). This documentation is designed to serve both current senior engineers and new junior developers joining the team, ensuring total clarity on all APIs, database schemas, business logic, transaction boundaries, and design choices.

---

## 📚 Documentation Index

Click on any section to open the full detailed documentation guide:

| # | Documentation Guide | Modules Covered | Primary Topics Covered |
| :-: | :--- | :--- | :--- |
| **00** | **[00. Overview & Architecture](file:///c:/Users/Arayan/OneDrive/Documents/HospitalMS/docs/backendDocs/00_OVERVIEW_AND_ARCHITECTURE.md)** | Core System | Layer Pattern (Controller-Service-Model-Routes-Validation), Middlewares, Utilities, Error Standards, Cloudinary, DB Seeder. |
| **01** | **[01. Auth & Security Modules](file:///c:/Users/Arayan/OneDrive/Documents/HospitalMS/docs/backendDocs/01_AUTH_AND_SECURITY_MODULES.md)** | `auth`, `users`, `roles`, `permissions`, `super-admin` | JWT authentication, Token Rotation, Password Hashing, RBAC matrix, Session revocation, User lifecycle. |
| **02** | **[02. Clinical & Patient Care](file:///c:/Users/Arayan/OneDrive/Documents/HospitalMS/docs/backendDocs/02_CLINICAL_AND_PATIENT_MODULES.md)** | `patients`, `doctors`, `opd`, `appointments`, `ipd`, `wards`, `beds` | UHID generation, Doctor scheduling, OPD tokens, Appointment collision check, IPD admission & bed occupancy locking. |
| **03** | **[03. Medical Records & Diagnostics](file:///c:/Users/Arayan/OneDrive/Documents/HospitalMS/docs/backendDocs/03_MEDICAL_RECORDS_DIAGNOSTICS_MODULES.md)** | `medical-records`, `prescriptions`, `laboratory`, `radiology` | EHR timelines, Doctor prescription issuance, Pathology test catalog & PDF uploads, Radiology scan management. |
| **04** | **[04. Pharmacy & Inventory](file:///c:/Users/Arayan/OneDrive/Documents/HospitalMS/docs/backendDocs/04_PHARMACY_AND_INVENTORY_MODULES.md)** | `pharmacy`, `inventory`, `suppliers` | Medicine catalog, ACID transaction stock deduction (`stockOut`), Low stock alerts, Vendor procurement. |
| **05** | **[05. Billing, Payments & Insurance](file:///c:/Users/Arayan/OneDrive/Documents/HospitalMS/docs/backendDocs/05_BILLING_PAYMENTS_INSURANCE_MODULES.md)** | `billing`, `payments`, `insurance` | Invoice generation, Partial payment handling, Overpayment protection, Insurance policy & claim approvals. |
| **06** | **[06. System Logs & Settings](file:///c:/Users/Arayan/OneDrive/Documents/HospitalMS/docs/backendDocs/06_SYSTEM_LOGS_NOTIFICATIONS_SETTINGS_MODULES.md)** | `audit-logs`, `notifications`, `reports`, `settings` | Non-blocking audit compliance logging, In-app alerts, Analytical revenue/occupancy reports, Global settings. |

---

## 🏛️ System Architecture Map

All 27 modules follow the unified **Clean Layered Controller-Service Architecture**:

```
Client Request (HTTP / REST)
       │
       ▼
   [Routes] ──► (Authentication & Permission Middlewares)
       │
       ▼
 [Validation] ──► (Zod Payload Sanitization)
       │
       ▼
[Controller] ──► (Extracts req parameters & returns ApiResponse)
       │
       ▼
  [Service]  ──► (Pure Business Logic, ACID Transactions, Conflict Checks)
       │
       ▼
   [Model]   ──► (Mongoose Schema & MongoDB Operations)
```

---

## 🔐 Master Role-Based Access Control (RBAC) Matrix

| Feature / Module | Super Admin | Admin | Doctor | Nurse | Receptionist | Pharmacist | Lab Tech | Patient |
| :--- | :-: | :-: | :-: | :-: | :-: | :-: | :-: | :-: |
| **User & Role Management** | ✅ | ✅ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ |
| **Patient Registration** | ✅ | ✅ | ✅ | ✅ | ✅ | ❌ | ❌ | ❌ |
| **OPD & Appointments** | ✅ | ✅ | ✅ | ✅ | ✅ | ❌ | ❌ | View Own |
| **IPD Admissions & Beds** | ✅ | ✅ | ✅ | ✅ | ✅ | ❌ | ❌ | ❌ |
| **Medical Records** | ✅ | ✅ | ✅ | Read | ❌ | ❌ | ❌ | View Own |
| **Prescription Creation** | ✅ | ❌ | ✅ | ❌ | ❌ | ❌ | ❌ | View Own |
| **Pharmacy Sales & Stock** | ✅ | ✅ | ❌ | ❌ | ❌ | ✅ | ❌ | ❌ |
| **Lab & Radiology Reports** | ✅ | ✅ | ✅ | Read | ❌ | ❌ | ✅ | View Own |
| **Billing & Payments** | ✅ | ✅ | ❌ | ❌ | ✅ | ✅ | ❌ | View Own |
| **Audit Logs & Settings** | ✅ | Read | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ |

---

## 💡 Quick Start Rules for Developers

1. **Password Safety**: Passwords are automatically hashed via Mongoose `pre("save")` hooks in `user.model.js`. **Do NOT call `bcrypt.hash()` manually in service methods.**
2. **Atomic Financial & Stock Operations**: Always pass a Mongoose `session` into `PharmacySale` or `Payment` service calls to ensure stock and invoice balances mutate atomically inside transactions.
3. **Audit Log Resilience**: Service methods trigger `createAuditLog()`. The audit logger swallows internal logging errors so main user actions never fail due to audit persistence glitches.
4. **Soft Delete Policy**: Clinical entities (Patients, Doctors, Admissions) use soft deletion (`status = "inactive"` or `"discharged"`) to maintain legal healthcare compliance history.
