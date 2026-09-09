# Hospital Management System - Master Project Plan & Build Strategy

This document provides a clear, step-by-step master plan for building and understanding the Hospital Management System (HMS). It includes system flow diagrams, sequential build phases based on database dependencies, simple-word explanations, and a complete module dependency matrix.

---

## 🗺️ Master System Flow Diagram

```
                     ┌────────────────┐
                     │  Super Admin   │ (System Controller)
                     └───────┬────────┘
                             │
              ┌──────────────┴──────────────┐
              ▼                             ▼
   ┌────────────────────┐        ┌────────────────────┐
   │ Users / Staff      │        │ Patients           │
   │ (Doctors, Nurses,  │        │ (Demographics,     │
   │ Receptionists)     │        │ Medical History)   │
   └──────────┬─────────┘        └──────────┬─────────┘
              │                             │
              └──────────────┬──────────────┘
                             │
                             ▼
              ┌─────────────────────────────┐
              │ OPD Visits & Appointments   │
              └──────────────┬──────────────┘
                             │
              ┌──────────────┴──────────────┐
              ▼                             ▼
   ┌────────────────────┐        ┌────────────────────┐
   │ IPD Admissions     │        │ Prescriptions &    │
   │ & Bed Allocations  │        │ EHR History        │
   └──────────┬─────────┘        └──────────┬─────────┘
              │                             │
              ├─────────────────────────────┘
              ▼
   ┌────────────────────┐
   │ Lab & Radiology    │
   │ Diagnostic Reports │
   └──────────┬─────────┘
              │
              ▼
   ┌────────────────────┐
   │ Pharmacy Sales &   │
   │ Inventory Batches  │
   └──────────┬─────────┘
              │
              ▼
   ┌────────────────────┐
   │ Billing, Payments  │
   │ & Insurance Claims │
   └──────────┬─────────┘
              │
              ▼
   ┌────────────────────┐
   │ Audit Logs,        │
   │ Reports & Settings │
   └────────────────────┘
```

---

## 💡 System Architecture in Simple Words

### What does this project do?
The Hospital Management System is a complete digital operating system for a hospital. It replaces paper registers with an automated web application that manages:
- **Staff Accounts & Security**: Super Admins create staff accounts (Doctors, Nurses, Receptionists, Pharmacists, Lab Technicians) and assign permissions so staff can only access what they need.
- **Patients & Appointments**: Receptionists register patients and book non-overlapping appointment slots with doctors.
- **OPD & IPD Care**: Doctors record consultation notes and issue digital prescriptions. For severe cases, patients are admitted into hospital wards and assigned real-time occupied beds.
- **Diagnostics**: Lab Technicians upload blood test PDFs and DICOM X-Ray/MRI scans directly to cloud storage (Cloudinary).
- **Pharmacy Counter**: Pharmacists sell medicines, while the system automatically deducts stock from inventory batches using FIFO/FEFO rules.
- **Billing & Money**: Cashiers generate line-item invoices, collect partial/full payments via Cash/Card/UPI, and submit insurance claims.
- **Audit & Analytics**: Super Admins view real-time revenue stats, bed occupancy rates, and security audit logs.

---

## 🧱 Sequential Build Order & Dependency Phases

When building or extending the codebase, modules **MUST** be created in order of database dependency (you cannot create a Doctor before creating a User and Department!).

```
PHASE 1: Foundation (Zero Dependencies)
  ├── Permission (Defines permissions like "patient:read")
  ├── Role (Groups permissions like DOCTOR, NURSE)
  ├── User (Staff accounts with roleId)
  └── Department (Hospital departments like Cardiology)
        │
        ▼
PHASE 2: Clinical Entities (Depends on Phase 1)
  ├── Doctor (Requires User + Department)
  ├── Patient (Standalone patient records)
  ├── Ward (Physical ward setup)
  └── Bed (Requires Ward reference)
        │
        ▼
PHASE 3: Care Delivery & Scheduling (Depends on Phase 2)
  ├── OPDVisit (Requires Patient + Doctor)
  ├── Appointment (Requires Patient + Doctor + Department)
  └── Admission (Requires Patient + Doctor + Ward + Bed)
        │
        ▼
PHASE 4: EHR & Diagnostics (Depends on Phase 3)
  ├── MedicalRecord (Requires Patient + Doctor)
  ├── Prescription (Requires Patient + Doctor)
  ├── LabTest (Pathology catalog)
  ├── LabReport (Requires Patient + LabTest)
  ├── RadiologyTest (Scan catalog)
  └── RadiologyReport (Requires Patient + RadiologyTest)
        │
        ▼
PHASE 5: Pharmacy & Supply Chain (Depends on Phase 4)
  ├── Supplier (Vendor directory)
  ├── Medicine (Drug catalog)
  ├── InventoryItem (Requires Supplier + Medicine)
  └── PharmacySale (Requires Medicine + InventoryItem + User)
        │
        ▼
PHASE 6: Financials, Governance & Analytics (Depends on Phase 5)
  ├── Invoice (Requires Patient)
  ├── Payment (Requires Invoice + Patient + User)
  ├── InsurancePolicy (Requires Patient)
  ├── InsuranceClaim (Requires InsurancePolicy + Invoice)
  ├── AuditLog (Captures all mutations)
  ├── Notification (Requires User)
  ├── Setting (Global system settings)
  ├── Reports (Aggregates Invoice + PharmacySale + Admission data)
  └── SuperAdmin (Aggregates all modules with Redis caching)
```

---

## 📊 Complete Module Dependency Matrix (27 Modules)

| Module Name | Prerequisite Dependencies | Dependent Downstream Modules | Simple Explanation |
| :--- | :--- | :--- | :--- |
| **`permissions`** | None | `roles` | Defines individual permission capability keys. |
| **`roles`** | `permissions` | `users` | Groups permissions into roles (`DOCTOR`, `NURSE`, etc.). |
| **`users`** | `roles` | `doctors`, `audit-logs`, `notifications` | Hospital staff user accounts with hashed passwords. |
| **`departments`** | None | `doctors`, `appointments` | Medical departments (e.g. Cardiology, Pediatrics). |
| **`doctors`** | `users`, `departments` | `appointments`, `opd`, `ipd`, `prescriptions` | Physician profiles with schedules and consultation fees. |
| **`patients`** | None | `appointments`, `opd`, `ipd`, `billing`, `lab` | Master patient demographic registry with UHIDs. |
| **`wards`** | None | `beds`, `ipd` | Hospital physical wards (ICU, Private, General). |
| **`beds`** | `wards` | `ipd` | Individual bed units inside wards with occupancy state. |
| **`opd`** | `patients`, `doctors` | `prescriptions`, `billing` | Outpatient walk-in queue tokens and vitals. |
| **`appointments`** | `patients`, `doctors`, `departments` | `prescriptions`, `billing` | Pre-booked appointment slots with collision checks. |
| **`ipd`** | `patients`, `doctors`, `wards`, `beds` | `billing`, `reports` | Inpatient admissions, bed locking, discharge summaries. |
| **`medical-records`**| `patients`, `doctors` | `reports` | Chronic EHR timeline and clinical document uploads. |
| **`prescriptions`** | `patients`, `doctors`, `pharmacy` | `pharmacy` | Digital prescriptions issued by doctors for patients. |
| **`laboratory`** | `patients`, `doctors` | `billing` | Pathology lab test catalog and PDF report uploads. |
| **`radiology`** | `patients`, `doctors` | `billing` | Diagnostic imaging orders (X-Ray, MRI) and DICOM uploads. |
| **`suppliers`** | None | `inventory` | Pharmaceutical vendor directory and tax IDs. |
| **`pharmacy`** | None | `inventory`, `prescriptions` | Drug catalog and OTC/prescription sales counter (POS). |
| **`inventory`** | `pharmacy`, `suppliers` | `pharmacy` | Physical stock levels, batch numbers, and expiry FEFO. |
| **`billing`** | `patients` | `payments`, `insurance`, `reports` | Line-itemized patient invoices, discounts, and tax. |
| **`payments`** | `billing`, `patients`, `users` | `reports` | Cash, Card, UPI payment receipts and balance calculations. |
| **`insurance`** | `patients`, `billing` | `reports` | Third-party insurance policy registration and claim payouts. |
| **`audit-logs`** | `users` | `super-admin` | Non-blocking security audit trails for compliance. |
| **`notifications`** | `users` | Frontend UI | Real-time in-app user notifications via Socket.IO. |
| **`reports`** | `billing`, `pharmacy`, `ipd` | `super-admin` | Revenue, occupancy, and demographic analytics charts. |
| **`settings`** | None | System-wide | Global hospital name, currency, and tax configurations. |
| **`super-admin`** | All Modules | Dashboard UI | System-level Redis-cached KPI dashboard and activity feed. |