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
