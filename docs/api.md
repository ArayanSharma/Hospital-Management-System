# Hospital Management System - Complete REST API Specification

Welcome to the comprehensive **REST API Reference Specification** for the Hospital Management System (HMS). All backend APIs follow strict RESTful conventions, returning JSON responses wrapped in a standardized envelope structure.

---

## 🌐 Global API Envelope & Standards

### Base URL
`http://localhost:5000/api/v1`

### Standard Request Headers
```http
Content-Type: application/json
Authorization: Bearer <JWT_ACCESS_TOKEN>
```

### Standard Success Response Envelope (HTTP 200 / 201)
```json
{
  "success": true,
  "statusCode": 200,
  "message": "Operation completed successfully",
  "data": { ... },
  "meta": {
    "page": 1,
    "limit": 10,
    "total": 150,
    "totalPages": 15
  }
}
```

### Standard Error Response Envelope (HTTP 4xx / 5xx)
```json
{
  "success": false,
  "statusCode": 400,
  "message": "Validation failed: Phone number must be 10 digits",
  "errors": [
    {
      "field": "phone",
      "message": "Phone number must be 10 digits"
    }
  ]
}
```

---

## 📚 Module API Endpoint Directory

Below is the exhaustive directory of endpoints organized across the system's 27 functional modules.

---

### 1. Authentication Module (`/auth`)

| Method | Endpoint | Access Level | Description |
| :--- | :--- | :--- | :--- |
| `POST` | `/auth/login` | Public | Authenticates user with email & password, returns JWT token |
| `POST` | `/auth/logout` | Authenticated | Revokes active user session |
| `GET` | `/auth/me` | Authenticated | Retrieves current authenticated user profile & permissions |
| `POST` | `/auth/complete-profile` | Public / Invited | Completes new staff profile setup & sets permanent password |
| `POST` | `/auth/forgot-password` | Public | Initiates password reset email dispatch |
| `POST` | `/auth/reset-password` | Public | Resets password using valid reset token |

---

### 2. User & RBAC Modules (`/users`, `/roles`, `/permissions`)

| Method | Endpoint | Access Level | Description |
| :--- | :--- | :--- | :--- |
| `GET` | `/users` | `user:read` | Returns paginated list of staff users (filters: `roleId`, `status`, `search`) |
| `POST` | `/users` | `user:create` | Creates new user account and dispatches invitation email |
| `GET` | `/users/:id` | `user:read` | Fetches specific user details |
| `PUT` | `/users/:id` | `user:update` | Updates user details, status, or role assignment |
| `DELETE` | `/users/:id` | `user:delete` | Soft deletes user account |
| `GET` | `/roles` | `role:read` | Lists all roles with assigned permissions |
| `POST` | `/roles` | `role:create` | Creates custom user role |
| `PUT` | `/roles/:id` | `role:update` | Updates role name & permissions array |
| `GET` | `/permissions` | `permission:read` | Retrieves master permission matrix catalog |

---

### 3. Patient Management Module (`/patients`)

| Method | Endpoint | Access Level | Description |
| :--- | :--- | :--- | :--- |
| `GET` | `/patients` | `patient:read` | Paginated patient list with UHID & name search |
| `POST` | `/patients` | `patient:create` | Registers new patient & auto-generates UHID (e.g. `UHID-2026-00042`) |
| `GET` | `/patients/:id` | `patient:read` | Fetches patient profile, emergency contact, & medical history |
| `PUT` | `/patients/:id` | `patient:update` | Updates patient details |
| `DELETE` | `/patients/:id` | `patient:delete` | Soft deletes patient record |

---

### 4. Doctor & Department Modules (`/doctors`, `/departments`)

| Method | Endpoint | Access Level | Description |
| :--- | :--- | :--- | :--- |
| `GET` | `/doctors` | `doctor:read` | Lists active doctors with department, specialization, & shift schedule |
| `POST` | `/doctors` | `doctor:create` | Registers doctor profile & assigns consultation fee |
| `GET` | `/departments` | `department:read` | Lists hospital departments |
| `POST` | `/departments` | `department:create` | Creates hospital department |

---

### 5. Appointments & OPD Modules (`/appointments`, `/opd`)

| Method | Endpoint | Access Level | Description |
| :--- | :--- | :--- | :--- |
| `GET` | `/appointments` | `appointment:read` | Fetches appointments (filters: `doctorId`, `date`, `status`) |
| `POST` | `/appointments` | `appointment:create` | Schedules OPD appointment with collision check |
| `PUT` | `/appointments/:id/status` | `appointment:update` | Updates status (`scheduled`, `completed`, `cancelled`) |
| `GET` | `/opd/visits` | `opd:read` | Lists OPD visit consultations |
| `POST` | `/opd/visits` | `opd:create` | Records OPD consultation, symptoms, diagnosis & vital signs |

---

### 6. IPD & Ward Management Modules (`/ipd/admissions`, `/wards`, `/beds`)

| Method | Endpoint | Access Level | Description |
| :--- | :--- | :--- | :--- |
| `GET` | `/ipd/admissions` | `admission:read` | Lists IPD admissions (filters: `status`, `wardId`) |
| `POST` | `/ipd/admissions` | `admission:create` | Admits patient to ward/bed with atomic bed locking |
| `PUT` | `/ipd/admissions/:id/discharge` | `admission:update` | Discharges IPD patient & frees occupied bed |
| `GET` | `/wards` | `admission:read` | Returns wards with total capacity & live occupancy |

---

### 7. Diagnostics: Laboratory & Radiology (`/laboratory`, `/radiology`)

| Method | Endpoint | Access Level | Description |
| :--- | :--- | :--- | :--- |
| `GET` | `/laboratory/tests` | `lab_test:read` | Catalog of lab test types & pricing |
| `GET` | `/laboratory/orders` | `lab_test:read` | Lists lab orders & report completion status |
| `POST` | `/laboratory/reports` | `lab_test:create` | Enters test result values & attaches PDF diagnostic report |
| `GET` | `/radiology/orders` | `radiology_test:read` | Radiology scan requests (X-Ray, MRI, CT) |
| `POST` | `/radiology/reports` | `radiology_test:create` | Uploads DICOM/radiology scan report images via Cloudinary |

---

### 8. Pharmacy & Inventory Modules (`/pharmacy`, `/inventory`, `/suppliers`)

| Method | Endpoint | Access Level | Description |
| :--- | :--- | :--- | :--- |
| `GET` | `/pharmacy/medicines` | `medicine:read` | Medicine catalog with stock quantity & expiry dates |
| `POST` | `/pharmacy/sales` | `medicine:create` | Records pharmacy sale with atomic stock deduction (`stockOut`) |
| `GET` | `/inventory/items` | `inventory:read` | Inventory items with minimum stock alerts |
| `GET` | `/suppliers` | `supplier:read` | Vendor suppliers catalog & purchase orders |

---

### 9. Billing, Payments & Insurance Modules (`/billing`, `/payments`, `/insurance`)

| Method | Endpoint | Access Level | Description |
| :--- | :--- | :--- | :--- |
| `GET` | `/billing/invoices` | `invoice:read` | Lists patient invoices (filters: `status`, `dateRange`) |
| `POST` | `/billing/invoices` | `invoice:create` | Generates itemized invoice for OPD/IPD/Lab/Pharmacy charges |
| `POST` | `/payments` | `invoice:update` | Records invoice payment (Cash, UPI, Card, Insurance) |
| `GET` | `/insurance/claims` | `insurance:read` | Lists insurance claim submissions & approvals |

---

### 10. Super Admin Dashboard (`/super-admin`)

| Method | Endpoint | Access Level | Description |
| :--- | :--- | :--- | :--- |
| `GET` | `/super-admin/dashboard` | `SUPER_ADMIN` | Returns aggregated metrics, revenue stats, occupancy, & inventory alerts |
| `GET` | `/super-admin/activity` | `SUPER_ADMIN` | Audit log feed of recent system actions |
