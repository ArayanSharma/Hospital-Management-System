# Hospital Management System - Complete Modules Reference Guide

This document provides an exhaustive reference inventory of all 27 Backend Modules (`backend/src/modules/`), 25 Frontend Feature Directories (`frontend/src/features/`), and shared system infrastructure.

---

## 🔴 Backend Modules Directory Structure (`backend/src/modules/`)

```
backend/src/modules/
├── appointments/          # OPD appointment scheduling & time-overlap collision logic
├── audit-logs/            # Non-blocking immutable compliance audit trail logger
├── auth/                  # JWT authentication, login, register, token rotation, logout
├── beds/                  # Hospital bed occupancy state & ward bed management
├── billing/               # Line-item patient invoice generation, discounts & tax
├── departments/           # Hospital department directory & HOD doctor assignment
├── doctors/               # Physician profiles, schedules, consultation fee setup
├── insurance/             # Health insurance policy directory & claim approvals
├── inventory/             # Stock batch tracking, min-level alerts, expiry FEFO enforcement
├── ipd/                   # Inpatient admissions, bed locking & discharge summaries
├── laboratory/            # Pathology lab test catalog & report PDF uploads
├── medical-records/       # EHR timeline & clinical attachment management
├── notifications/         # Real-time in-app alert notifications via Socket.IO
├── opd/                   # Outpatient visit consultation queue token manager
├── patients/              # Master patient demographic registry & UHID generator
├── payments/              # Payment receipts (Cash/Card/UPI) & balance ledger
├── permissions/           # System capability permission keys registry
├── pharmacy/              # Drug catalog & POS counter stock deduction
├── prescriptions/         # Digital prescription writer & pharmacy queue integration
├── radiology/             # Diagnostic imaging scan orders & DICOM image uploads
├── reports/               # Aggregate financial, occupancy & demographic analytics
├── roles/                 # Custom role definitions & permission ID arrays
├── settings/              # Global hospital settings, currency & default tax rates
├── super-admin/           # Redis-cached dashboard analytics & activity feeds
├── suppliers/             # Vendor procurement directory & tax ID records
├── users/                 # Staff user directory, bcrypt password hooks & status toggles
└── wards/                 # Ward room setup (ICU, Private, Deluxe) & daily rates
```

---

## 📋 Comprehensive Backend Modules Capability Matrix

| Module Name | Mongoose Model File | Base API Route Prefix | Core Capabilities & Work |
| :--- | :--- | :--- | :--- |
| **`auth`** | `user.model.js` | `/api/v1/auth` | User login, registration, token rotation, profile retrieval, logout. |
| **`users`** | `user.model.js` | `/api/v1/users` | Staff account creation, profile updates, status activation/deactivation. |
| **`roles`** | `role.model.js` | `/api/v1/roles` | Role creation, permission assignments, protected system roles. |
| **`permissions`** | `permission.model.js` | `/api/v1/permissions` | System permission registry display, module category grouping. |
| **`super-admin`** | N/A (Aggregator) | `/api/v1/super-admin` | System-wide Redis-cached analytics dashboard, recent activity feed. |
| **`patients`** | `patient.model.js` | `/api/v1/patients` | Patient master demographic registry, UHID generation, soft delete. |
| **`doctors`** | `doctor.model.js` | `/api/v1/doctors` | Physician profiles, weekly availability slots, consultation fees. |
| **`departments`** | `department.model.js` | `/api/v1/departments` | Department directory, code uniqueness, HOD doctor assignment. |
| **`appointments`** | `appointment.model.js` | `/api/v1/appointments` | Appointment booking, doctor slot collision prevention (`409 Conflict`). |
| **`opd`** | `opdVisit.model.js` | `/api/v1/opd-visits` | Outpatient consultation queue tokens, triage vitals recording. |
| **`ipd`** | `admission.model.js` | `/api/v1/admissions` | IPD admissions, atomic bed locking (`available` -> `occupied`), discharge. |
| **`wards`** | `ward.model.js` | `/api/v1/wards` | Physical ward setup (ICU, Private), capacity, daily room rates. |
| **`beds`** | `bed.model.js` | `/api/v1/beds` | Live bed occupancy matrix, maintenance status toggles. |
| **`prescriptions`** | `prescription.model.js` | `/api/v1/prescriptions` | Digital prescription issuance, dosage instructions, pharmacy links. |
| **`medical-records`**| `medicalRecord.model.js` | `/api/v1/medical-records` | Chronological EHR timeline, clinical attachment uploads. |
| **`laboratory`** | `labTest.model.js`, `labReport.model.js` | `/api/v1/lab-reports` | Pathology lab test catalog, test result entry, Cloudinary PDF uploads. |
| **`radiology`** | `radiologyTest.model.js`, `radiologyReport.model.js` | `/api/v1/radiology-reports` | Imaging scan orders (X-Ray, MRI, CT), DICOM image uploads. |
| **`pharmacy`** | `medicine.model.js`, `pharmacySale.model.js` | `/api/v1/pharmacy-sales` | Drug catalog, POS checkout with atomic Mongoose stock deduction. |
| **`inventory`** | `inventoryItem.model.js` | `/api/v1/inventory` | SKU batch tracking, unit cost, low-stock alerts, expiry FEFO. |
| **`suppliers`** | `supplier.model.js` | `/api/v1/suppliers` | Vendor procurement directory, contact details, tax numbers (GSTIN). |
| **`billing`** | `invoice.model.js` | `/api/v1/invoices` | Line-item invoice generation, discounts, tax, status tracking. |
| **`payments`** | `payment.model.js` | `/api/v1/payments` | Cash/Card/UPI payment receipts, multi-receipt ledger, overpayment guard. |
| **`insurance`** | `insurancePolicy.model.js`, `insuranceClaim.model.js` | `/api/v1/insurance-claims` | Third-party insurance policy registration, claim pre-auth & approvals. |
| **`audit-logs`** | `audit-log.model.js` | `/api/v1/audit-logs` | Immutable security audit trail logger with fail-safe isolation. |
| **`notifications`** | `notification.model.js` | `/api/v1/notifications` | Real-time in-app alerts delivered via Socket.IO rooms (`user:<userId>`). |
| **`reports`** | N/A (Aggregator) | `/api/v1/reports` | Revenue analytics, patient demographics, doctor occupancy reports. |
| **`settings`** | `setting.model.js` | `/api/v1/settings` | Hospital institution profile, brand logo, currency, tax defaults. |

---

## 🟢 Frontend Features Directory Structure (`frontend/src/features/`)

```
frontend/src/features/
├── admissions/           # IPD patient stay management & discharge summaries
├── appointments/         # OPD appointment scheduling & slot collision grid
├── audit-logs/           # System security audit log filterable viewer
├── auth/                 # Login page, profile setup & AuthContext hook
├── beds/                 # Live bed occupancy matrix & status toggles
├── billing/              # Line-item invoice generation & payment popovers
├── departments/          # Department directory & HOD assignment modals
├── doctors/              # Physician profiles & weekly schedule setup
├── insurance/            # Health insurance policy directory & claims
├── ipd/                  # IPD overview & ward capacity analytics
├── laboratory/           # Lab test catalog & report PDF upload modal
├── notifications/        # In-app real-time notification popover menu
├── opd/                  # Outpatient visit consultation queue workbench
├── patients/             # Patient registration & EMR timeline view
├── permissions/          # System permissions registry matrix display
├── pharmacy/             # Drug catalog & POS checkout sales counter
├── prescriptions/        # Doctor digital prescription writer
├── radiology/            # Diagnostic imaging scan orders & image viewer
├── reports/              # Hospital revenue & doctor occupancy charts
├── roles/                # Custom role management & RBAC checkbox matrix
├── settings/             # Global hospital settings & tax default config
├── super-admin/          # System analytics KPI dashboard & activity feed
├── suppliers/            # Vendor procurement directory & purchase records
├── users/                # Staff directory & role assignment toggles
└── wards/                # Physical ward setup & daily rate config
```

---

## 🧩 Shared Frontend Infrastructure (`frontend/src/`)

These directories contain shared utilities, UI components, layout shells, and state context wrappers used across all feature modules:

```
frontend/src/
├── app/
│   ├── App.jsx            # Main React App entry with AuthProvider & Query Client
│   └── routes.jsx         # React Router v6 route tree with Protected Routes
├── components/
│   ├── common/            # `ErrorBoundary.jsx`, `ErrorState.jsx`, `RouteErrorBoundary.jsx`, `LoadingSpinner.jsx`
│   └── layout/            # `Header.jsx`, `Sidebar.jsx`, `DashboardLayout.jsx`
├── hooks/
│   ├── useAuth.js         # AuthContext hook for user session state & token storage
│   └── usePermission.js   # RBAC permission engine hook & module gate logic
├── utils/
│   ├── api.js             # Centralized Axios instance with JWT interceptor
│   └── lazyWithRetry.js   # Dynamic import chunk error reload retry wrapper
└── index.css              # Tailwind CSS layer directives & custom design tokens
```

---

## 🔄 Backend ↔ Frontend Alignment Table

| Backend Module (`modules/`) | Frontend Feature (`features/`) | Direct Route |
| :--- | :--- | :--- |
| `auth` | `auth` | `/login` |
| `users` | `users` | `/users` |
| `roles` | `roles` | `/roles` |
| `permissions` | `permissions` | `/roles` |
| `super-admin` | `super-admin` | `/dashboard` |
| `patients` | `patients` | `/patients` |
| `doctors` | `doctors` | `/doctors` |
| `departments` | `departments` | `/departments` |
| `opd` | `opd` | `/opd` |
| `appointments` | `appointments` | `/appointments` |
| `ipd` | `ipd` | `/ipd` |
| `admissions` | `admissions` | `/ipd/admissions` |
| `wards` | `wards` | `/ipd/wards` |
| `beds` | `beds` | `/ipd/beds` |
| `medical-records` | `medical-records` | `/patients/:id` |
| `prescriptions` | `prescriptions` | `/prescriptions` |
| `laboratory` | `laboratory` | `/laboratory` |
| `radiology` | `radiology` | `/radiology` |
| `pharmacy` | `pharmacy` | `/pharmacy` |
| `inventory` | `inventory` | `/pharmacy/inventory` |
| `suppliers` | `suppliers` | `/suppliers` |
| `billing` | `billing` | `/billing` |
| `payments` | `payments` | `/billing/payments` |
| `insurance` | `insurance` | `/insurance` |
| `audit-logs` | `audit-logs` | `/audit-logs` |
| `notifications` | `notifications` | Top Header Bar |
| `reports` | `reports` | `/reports` |
| `settings` | `settings` | `/settings` |