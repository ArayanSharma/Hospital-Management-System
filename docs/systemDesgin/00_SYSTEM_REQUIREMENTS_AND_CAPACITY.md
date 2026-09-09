# 00. System Requirements & Capacity Planning

This document details the functional and non-functional requirements, Service Level Agreements (SLAs), capacity estimations, throughput projections, and storage calculations for the Hospital Management System (HMS).

---

## 1. System Requirements & SLAs

### Functional Requirements
1. **Multi-Role Access Control**: 8 discrete user roles with granular permission capability checks.
2. **Clinical Workflows**: OPD token queues, IPD bed locking, digital prescriptions, EHR timelines.
3. **Diagnostics**: Pathology PDF generation and Radiology DICOM image uploads.
4. **Supply Chain & Finance**: Pharmacy POS checkout with atomic Mongoose stock deduction, invoice generation, and insurance claim approvals.

### Non-Functional Requirements & SLAs

| Metric / SLA | Target Guarantee | Architectural Mechanism |
| :--- | :--- | :--- |
| **System Availability** | **99.99% Uptime** (Max 52m downtime/year) | PM2 cluster mode, MongoDB Replica Sets, Redis failover |
| **API Latency (p95)** | **< 100 ms** for read/write queries | Redis caching (`hms:superadmin:*`), Mongoose indexes |
| **Dashboard Load Time** | **< 50 ms** for aggregate statistics | Redis dashboard pre-caching with 300s TTL |
| **Data Durability** | **99.999999999% (11 9s)** for medical records | Cloudinary object storage + Automated MongoDB backups |
| **Concurrency Guard** | **Zero Double-Bookings** | Mongoose Session ACID transactions (`startTransaction()`) |

---

## 2. Capacity Estimations & Scale Projections

### User & Traffic Estimations
- **Total Hospital Staff (Active Users)**: 1,000 active staff members (Doctors, Nurses, Receptionists, Pharmacists, Techs).
- **Registered Patients**: 500,000 patient records.
- **Daily Active Users (DAU)**: ~800 staff DAU + 5,000 patient portal DAU.
- **Daily OPD Visits**: 2,000 visits/day.
- **Daily Prescriptions & Invoices**: 2,000 prescriptions/day + 2,500 invoices/day.

### Peak Throughput Calculations (QPS)
- **Daily Read/Write API Requests**: 1,000,000 requests/day.
- **Average QPS**: `1,000,000 / 86,400 sec` ≈ **12 Requests/sec**.
- **Peak Traffic Multiplier**: 5x during morning registration hours (8:00 AM – 11:00 AM).
- **Peak QPS**: `12 * 5` ≈ **60 Requests/sec**.

---

## 3. Database & File Storage Estimations

### Database Growth Projections (5-Year Projection)

| Collection | Doc Size (Avg) | Daily Writes | Yearly Storage Growth | 5-Year Total Storage |
| :--- | :--- | :--- | :--- | :--- |
| `patients` | 1.5 KB | 300 | ~164 MB / year | ~820 MB |
| `opdvisits` | 1.0 KB | 2,000 | ~730 MB / year | ~3.65 GB |
| `prescriptions` | 2.0 KB | 2,000 | ~1.46 GB / year | ~7.30 GB |
| `invoices` | 2.5 KB | 2,500 | ~2.28 GB / year | ~11.40 GB |
| `auditlogs` | 1.2 KB | 10,000 | ~4.38 GB / year | ~21.90 GB |
| **Total DB Growth** | — | — | **~9.0 GB / year** | **~45.0 GB** |

### Cloud Storage Estimations (Cloudinary File Attachments)
- **Pathology Lab PDF Reports**: 500 reports/day * 500 KB = 250 MB / day ≈ **91 GB / year**.
- **Radiology DICOM / PNG Scans**: 100 scans/day * 5 MB = 500 MB / day ≈ **182.5 GB / year**.
- **5-Year Cloudinary Storage Capacity Target**: **~1.37 TB**.
