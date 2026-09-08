# 03. Medical Records & Diagnostics Modules Documentation

This document covers electronic health records (EHR) and diagnostic lab/radiology workflows:
1. **Medical Records (`medical-records`)**
2. **Prescriptions (`prescriptions`)**
3. **Laboratory (`laboratory`)**
4. **Radiology (`radiology`)**

---

## 1. Medical Records Module (`src/modules/medical-records`)

### Purpose & Business Motivation
Stores Electronic Health Records (EHR) including patient history, past diagnoses, treatment plans, uploaded clinical documents (discharge notes, historical reports), and vital sign trends.

### Data Model (`medicalRecord.model.js`)
- `patientId`: Ref `Patient` (Required).
- `doctorId`: Ref `Doctor` (Attending physician who authored entry).
- `recordType`: Enum (`"opd_consultation"`, `"ipd_summary"`, `"progress_note"`, `"discharge_summary"`, `"history"`).
- `diagnosis`: String / ICD Code description.
- `clinicalNotes`: String.
- `vitals`: `{ bp, pulse, temperature, weight, spo2 }`.
- `attachments`: Array of Cloudinary file URLs `{ fileUrl, fileName, fileType, uploadedAt }`.

---

### Key Functions & Business Logic (`medicalRecord.service.js`)

1. **`createRecord(data, files)`**:
   - Uploads attached documents/scans to Cloudinary via `upload.middleware.js`.
   - Saves EHR entry with verified attachment metadata.

2. **`getPatientHistory(patientId)`**:
   - Fetches complete chronological timeline of medical records for a specific patient, sorted by `createdAt: -1`.

---

## 2. Prescriptions Module (`src/modules/prescriptions`)

### Purpose & Business Motivation
Allows Doctors to issue digital prescriptions detailing medications, dosages, frequency, duration, and clinical instructions. Integrates directly with the Pharmacy module for medicine dispensing.

### Data Model (`prescription.model.js`)
- `prescriptionId`: Unique sequential ID (`RX-2026-0089`).
- `patientId`: Ref `Patient`.
- `doctorId`: Ref `Doctor`.
- `visitId`: Ref `OPDVisit` (Optional).
- `admissionId`: Ref `Admission` (Optional).
- `medicines`: Array of items:
  - `medicineId`: Ref `Medicine` (Pharmacy catalog entry).
  - `name`: String.
  - `dosage`: String (e.g. "500mg").
  - `frequency`: String (e.g. "1-0-1" or "Twice daily").
  - `duration`: String (e.g. "5 days").
  - `instructions`: String (e.g. "Take after food").
- `notes`: String.
- `status`: Enum (`"active"`, `"dispensed"`, `"cancelled"`).

---

### Key Functions & Business Logic (`prescription.service.js`)

1. **`createPrescription(data)`**:
   - Generates unique ID (`RX-YYYY-XXXX`).
   - Links medicines with prescribed dosage instructions.
   - Sends notification to Pharmacist queue.

2. **`dispensePrescription(prescriptionId)`**:
   - Updates status to `"dispensed"` when pharmacy completes medicine fulfillment.

---

## 3. Laboratory Module (`src/modules/laboratory`)

### Purpose & Business Motivation
Manages the hospital pathology laboratory. Comprises two primary sub-domains:
1. **Lab Test Catalog (`labTest`)**: Master list of available blood, urine, tissue tests, normal reference ranges, and test costs.
2. **Lab Reports (`labReport`)**: Patient test requests, sample collection tracking, lab technician test entry, and final report approval.

---

### Data Models

#### `labTest.model.js` (Catalog)
- `testCode`: String (e.g. `CBC-001`, `LFT-002`).
- `name`: String (e.g. "Complete Blood Count").
- `category`: Enum (`"pathology"`, `"biochemistry"`, `"microbiology"`, `"hematology"`).
- `price`: Number.
- `normalRange`: String (e.g. "4.5 - 11.0 x10^3 / uL").
- `unit`: String (e.g. "g/dL").

#### `labReport.model.js` (Patient Test Execution)
- `reportNumber`: Unique ID (`LAB-2026-0541`).
- `patientId`: Ref `Patient`.
- `doctorId`: Ref `Doctor` (Requesting physician).
- `labTestId`: Ref `LabTest`.
- `sampleType`: String (e.g. "Blood", "Urine").
- `sampleCollectedAt`: Date.
- `resultValue`: String.
- `remarks`: String.
- `reportFileUrl`: Cloudinary PDF URL.
- `status`: Enum (`"requested"`, `"sample_collected"`, `"completed"`, `"cancelled"`).

---

### Key Functions & Business Logic (`labReport.service.js`)

1. **`requestLabTest(data)`**: Creates lab request in `"requested"` state.
2. **`collectSample(reportId)`**: Updates status to `"sample_collected"` and sets timestamp.
3. **`uploadTestResult(reportId, resultData, reportFile)`**:
   - Lab Tech enters numerical/text values and uploads PDF report.
   - Sets status to `"completed"` and notifies ordering doctor.

---

## 4. Radiology Module (`src/modules/radiology`)

### Purpose & Business Motivation
Handles Imaging and Radiology scans (X-Ray, MRI, CT Scan, Ultrasound, ECG).

### Data Models

#### `radiologyTest.model.js` (Catalog)
- `testCode`: String (e.g. `XRAY-CHEST-01`).
- `name`: String ("Chest X-Ray PA View").
- `modality`: Enum (`"X-Ray"`, `"MRI"`, `"CT Scan"`, `"Ultrasound"`, `"ECG"`).
- `price`: Number.

#### `radiologyReport.model.js` (Patient Diagnostic Scan)
- `reportNumber`: Unique ID (`RAD-2026-0210`).
- `patientId`: Ref `Patient`.
- `doctorId`: Ref `Doctor`.
- `radiologyTestId`: Ref `RadiologyTest`.
- `findings`: String (Radiologist opinion text).
- `impression`: String (Final diagnostic summary).
- `imageUrls`: Array of Cloudinary URLs (Scanned DICOM/PNG images).
- `status`: Enum (`"scheduled"`, `"in-progress"`, `"completed"`).

---

## API Endpoints Quick Reference

| Module | Method | Endpoint | Description |
| :--- | :--- | :--- | :--- |
| **Medical Records** | `POST` | `/api/v1/medical-records` | Upload new medical record entry |
| **Medical Records** | `GET` | `/api/v1/medical-records/patient/:id` | Get patient EHR timeline |
| **Prescriptions** | `POST` | `/api/v1/prescriptions` | Issue new prescription |
| **Laboratory** | `GET` | `/api/v1/lab-tests` | List available pathology tests |
| **Laboratory** | `POST` | `/api/v1/lab-reports` | Order lab test for patient |
| **Laboratory** | `PUT` | `/api/v1/lab-reports/:id/results` | Submit lab test result values |
| **Radiology** | `POST` | `/api/v1/radiology-reports` | Create radiology scan request |
| **Radiology** | `PUT` | `/api/v1/radiology-reports/:id/findings` | Upload scan images & findings |

---

## Senior Developer Notes & Edge Cases

- **File Storage**: Pathology lab reports and Radiology DICOM images are uploaded directly to Cloudinary using `upload.middleware.js` to avoid filling local disk storage.
- **Reference Integrity**: If a medicine is deleted or updated in the catalog, historical prescriptions maintain their snapshot data (`name`, `dosage`) so old patient medical history is never altered.
