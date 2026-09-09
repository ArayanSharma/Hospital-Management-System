# 03. Medical Records & Diagnostics Schemas Documentation

This document provides complete Mongoose schema specifications for electronic health records (EHR), digital prescriptions, pathology lab tests, and radiology imaging:
1. **`MedicalRecord` (`medicalrecords`)**
2. **`Prescription` (`prescriptions`)**
3. **`LabTest` (`labtests`)**
4. **`LabReport` (`labreports`)**
5. **`RadiologyTest` (`radiologytests`)**
6. **`RadiologyReport` (`radiologyreports`)**

---

## 1. MedicalRecord Model (`MedicalRecord` -> `medicalrecords` collection)

### Mongoose File Path
`src/modules/medical-records/medicalRecord.model.js`

### Schema Definition & Field Matrix

| Field Name | Data Type | Validation / Constraints | Default Value | Description |
| :--- | :--- | :--- | :--- | :--- |
| `_id` | `ObjectId` | Auto-generated Primary Key | Auto | Unique Identifier |
| `patientId` | `ObjectId` | Required, ref: `Patient` | N/A | Target patient |
| `doctorId` | `ObjectId` | Required, ref: `Doctor` | N/A | Authoring physician |
| `recordType` | `String` | Enum: `["opd_consultation", "ipd_summary", "progress_note", "discharge_summary", "history"]` | N/A | Document category |
| `diagnosis` | `String` | Required, trim | N/A | Clinical diagnosis / ICD-10 description |
| `clinicalNotes` | `String` | Trim | `""` | Detailed clinical observation notes |
| `vitals` | `Subdocument`| `{ bp, pulse, temperature, weight, spo2 }` | `{}` | Recorded vitals |
| `attachments` | `[Subdocument]`| Array of `{ fileUrl, fileName, fileType, uploadedAt }` | `[]` | Cloudinary document/scan attachments |
| `createdAt` | `Date` | Auto ISO timestamp | `Date.now` | Creation timestamp |
| `updatedAt` | `Date` | Auto ISO timestamp | `Date.now` | Last update timestamp |

---

## 2. Prescription Model (`Prescription` -> `prescriptions` collection)

### Mongoose File Path
`src/modules/prescriptions/prescription.model.js`

### Schema Definition & Field Matrix

| Field Name | Data Type | Validation / Constraints | Default Value | Description |
| :--- | :--- | :--- | :--- | :--- |
| `_id` | `ObjectId` | Auto-generated Primary Key | Auto | Unique Identifier |
| `prescriptionId`| `String` | Required, unique | N/A | Sequential Prescription ID (`RX-YYYY-XXXX`) |
| `patientId` | `ObjectId` | Required, ref: `Patient` | N/A | Target patient |
| `doctorId` | `ObjectId` | Required, ref: `Doctor` | N/A | Prescribing doctor |
| `visitId` | `ObjectId` | Ref: `OPDVisit` | `null` | Optional OPD Visit link |
| `admissionId` | `ObjectId` | Ref: `Admission` | `null` | Optional IPD Admission link |
| `medicines` | `[Subdocument]`| Array of `{ medicineId, name, dosage, frequency, duration, instructions }` | `[]` | Prescribed drug line items |
| `notes` | `String` | Trim | `""` | General usage instructions |
| `status` | `String` | Enum: `["active", "dispensed", "cancelled"]` | `"active"` | Fulfillment state |

---

## 3. LabTest Model (`LabTest` -> `labtests` collection)

### Mongoose File Path
`src/modules/laboratory/labTest.model.js`

### Schema Definition & Field Matrix

| Field Name | Data Type | Validation / Constraints | Default Value | Description |
| :--- | :--- | :--- | :--- | :--- |
| `_id` | `ObjectId` | Auto-generated Primary Key | Auto | Unique Identifier |
| `testCode` | `String` | Required, unique, uppercase | N/A | Test catalog SKU (e.g. `CBC-001`) |
| `name` | `String` | Required, trim | N/A | Test title (e.g. "Complete Blood Count") |
| `category` | `String` | Enum: `["pathology", "biochemistry", "microbiology", "hematology"]` | N/A | Lab sub-specialty |
| `price` | `Number` | Required, min 0 | N/A | Standard test fee |
| `normalRange` | `String` | Trim | `""` | Standard biological reference range |
| `unit` | `String` | Trim | `""` | Measurement unit (e.g. "g/dL") |

---

## 4. LabReport Model (`LabReport` -> `labreports` collection)

### Mongoose File Path
`src/modules/laboratory/labReport.model.js`

### Schema Definition & Field Matrix

| Field Name | Data Type | Validation / Constraints | Default Value | Description |
| :--- | :--- | :--- | :--- | :--- |
| `_id` | `ObjectId` | Auto-generated Primary Key | Auto | Unique Identifier |
| `reportNumber` | `String` | Required, unique | N/A | Report ID (`LAB-YYYY-XXXX`) |
| `patientId` | `ObjectId` | Required, ref: `Patient` | N/A | Patient tested |
| `doctorId` | `ObjectId` | Required, ref: `Doctor` | N/A | Ordering doctor |
| `labTestId` | `ObjectId` | Required, ref: `LabTest` | N/A | Catalog test ordered |
| `sampleType` | `String` | Trim | `""` | Specimen type (e.g. "Blood", "Urine") |
| `sampleCollectedAt`| `Date` | Nullable Date | `null` | Specimen collection timestamp |
| `resultValue` | `String` | Trim | `""` | Recorded test result string/number |
| `remarks` | `String` | Trim | `""` | Pathologist observations |
| `reportFileUrl`| `String` | Cloudinary PDF URL | `""` | Uploaded PDF test report |
| `status` | `String` | Enum: `["requested", "sample_collected", "completed", "cancelled"]` | `"requested"` | Test lifecycle stage |

---

## 5. RadiologyTest Model (`RadiologyTest` -> `radiologytests` collection)

### Mongoose File Path
`src/modules/radiology/radiologyTest.model.js`

### Schema Definition & Field Matrix

| Field Name | Data Type | Validation / Constraints | Default Value | Description |
| :--- | :--- | :--- | :--- | :--- |
| `_id` | `ObjectId` | Auto-generated Primary Key | Auto | Unique Identifier |
| `testCode` | `String` | Required, unique, uppercase | N/A | Catalog scan SKU (e.g. `RAD-XRAY-01`) |
| `name` | `String` | Required, trim | N/A | Diagnostic scan name |
| `modality` | `String` | Enum: `["X-Ray", "MRI", "CT Scan", "Ultrasound", "ECG"]` | N/A | Imaging modality type |
| `price` | `Number` | Required, min 0 | N/A | Standard scan fee |

---

## 6. RadiologyReport Model (`RadiologyReport` -> `radiologyreports` collection)

### Mongoose File Path
`src/modules/radiology/radiologyReport.model.js`

### Schema Definition & Field Matrix

| Field Name | Data Type | Validation / Constraints | Default Value | Description |
| :--- | :--- | :--- | :--- | :--- |
| `_id` | `ObjectId` | Auto-generated Primary Key | Auto | Unique Identifier |
| `reportNumber` | `String` | Required, unique | N/A | Scan Report ID (`RAD-YYYY-XXXX`) |
| `patientId` | `ObjectId` | Required, ref: `Patient` | N/A | Scanned patient |
| `doctorId` | `ObjectId` | Required, ref: `Doctor` | N/A | Ordering doctor |
| `radiologyTestId`| `ObjectId` | Required, ref: `RadiologyTest` | N/A | Scan test ordered |
| `findings` | `String` | Trim | `""` | Detailed radiologist opinion text |
| `impression` | `String` | Trim | `""` | Summary diagnostic impression |
| `imageUrls` | `[String]` | Array of Cloudinary image URLs | `[]` | Uploaded DICOM/PNG scan images |
| `status` | `String` | Enum: `["scheduled", "in-progress", "completed"]` | `"scheduled"` | Imaging pipeline status |
