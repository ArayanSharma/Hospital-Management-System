# Hospital Management System - Frontend Documentation Index

Welcome to the official **Frontend Architecture & Component Documentation** for the Hospital Management System (HMS). This single-page application (SPA) is built with **React 18, Vite, Tailwind CSS, Lucide Icons, and Recharts**, using a modular **Feature-First Domain Architecture**.

---

## 📚 Documentation Index

Click on any section to open the full detailed documentation guide:

| # | Documentation Guide | Primary Topics Covered | Key Source Files |
| :-: | :--- | :--- | :--- |
| **00** | **[00. Frontend Architecture](file:///c:/Users/Arayan/OneDrive/Documents/HospitalMS/docs/frontendDocs/00_FRONTEND_ARCHITECTURE.md)** | Directory Structure, Vite build config, React Router v6 layout, Protected Routes, `lazyWithRetry` Chunk Error recovery, Error Boundaries, Axios Interceptor (`api.js`), and 25 domain features list. | `app/App.jsx`, `app/routes.jsx`, `utils/api.js`, `utils/lazyWithRetry.js` |
| **01** | **[01. UI/UX Design System](file:///c:/Users/Arayan/OneDrive/Documents/HospitalMS/docs/frontendDocs/01_UI_UX_DESIGN_SYSTEM.md)** | Color Tokens (Slate/HSL palette), Card & Modal overlays, Typography, Recharts charts, Mini SVG Sparklines, Skeleton loading rules vs Spinners, Micro-interactions. | `index.css`, `components/common/`, `components/layout/` |
| **02** | **[02. RBAC & State Engine](file:///c:/Users/Arayan/OneDrive/Documents/HospitalMS/docs/frontendDocs/02_RBAC_AND_STATE_MANAGEMENT.md)** | `AuthContext` state, JWT local persistence, `usePermission` hook, Module-to-Permission mapping (`PERM_TO_ACTION_MODULE_MAP`), `PermissionGate` wrappers. | `hooks/useAuth.js`, `hooks/usePermission.js`, `features/auth/` |

---

## 🏛️ Frontend Application Architecture

```
                               ┌──────────────────────────┐
                               │   Browser / Client App   │
                               └────────────┬─────────────┘
                                            │
                                            ▼
                               ┌──────────────────────────┐
                               │  Auth & Permission Gate  │ (useAuth & usePermission)
                               └────────────┬─────────────┘
                                            │
                                            ▼
                               ┌──────────────────────────┐
                               │     Dashboard Layout     │ (Header & Sidebar)
                               └────────────┬─────────────┘
                                            │
                                            ▼
                               ┌──────────────────────────┐
                               │ Route Error Boundary    │ (RouteErrorBoundary)
                               └────────────┬─────────────┘
                                            │
                                            ▼
                               ┌──────────────────────────┐
                               │ Domain Feature Components │ (25 Modular Features)
                               └────────────┬─────────────┘
                                            │
                                            ▼
                               ┌──────────────────────────┐
                               │   Axios HTTP Client      │ (api.js with JWT Interceptors)
                               └──────────────────────────┘
```

---

## 📦 Domain Features Summary (25 Modules)

| Feature | Primary Route | Permission Key | Key Responsibilities & Capabilities |
| :--- | :--- | :--- | :--- |
| **`admissions`** | `/ipd/admissions` | `admission:read` | IPD patient admission forms, active stay tracking, discharge summaries. |
| **`appointments`** | `/appointments` | `appointment:read` | Doctor appointment booking grid, slot collision alerts, status toggles. |
| **`audit-logs`** | `/audit-logs` | `audit_log:read` | System security audit trail viewer with user/action/date filtering. |
| **`auth`** | `/login`, `/profile` | Public / Required | User login, complete profile setup, token management, session logout. |
| **`beds`** | `/ipd/beds` | `admission:read` | Live bed occupancy map, ward bed matrix, maintenance toggles. |
| **`billing`** | `/billing` | `invoice:read` | Line-item invoice generation, partial payment processing, payment receipts. |
| **`departments`** | `/departments` | `user:read` | Hospital department directory, HOD doctor assignment, active stats. |
| **`doctors`** | `/doctors` | `doctor:read` | Physician profiles, weekly availability slots, consultation fee configuration. |
| **`insurance`** | `/insurance` | `insurance:read` | Health insurance policy directory, claim submission, approval tracking. |
| **`ipd`** | `/ipd` | `admission:read` | Inpatient Department (IPD) overview, active admissions, ward capacity. |
| **`laboratory`** | `/laboratory` | `lab_test:read` | Pathology lab test catalog, test result entry, Cloudinary PDF uploads. |
| **`notifications`** | Top Bar Popover | Required | Real-time in-app notification list, unread counters, mark as read. |
| **`opd`** | `/opd` | `opd:read` | Outpatient queue token workbench, vital sign recording, consultation finish. |
| **`patients`** | `/patients` | `patient:read` | Patient master demographic registry, UHID lookup, EHR timeline. |
| **`permissions`** | `/roles` | `role:write` | System permission registry display, module permission grouping. |
| **`pharmacy`** | `/pharmacy` | `medicine:read` | Drug catalog, OTC & prescription sale POS, automatic stock deduction. |
| **`prescriptions`** | `/prescriptions` | `medicine:read` | Doctor digital prescription issuance, dosage instructions, fulfillment state. |
| **`radiology`** | `/radiology` | `radiology_test:read` | Diagnostic imaging requests (X-Ray, MRI, CT), DICOM image uploads. |
| **`reports`** | `/reports` | `audit_log:read` | Revenue, patient demographics, doctor occupancy, and inventory analytics. |
| **`roles`** | `/roles` | `role:read` | Custom role management, RBAC permission matrix check-boxes. |
| **`settings`** | `/settings` | `superadmin:write` | Hospital profile, currency, tax rates, slot duration global settings. |
| **`super-admin`** | `/dashboard` | `superadmin:read` | System-wide analytics KPI dashboard, recent activity feed. |
| **`suppliers`** | `/suppliers` | `medicine:read` | Vendor procurement directory, tax ID records, contact details. |
| **`users`** | `/users` | `user:read` | Hospital staff directory, role assignment, active/inactive toggles. |
| **`wards`** | `/ipd/wards` | `admission:read` | Physical ward setup (ICU, Private, Deluxe), daily room rate configuration. |

---

## 💡 Quick Start Rules for Frontend Developers

1. **Permission Guards**: Wrap all protected routes with `<PermissionGate module="...">`. Use `const { hasPermission } = usePermission()` for action buttons (Create, Edit, Delete).
2. **Dynamic Imports**: Use `lazyWithRetry(() => import('./Feature'))` for code-splitting routes to handle chunk reload retries gracefully.
3. **Axios Client**: Always import the configured API instance from `src/utils/api.js`. Never raw `axios.get()`.
4. **Skeleton Loading**: Render matching skeleton layout cards during loading states to eliminate layout shifts (`animate-pulse`).


# Hospital Management System - Backend Documentation Index

Welcome to the official **Backend Architecture & Module Documentation** for the Hospital Management System (HMS). This documentation is designed to serve both current senior engineers and new junior developers joining the team, ensuring total clarity on all APIs, database schemas, business logic, transaction boundaries, and design choices across all 27 modules.

---

## 📚 Documentation Index

Click on any section to open the full detailed documentation guide:

| # | Documentation Guide | Modules Covered | Primary Topics Covered |
| :-: | :--- | :--- | :--- |
| **00** | **[00. Overview & Architecture](file:///c:/Users/Arayan/OneDrive/Documents/HospitalMS/docs/backendDocs/00_OVERVIEW_AND_ARCHITECTURE.md)** | Core System | Layer Pattern (Controller-Service-Model-Routes-Validation), Middlewares, Utilities, Error Standards, Cloudinary, DB Seeder, Redis, Sockets. |
| **01** | **[01. Auth & Security Modules](file:///c:/Users/Arayan/OneDrive/Documents/HospitalMS/docs/backendDocs/01_AUTH_AND_SECURITY_MODULES.md)** | `auth`, `users`, `roles`, `permissions`, `super-admin` | JWT authentication, Token Rotation, Password Hashing, RBAC matrix, Session revocation, User lifecycle, Redis dashboard caching. |
| **02** | **[02. Clinical & Patient Care](file:///c:/Users/Arayan/OneDrive/Documents/HospitalMS/docs/backendDocs/02_CLINICAL_AND_PATIENT_MODULES.md)** | `patients`, `doctors`, `departments`, `opd`, `appointments`, `ipd`, `wards`, `beds` | UHID generation, Doctor scheduling, Department HOD assignment, OPD tokens, Appointment collision check, IPD bed locking. |
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
4. **Soft Delete Policy**: Clinical entities (Patients, Doctors, Admissions, Departments) use soft deletion (`status = "inactive"` or `"discharged"`) to maintain legal healthcare compliance history.
5. **Redis Cache Invalidation**: Super Admin Dashboard queries use Redis cache keys (`hms:superadmin:dashboard:<start>:<end>:<dept>`) with 300s TTL. Any mutation altering financial or bed state should invalidate matching Redis cache prefixes.
6. **Real-Time Sockets**: Trigger real-time notifications via `emitNotification(userId, notificationData)` using Socket.IO target rooms (`user:<userId>`).

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

