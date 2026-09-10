# 🔄 Hospital Management System - Complete Workflow & Module Relationships Guide

---

## 📌 Executive Overview

Is document mein hamare Hospital Management System (HMS) ke **End-to-End Workflows** aur sabhi **Modules & Entities ke aapsi Relationship** ko step-by-step samjhaya gaya hai. 

Hospital mein jab ek Naya Patient aata hai se lekar Doctor Consultation, Ward/Bed Admission, Lab Tests, Pharmacy Dispensing aur Final Billing & Discharge tak data kaise flow hota hai — sab yahan clear hai.

---

## 🗺️ 1. Master System Entity Relationship Map

Below diagram dikhata hai ki hamare system ke main modules ek dusre se kaise jude (connected) hain:

```
                          ┌───────────────────────┐
                          │   Patient (Profile)   │
                          └───────────┬───────────┘
                                      │
          ┌───────────────────────────┼───────────────────────────┐
          │ (OPD Path)                │ (IPD Path)                │ (Emergency Path)
          ▼                           ▼                           ▼
┌───────────────────┐       ┌───────────────────┐       ┌───────────────────┐
│ OPD Appointment & │       │  IPD Admission &  │       │  Emergency Ward   │
│ Token Generation  │       │  Bed Allocation   │       │  Triage & Bed     │
└─────────┬─────────┘       └─────────┬─────────┘       └─────────┬─────────┘
          │                           │                           │
          └───────────────────────────┼───────────────────────────┘
                                      ▼
                          ┌───────────────────────┐
                          │ Doctor Consultation & │
                          │ E-Prescription Desk   │
                          └───────────┬───────────┘
                                      │
          ┌───────────────────────────┴───────────────────────────┐
          │ Prescribes Medicines                                  │ Prescribes Lab Tests
          ▼                                                       ▼
┌───────────────────┐                                   ┌───────────────────┐
│ Pharmacy Module & │                                   │ Laboratory Module │
│ Stock Deduction   │                                   │ & Cloud Upload    │
└─────────┬─────────┘                                   └─────────┬─────────┘
          │ Auto-adds Medicine Bill                               │ Auto-adds Test Bill
          └───────────────────────────┬───────────────────────────┘
                                      ▼
                          ┌───────────────────────┐
                          │ Consolidated Billing  │
                          │ & Insurance Claims    │
                          └───────────┬───────────┘
                                      ▼
                          ┌───────────────────────┐
                          │ Payment & Discharge   │
                          │ (PDF Receipt & Email) │
                          └───────────────────────┘
```

---

## 🔁 2. Step-by-Step Hospital Workflows

---

### 🏥 Flow A: Out-Patient Department (OPD Workflow)

1. **Step 1: Patient Arrival & Registration**  
   - Patient reception desk par aata hai.  
   - Receptionist system mein Patient Search karta hai (Mobile No or Name).  
   - Agar Naya Patient hai -> System automatic Unique Patient ID (**UHID**) generate karta hai.

2. **Step 2: Doctor Selection & OPD Token Generation**  
   - Receptionist Doctor ka schedule check karke **OPD Slot/Token** book karta hai.  
   - Patient ko Live Token Number mil jata hai.

3. **Step 3: Doctor Consultation & E-Prescription**  
   - Doctor dashboard par live queue dikhti hai.  
   - Doctor Patient ko call karta hai, Vitals (BP, Temp, Pulse) view karta hai.  
   - Doctor **E-Prescription** create karta hai (Diagnosis + Medicines + Lab Tests).

4. **Step 4: Branching to Pharmacy & Lab**  
   - Prescription submit hote hi -> Medicines automatic **Pharmacy Desk** par aur Test orders **Lab Desk** par push ho jate hain.

---

### 🛏️ Flow B: In-Patient Department (IPD Bed Admission & Discharge)

1. **Step 1: Doctor Recommends IPD Admission**  
   - OPD consultation ya Emergency ward mein Doctor Patient ko Admit karne ka order deta hai.

2. **Step 2: Bed Allocation (ACID Locking)**  
   - Nurse/Receptionist **Live Bed Matrix Grid** dekhta hai (General Ward, Semi-Private, ICU, Ventilator).  
   - Available Bed par click karke Patient ko allocate karta hai.  
   - **Backend Engine (Mongoose Session Transaction)** is Bed ko lock kar deta hai taaki koi dusra staff member same second mein same bed kisi aur ko assign na kar sake!

3. **Step 3: Daily Nursing & Treatment Log**  
   - Staff Nurse daily Vitals, Medicine administration, aur Doctor rounds update karti hai.

4. **Step 4: Discharge Summary & Bed Release**  
   - Doctor Discharge Summary write-up submit karta hai.  
   - Clearance milte hi Bed Status **"Under Cleaning/Maintenance"** -> aur phir **"Available (Green)"** ho jata hai.

---

### 💊 Flow C: Pharmacy & Inventory Workflow

1. **Step 1: Prescription Arrival**  
   - Pharmacist screen par Doctor ki digitally signed Prescription auto-appear hoti hai.

2. **Step 2: Stock Check & Dispensing**  
   - Pharmacist batch number & expiry date select karke medicine dispense karta hai.

3. **Step 3: Automated Stock Deduction & Low-Stock Alerts**  
   - Jaise hi medicine confirm hoti hai -> Main Inventory se quantity **auto-deduct** ho jati hai.  
   - Agar kisi medicine ka stock 20 units se kam hota hai -> System Admin ko **Low Stock Warning** pop-up bhejta hai.

4. **Step 4: Auto-Billing Integration**  
   - Medicine bill automatically Patient ke Main Hospital Invoice mein attach ho jata hai.

---

### 🧪 Flow D: Laboratory & Diagnostic Workflow

1. **Step 1: Test Request Received**  
   - Lab Technician dashboard par Patient ka Test Request (Blood Test, X-Ray, MRI) dikhta hai.

2. **Step 2: Sample Collection & Processing**  
   - Lab Tech sample collect karke barcode tag lagata hai aur status **"In Progress"** set karta hai.

3. **Step 3: Result Entry & Cloud Upload**  
   - Test results enter hote hain. X-Ray/MRI images **Cloudinary Cloud Storage** par encrypted upload hoti hain.

4. **Step 4: Doctor & Patient Access**  
   - PDF Report auto-generate hokar Doctor Dashboard aur Patient Portal par instant available ho jati hai.

---

### 💳 Flow E: Consolidated Billing & Financial Settlement

1. **Step 1: Automatic Charge Aggregation**  
   - Accountant "Generate Final Invoice" par click karta hai.  
   - System auto-calculate karta hai:  
     $$\text{Total Invoice} = \text{Bed/Room Charges} + \text{Doctor Consultation Fees} + \text{Pharmacy Cost} + \text{Lab Tests Cost} + \text{Nursing Care}$$

2. **Step 2: Insurance TPA Claim Processing**  
   - Agar Patient insured hai -> TPA Insurance claim claim amount enter karke Co-Pay auto-calculate hota hai.

3. **Step 3: Payment & PDF Receipt Generation**  
   - Payment mode (Cash / Card / UPI / Insurance) select karke Payment complete hoti hai.  
   - PDF Invoice auto-generate hota hai aur Patient ko **Email (via Resend)** bhej diya jata hai.

---

## 👥 3. Role-Based Interaction Matrix (Kaun Kya Kar Sakta Hai?)

| System Role | Primary Actions & Responsibilities | Interacts With |
| :--- | :--- | :--- |
| **Super Admin** | Full System Control, User Management, System Settings, Audit Logs | All Modules & Users |
| **Doctor** | OPD Queue, Vitals Check, E-Prescription, Lab Test Order, IPD Admission | Patient, Nurse, Lab Tech |
| **Receptionist** | Patient Registration, OPD Token Booking, Bed Check-in, Appointment Scheduling | Patient, Doctor |
| **Nurse** | Daily Vitals Logging, Ward Bed Matrix, IPD Medicine Dispense Log | Doctor, Patient, IPD Bed |
| **Pharmacist** | Prescription Review, Medicine Dispensing, Stock Inventory Management | Doctor, Patient, Billing |
| **Lab Technician** | Sample Collection, Test Result Input, Cloud Image Upload | Doctor, Patient, Cloudinary |
| **Accountant** | Consolidated Invoice Generation, Insurance Claims, Payment Receipt | Patient, Pharmacy, IPD |
| **Patient** | View Prescriptions, Download Lab Reports PDF, View Invoices & Booking History | Portal UI |

---

## 🎯 Summary for Management

Yeh workflow structure ensure karta hai ki:
- Hospital staff ko **kisi manual register par entry nahi karni padti**.
- Data ek department se dusre department tak **seconds mein bina error flow hota hai**.
- Management ko live status dikhta hai ki **kitne patients admitted hain, kitne beds empty hain, aur kitna revenue generate hua hai!**
