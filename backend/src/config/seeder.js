import mongoose from "mongoose";
import dotenv from "dotenv";
import connectDB from "./DbConnect.js";
import { RESOURCES, ACTIONS } from "../core/constants/permissions.js";
import { ROLES } from "../core/constants/roles.js";
import Permission from "../modules/permissions/permission.model.js";
import Role from "../modules/roles/role.model.js";
import User from "../modules/users/user.model.js";
import Patient from "../modules/patients/patient.model.js";
import Doctor from "../modules/doctors/doctor.model.js";
import Department from "../modules/departments/department.model.js";
import Appointment from "../modules/appointments/appointment.model.js";
import OPDVisit from "../modules/opd/opdVisit.model.js";
import Ward from "../modules/wards/ward.model.js";
import Bed from "../modules/beds/bed.model.js";
import Admission from "../modules/ipd/admission.model.js";
import LabTest from "../modules/laboratory/labTest.model.js";
import LabReport from "../modules/laboratory/labReport.model.js";
import RadiologyTest from "../modules/radiology/radiologyTest.model.js";
import RadiologyReport from "../modules/radiology/radiologyReport.model.js";
import Medicine from "../modules/pharmacy/medicine.model.js";
import Supplier from "../modules/suppliers/supplier.model.js";
import InventoryItem from "../modules/inventory/inventoryItem.model.js";
import PharmacySale from "../modules/pharmacy/pharmacySale.model.js";
import Invoice from "../modules/billing/invoice.model.js";
import InsurancePolicy from "../modules/insurance/insurancePolicy.model.js";
import InsuranceClaim from "../modules/insurance/insuranceClaim.model.js";
import StockIn from "../modules/pharmacy/stockIn.model.js";
import { invalidatePattern } from "../utils/redisCache.js";

dotenv.config();

const sample50Users = [
  // 1-24 DOCTORS (24 DOCTOR USERS FOR DOCTOR RECORDS)
  {
    name: "Dr. Rajesh Kumar",
    email: "rajesh.kumar@citycare.com",
    username: "rajesh.kumar",
    password: "CityCare@123",
    roleName: "DOCTOR",
    department: "Cardiology",
    designation: "Senior Consultant",
    employeeId: "DOC-1001",
    phone: "+91 98765 10001",
    countryCode: "+91",
    dateOfBirth: "1980-04-12",
    gender: "Male",
    bloodGroup: "O+",
    maritalStatus: "Married",
    nationality: "Indian",
    currentAddress: "A-102, Saket, New Delhi, Delhi",
    joiningDate: "2018-06-15",
    isProfileComplete: true,
    status: "active",
    emailVerified: "Verified",
    loginAccess: "Allowed",
    forcePasswordChange: false,
    sendWelcomeEmail: false,
    notes: "Lead Cardiologist in OPD",
    isVerified: true,
    authProvider: "local",
    doctorMeta: {
      specialization: "Cardiology",
      qualification: "MBBS, MD (Cardiology)",
      experience: 15,
      consultationFee: 800,
      availability: [
        { day: "Monday", startTime: "09:00", endTime: "13:00" },
        { day: "Wednesday", startTime: "09:00", endTime: "13:00" },
        { day: "Friday", startTime: "14:00", endTime: "18:00" },
      ],
    },
  },
  {
    name: "Dr. Ananya Sharma",
    email: "ananya.sharma@citycare.com",
    username: "ananya.sharma",
    password: "CityCare@123",
    roleName: "DOCTOR",
    department: "Neurology",
    designation: "Chief Neurologist",
    employeeId: "DOC-1002",
    phone: "+91 98765 10002",
    countryCode: "+91",
    dateOfBirth: "1984-08-25",
    gender: "Female",
    bloodGroup: "A+",
    maritalStatus: "Married",
    nationality: "Indian",
    currentAddress: "402, Bandra West, Mumbai, Maharashtra",
    joiningDate: "2019-03-10",
    isProfileComplete: true,
    status: "active",
    emailVerified: "Verified",
    loginAccess: "Allowed",
    forcePasswordChange: false,
    sendWelcomeEmail: false,
    notes: "Specialist in neuro-degenerative care",
    isVerified: true,
    authProvider: "local",
    doctorMeta: {
      specialization: "Neurology",
      qualification: "MBBS, DM (Neurology)",
      experience: 12,
      consultationFee: 1000,
      availability: [
        { day: "Tuesday", startTime: "10:00", endTime: "14:00" },
        { day: "Thursday", startTime: "10:00", endTime: "14:00" },
        { day: "Saturday", startTime: "09:00", endTime: "12:00" },
      ],
    },
  },
  {
    name: "Dr. Vikram Patel",
    email: "vikram.patel@citycare.com",
    username: "vikram.patel",
    password: "CityCare@123",
    roleName: "DOCTOR",
    department: "Orthopedics",
    designation: "Senior Orthopedic Surgeon",
    employeeId: "DOC-1003",
    phone: "+91 98765 10003",
    countryCode: "+91",
    dateOfBirth: "1978-11-15",
    gender: "Male",
    bloodGroup: "B+",
    maritalStatus: "Married",
    nationality: "Indian",
    currentAddress: "12, CG Road, Ahmedabad, Gujarat",
    joiningDate: "2015-09-01",
    isProfileComplete: true,
    status: "active",
    emailVerified: "Verified",
    loginAccess: "Allowed",
    forcePasswordChange: false,
    sendWelcomeEmail: false,
    notes: "Joint replacement specialist",
    isVerified: true,
    authProvider: "local",
    doctorMeta: {
      specialization: "Orthopedics",
      qualification: "MBBS, MS (Orthopedics)",
      experience: 18,
      consultationFee: 900,
      availability: [
        { day: "Monday", startTime: "11:00", endTime: "16:00" },
        { day: "Thursday", startTime: "11:00", endTime: "16:00" },
      ],
    },
  },
  {
    name: "Dr. Sunita Reddy",
    email: "sunita.reddy@citycare.com",
    username: "sunita.reddy",
    password: "CityCare@123",
    roleName: "DOCTOR",
    department: "Pediatrics",
    designation: "Lead Pediatrician",
    employeeId: "DOC-1004",
    phone: "+91 98765 10004",
    countryCode: "+91",
    dateOfBirth: "1986-02-19",
    gender: "Female",
    bloodGroup: "AB+",
    maritalStatus: "Married",
    nationality: "Indian",
    currentAddress: "88, Banjara Hills, Hyderabad, Telangana",
    joiningDate: "2020-01-15",
    isProfileComplete: true,
    status: "active",
    emailVerified: "Verified",
    loginAccess: "Allowed",
    forcePasswordChange: false,
    sendWelcomeEmail: false,
    notes: "Child immunization & ICU specialist",
    isVerified: true,
    authProvider: "local",
    doctorMeta: {
      specialization: "Pediatrics",
      qualification: "MBBS, MD (Pediatrics)",
      experience: 10,
      consultationFee: 700,
      availability: [
        { day: "Monday", startTime: "09:00", endTime: "13:00" },
        { day: "Tuesday", startTime: "09:00", endTime: "13:00" },
        { day: "Friday", startTime: "09:00", endTime: "13:00" },
      ],
    },
  },
  {
    name: "Dr. Amit Verma",
    email: "amit.verma@citycare.com",
    username: "amit.verma",
    password: "CityCare@123",
    roleName: "DOCTOR",
    department: "General Medicine",
    designation: "Senior Medical Officer",
    employeeId: "DOC-1005",
    phone: "+91 98765 10005",
    countryCode: "+91",
    dateOfBirth: "1982-09-30",
    gender: "Male",
    bloodGroup: "O-",
    maritalStatus: "Married",
    nationality: "Indian",
    currentAddress: "15, Gomti Nagar, Lucknow, Uttar Pradesh",
    joiningDate: "2017-07-20",
    isProfileComplete: true,
    status: "active",
    emailVerified: "Verified",
    loginAccess: "Allowed",
    forcePasswordChange: false,
    sendWelcomeEmail: false,
    notes: "Primary care physician",
    isVerified: true,
    authProvider: "local",
    doctorMeta: {
      specialization: "General Medicine",
      qualification: "MBBS, MD (Medicine)",
      experience: 14,
      consultationFee: 600,
      availability: [
        { day: "Monday", startTime: "08:00", endTime: "12:00" },
        { day: "Wednesday", startTime: "08:00", endTime: "12:00" },
        { day: "Friday", startTime: "08:00", endTime: "12:00" },
      ],
    },
  },
  {
    name: "Dr. Neha Gupta",
    email: "neha.gupta@citycare.com",
    username: "neha.gupta",
    password: "CityCare@123",
    roleName: "DOCTOR",
    department: "Dermatology",
    designation: "Consultant Dermatologist",
    employeeId: "DOC-1006",
    phone: "+91 98765 10006",
    countryCode: "+91",
    dateOfBirth: "1990-06-14",
    gender: "Female",
    bloodGroup: "A-",
    maritalStatus: "Single",
    nationality: "Indian",
    currentAddress: "Sector 62, Noida, Uttar Pradesh",
    joiningDate: "2021-11-05",
    isProfileComplete: true,
    status: "active",
    emailVerified: "Verified",
    loginAccess: "Allowed",
    forcePasswordChange: false,
    sendWelcomeEmail: false,
    notes: "Dermato-surgery lead",
    isVerified: true,
    authProvider: "google",
    firebaseUid: "firebase_uid_google_1006",
    doctorMeta: {
      specialization: "Dermatology",
      qualification: "MBBS, MD (Dermatology)",
      experience: 8,
      consultationFee: 750,
      availability: [
        { day: "Tuesday", startTime: "14:00", endTime: "18:00" },
        { day: "Thursday", startTime: "14:00", endTime: "18:00" },
      ],
    },
  },
  {
    name: "Dr. Suresh Nair",
    email: "suresh.nair@citycare.com",
    username: "suresh.nair",
    password: "CityCare@123",
    roleName: "DOCTOR",
    department: "Emergency Medicine",
    designation: "HOD Emergency Care",
    employeeId: "DOC-1007",
    phone: "+91 98765 10007",
    countryCode: "+91",
    dateOfBirth: "1975-12-05",
    gender: "Male",
    bloodGroup: "B-",
    maritalStatus: "Married",
    nationality: "Indian",
    currentAddress: "55, MG Road, Kochi, Kerala",
    joiningDate: "2014-04-12",
    isProfileComplete: true,
    status: "active",
    emailVerified: "Verified",
    loginAccess: "Allowed",
    forcePasswordChange: false,
    sendWelcomeEmail: false,
    notes: "Trauma and resuscitation specialist",
    isVerified: true,
    authProvider: "local",
    doctorMeta: {
      specialization: "Emergency Medicine",
      qualification: "MBBS, MEM (Emergency)",
      experience: 20,
      consultationFee: 1200,
      availability: [
        { day: "Monday", startTime: "00:00", endTime: "12:00" },
        { day: "Thursday", startTime: "12:00", endTime: "23:59" },
      ],
    },
  },
  {
    name: "Dr. Priya Iyer",
    email: "priya.iyer@citycare.com",
    username: "priya.iyer",
    password: "CityCare@123",
    roleName: "DOCTOR",
    department: "Radiology",
    designation: "Chief Radiologist",
    employeeId: "DOC-1008",
    phone: "+91 98765 10008",
    countryCode: "+91",
    dateOfBirth: "1987-03-22",
    gender: "Female",
    bloodGroup: "O+",
    maritalStatus: "Married",
    nationality: "Indian",
    currentAddress: "77, T. Nagar, Chennai, Tamil Nadu",
    joiningDate: "2019-10-18",
    isProfileComplete: true,
    status: "active",
    emailVerified: "Verified",
    loginAccess: "Allowed",
    forcePasswordChange: false,
    sendWelcomeEmail: false,
    notes: "MRI & CT Scan specialist",
    isVerified: true,
    authProvider: "local",
    doctorMeta: {
      specialization: "Radiology",
      qualification: "MBBS, MD (Radiology)",
      experience: 11,
      consultationFee: 850,
      availability: [
        { day: "Monday", startTime: "09:00", endTime: "14:00" },
        { day: "Wednesday", startTime: "09:00", endTime: "14:00" },
        { day: "Friday", startTime: "09:00", endTime: "14:00" },
      ],
    },
  },
  {
    name: "Dr. Rahul Mishra",
    email: "rahul.mishra@citycare.com",
    username: "rahul.mishra",
    password: "CityCare@123",
    roleName: "DOCTOR",
    department: "Cardiology",
    designation: "Associate Cardiologist",
    employeeId: "DOC-1009",
    phone: "+91 98765 10009",
    countryCode: "+91",
    dateOfBirth: "1989-07-11",
    gender: "Male",
    bloodGroup: "AB-",
    maritalStatus: "Single",
    nationality: "Indian",
    currentAddress: "22, Civil Lines, Mathura, Uttar Pradesh",
    joiningDate: "2022-02-01",
    isProfileComplete: true,
    status: "active",
    emailVerified: "Verified",
    loginAccess: "Allowed",
    forcePasswordChange: true,
    sendWelcomeEmail: true,
    notes: "Echocardiography specialist",
    isVerified: true,
    authProvider: "local",
    doctorMeta: {
      specialization: "Cardiology",
      qualification: "MBBS, DNB (Cardiology)",
      experience: 6,
      consultationFee: 650,
      availability: [
        { day: "Tuesday", startTime: "11:00", endTime: "16:00" },
        { day: "Thursday", startTime: "11:00", endTime: "16:00" },
      ],
    },
  },
  {
    name: "Dr. Kavita Joshi",
    email: "kavita.joshi@citycare.com",
    username: "kavita.joshi",
    password: "CityCare@123",
    roleName: "DOCTOR",
    department: "Pediatrics",
    designation: "Junior Resident Doctor",
    employeeId: "DOC-1010",
    phone: "+91 98765 10010",
    countryCode: "+91",
    dateOfBirth: "1993-10-08",
    gender: "Female",
    bloodGroup: "B+",
    maritalStatus: "Single",
    nationality: "Indian",
    currentAddress: "104, Kothrud, Pune, Maharashtra",
    joiningDate: "2023-06-15",
    isProfileComplete: false,
    status: "inactive",
    emailVerified: "Unverified",
    loginAccess: "Allowed",
    forcePasswordChange: true,
    sendWelcomeEmail: true,
    notes: "Documents pending verification",
    isVerified: false,
    authProvider: "local",
    doctorMeta: {
      specialization: "Pediatrics",
      qualification: "MBBS",
      experience: 2,
      consultationFee: 500,
      availability: [
        { day: "Wednesday", startTime: "14:00", endTime: "18:00" },
      ],
    },
  },
  {
    name: "Dr. Sanjeev Chawla",
    email: "sanjeev.chawla@citycare.com",
    username: "sanjeev.chawla",
    password: "CityCare@123",
    roleName: "DOCTOR",
    department: "General Medicine",
    designation: "Senior Physician",
    employeeId: "DOC-1041",
    phone: "+91 98765 10041",
    countryCode: "+91",
    dateOfBirth: "1979-11-20",
    gender: "Male",
    bloodGroup: "O+",
    maritalStatus: "Married",
    nationality: "Indian",
    currentAddress: "E-14, Model Town, New Delhi, Delhi",
    joiningDate: "2016-08-10",
    isProfileComplete: true,
    status: "active",
    emailVerified: "Verified",
    loginAccess: "Allowed",
    forcePasswordChange: false,
    sendWelcomeEmail: false,
    notes: "Diabetology and Hypertension specialist",
    isVerified: true,
    authProvider: "local",
    doctorMeta: {
      specialization: "General Medicine",
      qualification: "MBBS, MD (Medicine)",
      experience: 16,
      consultationFee: 800,
      availability: [
        { day: "Monday", startTime: "10:00", endTime: "15:00" },
        { day: "Thursday", startTime: "10:00", endTime: "15:00" },
      ],
    },
  },
  {
    name: "Dr. Monali Sen",
    email: "monali.sen@citycare.com",
    username: "monali.sen",
    password: "CityCare@123",
    roleName: "DOCTOR",
    department: "Gynecology",
    designation: "Senior Gynecologist",
    employeeId: "DOC-1042",
    phone: "+91 98765 10042",
    countryCode: "+91",
    dateOfBirth: "1983-05-17",
    gender: "Female",
    bloodGroup: "A+",
    maritalStatus: "Married",
    nationality: "Indian",
    currentAddress: "12B, Salt Lake, Kolkata, West Bengal",
    joiningDate: "2018-12-01",
    isProfileComplete: true,
    status: "active",
    emailVerified: "Verified",
    loginAccess: "Allowed",
    forcePasswordChange: false,
    sendWelcomeEmail: false,
    notes: "Maternal-fetal medicine specialist",
    isVerified: true,
    authProvider: "local",
    doctorMeta: {
      specialization: "Gynecology",
      qualification: "MBBS, MS (Gynecology)",
      experience: 13,
      consultationFee: 900,
      availability: [
        { day: "Tuesday", startTime: "09:00", endTime: "13:00" },
        { day: "Friday", startTime: "09:00", endTime: "13:00" },
      ],
    },
  },
  {
    name: "Dr. Parag Somani",
    email: "parag.somani@citycare.com",
    username: "parag.somani",
    password: "CityCare@123",
    roleName: "DOCTOR",
    department: "ENT",
    designation: "ENT Specialist",
    employeeId: "DOC-1043",
    phone: "+91 98765 10043",
    countryCode: "+91",
    dateOfBirth: "1986-10-29",
    gender: "Male",
    bloodGroup: "B+",
    maritalStatus: "Married",
    nationality: "Indian",
    currentAddress: "45, Vijay Nagar, Indore, Madhya Pradesh",
    joiningDate: "2020-04-15",
    isProfileComplete: true,
    status: "active",
    emailVerified: "Verified",
    loginAccess: "Allowed",
    forcePasswordChange: false,
    sendWelcomeEmail: false,
    notes: "Otorhinolaryngology OPD consultant",
    isVerified: true,
    authProvider: "local",
    doctorMeta: {
      specialization: "ENT",
      qualification: "MBBS, MS (ENT)",
      experience: 9,
      consultationFee: 700,
      availability: [
        { day: "Monday", startTime: "14:00", endTime: "18:00" },
        { day: "Wednesday", startTime: "14:00", endTime: "18:00" },
      ],
    },
  },
  {
    name: "Dr. Ritu Bhardwaj",
    email: "ritu.bhardwaj@citycare.com",
    username: "ritu.bhardwaj",
    password: "CityCare@123",
    roleName: "DOCTOR",
    department: "Pathology",
    designation: "Consultant Pathologist",
    employeeId: "DOC-1050",
    phone: "+91 98765 10050",
    countryCode: "+91",
    dateOfBirth: "1988-01-09",
    gender: "Female",
    bloodGroup: "AB-",
    maritalStatus: "Married",
    nationality: "Indian",
    currentAddress: "34, Dwarka Sector 10, New Delhi, Delhi",
    joiningDate: "2020-03-10",
    isProfileComplete: true,
    status: "active",
    emailVerified: "Verified",
    loginAccess: "Allowed",
    forcePasswordChange: false,
    sendWelcomeEmail: false,
    notes: "Clinical Pathology Incharge",
    isVerified: true,
    authProvider: "local",
    doctorMeta: {
      specialization: "Pathology",
      qualification: "MBBS, MD (Pathology)",
      experience: 11,
      consultationFee: 750,
      availability: [
        { day: "Monday", startTime: "09:00", endTime: "17:00" },
        { day: "Tuesday", startTime: "09:00", endTime: "17:00" },
      ],
    },
  },
  {
    name: "Dr. Alok Mathur",
    email: "alok.mathur@citycare.com",
    username: "alok.mathur",
    password: "CityCare@123",
    roleName: "DOCTOR",
    department: "Cardiology",
    designation: "Senior Electrophysiologist",
    employeeId: "DOC-1051",
    phone: "+91 98765 10051",
    countryCode: "+91",
    dateOfBirth: "1977-03-18",
    gender: "Male",
    bloodGroup: "O+",
    maritalStatus: "Married",
    nationality: "Indian",
    currentAddress: "56, C-Scheme, Jaipur, Rajasthan",
    joiningDate: "2015-02-10",
    isProfileComplete: true,
    status: "active",
    emailVerified: "Verified",
    loginAccess: "Allowed",
    forcePasswordChange: false,
    sendWelcomeEmail: false,
    notes: "Cardiac rhythm disorder specialist",
    isVerified: true,
    authProvider: "local",
    doctorMeta: {
      specialization: "Cardiology",
      qualification: "MBBS, DM (Cardiology)",
      experience: 17,
      consultationFee: 950,
      availability: [
        { day: "Tuesday", startTime: "09:00", endTime: "13:00" },
        { day: "Friday", startTime: "09:00", endTime: "13:00" },
      ],
    },
  },
  {
    name: "Dr. Meera Deshmukh",
    email: "meera.deshmukh@citycare.com",
    username: "meera.deshmukh",
    password: "CityCare@123",
    roleName: "DOCTOR",
    department: "Neurology",
    designation: "Pediatric Neurologist",
    employeeId: "DOC-1052",
    phone: "+91 98765 10052",
    countryCode: "+91",
    dateOfBirth: "1982-11-30",
    gender: "Female",
    bloodGroup: "A+",
    maritalStatus: "Married",
    nationality: "Indian",
    currentAddress: "12, Shivaji Nagar, Pune, Maharashtra",
    joiningDate: "2017-09-15",
    isProfileComplete: true,
    status: "active",
    emailVerified: "Verified",
    loginAccess: "Allowed",
    forcePasswordChange: false,
    sendWelcomeEmail: false,
    notes: "Child seizure & epilepsy specialist",
    isVerified: true,
    authProvider: "local",
    doctorMeta: {
      specialization: "Neurology",
      qualification: "MBBS, DM (Neurology)",
      experience: 14,
      consultationFee: 1100,
      availability: [
        { day: "Monday", startTime: "10:00", endTime: "14:00" },
        { day: "Wednesday", startTime: "10:00", endTime: "14:00" },
      ],
    },
  },
  {
    name: "Dr. Tarun Kapoor",
    email: "tarun.kapoor@citycare.com",
    username: "tarun.kapoor",
    password: "CityCare@123",
    roleName: "DOCTOR",
    department: "Orthopedics",
    designation: "Spine Surgeon",
    employeeId: "DOC-1053",
    phone: "+91 98765 10053",
    countryCode: "+91",
    dateOfBirth: "1988-05-22",
    gender: "Male",
    bloodGroup: "B+",
    maritalStatus: "Single",
    nationality: "Indian",
    currentAddress: "78, Greater Kailash, New Delhi, Delhi",
    joiningDate: "2021-04-01",
    isProfileComplete: true,
    status: "active",
    emailVerified: "Verified",
    loginAccess: "Allowed",
    forcePasswordChange: false,
    sendWelcomeEmail: false,
    notes: "Minimally invasive spine surgery lead",
    isVerified: true,
    authProvider: "local",
    doctorMeta: {
      specialization: "Orthopedics",
      qualification: "MBBS, MS (Orthopedics)",
      experience: 7,
      consultationFee: 650,
      availability: [
        { day: "Thursday", startTime: "11:00", endTime: "16:00" },
        { day: "Saturday", startTime: "09:00", endTime: "13:00" },
      ],
    },
  },
  {
    name: "Dr. Pooja Ranade",
    email: "pooja.ranade@citycare.com",
    username: "pooja.ranade",
    password: "CityCare@123",
    roleName: "DOCTOR",
    department: "Pediatrics",
    designation: "Neonatologist",
    employeeId: "DOC-1054",
    phone: "+91 98765 10054",
    countryCode: "+91",
    dateOfBirth: "1991-09-05",
    gender: "Female",
    bloodGroup: "O-",
    maritalStatus: "Married",
    nationality: "Indian",
    currentAddress: "45, Law Garden, Ahmedabad, Gujarat",
    joiningDate: "2022-08-10",
    isProfileComplete: true,
    status: "active",
    emailVerified: "Verified",
    loginAccess: "Allowed",
    forcePasswordChange: false,
    sendWelcomeEmail: false,
    notes: "NICU intensive care specialist",
    isVerified: true,
    authProvider: "local",
    doctorMeta: {
      specialization: "Pediatrics",
      qualification: "MBBS, DCH (Pediatrics)",
      experience: 5,
      consultationFee: 600,
      availability: [
        { day: "Monday", startTime: "14:00", endTime: "18:00" },
        { day: "Friday", startTime: "14:00", endTime: "18:00" },
      ],
    },
  },
  {
    name: "Dr. Harish Nambiar",
    email: "harish.nambiar@citycare.com",
    username: "harish.nambiar",
    password: "CityCare@123",
    roleName: "DOCTOR",
    department: "General Medicine",
    designation: "Consultant Physician & Rheumatologist",
    employeeId: "DOC-1055",
    phone: "+91 98765 10055",
    countryCode: "+91",
    dateOfBirth: "1972-12-14",
    gender: "Male",
    bloodGroup: "AB+",
    maritalStatus: "Married",
    nationality: "Indian",
    currentAddress: "90, Marine Drive, Kochi, Kerala",
    joiningDate: "2011-01-20",
    isProfileComplete: true,
    status: "active",
    emailVerified: "Verified",
    loginAccess: "Allowed",
    forcePasswordChange: false,
    sendWelcomeEmail: false,
    notes: "Senior autoimmune disorder specialist",
    isVerified: true,
    authProvider: "local",
    doctorMeta: {
      specialization: "General Medicine",
      qualification: "MBBS, MD (Medicine)",
      experience: 22,
      consultationFee: 1200,
      availability: [
        { day: "Tuesday", startTime: "09:00", endTime: "13:00" },
        { day: "Thursday", startTime: "09:00", endTime: "13:00" },
      ],
    },
  },
  {
    name: "Dr. Divya Saxena",
    email: "divya.saxena@citycare.com",
    username: "divya.saxena",
    password: "CityCare@123",
    roleName: "DOCTOR",
    department: "Dermatology",
    designation: "Cosmetologist Doctor",
    employeeId: "DOC-1056",
    phone: "+91 98765 10056",
    countryCode: "+91",
    dateOfBirth: "1992-04-19",
    gender: "Female",
    bloodGroup: "A-",
    maritalStatus: "Single",
    nationality: "Indian",
    currentAddress: "23, Cyber City, Gurugram, Haryana",
    joiningDate: "2023-03-01",
    isProfileComplete: false,
    status: "inactive",
    emailVerified: "Unverified",
    loginAccess: "Allowed",
    forcePasswordChange: true,
    sendWelcomeEmail: true,
    notes: "Awaiting hospital board clearance",
    isVerified: false,
    authProvider: "local",
    doctorMeta: {
      specialization: "Dermatology",
      qualification: "MBBS, DVD (Dermatology)",
      experience: 4,
      consultationFee: 550,
      availability: [
        { day: "Saturday", startTime: "10:00", endTime: "14:00" },
      ],
    },
  },
  {
    name: "Dr. Arvind Menon",
    email: "arvind.menon@citycare.com",
    username: "arvind.menon",
    password: "CityCare@123",
    roleName: "DOCTOR",
    department: "Emergency Medicine",
    designation: "Trauma Care Director",
    employeeId: "DOC-1057",
    phone: "+91 98765 10057",
    countryCode: "+91",
    dateOfBirth: "1980-07-28",
    gender: "Male",
    bloodGroup: "B-",
    maritalStatus: "Married",
    nationality: "Indian",
    currentAddress: "14, Panampilly Nagar, Kochi, Kerala",
    joiningDate: "2016-10-10",
    isProfileComplete: true,
    status: "active",
    emailVerified: "Verified",
    loginAccess: "Allowed",
    forcePasswordChange: false,
    sendWelcomeEmail: false,
    notes: "Emergency & critical trauma Lead",
    isVerified: true,
    authProvider: "local",
    doctorMeta: {
      specialization: "Emergency Medicine",
      qualification: "MBBS, MD (Emergency)",
      experience: 15,
      consultationFee: 1000,
      availability: [
        { day: "Wednesday", startTime: "08:00", endTime: "20:00" },
        { day: "Saturday", startTime: "08:00", endTime: "20:00" },
      ],
    },
  },
  {
    name: "Dr. Smita Kulkarni",
    email: "smita.kulkarni@citycare.com",
    username: "smita.kulkarni",
    password: "CityCare@123",
    roleName: "DOCTOR",
    department: "Radiology",
    designation: "Ultrasonography Specialist",
    employeeId: "DOC-1058",
    phone: "+91 98765 10058",
    countryCode: "+91",
    dateOfBirth: "1987-02-14",
    gender: "Female",
    bloodGroup: "O+",
    maritalStatus: "Married",
    nationality: "Indian",
    currentAddress: "89, FC Road, Pune, Maharashtra",
    joiningDate: "2019-11-20",
    isProfileComplete: true,
    status: "active",
    emailVerified: "Verified",
    loginAccess: "Allowed",
    forcePasswordChange: false,
    sendWelcomeEmail: false,
    notes: "Diagnostic USG & Doppler specialist",
    isVerified: true,
    authProvider: "local",
    doctorMeta: {
      specialization: "Radiology",
      qualification: "MBBS, DMRD (Radiology)",
      experience: 8,
      consultationFee: 700,
      availability: [
        { day: "Tuesday", startTime: "09:00", endTime: "13:00" },
        { day: "Thursday", startTime: "09:00", endTime: "13:00" },
      ],
    },
  },
  {
    name: "Dr. Brijesh Rastogi",
    email: "brijesh.rastogi@citycare.com",
    username: "brijesh.rastogi",
    password: "CityCare@123",
    roleName: "DOCTOR",
    department: "ENT",
    designation: "Rhinologist & Sinus Surgeon",
    employeeId: "DOC-1059",
    phone: "+91 98765 10059",
    countryCode: "+91",
    dateOfBirth: "1983-08-09",
    gender: "Male",
    bloodGroup: "A+",
    maritalStatus: "Married",
    nationality: "Indian",
    currentAddress: "34, Aliganj, Lucknow, Uttar Pradesh",
    joiningDate: "2018-05-14",
    isProfileComplete: true,
    status: "active",
    emailVerified: "Verified",
    loginAccess: "Allowed",
    forcePasswordChange: false,
    sendWelcomeEmail: false,
    notes: "Endoscopic sinus surgery consultant",
    isVerified: true,
    authProvider: "local",
    doctorMeta: {
      specialization: "ENT",
      qualification: "MBBS, DLO (ENT)",
      experience: 12,
      consultationFee: 800,
      availability: [
        { day: "Monday", startTime: "10:00", endTime: "14:00" },
        { day: "Friday", startTime: "10:00", endTime: "14:00" },
      ],
    },
  },
  {
    name: "Dr. Neeta Aggarwal",
    email: "neeta.aggarwal@citycare.com",
    username: "neeta.aggarwal",
    password: "CityCare@123",
    roleName: "DOCTOR",
    department: "Gynecology",
    designation: "Chief Infertility Specialist",
    employeeId: "DOC-1060",
    phone: "+91 98765 10060",
    countryCode: "+91",
    dateOfBirth: "1976-10-25",
    gender: "Female",
    bloodGroup: "B+",
    maritalStatus: "Married",
    nationality: "Indian",
    currentAddress: "12, Civil Lines, Jaipur, Rajasthan",
    joiningDate: "2013-07-01",
    isProfileComplete: true,
    status: "active",
    emailVerified: "Verified",
    loginAccess: "Allowed",
    forcePasswordChange: false,
    sendWelcomeEmail: false,
    notes: "Reproductive health & IVF consultant",
    isVerified: true,
    authProvider: "local",
    doctorMeta: {
      specialization: "Gynecology",
      qualification: "MBBS, DGO (Gynecology)",
      experience: 19,
      consultationFee: 1000,
      availability: [
        { day: "Wednesday", startTime: "10:00", endTime: "15:00" },
        { day: "Saturday", startTime: "10:00", endTime: "15:00" },
      ],
    },
  },

  // 25-32 NURSES (8 NURSES)
  {
    name: "Pooja Singh",
    email: "pooja.singh@citycare.com",
    username: "pooja.singh",
    password: "CityCare@123",
    roleName: "NURSE",
    department: "Emergency Medicine",
    designation: "Head ICU Nurse",
    employeeId: "NUR-1011",
    phone: "+91 98765 10011",
    countryCode: "+91",
    dateOfBirth: "1991-05-18",
    gender: "Female",
    bloodGroup: "A+",
    maritalStatus: "Married",
    nationality: "Indian",
    currentAddress: "Plot 45, DLF Phase 3, Gurugram, Haryana",
    joiningDate: "2019-08-12",
    isProfileComplete: true,
    status: "active",
    emailVerified: "Verified",
    loginAccess: "Allowed",
    forcePasswordChange: false,
    sendWelcomeEmail: false,
    notes: "Shift incharge for Intensive Care",
    isVerified: true,
    authProvider: "local",
  },
  {
    name: "Suresh Verma",
    email: "suresh.verma@citycare.com",
    username: "suresh.verma",
    password: "CityCare@123",
    roleName: "NURSE",
    department: "Emergency Medicine",
    designation: "Senior Staff Nurse",
    employeeId: "NUR-1012",
    phone: "+91 98765 10012",
    countryCode: "+91",
    dateOfBirth: "1988-01-27",
    gender: "Male",
    bloodGroup: "O+",
    maritalStatus: "Married",
    nationality: "Indian",
    currentAddress: "78, Tajganj, Agra, Uttar Pradesh",
    joiningDate: "2017-03-25",
    isProfileComplete: true,
    status: "active",
    emailVerified: "Verified",
    loginAccess: "Allowed",
    forcePasswordChange: false,
    sendWelcomeEmail: false,
    notes: "Night shift emergency Lead",
    isVerified: true,
    authProvider: "local",
  },
  {
    name: "Ritika Agarwal",
    email: "ritika.agarwal@citycare.com",
    username: "ritika.agarwal",
    password: "CityCare@123",
    roleName: "NURSE",
    department: "General Medicine",
    designation: "Staff Nurse",
    employeeId: "NUR-1013",
    phone: "+91 98765 10013",
    countryCode: "+91",
    dateOfBirth: "1995-09-14",
    gender: "Female",
    bloodGroup: "B+",
    maritalStatus: "Single",
    nationality: "Indian",
    currentAddress: "C-9, Malviya Nagar, Jaipur, Rajasthan",
    joiningDate: "2021-05-10",
    isProfileComplete: true,
    status: "active",
    emailVerified: "Verified",
    loginAccess: "Allowed",
    forcePasswordChange: false,
    sendWelcomeEmail: false,
    notes: "General ward care staff",
    isVerified: true,
    authProvider: "google",
    firebaseUid: "firebase_uid_google_1013",
  },
  {
    name: "Deepak Tiwari",
    email: "deepak.tiwari@citycare.com",
    username: "deepak.tiwari",
    password: "CityCare@123",
    roleName: "NURSE",
    department: "Orthopedics",
    designation: "Nursing Officer",
    employeeId: "NUR-1014",
    phone: "+91 98765 10014",
    countryCode: "+91",
    dateOfBirth: "1992-11-03",
    gender: "Male",
    bloodGroup: "A-",
    maritalStatus: "Married",
    nationality: "Indian",
    currentAddress: "34, Swaroop Nagar, Kanpur, Uttar Pradesh",
    joiningDate: "2020-09-01",
    isProfileComplete: true,
    status: "active",
    emailVerified: "Verified",
    loginAccess: "Allowed",
    forcePasswordChange: false,
    sendWelcomeEmail: false,
    notes: "Orthopedic post-op care nurse",
    isVerified: true,
    authProvider: "local",
  },
  {
    name: "Sneha Rao",
    email: "sneha.rao@citycare.com",
    username: "sneha.rao",
    password: "CityCare@123",
    roleName: "NURSE",
    department: "Pediatrics",
    designation: "Pediatric Nurse Specialist",
    employeeId: "NUR-1015",
    phone: "+91 98765 10015",
    countryCode: "+91",
    dateOfBirth: "1994-04-20",
    gender: "Female",
    bloodGroup: "O-",
    maritalStatus: "Single",
    nationality: "Indian",
    currentAddress: "56, Indiranagar, Bengaluru, Karnataka",
    joiningDate: "2022-01-10",
    isProfileComplete: true,
    status: "active",
    emailVerified: "Verified",
    loginAccess: "Allowed",
    forcePasswordChange: false,
    sendWelcomeEmail: false,
    notes: "Neonatal ward staff nurse",
    isVerified: true,
    authProvider: "local",
  },
  {
    name: "Meena Chatterjee",
    email: "meena.chatterjee@citycare.com",
    username: "meena.chatterjee",
    password: "CityCare@123",
    roleName: "NURSE",
    department: "Neurology",
    designation: "Critical Care Nurse",
    employeeId: "NUR-1016",
    phone: "+91 98765 10016",
    countryCode: "+91",
    dateOfBirth: "1989-08-30",
    gender: "Female",
    bloodGroup: "AB+",
    maritalStatus: "Married",
    nationality: "Indian",
    currentAddress: "88, Park Street, Kolkata, West Bengal",
    joiningDate: "2018-11-20",
    isProfileComplete: true,
    status: "active",
    emailVerified: "Verified",
    loginAccess: "Allowed",
    forcePasswordChange: false,
    sendWelcomeEmail: false,
    notes: "Neuro-ICU nurse specialist",
    isVerified: true,
    authProvider: "local",
  },
  {
    name: "Arjun Yadav",
    email: "arjun.yadav@citycare.com",
    username: "arjun.yadav",
    password: "CityCare@123",
    roleName: "NURSE",
    department: "Radiology",
    designation: "Radiographic Nurse",
    employeeId: "NUR-1017",
    phone: "+91 98765 10017",
    countryCode: "+91",
    dateOfBirth: "1996-03-12",
    gender: "Male",
    bloodGroup: "B+",
    maritalStatus: "Single",
    nationality: "Indian",
    currentAddress: "12, Sigra, Varanasi, Uttar Pradesh",
    joiningDate: "2023-02-15",
    isProfileComplete: false,
    status: "inactive",
    emailVerified: "Unverified",
    loginAccess: "Allowed",
    forcePasswordChange: true,
    sendWelcomeEmail: true,
    notes: "Awaiting medical fitness certificate",
    isVerified: false,
    authProvider: "local",
  },
  {
    name: "Divya Shah",
    email: "divya.shah@citycare.com",
    username: "divya.shah",
    password: "CityCare@123",
    roleName: "NURSE",
    department: "General Medicine",
    designation: "Junior Nurse",
    employeeId: "NUR-1018",
    phone: "+91 98765 10018",
    countryCode: "+91",
    dateOfBirth: "1998-07-25",
    gender: "Female",
    bloodGroup: "A+",
    maritalStatus: "Single",
    nationality: "Indian",
    currentAddress: "67, Satellite, Ahmedabad, Gujarat",
    joiningDate: "2024-01-08",
    isProfileComplete: false,
    status: "suspended",
    emailVerified: "Unverified",
    loginAccess: "Denied",
    forcePasswordChange: true,
    sendWelcomeEmail: false,
    notes: "Suspended pending HR investigation",
    isVerified: false,
    authProvider: "local",
  },

  // 33-36 ADMINS (4 ADMINS)
  {
    name: "Rohan Mehta (Super Admin)",
    email: "admin@gmail.com",
    username: "superadmin",
    password: "admin123",
    roleName: "SUPER_ADMIN",
    department: "Administration",
    designation: "Hospital Administrator",
    employeeId: "ADM-1019",
    phone: "+91 98765 10019",
    countryCode: "+91",
    dateOfBirth: "1983-02-14",
    gender: "Male",
    bloodGroup: "O+",
    maritalStatus: "Married",
    nationality: "Indian",
    currentAddress: "101, Powai, Mumbai, Maharashtra",
    joiningDate: "2016-01-10",
    isProfileComplete: true,
    status: "active",
    emailVerified: "Verified",
    loginAccess: "Allowed",
    forcePasswordChange: false,
    sendWelcomeEmail: false,
    notes: "Overall operations admin",
    isVerified: true,
    authProvider: "local",
  },
  {
    name: "Shalini Pandey",
    email: "shalini.pandey@citycare.com",
    username: "shalini.pandey",
    password: "CityCare@123",
    roleName: "ADMIN",
    department: "Administration",
    designation: "Operations Manager",
    employeeId: "ADM-1020",
    phone: "+91 98765 10020",
    countryCode: "+91",
    dateOfBirth: "1987-12-01",
    gender: "Female",
    bloodGroup: "B+",
    maritalStatus: "Married",
    nationality: "Indian",
    currentAddress: "45, Vasant Kunj, New Delhi, Delhi",
    joiningDate: "2018-04-05",
    isProfileComplete: true,
    status: "active",
    emailVerified: "Verified",
    loginAccess: "Allowed",
    forcePasswordChange: false,
    sendWelcomeEmail: false,
    notes: "Facility & vendor management",
    isVerified: true,
    authProvider: "google",
    firebaseUid: "firebase_uid_google_1020",
  },
  {
    name: "Vikas Malhotra",
    email: "vikas.malhotra@citycare.com",
    username: "vikas.malhotra",
    password: "CityCare@123",
    roleName: "ADMIN",
    department: "Administration",
    designation: "IT Systems Lead",
    employeeId: "ADM-1021",
    phone: "+91 98765 10021",
    countryCode: "+91",
    dateOfBirth: "1990-05-09",
    gender: "Male",
    bloodGroup: "AB+",
    maritalStatus: "Single",
    nationality: "Indian",
    currentAddress: "12, Sector 17, Chandigarh, Punjab",
    joiningDate: "2020-08-15",
    isProfileComplete: true,
    status: "active",
    emailVerified: "Verified",
    loginAccess: "Allowed",
    forcePasswordChange: false,
    sendWelcomeEmail: false,
    notes: "System security & audit manager",
    isVerified: true,
    authProvider: "local",
  },
  {
    name: "Pankaj Bansal",
    email: "pankaj.bansal@citycare.com",
    username: "pankaj.bansal",
    password: "CityCare@123",
    roleName: "ADMIN",
    department: "Administration",
    designation: "Security & Admin Supervisor",
    employeeId: "ADM-1049",
    phone: "+91 98765 10049",
    countryCode: "+91",
    dateOfBirth: "1986-06-03",
    gender: "Male",
    bloodGroup: "A-",
    maritalStatus: "Married",
    nationality: "Indian",
    currentAddress: "14, Urban Estate, Hisar, Haryana",
    joiningDate: "2017-09-01",
    isProfileComplete: false,
    status: "blocked",
    emailVerified: "Unverified",
    loginAccess: "Denied",
    forcePasswordChange: true,
    sendWelcomeEmail: false,
    notes: "Blocked due to security non-compliance",
    isVerified: false,
    authProvider: "local",
  },

  // 37-40 RECEPTIONISTS (4 RECEPTIONISTS)
  {
    name: "Aarti Saxena",
    email: "aarti.saxena@citycare.com",
    username: "aarti.saxena",
    password: "CityCare@123",
    roleName: "RECEPTIONIST",
    department: "Reception",
    designation: "Front Desk Officer",
    employeeId: "REC-1022",
    phone: "+91 98765 10022",
    countryCode: "+91",
    dateOfBirth: "1994-10-17",
    gender: "Female",
    bloodGroup: "A+",
    maritalStatus: "Married",
    nationality: "Indian",
    currentAddress: "78, Hazratganj, Lucknow, Uttar Pradesh",
    joiningDate: "2021-03-01",
    isProfileComplete: true,
    status: "active",
    emailVerified: "Verified",
    loginAccess: "Allowed",
    forcePasswordChange: false,
    sendWelcomeEmail: false,
    notes: "OPD Front Desk Officer",
    isVerified: true,
    authProvider: "local",
  },
  {
    name: "Manoj Chauhan",
    email: "manoj.chauhan@citycare.com",
    username: "manoj.chauhan",
    password: "CityCare@123",
    roleName: "RECEPTIONIST",
    department: "Reception",
    designation: "Patient Helpdesk Executive",
    employeeId: "REC-1023",
    phone: "+91 98765 10023",
    countryCode: "+91",
    dateOfBirth: "1993-01-22",
    gender: "Male",
    bloodGroup: "O+",
    maritalStatus: "Married",
    nationality: "Indian",
    currentAddress: "90, Sector 18, Noida, Uttar Pradesh",
    joiningDate: "2020-10-10",
    isProfileComplete: true,
    status: "active",
    emailVerified: "Verified",
    loginAccess: "Allowed",
    forcePasswordChange: false,
    sendWelcomeEmail: false,
    notes: "Emergency patient check-in executive",
    isVerified: true,
    authProvider: "local",
  },
  {
    name: "Swati Banerjee",
    email: "swati.banerjee@citycare.com",
    username: "swati.banerjee",
    password: "CityCare@123",
    roleName: "RECEPTIONIST",
    department: "Reception",
    designation: "Senior Receptionist",
    employeeId: "REC-1024",
    phone: "+91 98765 10024",
    countryCode: "+91",
    dateOfBirth: "1996-06-30",
    gender: "Female",
    bloodGroup: "B-",
    maritalStatus: "Single",
    nationality: "Indian",
    currentAddress: "14, Ballygunge, Kolkata, West Bengal",
    joiningDate: "2022-07-15",
    isProfileComplete: true,
    status: "active",
    emailVerified: "Verified",
    loginAccess: "Allowed",
    forcePasswordChange: false,
    sendWelcomeEmail: false,
    notes: "IPD Admission Helpdesk Lead",
    isVerified: true,
    authProvider: "google",
    firebaseUid: "firebase_uid_google_1024",
  },
  {
    name: "Tarun Bhatia",
    email: "tarun.bhatia@citycare.com",
    username: "tarun.bhatia",
    password: "CityCare@123",
    roleName: "RECEPTIONIST",
    department: "Reception",
    designation: "Evening Shift Receptionist",
    employeeId: "REC-1025",
    phone: "+91 98765 10025",
    countryCode: "+91",
    dateOfBirth: "1997-09-04",
    gender: "Male",
    bloodGroup: "A-",
    maritalStatus: "Single",
    nationality: "Indian",
    currentAddress: "56, Sector 14, Gurugram, Haryana",
    joiningDate: "2023-04-01",
    isProfileComplete: false,
    status: "inactive",
    emailVerified: "Unverified",
    loginAccess: "Allowed",
    forcePasswordChange: true,
    sendWelcomeEmail: true,
    notes: "Resigned - account deactivation pending",
    isVerified: false,
    authProvider: "local",
  },

  // 41-44 PHARMACISTS (4 PHARMACISTS)
  {
    name: "Rajiv Kapoor",
    email: "rajiv.kapoor@citycare.com",
    username: "rajiv.kapoor",
    password: "CityCare@123",
    roleName: "PHARMACIST",
    department: "Pharmacy",
    designation: "Chief Pharmacist",
    employeeId: "PHM-1026",
    phone: "+91 98765 10026",
    countryCode: "+91",
    dateOfBirth: "1985-11-19",
    gender: "Male",
    bloodGroup: "O+",
    maritalStatus: "Married",
    nationality: "Indian",
    currentAddress: "12, Rohini Sector 9, New Delhi, Delhi",
    joiningDate: "2017-02-14",
    isProfileComplete: true,
    status: "active",
    emailVerified: "Verified",
    loginAccess: "Allowed",
    forcePasswordChange: false,
    sendWelcomeEmail: false,
    notes: "Head of Hospital Pharmacy & Narcotics store",
    isVerified: true,
    authProvider: "local",
  },
  {
    name: "Sunil Deshmukh",
    email: "sunil.deshmukh@citycare.com",
    username: "sunil.deshmukh",
    password: "CityCare@123",
    roleName: "PHARMACIST",
    department: "Pharmacy",
    designation: "Senior Pharmacist",
    employeeId: "PHM-1027",
    phone: "+91 98765 10027",
    countryCode: "+91",
    dateOfBirth: "1988-04-15",
    gender: "Male",
    bloodGroup: "A+",
    maritalStatus: "Married",
    nationality: "Indian",
    currentAddress: "89, Aundh, Pune, Maharashtra",
    joiningDate: "2019-06-01",
    isProfileComplete: true,
    status: "active",
    emailVerified: "Verified",
    loginAccess: "Allowed",
    forcePasswordChange: false,
    sendWelcomeEmail: false,
    notes: "Inpatient prescription dispenser",
    isVerified: true,
    authProvider: "local",
  },
  {
    name: "Kirti Tripathi",
    email: "kirti.tripathi@citycare.com",
    username: "kirti.tripathi",
    password: "CityCare@123",
    roleName: "PHARMACIST",
    department: "Pharmacy",
    designation: "Dispensary Pharmacist",
    employeeId: "PHM-1028",
    phone: "+91 98765 10028",
    countryCode: "+91",
    dateOfBirth: "1995-02-28",
    gender: "Female",
    bloodGroup: "B+",
    maritalStatus: "Single",
    nationality: "Indian",
    currentAddress: "44, Civil Lines, Prayagraj, Uttar Pradesh",
    joiningDate: "2021-08-10",
    isProfileComplete: true,
    status: "active",
    emailVerified: "Verified",
    loginAccess: "Allowed",
    forcePasswordChange: false,
    sendWelcomeEmail: false,
    notes: "OPD counter pharmacist",
    isVerified: true,
    authProvider: "google",
    firebaseUid: "firebase_uid_google_1028",
  },
  {
    name: "Nitin Das",
    email: "nitin.das@citycare.com",
    username: "nitin.das",
    password: "CityCare@123",
    roleName: "PHARMACIST",
    department: "Pharmacy",
    designation: "Night Shift Pharmacist",
    employeeId: "PHM-1029",
    phone: "+91 98765 10029",
    countryCode: "+91",
    dateOfBirth: "1993-07-16",
    gender: "Male",
    bloodGroup: "AB+",
    maritalStatus: "Single",
    nationality: "Indian",
    currentAddress: "33, Saheed Nagar, Bhubaneswar, Odisha",
    joiningDate: "2022-10-05",
    isProfileComplete: true,
    status: "active",
    emailVerified: "Verified",
    loginAccess: "Allowed",
    forcePasswordChange: false,
    sendWelcomeEmail: false,
    notes: "Emergency 24x7 pharmacy dispenser",
    isVerified: true,
    authProvider: "local",
  },

  // 45-48 ACCOUNTANTS (4 ACCOUNTANTS)
  {
    name: "Alok Singhal",
    email: "alok.singhal@citycare.com",
    username: "alok.singhal",
    password: "CityCare@123",
    roleName: "ACCOUNTANT",
    department: "Accounts",
    designation: "Chief Financial Accountant",
    employeeId: "ACC-1030",
    phone: "+91 98765 10030",
    countryCode: "+91",
    dateOfBirth: "1982-08-11",
    gender: "Male",
    bloodGroup: "O+",
    maritalStatus: "Married",
    nationality: "Indian",
    currentAddress: "105, Vaishali Nagar, Jaipur, Rajasthan",
    joiningDate: "2015-05-18",
    isProfileComplete: true,
    status: "active",
    emailVerified: "Verified",
    loginAccess: "Allowed",
    forcePasswordChange: false,
    sendWelcomeEmail: false,
    notes: "Head of Accounts & Payroll",
    isVerified: true,
    authProvider: "local",
  },
  {
    name: "Rashmi Kulkarni",
    email: "rashmi.kulkarni@citycare.com",
    username: "rashmi.kulkarni",
    password: "CityCare@123",
    roleName: "ACCOUNTANT",
    department: "Accounts",
    designation: "Billing Specialist",
    employeeId: "ACC-1031",
    phone: "+91 98765 10031",
    countryCode: "+91",
    dateOfBirth: "1990-12-24",
    gender: "Female",
    bloodGroup: "A+",
    maritalStatus: "Married",
    nationality: "Indian",
    currentAddress: "12, Dadar East, Mumbai, Maharashtra",
    joiningDate: "2019-09-10",
    isProfileComplete: true,
    status: "active",
    emailVerified: "Verified",
    loginAccess: "Allowed",
    forcePasswordChange: false,
    sendWelcomeEmail: false,
    notes: "IPD Final Discharge Billing",
    isVerified: true,
    authProvider: "local",
  },
  {
    name: "Gaurav Shrivastav",
    email: "gaurav.shrivastav@citycare.com",
    username: "gaurav.shrivastav",
    password: "CityCare@123",
    roleName: "ACCOUNTANT",
    department: "Accounts",
    designation: "Insurance Billing Accountant",
    employeeId: "ACC-1032",
    phone: "+91 98765 10032",
    countryCode: "+91",
    dateOfBirth: "1992-05-03",
    gender: "Male",
    bloodGroup: "B+",
    maritalStatus: "Single",
    nationality: "Indian",
    currentAddress: "88, Arera Colony, Bhopal, Madhya Pradesh",
    joiningDate: "2021-02-01",
    isProfileComplete: true,
    status: "active",
    emailVerified: "Verified",
    loginAccess: "Allowed",
    forcePasswordChange: false,
    sendWelcomeEmail: false,
    notes: "TPA & Cashless claim settlements",
    isVerified: true,
    authProvider: "local",
  },
  {
    name: "Preeti Rathi",
    email: "preeti.rathi@citycare.com",
    username: "preeti.rathi",
    password: "CityCare@123",
    roleName: "ACCOUNTANT",
    department: "Accounts",
    designation: "Junior Accountant",
    employeeId: "ACC-1033",
    phone: "+91 98765 10033",
    countryCode: "+91",
    dateOfBirth: "1997-11-12",
    gender: "Female",
    bloodGroup: "O-",
    maritalStatus: "Single",
    nationality: "Indian",
    currentAddress: "19, Shastri Nagar, Meerut, Uttar Pradesh",
    joiningDate: "2023-08-15",
    isProfileComplete: false,
    status: "inactive",
    emailVerified: "Unverified",
    loginAccess: "Allowed",
    forcePasswordChange: true,
    sendWelcomeEmail: true,
    notes: "On extended study leave",
    isVerified: false,
    authProvider: "local",
  },

  // 49-50 PATIENT ROLES (2 PATIENT USERS)
  {
    name: "Ramesh Chand",
    email: "ramesh.chand@gmail.com",
    username: "ramesh.chand",
    password: "CityCare@123",
    roleName: "PATIENT",
    department: "General",
    designation: "Registered Patient",
    employeeId: "PAT-1034",
    phone: "+91 98765 10034",
    countryCode: "+91",
    dateOfBirth: "1968-03-15",
    gender: "Male",
    bloodGroup: "B+",
    maritalStatus: "Married",
    nationality: "Indian",
    currentAddress: "44, Krishna Nagar, Mathura, Uttar Pradesh",
    joiningDate: "2024-02-10",
    isProfileComplete: true,
    status: "active",
    emailVerified: "Verified",
    loginAccess: "Allowed",
    forcePasswordChange: false,
    sendWelcomeEmail: false,
    notes: "Chronic hypertension patient",
    isVerified: true,
    authProvider: "local",
  },
  {
    name: "Geeta Rani",
    email: "geeta.rani@gmail.com",
    username: "geeta.rani",
    password: "CityCare@123",
    roleName: "PATIENT",
    department: "General",
    designation: "Registered Patient",
    employeeId: "PAT-1035",
    phone: "+91 98765 10035",
    countryCode: "+91",
    dateOfBirth: "1974-09-02",
    gender: "Female",
    bloodGroup: "O+",
    maritalStatus: "Married",
    nationality: "Indian",
    currentAddress: "12, Shahganj, Agra, Uttar Pradesh",
    joiningDate: "2024-03-01",
    isProfileComplete: true,
    status: "active",
    emailVerified: "Verified",
    loginAccess: "Allowed",
    forcePasswordChange: false,
    sendWelcomeEmail: false,
    notes: "Diabetic routine consultation patient",
    isVerified: true,
    authProvider: "local",
  },
];

const sample50Patients = [
  {
    patientId: "PAT-1001",
    name: "Rajesh Kumar",
    dateOfBirth: new Date("1985-04-12"),
    gender: "male",
    phone: "+91 98765 20001",
    email: "rajesh.kumar85@gmail.com",
    address: "14, Civil Lines, Mathura, Uttar Pradesh",
    bloodGroup: "O+",
    maritalStatus: "married",
    occupation: "Business Owner",
    nationality: "Indian",
    notes: "Chronic hypertension patient",
    emergencyContact: { name: "Sunita Kumar", phone: "+91 98765 20002", relation: "Spouse" },
    status: "active",
    isDeleted: false,
    deletedAt: null,
  },
  {
    patientId: "PAT-1002",
    name: "Priya Sharma",
    dateOfBirth: new Date("1992-08-25"),
    gender: "female",
    phone: "+91 98765 20003",
    email: "priya.sharma92@yahoo.com",
    address: "402, Bandra West, Mumbai, Maharashtra",
    bloodGroup: "A+",
    maritalStatus: "single",
    occupation: "Software Engineer",
    nationality: "Indian",
    notes: "Regular health checkup",
    emergencyContact: { name: "Ramesh Sharma", phone: "+91 98765 20004", relation: "Father" },
    status: "active",
    isDeleted: false,
    deletedAt: null,
  },
  {
    patientId: "PAT-1003",
    name: "Aarav Singh",
    dateOfBirth: new Date("2012-01-15"),
    gender: "male",
    phone: "+91 98765 20005",
    email: null,
    address: "88, Raj Nagar, Ghaziabad, Uttar Pradesh",
    bloodGroup: "B+",
    maritalStatus: "single",
    occupation: "Student",
    nationality: "Indian",
    notes: "Pediatric asthma follow-up",
    emergencyContact: { name: "Vikram Singh", phone: "+91 98765 20006", relation: "Father" },
    status: "active",
    isDeleted: false,
    deletedAt: null,
  },
  {
    patientId: "PAT-1004",
    name: "Ananya Gupta",
    dateOfBirth: new Date("1978-11-05"),
    gender: "female",
    phone: "+91 98765 20007",
    email: "ananya.gupta@outlook.com",
    address: "78, Tajganj, Agra, Uttar Pradesh",
    bloodGroup: "AB+",
    maritalStatus: "married",
    occupation: "School Teacher",
    nationality: "Indian",
    notes: "Diabetic routine consultation",
    emergencyContact: { name: "Alok Gupta", phone: "+91 98765 20008", relation: "Spouse" },
    status: "active",
    isDeleted: false,
    deletedAt: null,
  },
  {
    patientId: "PAT-1005",
    name: "Suresh Verma",
    dateOfBirth: new Date("1965-06-30"),
    gender: "male",
    phone: "+91 98765 20009",
    email: "suresh.verma65@gmail.com",
    address: "A-102, Saket, New Delhi, Delhi",
    bloodGroup: "O-",
    maritalStatus: "married",
    occupation: "Retired Bank Manager",
    nationality: "Indian",
    notes: "Cardiac OPD patient",
    emergencyContact: { name: "Kavita Verma", phone: "+91 98765 20010", relation: "Daughter" },
    status: "active",
    isDeleted: false,
    deletedAt: null,
  },
  {
    patientId: "PAT-1006",
    name: "Kavita Yadav",
    dateOfBirth: new Date("1989-03-14"),
    gender: "female",
    phone: "+91 98765 20011",
    email: "kavita.yadav@gmail.com",
    address: "15, Gomti Nagar, Lucknow, Uttar Pradesh",
    bloodGroup: "A-",
    maritalStatus: "married",
    occupation: "Homemaker",
    nationality: "Indian",
    notes: "Obstetrics OPD consultation",
    emergencyContact: { name: "Rahul Yadav", phone: "+91 98765 20012", relation: "Husband" },
    status: "active",
    isDeleted: false,
    deletedAt: null,
  },
  {
    patientId: "PAT-1007",
    name: "Mohit Mishra",
    dateOfBirth: new Date("1995-10-22"),
    gender: "male",
    phone: "+91 98765 20013",
    email: "mohit.mishra95@gmail.com",
    address: "Sector 62, Noida, Uttar Pradesh",
    bloodGroup: "B-",
    maritalStatus: "single",
    occupation: "Sales Executive",
    nationality: "Indian",
    notes: "ENT routine checkup",
    emergencyContact: { name: "Sunil Mishra", phone: "+91 98765 20014", relation: "Father" },
    status: "active",
    isDeleted: false,
    deletedAt: null,
  },
  {
    patientId: "PAT-1008",
    name: "Sneha Agarwal",
    dateOfBirth: new Date("1991-07-08"),
    gender: "female",
    phone: "+91 98765 20015",
    email: "sneha.agarwal@yahoo.com",
    address: "C-9, Malviya Nagar, Jaipur, Rajasthan",
    bloodGroup: "O+",
    maritalStatus: "married",
    occupation: "Accountant",
    nationality: "Indian",
    notes: "Dermatology consultation",
    emergencyContact: { name: "Amit Agarwal", phone: "+91 98765 20016", relation: "Spouse" },
    status: "active",
    isDeleted: false,
    deletedAt: null,
  },
  {
    patientId: "PAT-1009",
    name: "Vivek Tiwari",
    dateOfBirth: new Date("1983-12-19"),
    gender: "male",
    phone: "+91 98765 20017",
    email: null,
    address: "34, Swaroop Nagar, Kanpur, Uttar Pradesh",
    bloodGroup: "AB-",
    maritalStatus: "married",
    occupation: "Government Servant",
    nationality: "Indian",
    notes: "Orthopedic back pain consultation",
    emergencyContact: { name: "Pooja Tiwari", phone: "+91 98765 20018", relation: "Wife" },
    status: "active",
    isDeleted: false,
    deletedAt: null,
  },
  {
    patientId: "PAT-1010",
    name: "Pooja Chauhan",
    dateOfBirth: new Date("1997-05-02"),
    gender: "female",
    phone: "+91 98765 20019",
    email: "pooja.chauhan97@gmail.com",
    address: "Plot 45, DLF Phase 3, Gurugram, Haryana",
    bloodGroup: "B+",
    maritalStatus: "single",
    occupation: "HR Manager",
    nationality: "Indian",
    notes: "Eye OPD checkup",
    emergencyContact: { name: "Rajendra Chauhan", phone: "+91 98765 20020", relation: "Father" },
    status: "active",
    isDeleted: false,
    deletedAt: null,
  },
  {
    patientId: "PAT-1011",
    name: "Deepak Patel",
    dateOfBirth: new Date("1972-09-14"),
    gender: "male",
    phone: "+91 98765 20021",
    email: "deepak.patel72@gmail.com",
    address: "12, CG Road, Ahmedabad, Gujarat",
    bloodGroup: "A+",
    maritalStatus: "married",
    occupation: "Textile Businessman",
    nationality: "Indian",
    notes: "Kidney stone evaluation",
    emergencyContact: { name: "Bhavna Patel", phone: "+91 98765 20022", relation: "Spouse" },
    status: "active",
    isDeleted: false,
    deletedAt: null,
  },
  {
    patientId: "PAT-1012",
    name: "Meenakshi Shah",
    dateOfBirth: new Date("1960-11-28"),
    gender: "female",
    phone: "+91 98765 20023",
    email: "meenakshi.shah@outlook.com",
    address: "67, Satellite, Ahmedabad, Gujarat",
    bloodGroup: "O+",
    maritalStatus: "widowed",
    occupation: "Retired Teacher",
    nationality: "Indian",
    notes: "Arthritis management",
    emergencyContact: { name: "Ketan Shah", phone: "+91 98765 20024", relation: "Son" },
    status: "active",
    isDeleted: false,
    deletedAt: null,
  },
  {
    patientId: "PAT-1013",
    name: "Rohan Mehta",
    dateOfBirth: new Date("2005-08-04"),
    gender: "male",
    phone: "+91 98765 20025",
    email: null,
    address: "101, Powai, Mumbai, Maharashtra",
    bloodGroup: "B+",
    maritalStatus: "single",
    occupation: "College Student",
    nationality: "Indian",
    notes: "Sports injury - knee ligament assessment",
    emergencyContact: { name: "Suresh Mehta", phone: "+91 98765 20026", relation: "Father" },
    status: "active",
    isDeleted: false,
    deletedAt: null,
  },
  {
    patientId: "PAT-1014",
    name: "Sunita Joshi",
    dateOfBirth: new Date("1986-04-17"),
    gender: "female",
    phone: "+91 98765 20027",
    email: "sunita.joshi86@gmail.com",
    address: "104, Kothrud, Pune, Maharashtra",
    bloodGroup: "AB+",
    maritalStatus: "married",
    occupation: "Graphic Designer",
    nationality: "Indian",
    notes: "Migraine management",
    emergencyContact: { name: "Prashant Joshi", phone: "+91 98765 20028", relation: "Husband" },
    status: "active",
    isDeleted: false,
    deletedAt: null,
  },
  {
    patientId: "PAT-1015",
    name: "Arvind Reddy",
    dateOfBirth: new Date("1979-01-09"),
    gender: "male",
    phone: "+91 98765 20029",
    email: "arvind.reddy79@yahoo.com",
    address: "88, Banjara Hills, Hyderabad, Telangana",
    bloodGroup: "A-",
    maritalStatus: "married",
    occupation: "Pharma Manager",
    nationality: "Indian",
    notes: "Gastroenterology OPD follow-up",
    emergencyContact: { name: "Latha Reddy", phone: "+91 98765 20030", relation: "Wife" },
    status: "active",
    isDeleted: false,
    deletedAt: null,
  },
  {
    patientId: "PAT-1016",
    name: "Lakshmi Rao",
    dateOfBirth: new Date("1953-06-21"),
    gender: "female",
    phone: "+91 98765 20031",
    email: null,
    address: "56, Indiranagar, Bengaluru, Karnataka",
    bloodGroup: "O+",
    maritalStatus: "widowed",
    occupation: "Retired Homemaker",
    nationality: "Indian",
    notes: "Geriatric care & hypertension",
    emergencyContact: { name: "Manoj Rao", phone: "+91 98765 20032", relation: "Son" },
    status: "active",
    isDeleted: false,
    deletedAt: null,
  },
  {
    patientId: "PAT-1017",
    name: "Ganesh Nair",
    dateOfBirth: new Date("1981-02-11"),
    gender: "male",
    phone: "+91 98765 20033",
    email: "ganesh.nair81@gmail.com",
    address: "55, MG Road, Kochi, Kerala",
    bloodGroup: "B+",
    maritalStatus: "married",
    occupation: "IT Consultant",
    nationality: "Indian",
    notes: "Thyroid profile evaluation",
    emergencyContact: { name: "Deepa Nair", phone: "+91 98765 20034", relation: "Spouse" },
    status: "active",
    isDeleted: false,
    deletedAt: null,
  },
  {
    patientId: "PAT-1018",
    name: "Revathi Iyer",
    dateOfBirth: new Date("1994-09-30"),
    gender: "female",
    phone: "+91 98765 20035",
    email: "revathi.iyer94@gmail.com",
    address: "77, T. Nagar, Chennai, Tamil Nadu",
    bloodGroup: "O-",
    maritalStatus: "single",
    occupation: "Bank Officer",
    nationality: "Indian",
    notes: "Allergy & asthma consultation",
    emergencyContact: { name: "Subramanian Iyer", phone: "+91 98765 20036", relation: "Father" },
    status: "active",
    isDeleted: false,
    deletedAt: null,
  },
  {
    patientId: "PAT-1019",
    name: "Subhash Das",
    dateOfBirth: new Date("1970-12-03"),
    gender: "male",
    phone: "+91 98765 20037",
    email: "subhash.das70@gmail.com",
    address: "88, Park Street, Kolkata, West Bengal",
    bloodGroup: "A+",
    maritalStatus: "married",
    occupation: "Civil Engineer",
    nationality: "Indian",
    notes: "Liver function monitoring",
    emergencyContact: { name: "Rina Das", phone: "+91 98765 20038", relation: "Wife" },
    status: "active",
    isDeleted: false,
    deletedAt: null,
  },
  {
    patientId: "PAT-1020",
    name: "Tanushree Banerjee",
    dateOfBirth: new Date("1988-07-16"),
    gender: "female",
    phone: "+91 98765 20039",
    email: "tanushree.b@gmail.com",
    address: "14, Ballygunge, Kolkata, West Bengal",
    bloodGroup: "AB+",
    maritalStatus: "married",
    occupation: "Lecturer",
    nationality: "Indian",
    notes: "Routine blood investigation",
    emergencyContact: { name: "Sourav Banerjee", phone: "+91 98765 20040", relation: "Husband" },
    status: "active",
    isDeleted: false,
    deletedAt: null,
  },
  {
    patientId: "PAT-1021",
    name: "Partha Chatterjee",
    dateOfBirth: new Date("1976-05-24"),
    gender: "male",
    phone: "+91 98765 20041",
    email: null,
    address: "12B, Salt Lake, Kolkata, West Bengal",
    bloodGroup: "B-",
    maritalStatus: "married",
    occupation: "Lawyer",
    nationality: "Indian",
    notes: "Hypercholesterolemia management",
    emergencyContact: { name: "Debashree Chatterjee", phone: "+91 98765 20042", relation: "Wife" },
    status: "active",
    isDeleted: false,
    deletedAt: null,
  },
  {
    patientId: "PAT-1022",
    name: "Tariq Khan",
    dateOfBirth: new Date("1993-11-12"),
    gender: "male",
    phone: "+91 98765 20043",
    email: "tariq.khan93@gmail.com",
    address: "78, Hazratganj, Lucknow, Uttar Pradesh",
    bloodGroup: "O+",
    maritalStatus: "single",
    occupation: "Architect",
    nationality: "Indian",
    notes: "General fever & viral checkup",
    emergencyContact: { name: "Anwar Khan", phone: "+91 98765 20044", relation: "Father" },
    status: "active",
    isDeleted: false,
    deletedAt: null,
  },
  {
    patientId: "PAT-1023",
    name: "Saba Ansari",
    dateOfBirth: new Date("1996-02-27"),
    gender: "female",
    phone: "+91 98765 20045",
    email: "saba.ansari96@gmail.com",
    address: "44, Civil Lines, Prayagraj, Uttar Pradesh",
    bloodGroup: "A+",
    maritalStatus: "married",
    occupation: "Fashion Designer",
    nationality: "Indian",
    notes: "Thyroid follow-up",
    emergencyContact: { name: "Zaid Ansari", phone: "+91 98765 20046", relation: "Husband" },
    status: "active",
    isDeleted: false,
    deletedAt: null,
  },
  {
    patientId: "PAT-1024",
    name: "Vikram Saxena",
    dateOfBirth: new Date("1982-10-05"),
    gender: "male",
    phone: "+91 98765 20047",
    email: "vikram.saxena82@yahoo.com",
    address: "19, Shastri Nagar, Meerut, Uttar Pradesh",
    bloodGroup: "B+",
    maritalStatus: "married",
    occupation: "Journalist",
    nationality: "Indian",
    notes: "Stress & insomnia consultation",
    emergencyContact: { name: "Nisha Saxena", phone: "+91 98765 20048", relation: "Wife" },
    status: "active",
    isDeleted: false,
    deletedAt: null,
  },
  {
    patientId: "PAT-1025",
    name: "Shalini Pandey",
    dateOfBirth: new Date("1990-04-18"),
    gender: "female",
    phone: "+91 98765 20049",
    email: "shalini.pandey90@gmail.com",
    address: "45, Vasant Kunj, New Delhi, Delhi",
    bloodGroup: "O-",
    maritalStatus: "single",
    occupation: "PR Manager",
    nationality: "Indian",
    notes: "Skin allergy assessment",
    emergencyContact: { name: "Ramesh Pandey", phone: "+91 98765 20050", relation: "Father" },
    status: "active",
    isDeleted: false,
    deletedAt: null,
  },
  {
    patientId: "PAT-1026",
    name: "Nitin Shrivastav",
    dateOfBirth: new Date("1987-08-22"),
    gender: "male",
    phone: "+91 98765 20051",
    email: null,
    address: "88, Arera Colony, Bhopal, Madhya Pradesh",
    bloodGroup: "A-",
    maritalStatus: "married",
    occupation: "Software Engineer",
    nationality: "Indian",
    notes: "Annual executive health screening",
    emergencyContact: { name: "Arti Shrivastav", phone: "+91 98765 20052", relation: "Wife" },
    status: "active",
    isDeleted: false,
    deletedAt: null,
  },
  {
    patientId: "PAT-1027",
    name: "Preeti Rathi",
    dateOfBirth: new Date("1995-01-11"),
    gender: "female",
    phone: "+91 98765 20053",
    email: "preeti.rathi95@gmail.com",
    address: "105, Vaishali Nagar, Jaipur, Rajasthan",
    bloodGroup: "AB-",
    maritalStatus: "single",
    occupation: "Event Planner",
    nationality: "Indian",
    notes: "Anemia & vitamin D deficiency treatment",
    emergencyContact: { name: "Mahendra Rathi", phone: "+91 98765 20054", relation: "Father" },
    status: "active",
    isDeleted: false,
    deletedAt: null,
  },
  {
    patientId: "PAT-1028",
    name: "Ashok Deshmukh",
    dateOfBirth: new Date("1958-09-03"),
    gender: "male",
    phone: "+91 98765 20055",
    email: "ashok.deshmukh58@gmail.com",
    address: "89, Aundh, Pune, Maharashtra",
    bloodGroup: "O+",
    maritalStatus: "married",
    occupation: "Retired Civil Engineer",
    nationality: "Indian",
    notes: "Post-cardiac rehab review",
    emergencyContact: { name: "Sunita Deshmukh", phone: "+91 98765 20056", relation: "Spouse" },
    status: "active",
    isDeleted: false,
    deletedAt: null,
  },
  {
    patientId: "PAT-1029",
    name: "Rinku Solanki",
    dateOfBirth: new Date("2000-11-29"),
    gender: "female",
    phone: "+91 98765 20057",
    email: null,
    address: "15, Tonk Road, Jaipur, Rajasthan",
    bloodGroup: "B+",
    maritalStatus: "single",
    occupation: "Student",
    nationality: "Indian",
    notes: "Migraine OPD checkup",
    emergencyContact: { name: "Devendra Solanki", phone: "+91 98765 20058", relation: "Father" },
    status: "active",
    isDeleted: false,
    deletedAt: null,
  },
  {
    patientId: "PAT-1030",
    name: "Manish Tripathi",
    dateOfBirth: new Date("1984-06-15"),
    gender: "male",
    phone: "+91 98765 20059",
    email: "manish.tripathi84@gmail.com",
    address: "12, Sigra, Varanasi, Uttar Pradesh",
    bloodGroup: "A+",
    maritalStatus: "married",
    occupation: "Pundit & Teacher",
    nationality: "Indian",
    notes: "Gastritis OPD consultation",
    emergencyContact: { name: "Shikha Tripathi", phone: "+91 98765 20060", relation: "Wife" },
    status: "active",
    isDeleted: false,
    deletedAt: null,
  },
  {
    patientId: "PAT-1031",
    name: "Komal Sen",
    dateOfBirth: new Date("1998-03-08"),
    gender: "female",
    phone: "+91 98765 20061",
    email: "komal.sen98@gmail.com",
    address: "23, Main Road, Ranchi, Jharkhand",
    bloodGroup: "O-",
    maritalStatus: "single",
    occupation: "Content Writer",
    nationality: "Indian",
    notes: "Eye strain & optic OPD consultation",
    emergencyContact: { name: "Anil Sen", phone: "+91 98765 20062", relation: "Father" },
    status: "active",
    isDeleted: false,
    deletedAt: null,
  },
  {
    patientId: "PAT-1032",
    name: "Bhupendra Upadhyay",
    dateOfBirth: new Date("1975-07-21"),
    gender: "male",
    phone: "+91 98765 20063",
    email: null,
    address: "56, Lanka, Varanasi, Uttar Pradesh",
    bloodGroup: "B-",
    maritalStatus: "married",
    occupation: "Farmer",
    nationality: "Indian",
    notes: "Joint pain & rheumatism treatment",
    emergencyContact: { name: "Saroj Upadhyay", phone: "+91 98765 20064", relation: "Wife" },
    status: "active",
    isDeleted: false,
    deletedAt: null,
  },
  {
    patientId: "PAT-1033",
    name: "Arvind Chawla",
    dateOfBirth: new Date("1968-12-14"),
    gender: "male",
    phone: "+91 98765 20065",
    email: "arvind.chawla68@gmail.com",
    address: "E-14, Model Town, New Delhi, Delhi",
    bloodGroup: "AB+",
    maritalStatus: "married",
    occupation: "University Professor",
    nationality: "Indian",
    notes: "Diabetic neuropathy evaluation",
    emergencyContact: { name: "Neelu Chawla", phone: "+91 98765 20066", relation: "Wife" },
    status: "active",
    isDeleted: false,
    deletedAt: null,
  },
  {
    patientId: "PAT-1034",
    name: "Ritu Somani",
    dateOfBirth: new Date("1991-08-19"),
    gender: "female",
    phone: "+91 98765 20067",
    email: "ritu.somani91@gmail.com",
    address: "45, Vijay Nagar, Indore, Madhya Pradesh",
    bloodGroup: "A+",
    maritalStatus: "married",
    occupation: "Nutritionist",
    nationality: "Indian",
    notes: "Prenatal health checkup",
    emergencyContact: { name: "Gaurav Somani", phone: "+91 98765 20068", relation: "Husband" },
    status: "active",
    isDeleted: false,
    deletedAt: null,
  },
  {
    patientId: "PAT-1035",
    name: "Sunil Menon",
    dateOfBirth: new Date("1980-05-31"),
    gender: "male",
    phone: "+91 98765 20069",
    email: "sunil.menon80@yahoo.com",
    address: "31, Kowdiar, Thiruvananthapuram, Kerala",
    bloodGroup: "O+",
    maritalStatus: "married",
    occupation: "Maritime Engineer",
    nationality: "Indian",
    notes: "Tropical fever checkup",
    emergencyContact: { name: "Anita Menon", phone: "+91 98765 20070", relation: "Spouse" },
    status: "active",
    isDeleted: false,
    deletedAt: null,
  },
  {
    patientId: "PAT-1036",
    name: "Geeta Prajapati",
    dateOfBirth: new Date("1987-11-25"),
    gender: "female",
    phone: "+91 98765 20071",
    email: null,
    address: "89, Alkapuri, Vadodara, Gujarat",
    bloodGroup: "B+",
    maritalStatus: "married",
    occupation: "Craftswoman",
    nationality: "Indian",
    notes: "Skin rash OPD consultation",
    emergencyContact: { name: "Mahesh Prajapati", phone: "+91 98765 20072", relation: "Husband" },
    status: "active",
    isDeleted: false,
    deletedAt: null,
  },
  {
    patientId: "PAT-1037",
    name: "Harish Rajput",
    dateOfBirth: new Date("1993-09-04"),
    gender: "male",
    phone: "+91 98765 20073",
    email: "harish.rajput93@gmail.com",
    address: "23, City Center, Gwalior, Madhya Pradesh",
    bloodGroup: "A-",
    maritalStatus: "single",
    occupation: "Fitness Trainer",
    nationality: "Indian",
    notes: "Shoulder dislocation follow-up",
    emergencyContact: { name: "Balwant Rajput", phone: "+91 98765 20074", relation: "Father" },
    status: "active",
    isDeleted: false,
    deletedAt: null,
  },
  {
    patientId: "PAT-1038",
    name: "Suman Choudhury",
    dateOfBirth: new Date("1974-02-16"),
    gender: "female",
    phone: "+91 98765 20075",
    email: "suman.choudhury74@gmail.com",
    address: "55, Dispur, Guwahati, Assam",
    bloodGroup: "O-",
    maritalStatus: "married",
    occupation: "High School Principal",
    nationality: "Indian",
    notes: "Hypertension monitoring",
    emergencyContact: { name: "Prabin Choudhury", phone: "+91 98765 20076", relation: "Husband" },
    status: "active",
    isDeleted: false,
    deletedAt: null,
  },
  {
    patientId: "PAT-1039",
    name: "Vinod Rawat",
    dateOfBirth: new Date("1989-10-12"),
    gender: "male",
    phone: "+91 98765 20077",
    email: null,
    address: "67, Rajpur Road, Dehradun, Uttarakhand",
    bloodGroup: "AB+",
    maritalStatus: "married",
    occupation: "Hotel Manager",
    nationality: "Indian",
    notes: "Lumbago OPD treatment",
    emergencyContact: { name: "Pooja Rawat", phone: "+91 98765 20078", relation: "Wife" },
    status: "active",
    isDeleted: false,
    deletedAt: null,
  },
  {
    patientId: "PAT-1040",
    name: "Anita Bansal",
    dateOfBirth: new Date("1982-07-28"),
    gender: "female",
    phone: "+91 98765 20079",
    email: "anita.bansal82@gmail.com",
    address: "14, Urban Estate, Hisar, Haryana",
    bloodGroup: "B-",
    maritalStatus: "married",
    occupation: "Bank Accountant",
    nationality: "Indian",
    notes: "Anaemia treatment follow-up",
    emergencyContact: { name: "Rakesh Bansal", phone: "+91 98765 20080", relation: "Husband" },
    status: "active",
    isDeleted: false,
    deletedAt: null,
  },
  {
    patientId: "PAT-1041",
    name: "Brijesh Bhardwaj",
    dateOfBirth: new Date("1967-04-03"),
    gender: "male",
    phone: "+91 98765 20081",
    email: "brijesh.bhardwaj67@gmail.com",
    address: "34, Dwarka Sector 10, New Delhi, Delhi",
    bloodGroup: "O+",
    maritalStatus: "married",
    occupation: "Senior Advocate",
    nationality: "Indian",
    notes: "Routine health screening",
    emergencyContact: { name: "Sushma Bhardwaj", phone: "+91 98765 20082", relation: "Wife" },
    status: "active",
    isDeleted: false,
    deletedAt: null,
  },
  {
    patientId: "PAT-1042",
    name: "Baby Anvi Verma",
    dateOfBirth: new Date("2021-09-18"),
    gender: "female",
    phone: "+91 98765 20083",
    email: null,
    address: "14, Civil Lines, Mathura, Uttar Pradesh",
    bloodGroup: "A+",
    maritalStatus: "single",
    occupation: null,
    nationality: "Indian",
    notes: "Pediatric vaccination schedule",
    emergencyContact: { name: "Rajesh Kumar", phone: "+91 98765 20001", relation: "Father" },
    status: "active",
    isDeleted: false,
    deletedAt: null,
  },
  {
    patientId: "PAT-1043",
    name: "Master Kabir Sharma",
    dateOfBirth: new Date("2018-06-22"),
    gender: "male",
    phone: "+91 98765 20084",
    email: null,
    address: "402, Bandra West, Mumbai, Maharashtra",
    bloodGroup: "B+",
    maritalStatus: "single",
    occupation: "Student",
    nationality: "Indian",
    notes: "Pediatric fever OPD checkup",
    emergencyContact: { name: "Priya Sharma", phone: "+91 98765 20003", relation: "Mother" },
    status: "active",
    isDeleted: false,
    deletedAt: null,
  },
  {
    patientId: "PAT-1044",
    name: "Jaspreet Kaur",
    dateOfBirth: new Date("1991-11-15"),
    gender: "female",
    phone: "+91 98765 20085",
    email: "jaspreet.kaur91@gmail.com",
    address: "12, Sector 17, Chandigarh, Punjab",
    bloodGroup: "O+",
    maritalStatus: "married",
    occupation: "IT Analyst",
    nationality: "Indian",
    notes: "Endocrinology consultation",
    emergencyContact: { name: "Gurpreet Singh", phone: "+91 98765 20086", relation: "Husband" },
    status: "active",
    isDeleted: false,
    deletedAt: null,
  },
  {
    patientId: "PAT-1045",
    name: "Kiran Mazumdar",
    dateOfBirth: new Date("1984-01-30"),
    gender: "other",
    phone: "+91 98765 20087",
    email: "kiran.m84@gmail.com",
    address: "88, Park Street, Kolkata, West Bengal",
    bloodGroup: "AB+",
    maritalStatus: "single",
    occupation: "Social Worker",
    nationality: "Indian",
    notes: "General physical consultation",
    emergencyContact: { name: "Swapan Mazumdar", phone: "+91 98765 20088", relation: "Brother" },
    status: "active",
    isDeleted: false,
    deletedAt: null,
  },
  {
    patientId: "PAT-1046",
    name: "Tarun Gill",
    dateOfBirth: new Date("1996-08-11"),
    gender: "male",
    phone: "+91 98765 20089",
    email: null,
    address: "77, NIT 3, Faridabad, Haryana",
    bloodGroup: "A-",
    maritalStatus: "single",
    occupation: "Delivery Partner",
    nationality: "Indian",
    notes: "Accidental ankle sprain treatment",
    emergencyContact: { name: "Manjeet Gill", phone: "+91 98765 20090", relation: "Brother" },
    status: "active",
    isDeleted: false,
    deletedAt: null,
  },
  {
    patientId: "PAT-1047",
    name: "Shyam Sundar",
    dateOfBirth: new Date("1948-10-09"),
    gender: "male",
    phone: "+91 98765 20091",
    email: "shyam.sundar48@gmail.com",
    address: "22, Civil Lines, Mathura, Uttar Pradesh",
    bloodGroup: "O+",
    maritalStatus: "widowed",
    occupation: "Retired Teacher",
    nationality: "Indian",
    notes: "Cataract & geriatric screening",
    emergencyContact: { name: "Ramesh Chand", phone: "+91 98765 20034", relation: "Son" },
    status: "inactive",
    isDeleted: false,
    deletedAt: null,
  },

  // 48-50 SOFT DELETED PATIENTS FOR TESTING
  {
    patientId: "PAT-1048",
    name: "Archana Shukla (Archived)",
    dateOfBirth: new Date("1985-05-20"),
    gender: "female",
    phone: "+91 98765 20092",
    email: "archana.shukla85@gmail.com",
    address: "90, Sector 18, Noida, Uttar Pradesh",
    bloodGroup: "B+",
    maritalStatus: "married",
    occupation: "Software Engineer",
    nationality: "Indian",
    notes: "Duplicate patient registration soft deleted",
    emergencyContact: { name: "Alok Shukla", phone: "+91 98765 20093", relation: "Husband" },
    status: "inactive",
    isDeleted: true,
    deletedAt: new Date("2025-05-15T10:30:00Z"),
  },
  {
    patientId: "PAT-1049",
    name: "Siddharth Malhotra (Archived)",
    dateOfBirth: new Date("1992-12-04"),
    gender: "male",
    phone: "+91 98765 20094",
    email: "siddharth.m92@gmail.com",
    address: "56, Sector 14, Gurugram, Haryana",
    bloodGroup: "O+",
    maritalStatus: "single",
    occupation: "Analyst",
    nationality: "Indian",
    notes: "Cancelled registration record",
    emergencyContact: { name: "Rajesh Malhotra", phone: "+91 98765 20095", relation: "Father" },
    status: "inactive",
    isDeleted: true,
    deletedAt: new Date("2025-05-20T14:15:00Z"),
  },
  {
    patientId: "PAT-1050",
    name: "Neelam Kapoor (Archived)",
    dateOfBirth: new Date("1977-03-29"),
    gender: "female",
    phone: "+91 98765 20096",
    email: "neelam.kapoor77@yahoo.com",
    address: "12, Rohini Sector 9, New Delhi, Delhi",
    bloodGroup: "A-",
    maritalStatus: "married",
    occupation: "Boutique Owner",
    nationality: "Indian",
    notes: "Merged patient file record",
    emergencyContact: { name: "Rajiv Kapoor", phone: "+91 98765 20097", relation: "Husband" },
    status: "inactive",
    isDeleted: true,
    deletedAt: new Date("2025-05-25T16:45:00Z"),
  },
];

const seedDatabase = async () => {
  try {
    // 1. Connect to MongoDB
    console.log("Connecting to database...");
    await connectDB();

    // 2. Generate and seed Permissions
    console.log("Seeding permissions...");
    const permissionOps = [];

    for (const resource of Object.values(RESOURCES)) {
      for (const action of Object.values(ACTIONS)) {
        const name = `${resource}:${action}`;
        permissionOps.push({
          updateOne: {
            filter: { resource, action },
            update: {
              $set: { name, resource, action },
              $setOnInsert: { description: `Allows ${action} action on ${resource} resource` }
            },
            upsert: true,
          },
        });
      }
    }

    if (permissionOps.length > 0) {
      const result = await Permission.bulkWrite(permissionOps);
      console.log(`Permissions seeded/updated. Matched: ${result.matchedCount}, Upserted: ${result.upsertedCount}`);
    }

    // Fetch all permission IDs for mapping
    const allPermissions = await Permission.find({});
    const allPermissionIds = allPermissions.map((p) => p._id);

    // Seed System Roles with synchronized modulePermissions & actionPermissions
    console.log("Seeding system roles...");

    const DEFAULT_ROLE_PERMISSIONS_SEED = {
      SUPER_ADMIN: {
        modulePermissions: {
          Patient: "Full Access", Doctor: "Full Access", Appointment: "Full Access", Billing: "Full Access", Pharmacy: "Full Access", Laboratory: "Full Access", Radiology: "Full Access", Inventory: "Full Access", User: "Full Access", Role: "Full Access", "Audit Log": "Full Access",
          "Patient Management": "Full Access", "OPD Management": "Full Access", "IPD Management": "Full Access", Prescriptions: "Full Access", "Billing & Invoicing": "Full Access", "User Management": "Full Access", Reports: "Full Access"
        },
        actionPermissions: {
          "Patient Management": { create: true, read: true, update: true, delete: true, manage: true },
          "OPD Management": { create: true, read: true, update: true, delete: true, manage: true },
          "IPD Management": { create: true, read: true, update: true, delete: true, manage: true },
          Prescriptions: { create: true, read: true, update: true, delete: true, manage: true },
          Laboratory: { create: true, read: true, update: true, delete: true, manage: true },
          Radiology: { create: true, read: true, update: true, delete: true, manage: true },
          "Billing & Invoicing": { create: true, read: true, update: true, delete: true, manage: true },
          Pharmacy: { create: true, read: true, update: true, delete: true, manage: true },
          "User Management": { create: true, read: true, update: true, delete: true, manage: true },
          Reports: { create: true, read: true, update: true, delete: true, manage: true },
          "Audit Log": { create: true, read: true, update: true, delete: true, manage: true }
        }
      },
      ADMIN: {
        modulePermissions: {
          Patient: "Full Access", Doctor: "Full Access", Appointment: "Full Access", Billing: "Full Access", Pharmacy: "Full Access", Laboratory: "Full Access", Radiology: "Full Access", Inventory: "Full Access", User: "Full Access", Role: "Full Access", "Audit Log": "Full Access",
          "Patient Management": "Full Access", "OPD Management": "Full Access", "IPD Management": "Full Access", Prescriptions: "Full Access", "Billing & Invoicing": "Full Access", "User Management": "Full Access", Reports: "Full Access"
        },
        actionPermissions: {
          "Patient Management": { create: true, read: true, update: true, delete: true, manage: true },
          "OPD Management": { create: true, read: true, update: true, delete: true, manage: true },
          "IPD Management": { create: true, read: true, update: true, delete: true, manage: true },
          Prescriptions: { create: true, read: true, update: true, delete: true, manage: true },
          Laboratory: { create: true, read: true, update: true, delete: true, manage: true },
          Radiology: { create: true, read: true, update: true, delete: true, manage: true },
          "Billing & Invoicing": { create: true, read: true, update: true, delete: true, manage: true },
          Pharmacy: { create: true, read: true, update: true, delete: true, manage: true },
          "User Management": { create: true, read: true, update: true, delete: true, manage: true },
          Reports: { create: true, read: true, update: true, delete: true, manage: true },
          "Audit Log": { create: true, read: true, update: true, delete: true, manage: true }
        }
      },
      DOCTOR: {
        modulePermissions: {
          Patient: "Limited Access", Doctor: "Full Access", Appointment: "Limited Access", Billing: "Read Only", Pharmacy: "No Access", Laboratory: "Read Only", Radiology: "Read Only", Inventory: "No Access", User: "No Access", Role: "No Access", "Audit Log": "Read Only",
          "Patient Management": "Limited Access", "OPD Management": "Limited Access", "IPD Management": "Limited Access", Prescriptions: "Full Access", "Billing & Invoicing": "Read Only", "User Management": "No Access", Reports: "Read Only"
        },
        actionPermissions: {
          "Patient Management": { create: false, read: true, update: true, delete: false, manage: false },
          "OPD Management": { create: true, read: true, update: true, delete: false, manage: false },
          "IPD Management": { create: true, read: true, update: true, delete: false, manage: false },
          Prescriptions: { create: true, read: true, update: true, delete: true, manage: false },
          Laboratory: { create: false, read: true, update: false, delete: false, manage: false },
          Radiology: { create: false, read: true, update: false, delete: false, manage: false },
          "Billing & Invoicing": { create: false, read: true, update: false, delete: false, manage: false },
          Pharmacy: { create: false, read: false, update: false, delete: false, manage: false },
          "User Management": { create: false, read: false, update: false, delete: false, manage: false },
          Reports: { create: false, read: true, update: false, delete: false, manage: false },
          "Audit Log": { create: false, read: true, update: false, delete: false, manage: false }
        }
      },
      PATIENT: {
        modulePermissions: {
          Patient: "Limited Access", Doctor: "Read Only", Appointment: "Limited Access", Billing: "Read Only", Pharmacy: "No Access", Laboratory: "Read Only", Radiology: "Read Only", Inventory: "No Access", User: "No Access", Role: "No Access", "Audit Log": "Read Only",
          "Patient Management": "Limited Access", "OPD Management": "Limited Access", "IPD Management": "Limited Access", Prescriptions: "Limited Access", "Billing & Invoicing": "Read Only", "User Management": "No Access", Reports: "Read Only"
        },
        actionPermissions: {
          "Patient Management": { create: false, read: true, update: true, delete: false, manage: false },
          "OPD Management": { create: true, read: true, update: true, delete: false, manage: false },
          "IPD Management": { create: true, read: true, update: true, delete: false, manage: false },
          Prescriptions: { create: true, read: true, update: true, delete: true, manage: false },
          Laboratory: { create: false, read: true, update: false, delete: false, manage: false },
          Radiology: { create: false, read: true, update: false, delete: false, manage: false },
          "Billing & Invoicing": { create: false, read: true, update: false, delete: false, manage: false },
          Pharmacy: { create: false, read: false, update: false, delete: false, manage: false },
          "User Management": { create: false, read: false, update: false, delete: false, manage: false },
          Reports: { create: false, read: true, update: false, delete: false, manage: false },
          "Audit Log": { create: false, read: true, update: false, delete: false, manage: false }
        }
      },
      NURSE: {
        modulePermissions: {
          Patient: "Full Access", Doctor: "Read Only", Appointment: "Limited Access", Billing: "No Access", Pharmacy: "No Access", Laboratory: "Read Only", Radiology: "Read Only", Inventory: "No Access", User: "No Access", Role: "No Access", "Audit Log": "No Access",
          "Patient Management": "Full Access", "OPD Management": "Limited Access", "IPD Management": "Full Access", Prescriptions: "Read Only", "Billing & Invoicing": "No Access", "User Management": "No Access", Reports: "Read Only"
        },
        actionPermissions: {
          "Patient Management": { create: true, read: true, update: true, delete: false, manage: false },
          "OPD Management": { create: false, read: true, update: true, delete: false, manage: false },
          "IPD Management": { create: true, read: true, update: true, delete: false, manage: false },
          Prescriptions: { create: false, read: true, update: false, delete: false, manage: false },
          Laboratory: { create: false, read: true, update: false, delete: false, manage: false },
          Radiology: { create: false, read: true, update: false, delete: false, manage: false },
          "Billing & Invoicing": { create: false, read: false, update: false, delete: false, manage: false },
          Pharmacy: { create: false, read: false, update: false, delete: false, manage: false },
          "User Management": { create: false, read: false, update: false, delete: false, manage: false },
          Reports: { create: false, read: true, update: false, delete: false, manage: false },
          "Audit Log": { create: false, read: false, update: false, delete: false, manage: false }
        }
      },
      RECEPTIONIST: {
        modulePermissions: {
          Patient: "Full Access", Doctor: "Read Only", Appointment: "Full Access", Billing: "Read Only", Pharmacy: "No Access", Laboratory: "No Access", Radiology: "No Access", Inventory: "No Access", User: "No Access", Role: "No Access", "Audit Log": "No Access",
          "Patient Management": "Full Access", "OPD Management": "Full Access", "IPD Management": "Read Only", Prescriptions: "No Access", "Billing & Invoicing": "Read Only", "User Management": "No Access", Reports: "Read Only"
        },
        actionPermissions: {
          "Patient Management": { create: true, read: true, update: true, delete: false, manage: false },
          "OPD Management": { create: true, read: true, update: true, delete: false, manage: false },
          "IPD Management": { create: false, read: true, update: false, delete: false, manage: false },
          Prescriptions: { create: false, read: false, update: false, delete: false, manage: false },
          Laboratory: { create: false, read: false, update: false, delete: false, manage: false },
          Radiology: { create: false, read: false, update: false, delete: false, manage: false },
          "Billing & Invoicing": { create: false, read: true, update: false, delete: false, manage: false },
          Pharmacy: { create: false, read: false, update: false, delete: false, manage: false },
          "User Management": { create: false, read: false, update: false, delete: false, manage: false },
          Reports: { create: false, read: true, update: false, delete: false, manage: false },
          "Audit Log": { create: false, read: false, update: false, delete: false, manage: false }
        }
      },
      ACCOUNTANT: {
        modulePermissions: {
          Patient: "Read Only", Doctor: "No Access", Appointment: "Read Only", Billing: "Full Access", Pharmacy: "Read Only", Laboratory: "No Access", Radiology: "No Access", Inventory: "No Access", User: "No Access", Role: "No Access", "Audit Log": "Read Only",
          "Patient Management": "Read Only", "OPD Management": "Read Only", "IPD Management": "Read Only", Prescriptions: "No Access", "Billing & Invoicing": "Full Access", "User Management": "No Access", Reports: "Full Access"
        },
        actionPermissions: {
          "Patient Management": { create: false, read: true, update: false, delete: false, manage: false },
          "OPD Management": { create: false, read: true, update: false, delete: false, manage: false },
          "IPD Management": { create: false, read: true, update: false, delete: false, manage: false },
          Prescriptions: { create: false, read: false, update: false, delete: false, manage: false },
          Laboratory: { create: false, read: false, update: false, delete: false, manage: false },
          Radiology: { create: false, read: false, update: false, delete: false, manage: false },
          "Billing & Invoicing": { create: true, read: true, update: true, delete: true, manage: true },
          Pharmacy: { create: false, read: true, update: false, delete: false, manage: false },
          "User Management": { create: false, read: false, update: false, delete: false, manage: false },
          Reports: { create: true, read: true, update: false, delete: false, manage: false },
          "Audit Log": { create: false, read: true, update: false, delete: false, manage: false }
        }
      },
      PHARMACIST: {
        modulePermissions: {
          Patient: "Read Only", Doctor: "Read Only", Appointment: "No Access", Billing: "Read Only", Pharmacy: "Full Access", Laboratory: "No Access", Radiology: "No Access", Inventory: "Full Access", User: "No Access", Role: "No Access", "Audit Log": "No Access",
          "Patient Management": "Read Only", "OPD Management": "No Access", "IPD Management": "No Access", Prescriptions: "Read Only", "Billing & Invoicing": "Read Only", "User Management": "No Access", Reports: "Read Only"
        },
        actionPermissions: {
          "Patient Management": { create: false, read: true, update: false, delete: false, manage: false },
          "OPD Management": { create: false, read: false, update: false, delete: false, manage: false },
          "IPD Management": { create: false, read: false, update: false, delete: false, manage: false },
          Prescriptions: { create: false, read: true, update: false, delete: false, manage: false },
          Laboratory: { create: false, read: false, update: false, delete: false, manage: false },
          Radiology: { create: false, read: false, update: false, delete: false, manage: false },
          "Billing & Invoicing": { create: false, read: true, update: false, delete: false, manage: false },
          Pharmacy: { create: true, read: true, update: true, delete: true, manage: true },
          "User Management": { create: false, read: false, update: false, delete: false, manage: false },
          Reports: { create: false, read: true, update: false, delete: false, manage: false },
          "Audit Log": { create: false, read: false, update: false, delete: false, manage: false }
        }
      }
    };

    // Seed SUPER_ADMIN role with ALL permissions
    const superAdminRole = await Role.findOneAndUpdate(
      { name: ROLES.SUPER_ADMIN },
      {
        name: ROLES.SUPER_ADMIN,
        description: "Super Administrator with full access to all system resources",
        permissionIds: allPermissionIds,
        modulePermissions: DEFAULT_ROLE_PERMISSIONS_SEED.SUPER_ADMIN.modulePermissions,
        actionPermissions: DEFAULT_ROLE_PERMISSIONS_SEED.SUPER_ADMIN.actionPermissions,
        isSystemRole: true,
        status: "active",
      },
      { upsert: true, returnDocument: "after" }
    );
    console.log("SUPER_ADMIN role created/updated with full permissions.");

    // Seed other system roles with complete module & action permissions
    for (const roleName of Object.values(ROLES)) {
      if (roleName === ROLES.SUPER_ADMIN) continue;

      const permPreset = DEFAULT_ROLE_PERMISSIONS_SEED[roleName] || DEFAULT_ROLE_PERMISSIONS_SEED.SUPER_ADMIN;

      await Role.findOneAndUpdate(
        { name: roleName },
        {
          name: roleName,
          description: `${roleName.charAt(0) + roleName.slice(1).toLowerCase().replace("_", " ")} role`,
          permissionIds: [],
          modulePermissions: permPreset.modulePermissions,
          actionPermissions: permPreset.actionPermissions,
          isSystemRole: true,
          status: "active",
        },
        { upsert: true }
      );
      console.log(`System role ${roleName} seeded with permissions.`);
    }

    // Create Map of Role Names to Role ObjectIds
    const dbRoles = await Role.find({});
    const roleMap = new Map();
    dbRoles.forEach((r) => roleMap.set(r.name, r._id));

    // 4. Seed Super Admin User
    console.log("Seeding Super Admin user...");
    const superAdminEmail = process.env.SUPERADMIN_EMAIL || "admin@gmail.com";
    const superAdminPassword = process.env.SUPERADMIN_PASSWORD || "admin123";

    let superAdminUser = await User.findOne({ email: superAdminEmail });

    if (!superAdminUser) {
      superAdminUser = await User.create({
        name: "Super Admin",
        email: superAdminEmail,
        password: superAdminPassword,
        roleId: superAdminRole._id,
        roleName: ROLES.SUPER_ADMIN,
        isVerified: true,
        status: "active",
      });
      console.log(`Super Admin user created successfully! (${superAdminEmail})`);
    } else {
      superAdminUser.roleId = superAdminRole._id;
      superAdminUser.roleName = ROLES.SUPER_ADMIN;
      superAdminUser.password = superAdminPassword;
      superAdminUser.isVerified = true;
      superAdminUser.status = "active";
      await superAdminUser.save();
      console.log(`Super Admin user updated successfully! (${superAdminEmail})`);
    }

    // 5. Seed Initial Departments
    console.log("Seeding initial departments...");
    const initialDepartments = [
      { name: "Cardiology", code: "CARD", description: "Heart & Cardiovascular Care" },
      { name: "Neurology", code: "NEUR", description: "Brain & Nervous System Care" },
      { name: "Orthopedics", code: "ORTH", description: "Bone & Joint Healthcare" },
      { name: "Pediatrics", code: "PEDI", description: "Child & Infant Healthcare" },
      { name: "General Medicine", code: "GENM", description: "General & Primary Care" },
      { name: "Emergency Medicine", code: "EMER", description: "24/7 Emergency Care" },
      { name: "Dermatology", code: "DERM", description: "Skin & Cosmetology" },
      { name: "Radiology", code: "RADI", description: "Diagnostic Imaging & Radiology" },
      { name: "Gynecology", code: "GYNE", description: "Maternal & Women's Health" },
      { name: "ENT", code: "ENT", description: "Ear, Nose & Throat Care" },
      { name: "Pathology", code: "PATH", description: "Diagnostic Lab Pathology" },
      { name: "Pharmacy", code: "PHAR", description: "Medicine & Prescriptions" },
      { name: "Administration", code: "ADMIN", description: "Hospital Management & Admin" },
      { name: "Reception", code: "RECP", description: "Front Office & Patient Intake" },
      { name: "Accounts", code: "ACCT", description: "Billing & Finance" },
      { name: "General", code: "GEN", description: "General Patient Care" },
    ];

    const departmentMap = new Map();
    for (const dept of initialDepartments) {
      const doc = await Department.findOneAndUpdate(
        { code: dept.code },
        { ...dept, status: "active" },
        { upsert: true, new: true }
      );
      departmentMap.set(dept.name, doc);
    }
    console.log("Initial departments seeded.");

    // Fallback default department
    const defaultDepartment = departmentMap.get("General Medicine") || Array.from(departmentMap.values())[0];

    // 6. Seed 50 Realistic Production-Grade Users & 24 Doctors
    console.log(`Seeding exactly ${sample50Users.length} realistic User records...`);
    let userInsertedCount = 0;
    let userUpdatedCount = 0;
    let doctorInsertedCount = 0;
    let doctorUpdatedCount = 0;

    for (const uData of sample50Users) {
      const { doctorMeta, ...userData } = uData;
      const targetRoleId = roleMap.get(userData.roleName) || superAdminRole._id;

      let userObj = await User.findOne({
        $or: [{ email: userData.email }, { employeeId: userData.employeeId }],
      });

      if (!userObj) {
        userObj = await User.create({
          ...userData,
          roleId: targetRoleId,
        });
        userInsertedCount++;
      } else {
        userObj.roleId = targetRoleId;
        userObj.name = userData.name;
        userObj.username = userData.username;
        userObj.roleName = userData.roleName;
        userObj.department = userData.department;
        userObj.designation = userData.designation;
        userObj.employeeId = userData.employeeId;
        userObj.phone = userData.phone;
        userObj.countryCode = userData.countryCode;
        userObj.dateOfBirth = userData.dateOfBirth;
        userObj.gender = userData.gender;
        userObj.bloodGroup = userData.bloodGroup;
        userObj.maritalStatus = userData.maritalStatus;
        userObj.nationality = userData.nationality;
        userObj.currentAddress = userData.currentAddress;
        userObj.joiningDate = userData.joiningDate;
        userObj.isProfileComplete = userData.isProfileComplete;
        userObj.status = userData.status;
        userObj.emailVerified = userData.emailVerified;
        userObj.loginAccess = userData.loginAccess;
        userObj.forcePasswordChange = userData.forcePasswordChange;
        userObj.sendWelcomeEmail = userData.sendWelcomeEmail;
        userObj.notes = userData.notes;
        userObj.isVerified = userData.isVerified;
        userObj.authProvider = userData.authProvider;
        if (userData.firebaseUid) userObj.firebaseUid = userData.firebaseUid;
        
        await userObj.save();
        userUpdatedCount++;
      }

      // If Doctor User, Seed corresponding Doctor document
      if (userData.roleName === "DOCTOR" && doctorMeta) {
        const deptDoc = departmentMap.get(userData.department) || defaultDepartment;

        let existingDoctor = await Doctor.findOne({
          $or: [{ userId: userObj._id }, { doctorId: userData.employeeId }],
        });

        const docPayload = {
          userId: userObj._id,
          doctorId: userData.employeeId,
          departmentId: deptDoc._id,
          specialization: doctorMeta.specialization,
          qualification: doctorMeta.qualification,
          experience: doctorMeta.experience,
          consultationFee: doctorMeta.consultationFee,
          availability: doctorMeta.availability,
          additionalInfo: userData.notes,
          photoUrl: userData.avatar || null,
          status: userData.status === "active" ? "active" : "inactive",
        };

        if (!existingDoctor) {
          await Doctor.create(docPayload);
          doctorInsertedCount++;
        } else {
          await Doctor.findOneAndUpdate(
            { _id: existingDoctor._id },
            docPayload,
            { runValidators: true }
          );
          doctorUpdatedCount++;
        }
      }
    }

    // 7. Seed 50 Realistic Production-Grade Patients
    console.log(`Seeding exactly ${sample50Patients.length} realistic Patient records...`);
    let patientInsertedCount = 0;
    let patientUpdatedCount = 0;

    const nowForPatients = new Date();
    let pIdx = 0;
    for (const pData of sample50Patients) {
      // Spread Patient registration dates realistically across last 7 days (6 to 0 days ago)
      const daysAgo = 6 - (pIdx % 7);
      const patientCreatedAt = new Date(nowForPatients.getTime() - daysAgo * 24 * 3600 * 1000 - (pIdx * 13 * 60 * 1000));

      let existingPatient = await Patient.findOne({ patientId: pData.patientId });

      if (!existingPatient) {
        await Patient.create({ ...pData, createdAt: patientCreatedAt, updatedAt: patientCreatedAt });
        patientInsertedCount++;
      } else {
        await Patient.collection.updateOne(
          { patientId: pData.patientId },
          { $set: { ...pData, createdAt: patientCreatedAt, updatedAt: patientCreatedAt } }
        );
        patientUpdatedCount++;
      }
      pIdx++;
    }

    // 8. Seed 120 Production-Grade Relationally Consistent Appointments
    console.log("Seeding realistic Appointment records...");
    const allDoctors = await Doctor.find({});
    const allPatients = await Patient.find({});

    if (allDoctors.length === 0 || allPatients.length === 0) {
      throw new Error("Cannot seed appointments: Doctors or Patients missing in database.");
    }

    const dayNameMap = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
    const baseDate = new Date("2026-09-09T00:00:00.000Z");

    const apptReasons = {
      Cardiology: ["Routine cardiac check-up", "Chest discomfort evaluation", "BP follow-up", "Echocardiogram review", "Post-angioplasty consultation"],
      Neurology: ["Migraine & chronic headache", "Dizziness and vertigo check", "Neuro-pathway evaluation", "Epilepsy follow-up", "Memory loss assessment"],
      Orthopedics: ["Knee joint pain", "Lower back pain consultation", "Post-fracture stiffness", "Shoulder mobility review", "Arthritis management"],
      Pediatrics: ["Childhood vaccination & growth", "Pediatric seasonal fever", "Asthma and wheezing check", "Nutritional assessment", "Infant colic & rash"],
      "General Medicine": ["Fever and general fatigue", "Diabetes HbA1c review", "Hypertension monitoring", "Seasonal allergy & cold", "Abdominal discomfort"],
      Dermatology: ["Skin allergy and itching", "Acne & facial eczema", "Psoriasis follow-up", "Scalp hair loss consultation", "Skin pigmentation review"],
      "Emergency Medicine": ["Acute abdominal pain", "High fever spike", "Mild head injury assessment", "Dehydration & weakness", "Sprain & minor trauma"],
      Radiology: ["Ultrasound report discussion", "CT Scan review", "X-Ray imaging consultation", "MRI spine evaluation", "Mammogram follow-up"],
      Gynecology: ["Routine antenatal check-up", "PCOD consultation", "Menstrual irregularity", "Post-partum health review", "Pelvic pain evaluation"],
      ENT: ["Throat infection & tonsillitis", "Ear pain and discharge", "Nasal blockage & sinusitis", "Hearing difficulty evaluation", "Voice hoarseness review"],
      Pathology: ["Blood report interpretation", "Thyroid profile review", "Lipid profile consultation", "CBC & Hb analysis", "Urine routine assessment"],
    };

    const cancelledReasonsList = [
      "Patient requested cancellation due to travel",
      "Doctor had emergency surgical duty",
      "Patient feeling better, cancelled visit",
      "Appointment rescheduled to next week",
      "Duplicate booking by mistake",
      "Personal emergency at patient end",
    ];

    const generatedAppointments = [];
    let apptSeq = 1001;
    const doctorBookedSlots = new Map();

    const TARGET_APPOINTMENTS = 120;
    let attempts = 0;
    let patientIndex = 0;

    while (generatedAppointments.length < TARGET_APPOINTMENTS && attempts < 3000) {
      attempts++;

      const doctor = allDoctors[generatedAppointments.length % allDoctors.length];
      if (!doctor.availability || doctor.availability.length === 0) continue;

      const avail = doctor.availability[attempts % doctor.availability.length];
      const targetDayName = avail.day;

      let chosenDate = null;
      // Search offset in [-14 .. +14] days around baseDate (2026-09-09)
      for (let offset = -14; offset <= 14; offset++) {
        const candidateDate = new Date(baseDate);
        candidateDate.setDate(baseDate.getDate() + offset);

        if (dayNameMap[candidateDate.getDay()] === targetDayName) {
          const dateStr = candidateDate.toISOString().slice(0, 10);
          const docKey = `${doctor._id}_${dateStr}`;
          const bookedSet = doctorBookedSlots.get(docKey) || new Set();

          const [sH, sM] = avail.startTime.split(":").map(Number);
          const [eH, eM] = avail.endTime.split(":").map(Number);
          const startMins = sH * 60 + sM;
          const endMins = eH * 60 + eM;

          for (let m = startMins; m + 30 <= endMins; m += 30) {
            const slotStartHH = String(Math.floor(m / 60)).padStart(2, "0");
            const slotStartMM = String(m % 60).padStart(2, "0");
            const slotTimeStr = `${slotStartHH}:${slotStartMM}`;

            if (!bookedSet.has(slotTimeStr)) {
              chosenDate = candidateDate;
              bookedSet.add(slotTimeStr);
              doctorBookedSlots.set(docKey, bookedSet);

              const slotEndHH = String(Math.floor((m + 30) / 60)).padStart(2, "0");
              const slotEndMM = String((m + 30) % 60).padStart(2, "0");
              const slotEndTimeStr = `${slotEndHH}:${slotEndMM}`;

              const patient = allPatients[patientIndex % allPatients.length];
              patientIndex++;

              const diffDays = Math.floor((candidateDate.getTime() - baseDate.getTime()) / (1000 * 3600 * 24));
              let status = "scheduled";
              let cancelledReason = null;

              if (diffDays < 0) {
                const rand = (generatedAppointments.length + attempts) % 10;
                if (rand < 7) status = "completed";
                else if (rand < 9) {
                  status = "cancelled";
                  cancelledReason = cancelledReasonsList[attempts % cancelledReasonsList.length];
                } else status = "no-show";
              } else if (diffDays === 0) {
                const rand = (generatedAppointments.length + attempts) % 10;
                if (rand < 2) status = "scheduled";
                else if (rand < 4) status = "checked_in";
                else if (rand < 6) status = "in_consultation";
                else if (rand < 8) status = "completed";
                else if (rand < 9) {
                  status = "cancelled";
                  cancelledReason = cancelledReasonsList[attempts % cancelledReasonsList.length];
                } else status = "no-show";
              } else {
                const rand = (generatedAppointments.length + attempts) % 10;
                if (rand < 9) status = "scheduled";
                else {
                  status = "cancelled";
                  cancelledReason = cancelledReasonsList[attempts % cancelledReasonsList.length];
                }
              }

              const spec = doctor.specialization || "General Medicine";
              const reasonPool = apptReasons[spec] || apptReasons["General Medicine"];
              const reason = reasonPool[generatedAppointments.length % reasonPool.length];

              generatedAppointments.push({
                appointmentId: `APT-${apptSeq++}`,
                patientId: patient._id,
                doctorId: doctor._id,
                departmentId: doctor.departmentId,
                appointmentDate: candidateDate,
                startTime: slotTimeStr,
                endTime: slotEndTimeStr,
                reason,
                status,
                notes: generatedAppointments.length % 3 === 0 ? `Follow-up recommended. ${reason}.` : null,
                cancelledReason: status === "cancelled" ? (cancelledReason || "Patient requested cancellation") : null,
                sendNotification: generatedAppointments.length % 5 !== 0,
              });

              break;
            }
          }
        }
        if (chosenDate) break;
      }
    }

    let appointmentInsertedCount = 0;
    let appointmentUpdatedCount = 0;

    for (const apptData of generatedAppointments) {
      let existingAppt = await Appointment.findOne({ appointmentId: apptData.appointmentId });
      if (!existingAppt) {
        await Appointment.create(apptData);
        appointmentInsertedCount++;
      } else {
        await Appointment.findOneAndUpdate({ appointmentId: apptData.appointmentId }, apptData, { runValidators: true });
        appointmentUpdatedCount++;
      }
    }

    // 9. Seed 100 Production-Grade OPD Visit Records (Appointment-Based & Walk-Ins)
    console.log("Seeding realistic OPD Visit records...");
    const dbAppointments = await Appointment.find({});

    const opdMedsPool = [
      { medicineName: "Tab Paracetamol 650mg", dosage: "1 tablet", frequency: "1-0-1 (After Food)", duration: "5 days", instructions: "Take with warm water" },
      { medicineName: "Cap Amoxicillin 500mg", dosage: "1 capsule", frequency: "1-1-1 (After Food)", duration: "7 days", instructions: "Complete full antibiotic course" },
      { medicineName: "Tab Pantoprazole 40mg", dosage: "1 tablet", frequency: "1-0-0 (Before Food)", duration: "10 days", instructions: "Take early morning on empty stomach" },
      { medicineName: "Tab Cetirizine 10mg", dosage: "1 tablet", frequency: "0-0-1 (Before Bed)", duration: "5 days", instructions: "May cause slight drowsiness" },
      { medicineName: "Syr Multivitamin 10ml", dosage: "10 ml", frequency: "1-0-1 (After Food)", duration: "14 days", instructions: "Shake well before use" },
      { medicineName: "Tab Ibuprofen 400mg", dosage: "1 tablet", frequency: "1-0-1 (After Food)", duration: "3 days", instructions: "Take only if severe joint pain" },
      { medicineName: "Tab Metformin 500mg", dosage: "1 tablet", frequency: "1-0-1 (With Food)", duration: "30 days", instructions: "Regular blood sugar monitoring advised" },
      { medicineName: "Tab Telmisartan 40mg", dosage: "1 tablet", frequency: "1-0-0 (Morning)", duration: "30 days", instructions: "Daily blood pressure log maintenance" },
    ];

    const generatedOPDVisits = [];
    let opdSeq = 1001;

    // A) 80 Appointment-based OPD Visits
    const apptSubset = dbAppointments.slice(0, 80);
    for (let i = 0; i < apptSubset.length; i++) {
      const appt = apptSubset[i];
      const isPast = new Date(appt.appointmentDate) < baseDate;

      let status = isPast ? "completed" : "in-progress";
      if (appt.status === "cancelled") status = "cancelled";

      const temperature = Number((98.0 + (i % 5) * 0.4).toFixed(1));
      const bpList = ["118/76", "120/80", "124/82", "130/85", "138/88"];
      const bloodPressure = bpList[i % bpList.length];
      const pulse = 70 + (i % 6) * 4;
      const weight = Number((52.0 + (i % 10) * 3.5).toFixed(1));
      const height = 155 + (i % 8) * 3;
      const spO2 = 96 + (i % 5);

      const hasPrescription = i % 4 !== 0;
      const rxMeds = hasPrescription ? [opdMedsPool[i % opdMedsPool.length], opdMedsPool[(i + 2) % opdMedsPool.length]] : [];

      generatedOPDVisits.push({
        visitId: `VIS-${opdSeq++}`,
        patientId: appt.patientId,
        doctorId: appt.doctorId,
        appointmentId: appt._id,
        visitType: "appointment",
        symptoms: appt.reason || "Outpatient Clinical Follow-up",
        diagnosis: `Clinical Evaluation - ${appt.reason || "General Consultation"}`,
        notes: appt.notes || "OPD visit completed successfully.",
        vitals: { temperature, bloodPressure, pulse, weight, height, spO2 },
        clinicalNotes: {
          examinationFindings: "Patient conscious, oriented. Systemic examination within normal limits.",
          clinicalAssessment: "Condition stable under current medical protocol.",
          additionalNotes: "Follow-up review scheduled as needed.",
        },
        prescription: rxMeds,
        visitDate: appt.appointmentDate,
        status,
      });
    }

    // B) 20 Walk-in OPD Visits (No Appointment ID)
    for (let j = 0; j < 20; j++) {
      const patient = allPatients[j % allPatients.length];
      const doctor = allDoctors[j % allDoctors.length];

      const walkInDate = new Date(baseDate);
      walkInDate.setDate(baseDate.getDate() - (j % 10));

      const temperature = Number((98.2 + (j % 4) * 0.5).toFixed(1));
      const bpList = ["120/80", "122/84", "128/86", "134/88"];
      const bloodPressure = bpList[j % bpList.length];
      const pulse = 72 + (j % 5) * 3;
      const weight = Number((55.0 + (j % 8) * 4.0).toFixed(1));
      const height = 160 + (j % 6) * 4;
      const spO2 = 97 + (j % 4);

      const rxMeds = [opdMedsPool[(j + 1) % opdMedsPool.length]];

      generatedOPDVisits.push({
        visitId: `VIS-${opdSeq++}`,
        patientId: patient._id,
        doctorId: doctor._id,
        appointmentId: null,
        visitType: "walk-in",
        symptoms: "Acute OPD Walk-in Consultation & Symptoms Check",
        diagnosis: "Primary Walk-in Clinical Assessment",
        notes: "Direct front-desk walk-in registration.",
        vitals: { temperature, bloodPressure, pulse, weight, height, spO2 },
        clinicalNotes: {
          examinationFindings: "Vital signs recorded at OPD triage desk.",
          clinicalAssessment: "Acute symptomatic consultation provided.",
          additionalNotes: "Patient instructed on medication adherence.",
        },
        prescription: rxMeds,
        visitDate: walkInDate,
        status: j % 5 === 0 ? "in-progress" : "walk-in",
      });
    }

    let opdInsertedCount = 0;
    let opdUpdatedCount = 0;

    for (const opdData of generatedOPDVisits) {
      let existingOPD = await OPDVisit.findOne({ visitId: opdData.visitId });
      if (!existingOPD) {
        await OPDVisit.create(opdData);
        opdInsertedCount++;
      } else {
        await OPDVisit.findOneAndUpdate({ visitId: opdData.visitId }, opdData, { runValidators: true });
        opdUpdatedCount++;
      }
    }

    // 10. Seed Exactly 10 Wards & 100 Beds (10 Beds per Ward)
    console.log("Seeding Wards and Beds (10 Wards x 10 Beds)...");

    const sample10Wards = [
      { name: "General Ward A", type: "general", floor: "Floor 1", capacity: 10, prefix: "GWA" },
      { name: "General Ward B", type: "general", floor: "Floor 1", capacity: 10, prefix: "GWB" },
      { name: "General Ward C", type: "general", floor: "Floor 2", capacity: 10, prefix: "GWC" },
      { name: "ICU-1", type: "icu", floor: "Floor 2", capacity: 10, prefix: "ICU1" },
      { name: "ICU-2", type: "icu", floor: "Floor 3", capacity: 10, prefix: "ICU2" },
      { name: "Private Ward", type: "private", floor: "Floor 3", capacity: 10, prefix: "PVT" },
      { name: "Semi-Private Ward A", type: "semi-private", floor: "Floor 4", capacity: 10, prefix: "SPWA" },
      { name: "Semi-Private Ward B", type: "semi-private", floor: "Floor 4", capacity: 10, prefix: "SPWB" },
      { name: "Emergency Ward", type: "emergency", floor: "Ground Floor", capacity: 10, prefix: "EMG" },
      { name: "General Ward D", type: "general", floor: "Floor 5", capacity: 10, prefix: "GWD" },
    ];

    const seededWards = [];
    let wardInsertedCount = 0;
    let wardUpdatedCount = 0;

    for (const wData of sample10Wards) {
      const { prefix, ...wardPayload } = wData;
      let existingWard = await Ward.findOne({ name: wardPayload.name });
      let wardDoc;
      if (!existingWard) {
        wardDoc = await Ward.create({ ...wardPayload, status: "active" });
        wardInsertedCount++;
      } else {
        wardDoc = await Ward.findOneAndUpdate({ name: wardPayload.name }, { ...wardPayload, status: "active" }, { new: true });
        wardUpdatedCount++;
      }
      seededWards.push({ ...wardDoc.toObject(), prefix });
    }

    const seededBeds = [];
    let bedInsertedCount = 0;
    let bedUpdatedCount = 0;

    for (const ward of seededWards) {
      for (let b = 1; b <= 10; b++) {
        const bedNumStr = String(b).padStart(2, "0");
        const bedNumber = `${ward.prefix}-${bedNumStr}`;

        let existingBed = await Bed.findOne({ wardId: ward._id, bedNumber });
        let bedDoc;
        if (!existingBed) {
          bedDoc = await Bed.create({
            wardId: ward._id,
            bedNumber,
            status: "available",
            currentPatientId: null,
            maintenanceReason: null,
          });
          bedInsertedCount++;
        } else {
          bedDoc = await Bed.findOne({ wardId: ward._id, bedNumber });
          bedUpdatedCount++;
        }
        seededBeds.push(bedDoc);
      }
    }

    // 11. Seed IPD Admissions & Synchronize Bed Occupancy to Exactly 55% (55 Occupied Beds)
    console.log("Seeding IPD Admissions & setting bed occupancy to exactly 55%...");

    const activeAdmissionPatients = allPatients.slice(0, 55);

    const maintenanceReasons = [
      "Electrical maintenance & socket repair",
      "Sanitisation & deep cleaning protocol",
      "Mattress replacement & frame servicing",
      "Plumbing maintenance & sink repair",
      "Nurse call button wiring repair",
    ];

    const generatedAdmissions = [];
    let admSeq = 1001;

    // A) 55 Active Current Admissions (Status: "admitted", Bed: "occupied")
    for (let k = 0; k < 55; k++) {
      const patient = allPatients[k % allPatients.length];
      const bed = seededBeds[k];
      const ward = seededWards.find((w) => String(w._id) === String(bed.wardId));
      const doctor = allDoctors[k % allDoctors.length];

      await Bed.findByIdAndUpdate(bed._id, {
        status: "occupied",
        currentPatientId: patient._id,
        maintenanceReason: null,
      });

      const rentMap = {
        general: 1500,
        "semi-private": 2800,
        private: 4500,
        icu: 7500,
        emergency: 2200,
      };

      const admDate = new Date(baseDate);
      admDate.setDate(baseDate.getDate() - ((k % 12) + 1));

      generatedAdmissions.push({
        admissionId: `ADM-2026-${admSeq++}`,
        patientId: patient._id,
        doctorId: doctor._id,
        wardId: ward._id,
        bedId: bed._id,
        admissionDate: admDate,
        reason: `IPD Admission for ${doctor.specialization || "General"} medical observation and treatment`,
        diagnosis: `Confirmed ${doctor.specialization || "Clinical"} Case`,
        provisionalDiagnosis: `Provisional ${doctor.specialization || "Clinical"} Diagnosis`,
        allergies: k % 4 === 0 ? "Penicillin allergy reported" : "No known drug allergies",
        medicalHistory: k % 3 === 0 ? "Hypertension, Type-2 Diabetes" : "No prior major surgical history",
        notes: "Patient admitted under active inpatient care protocol.",
        dailyRent: rentMap[ward.type] || 1500,
        bedType: `${ward.type.charAt(0).toUpperCase() + ward.type.slice(1)} Bed`,
        dischargeDate: null,
        dischargeSummary: null,
        status: "admitted",
      });
    }

    // B) 10 Maintenance Beds (Beds 55..64)
    for (let m = 55; m < 65; m++) {
      const bed = seededBeds[m];
      await Bed.findByIdAndUpdate(bed._id, {
        status: "maintenance",
        currentPatientId: null,
        maintenanceReason: maintenanceReasons[(m - 55) % maintenanceReasons.length],
      });
    }

    // C) 35 Available Beds (Beds 65..99)
    for (let v = 65; v < 100; v++) {
      const bed = seededBeds[v];
      await Bed.findByIdAndUpdate(bed._id, {
        status: "available",
        currentPatientId: null,
        maintenanceReason: null,
      });
    }

    // D) 30 Historical Discharged Admissions
    for (let h = 0; h < 30; h++) {
      const patient = allPatients[(h + 10) % allPatients.length];
      const doctor = allDoctors[(h + 3) % allDoctors.length];
      const bed = seededBeds[h % seededBeds.length];
      const ward = seededWards.find((w) => String(w._id) === String(bed.wardId));

      const admDate = new Date(baseDate);
      admDate.setDate(baseDate.getDate() - (25 + (h % 10)));
      const disDate = new Date(admDate);
      disDate.setDate(admDate.getDate() + (3 + (h % 5)));

      const rentMap = {
        general: 1500,
        "semi-private": 2800,
        private: 4500,
        icu: 7500,
        emergency: 2200,
      };

      generatedAdmissions.push({
        admissionId: `ADM-2026-${admSeq++}`,
        patientId: patient._id,
        doctorId: doctor._id,
        wardId: ward._id,
        bedId: bed._id,
        admissionDate: admDate,
        reason: `Historical IPD treatment for ${doctor.specialization || "General Medicine"}`,
        diagnosis: `Resolved ${doctor.specialization || "Clinical"} Condition`,
        provisionalDiagnosis: `Initial ${doctor.specialization || "Clinical"} Assessment`,
        allergies: "No known drug allergies",
        medicalHistory: "Nil significant",
        notes: "Discharged in stable condition after successful treatment.",
        dailyRent: rentMap[ward.type] || 1500,
        bedType: `${ward.type.charAt(0).toUpperCase() + ward.type.slice(1)} Bed`,
        dischargeDate: disDate,
        dischargeSummary: "Patient responded well to inpatient medical management and is discharged in stable condition with 7-day follow-up advice.",
        status: "discharged",
      });
    }

    let admInsertedCount = 0;
    let admUpdatedCount = 0;

    for (const admData of generatedAdmissions) {
      let existingAdm = await Admission.findOne({ admissionId: admData.admissionId });
      if (!existingAdm) {
        await Admission.create(admData);
        admInsertedCount++;
      } else {
        await Admission.findOneAndUpdate({ admissionId: admData.admissionId }, admData, { runValidators: true });
        admUpdatedCount++;
      }
    }

    // 12. Seed ~120 Laboratory Test Orders (LabTest)
    console.log("Seeding realistic LabTest orders...");

    const labTechRole = await Role.findOne({ name: "LAB_TECHNICIAN" });
    const labTechUsers = labTechRole ? await User.find({ roleId: labTechRole._id }) : [];

    const labTestCatalog = [
      { testName: "Complete Blood Count (CBC)", sampleType: "Blood", parameters: ["Hemoglobin", "WBC Count", "RBC Count", "Platelets", "PCV"] },
      { testName: "Lipid Profile", sampleType: "Blood", parameters: ["Total Cholesterol", "HDL Cholesterol", "LDL Cholesterol", "VLDL Cholesterol", "Triglycerides"] },
      { testName: "Thyroid Profile (T3, T4, TSH)", sampleType: "Blood", parameters: ["Total T3", "Total T4", "TSH Ultra-sensitive"] },
      { testName: "Urine Routine Examination", sampleType: "Urine", parameters: ["Color", "pH", "Specific Gravity", "Protein", "Glucose"] },
      { testName: "Blood Sugar Fasting & PP", sampleType: "Blood", parameters: ["Fasting Plasma Glucose", "Post Prandial Glucose", "HbA1c"] },
      { testName: "Kidney Function Test (KFT)", sampleType: "Blood", parameters: ["Serum Creatinine", "Blood Urea Nitrogen", "Uric Acid", "Serum Sodium", "Serum Potassium"] },
      { testName: "Liver Function Test (LFT)", sampleType: "Blood", parameters: ["SGOT / AST", "SGPT / ALT", "Total Bilirubin", "Direct Bilirubin", "Serum Albumin"] },
    ];

    const dbOPDVisits = await OPDVisit.find({});
    const dbAdmissions = await Admission.find({});

    const generatedLabTests = [];
    let labTestSeq = 1001;

    // A) 90 OPD-based Lab Test Orders
    const opdSubset = dbOPDVisits.slice(0, 90);
    for (let i = 0; i < opdSubset.length; i++) {
      const opd = opdSubset[i];
      const testItem = labTestCatalog[i % labTestCatalog.length];
      const priority = i % 10 === 0 ? "emergency" : i % 5 === 0 ? "urgent" : "routine";
      const status = i % 12 === 0 ? "cancelled" : i % 8 === 0 ? "pending" : i % 6 === 0 ? "sample-collected" : "completed";

      generatedLabTests.push({
        orderId: `LT-2026-${labTestSeq++}`,
        patientId: opd.patientId,
        doctorId: opd.doctorId,
        visitId: opd._id,
        visitType: "OPD Visit",
        testName: testItem.testName,
        sampleType: testItem.sampleType,
        priority,
        status,
        parameters: testItem.parameters,
        clinicalNotes: `Diagnostic lab test ordered during OPD visit for ${opd.symptoms}`,
        requestedAt: opd.visitDate,
      });
    }

    // B) 30 IPD-based Lab Test Orders
    const admSubset = dbAdmissions.slice(0, 30);
    for (let j = 0; j < admSubset.length; j++) {
      const adm = admSubset[j];
      const testItem = labTestCatalog[(j + 2) % labTestCatalog.length];
      const priority = j % 6 === 0 ? "emergency" : j % 3 === 0 ? "urgent" : "routine";
      const status = j % 10 === 0 ? "pending" : "completed";

      generatedLabTests.push({
        orderId: `LT-2026-${labTestSeq++}`,
        patientId: adm.patientId,
        doctorId: adm.doctorId,
        visitId: adm._id,
        visitType: "IPD Admission",
        testName: testItem.testName,
        sampleType: testItem.sampleType,
        priority,
        status,
        parameters: testItem.parameters,
        clinicalNotes: `Inpatient routine diagnostic monitoring for ${adm.reason}`,
        requestedAt: adm.admissionDate,
      });
    }

    let labTestInsertedCount = 0;
    let labTestUpdatedCount = 0;

    for (const ltData of generatedLabTests) {
      let existingLT = await LabTest.findOne({ orderId: ltData.orderId });
      if (!existingLT) {
        await LabTest.create(ltData);
        labTestInsertedCount++;
      } else {
        await LabTest.findOneAndUpdate({ orderId: ltData.orderId }, ltData, { runValidators: true });
        labTestUpdatedCount++;
      }
    }

    // 13. Seed ~90 Laboratory Test Reports (LabReport)
    console.log("Seeding realistic LabReport records...");
    const dbLabTests = await LabTest.find({ status: { $in: ["completed", "sample-collected"] } });

    const resultGenerators = {
      "Complete Blood Count (CBC)": (idx) => ({
        Hemoglobin: `${(12.5 + (idx % 5) * 0.6).toFixed(1)} g/dL`,
        "WBC Count": `${6500 + (idx % 6) * 600} /uL`,
        "RBC Count": `${(4.2 + (idx % 4) * 0.3).toFixed(1)} million/uL`,
        Platelets: `${(2.1 + (idx % 5) * 0.3).toFixed(1)} Lakhs/uL`,
        PCV: `${38 + (idx % 5)}%`,
      }),
      "Lipid Profile": (idx) => ({
        "Total Cholesterol": `${165 + (idx % 8) * 10} mg/dL`,
        "HDL Cholesterol": `${45 + (idx % 4) * 4} mg/dL`,
        "LDL Cholesterol": `${95 + (idx % 6) * 8} mg/dL`,
        "VLDL Cholesterol": `${20 + (idx % 3) * 3} mg/dL`,
        Triglycerides: `${120 + (idx % 7) * 12} mg/dL`,
      }),
      "Thyroid Profile (T3, T4, TSH)": (idx) => ({
        "Total T3": `${(1.1 + (idx % 4) * 0.1).toFixed(1)} ng/mL`,
        "Total T4": `${(7.8 + (idx % 5) * 0.4).toFixed(1)} µg/dL`,
        "TSH Ultra-sensitive": `${(2.1 + (idx % 5) * 0.5).toFixed(1)} µIU/mL`,
      }),
      "Urine Routine Examination": (idx) => ({
        Color: idx % 2 === 0 ? "Pale Yellow" : "Clear Straw",
        pH: `${(6.0 + (idx % 3) * 0.5).toFixed(1)}`,
        "Specific Gravity": "1.015",
        Protein: "Nil",
        Glucose: "Nil",
      }),
      "Blood Sugar Fasting & PP": (idx) => ({
        "Fasting Plasma Glucose": `${88 + (idx % 6) * 5} mg/dL`,
        "Post Prandial Glucose": `${125 + (idx % 8) * 8} mg/dL`,
        HbA1c: `${(5.4 + (idx % 4) * 0.3).toFixed(1)}%`,
      }),
      "Kidney Function Test (KFT)": (idx) => ({
        "Serum Creatinine": `${(0.8 + (idx % 4) * 0.1).toFixed(1)} mg/dL`,
        "Blood Urea Nitrogen": `${13 + (idx % 5)} mg/dL`,
        "Uric Acid": `${(4.8 + (idx % 4) * 0.3).toFixed(1)} mg/dL`,
        "Serum Sodium": `${138 + (idx % 4)} mEq/L`,
        "Serum Potassium": `${(4.1 + (idx % 3) * 0.2).toFixed(1)} mEq/L`,
      }),
      "Liver Function Test (LFT)": (idx) => ({
        "SGOT / AST": `${24 + (idx % 6) * 3} U/L`,
        "SGPT / ALT": `${28 + (idx % 5) * 4} U/L`,
        "Total Bilirubin": `${(0.7 + (idx % 3) * 0.1).toFixed(1)} mg/dL`,
        "Direct Bilirubin": "0.2 mg/dL",
        "Serum Albumin": `${(4.1 + (idx % 3) * 0.2).toFixed(1)} g/dL`,
      }),
    };

    const generatedLabReports = [];
    let reportInsertedCount = 0;
    let reportUpdatedCount = 0;

    for (let r = 0; r < dbLabTests.length; r++) {
      const lt = dbLabTests[r];
      const techUser = labTechUsers.length > 0 ? labTechUsers[r % labTechUsers.length] : superAdminUser;

      const genFn = resultGenerators[lt.testName] || resultGenerators["Complete Blood Count (CBC)"];
      const results = genFn(r);
      const isAbnormal = r % 7 === 0;

      const reportStatus = r % 8 === 0 ? "draft" : "finalized";
      const reportedDate = new Date(lt.requestedAt || baseDate);
      reportedDate.setHours(reportedDate.getHours() + 4);

      const payload = {
        labTestId: lt._id,
        patientId: lt.patientId,
        technicianId: techUser._id,
        results,
        interpretation: isAbnormal
          ? "Mild elevation observed in parameters. Clinical correlation recommended."
          : "All diagnostic parameters within reference physiological ranges.",
        status: reportStatus,
        reportedAt: reportedDate,
      };

      let existingReport = await LabReport.findOne({ labTestId: lt._id });
      if (!existingReport) {
        await LabReport.create(payload);
        reportInsertedCount++;
      } else {
        await LabReport.findOneAndUpdate({ labTestId: lt._id }, payload, { runValidators: true });
        reportUpdatedCount++;
      }

      generatedLabReports.push(payload);
    }

    // 14. Seed ~120 Radiology Test Orders (RadiologyTest)
    console.log("Seeding realistic RadiologyTest orders...");
    const dbDoctors = await Doctor.find({});
    const radiologyDoctor = dbDoctors.find((d) => d.specialization === "Radiology") || dbDoctors[0];

    // Find valid Radiologist User for reports
    const radiologistUser = (await User.findById(radiologyDoctor.userId)) || superAdminUser;

    const radiologyCatalog = [
      {
        modality: "X-Ray",
        bodyRegion: "Chest",
        testType: "Chest X-Ray PA View",
        bodyPart: "Chest",
        locationRoom: "X-Ray Room 1",
        findings: "Cardiomediastinal silhouette is within normal limits. Lung fields are clear bilaterally with no active focal parenchymal lesions. Hemidiaphragms and costophrenic angles are normal.",
        technique: "Digital Radiography PA and Lateral Projections",
        impression: "No acute cardiopulmonary abnormality detected.",
        recommendations: "Clinical correlation advised.",
        views: "PA & Lateral",
        contrast: "Not Used",
      },
      {
        modality: "MRI Scan",
        bodyRegion: "Brain",
        testType: "MRI Brain Contrast Study",
        bodyPart: "Brain",
        locationRoom: "MRI Suite 1",
        findings: "Multiplanar T1, T2, and FLAIR sequence images demonstrate normal cerebral cortex and subcortical white matter. No intracranial hemorrhage, midline shift, or mass effect.",
        technique: "Multiplanar Multisequence MRI with IV Gadolinium Contrast",
        impression: "Unremarkable brain MRI scan.",
        recommendations: "Follow up as clinically indicated.",
        views: "Axial, Sagittal, Coronal",
        contrast: "IV Gadolinium",
      },
      {
        modality: "CT Scan",
        bodyRegion: "Abdomen",
        testType: "CECT Abdomen & Pelvis",
        bodyPart: "Abdomen & Pelvis",
        locationRoom: "CT Room A",
        findings: "Contrast-enhanced axial sections show normal liver, spleen, pancreas, gallbladder, and both kidneys. No bowel wall thickening or free intra-abdominal fluid.",
        technique: "Multidetector Computed Tomography with Oral & IV Contrast",
        impression: "Normal CECT Abdomen & Pelvis evaluation.",
        recommendations: "Correlate with LFT & KFT parameters.",
        views: "Axial & Coronal Reconstructions",
        contrast: "IV Contrast",
      },
      {
        modality: "Ultrasound (USG)",
        bodyRegion: "Abdomen",
        testType: "USG Whole Abdomen",
        bodyPart: "Abdomen",
        locationRoom: "USG Room 3",
        findings: "Real-time B-mode sonography demonstrates normal liver size and echotexture. Gallbladder distended with clear lumen. No gallstones or sludge.",
        technique: "High-resolution real-time grey-scale sonography",
        impression: "Normal abdominal ultrasound study.",
        recommendations: "Routine clinical follow-up.",
        views: "Real-time Transverse & Longitudinal",
        contrast: "Not Used",
      },
      {
        modality: "X-Ray",
        bodyRegion: "Spine",
        testType: "Lumbosacral Spine X-Ray AP/Lat",
        bodyPart: "Lumbosacral Spine",
        locationRoom: "X-Ray Room 2",
        findings: "Vertebral body heights and intervertebral disc spaces are well maintained. No evidence of spondylolisthesis or vertebral fracture.",
        technique: "Digital Radiography AP and Lateral views",
        impression: "Mild degenerative changes consistent with age; no acute bony lesion.",
        recommendations: "Physiotherapy and posture correction.",
        views: "AP & Lateral",
        contrast: "Not Used",
      },
      {
        modality: "Mammography",
        bodyRegion: "Breast",
        testType: "Bilateral Screening Mammogram",
        bodyPart: "Bilateral Breasts",
        locationRoom: "Radiology Room 2",
        findings: "Bilateral mammograms show symmetrical fibroglandular parenchyma. No dominant mass, architectural distortion, or clustered microcalcifications.",
        technique: "Full-Field Digital Mammography CC and MLO views",
        impression: "BI-RADS Category 1: Negative bilateral mammogram.",
        recommendations: "Annual screening mammography recommended.",
        views: "CC & MLO Views",
        contrast: "Not Used",
      },
      {
        modality: "PET Scan",
        bodyRegion: "Whole Body",
        testType: "FDG Whole Body PET-CT",
        bodyPart: "Whole Body",
        locationRoom: "Nuclear Med Suite",
        findings: "Whole body 18F-FDG PET-CT scan demonstrates physiological tracer distribution in the brain, myocardium, liver, and urinary tract.",
        technique: "3D Whole Body PET co-registered with Low-Dose CT",
        impression: "No pathological hypermetabolic FDG focus identified.",
        recommendations: "Correlate with tumor markers.",
        views: "3D PET-CT Coronal/Axial",
        contrast: "IV Contrast",
      },
      {
        modality: "ECG",
        bodyRegion: "Heart",
        testType: "12-Lead Electrocardiogram",
        bodyPart: "Heart",
        locationRoom: "ECG Room 1",
        findings: "Normal sinus rhythm at 72 bpm. Normal PR interval (150 ms) and QRS duration (88 ms). No ST-segment elevation.",
        technique: "Standard 12-lead Electrocardiography",
        impression: "Normal 12-lead ECG.",
        recommendations: "Clinical monitoring.",
        views: "12-Lead Trace",
        contrast: "Not Used",
      },
    ];

    const generatedRadTests = [];
    let radTestSeq = 1001;

    // A) 90 OPD-based Radiology Orders
    const radOpdSubset = dbOPDVisits.slice(0, 90);
    for (let i = 0; i < radOpdSubset.length; i++) {
      const opd = radOpdSubset[i];
      const item = radiologyCatalog[i % radiologyCatalog.length];
      const priority = i % 10 === 0 ? "emergency" : i % 5 === 0 ? "urgent" : "routine";
      const status = i % 12 === 0 ? "cancelled" : i % 8 === 0 ? "pending" : i % 6 === 0 ? "scheduled" : i % 5 === 0 ? "in-progress" : "completed";

      const scheduledAt = status === "scheduled" || status === "in-progress" || status === "completed"
        ? new Date(opd.visitDate.getTime() + 1000 * 60 * 60 * 2)
        : null;

      generatedRadTests.push({
        orderId: `RO-2026-${radTestSeq++}`,
        patientId: opd.patientId,
        doctorId: opd.doctorId,
        visitId: opd._id,
        visitType: "OPD Visit",
        modality: item.modality,
        bodyRegion: item.bodyRegion,
        testType: item.testType,
        bodyPart: item.bodyPart,
        priority,
        status,
        clinicalInstructions: `Radiology evaluation ordered during OPD consultation for ${opd.symptoms}`,
        scheduledAt,
        locationRoom: item.locationRoom,
        requestedAt: opd.visitDate,
      });
    }

    // B) 30 IPD-based Radiology Orders
    const radAdmSubset = dbAdmissions.slice(0, 30);
    for (let j = 0; j < radAdmSubset.length; j++) {
      const adm = radAdmSubset[j];
      const item = radiologyCatalog[(j + 3) % radiologyCatalog.length];
      const priority = j % 6 === 0 ? "emergency" : j % 3 === 0 ? "urgent" : "routine";
      const status = j % 10 === 0 ? "pending" : j % 7 === 0 ? "in-progress" : "completed";

      const scheduledAt = new Date(adm.admissionDate.getTime() + 1000 * 60 * 60 * 3);

      generatedRadTests.push({
        orderId: `RO-2026-${radTestSeq++}`,
        patientId: adm.patientId,
        doctorId: adm.doctorId,
        visitId: adm._id,
        visitType: "IPD Admission",
        modality: item.modality,
        bodyRegion: item.bodyRegion,
        testType: item.testType,
        bodyPart: item.bodyPart,
        priority,
        status,
        clinicalInstructions: `Inpatient radiological monitoring for ${adm.reason}`,
        scheduledAt,
        locationRoom: item.locationRoom,
        requestedAt: adm.admissionDate,
      });
    }

    let radTestInsertedCount = 0;
    let radTestUpdatedCount = 0;

    for (const rtData of generatedRadTests) {
      let existingRT = await RadiologyTest.findOne({ orderId: rtData.orderId });
      if (!existingRT) {
        await RadiologyTest.create(rtData);
        radTestInsertedCount++;
      } else {
        await RadiologyTest.findOneAndUpdate({ orderId: rtData.orderId }, rtData, { runValidators: true });
        radTestUpdatedCount++;
      }
    }

    // 15. Seed ~100 Radiology Diagnostic Reports (RadiologyReport)
    console.log("Seeding realistic RadiologyReport records...");
    const dbRadTestsForReport = await RadiologyTest.find({ status: { $in: ["completed", "in-progress"] } });

    const generatedRadReports = [];
    let radReportInsertedCount = 0;
    let radReportUpdatedCount = 0;

    for (let r = 0; r < dbRadTestsForReport.length; r++) {
      const rt = dbRadTestsForReport[r];

      // Find catalog matching item
      const item = radiologyCatalog.find((c) => c.modality === rt.modality && c.bodyRegion === rt.bodyRegion) || radiologyCatalog[r % radiologyCatalog.length];
      const reportStatus = r % 7 === 0 ? "draft" : "finalized";
      const reportedAt = new Date((rt.scheduledAt || rt.requestedAt).getTime() + 1000 * 60 * 60 * 5);

      const payload = {
        testId: rt._id,
        patientId: rt.patientId,
        radiologistId: radiologistUser._id,
        findings: item.findings,
        technique: item.technique,
        impression: item.impression,
        recommendations: item.recommendations,
        additionalNotes: "Study completed with standard diagnostic quality. Findings communicated to treating physician.",
        technicianName: r % 2 === 0 ? "Rakesh Kumar" : "Amit Verma",
        checkedByName: radiologistUser.name || "Dr. Snigdha Sen",
        studyReviewed: reportStatus === "finalized",
        clinicalIndication: rt.clinicalInstructions || "Clinical evaluation",
        relevantHistory: "No prior adverse reactions to radiopaque contrast media.",
        examinationTechnique: item.technique,
        bodyPart: rt.bodyPart || item.bodyPart,
        views: item.views,
        contrast: item.contrast,
        imageQuality: "Diagnostic",
        images: [],
        status: reportStatus,
        reportedAt,
      };

      let existingRadReport = await RadiologyReport.findOne({ testId: rt._id });
      if (!existingRadReport) {
        await RadiologyReport.create(payload);
        radReportInsertedCount++;
      } else {
        await RadiologyReport.findOneAndUpdate({ testId: rt._id }, payload, { runValidators: true });
        radReportUpdatedCount++;
      }

      generatedRadReports.push(payload);
    }

    // 16. Seed 75 realistic Indian Medicine records (Medicine)
    console.log("Seeding 75 realistic Indian Medicine records...");
    const sample75Medicines = [
      // 1-10 Analgesic & Antipyretic
      { code: "MED-1001", name: "Paracetamol 500 mg Tablet", brandName: "Calpol 500", genericName: "Paracetamol", category: "Analgesic", therapeuticCategory: "Antipyretic / Analgesic", manufacturer: "GlaxoSmithKline India", supplier: "Metro Medical Supplies", countryOfOrigin: "India", dosageForm: "Tablet", strength: "500 mg", packSize: "15 Tablets", unit: "Strip", price: 20, mrp: 25, gstRate: 12, purchasePrice: 15, margin: 5, sellingPrice: 20, availableStock: 350, batchNo: "PCM500/26A", expiryDate: "2027-06-30", minStockLevel: 50, maxStockLevel: 500, reorderLevel: 30, prescriptionRequired: false, controlledMedicine: false, shelfLifeValue: 24, shelfLifeUnit: "Months", description: "For fever and mild pain relief", status: "active" },
      { code: "MED-1002", name: "Paracetamol 650 mg Tablet", brandName: "Dolo-650", genericName: "Paracetamol", category: "Analgesic", therapeuticCategory: "Antipyretic / Analgesic", manufacturer: "Micro Labs Ltd", supplier: "Apex Pharma Distributors", countryOfOrigin: "India", dosageForm: "Tablet", strength: "650 mg", packSize: "15 Tablets", unit: "Strip", price: 30, mrp: 35, gstRate: 12, purchasePrice: 22, margin: 8, sellingPrice: 30, availableStock: 420, batchNo: "DL650/26B", expiryDate: "2027-08-15", minStockLevel: 50, maxStockLevel: 600, reorderLevel: 40, prescriptionRequired: false, controlledMedicine: false, shelfLifeValue: 24, shelfLifeUnit: "Months", description: "First-line antipyretic for high fever", status: "active" },
      { code: "MED-1003", name: "Ibuprofen + Paracetamol Tablet", brandName: "Combiflam", genericName: "Ibuprofen + Paracetamol", category: "Analgesic", therapeuticCategory: "NSAID", manufacturer: "Sanofi India", supplier: "National Health Logistics", countryOfOrigin: "India", dosageForm: "Tablet", strength: "400 mg / 325 mg", packSize: "20 Tablets", unit: "Strip", price: 40, mrp: 48, gstRate: 12, purchasePrice: 28, margin: 12, sellingPrice: 40, availableStock: 280, batchNo: "CBF/26C", expiryDate: "2027-04-10", minStockLevel: 40, maxStockLevel: 400, reorderLevel: 25, prescriptionRequired: false, controlledMedicine: false, shelfLifeValue: 24, shelfLifeUnit: "Months", description: "Combines analgesic and anti-inflammatory action", status: "active" },
      { code: "MED-1004", name: "Tramadol 50 mg Capsule", brandName: "Tramazac 50", genericName: "Tramadol Hydrochloride", category: "Analgesic", therapeuticCategory: "Opioid Analgesic", manufacturer: "Zydus Cadila", supplier: "MediLife Pharma Wholesalers", countryOfOrigin: "India", dosageForm: "Capsule", strength: "50 mg", packSize: "10 Capsules", unit: "Strip", price: 85, mrp: 100, gstRate: 12, purchasePrice: 60, margin: 25, sellingPrice: 85, availableStock: 120, batchNo: "TMZ/26D", expiryDate: "2027-02-28", minStockLevel: 20, maxStockLevel: 200, reorderLevel: 15, prescriptionRequired: true, controlledMedicine: true, shelfLifeValue: 24, shelfLifeUnit: "Months", description: "Moderate to severe post-operative pain management", status: "active" },
      { code: "MED-1005", name: "Diclofenac Sodium 50 mg Tablet", brandName: "Voveran 50", genericName: "Diclofenac Sodium", category: "Analgesic", therapeuticCategory: "NSAID", manufacturer: "Novartis India", supplier: "Metro Medical Supplies", countryOfOrigin: "India", dosageForm: "Tablet", strength: "50 mg", packSize: "15 Tablets", unit: "Strip", price: 55, mrp: 65, gstRate: 12, purchasePrice: 38, margin: 17, sellingPrice: 55, availableStock: 210, batchNo: "VOV/26E", expiryDate: "2027-05-20", minStockLevel: 30, maxStockLevel: 300, reorderLevel: 20, prescriptionRequired: true, controlledMedicine: false, shelfLifeValue: 24, shelfLifeUnit: "Months", description: "Management of acute arthritis and musculoskeletal pain", status: "active" },
      { code: "MED-1006", name: "Aceclofenac 100 mg + Paracetamol 325 mg", brandName: "Zerodol-P", genericName: "Aceclofenac + Paracetamol", category: "Analgesic", therapeuticCategory: "NSAID", manufacturer: "Ipca Laboratories", supplier: "Apex Pharma Distributors", countryOfOrigin: "India", dosageForm: "Tablet", strength: "100 mg / 325 mg", packSize: "10 Tablets", unit: "Strip", price: 60, mrp: 72, gstRate: 12, purchasePrice: 42, margin: 18, sellingPrice: 60, availableStock: 190, batchNo: "ZDP/26F", expiryDate: "2027-09-30", minStockLevel: 30, maxStockLevel: 300, reorderLevel: 20, prescriptionRequired: true, controlledMedicine: false, shelfLifeValue: 24, shelfLifeUnit: "Months", description: "Relief of rheumatoid arthritis and osteoarthritic joint pain", status: "active" },
      { code: "MED-1007", name: "Mefenamic Acid 500 mg Tablet", brandName: "Meftal 500", genericName: "Mefenamic Acid", category: "Analgesic", therapeuticCategory: "NSAID", manufacturer: "Blue Cross Laboratories", supplier: "National Health Logistics", countryOfOrigin: "India", dosageForm: "Tablet", strength: "500 mg", packSize: "10 Tablets", unit: "Strip", price: 35, mrp: 42, gstRate: 12, purchasePrice: 24, margin: 11, sellingPrice: 35, availableStock: 160, batchNo: "MFT/26G", expiryDate: "2027-07-10", minStockLevel: 25, maxStockLevel: 250, reorderLevel: 15, prescriptionRequired: true, controlledMedicine: false, shelfLifeValue: 24, shelfLifeUnit: "Months", description: "Primary dysmenorrhea and mild spasm pain relief", status: "active" },
      { code: "MED-1008", name: "Etoricoxib 90 mg Tablet", brandName: "Nucoxia 90", genericName: "Etoricoxib", category: "Analgesic", therapeuticCategory: "COX-2 Inhibitor", manufacturer: "Zydus Cadila", supplier: "MediLife Pharma Wholesalers", countryOfOrigin: "India", dosageForm: "Tablet", strength: "90 mg", packSize: "10 Tablets", unit: "Strip", price: 115, mrp: 138, gstRate: 12, purchasePrice: 82, margin: 33, sellingPrice: 115, availableStock: 25, batchNo: "NCX/26H", expiryDate: "2026-11-30", minStockLevel: 50, maxStockLevel: 250, reorderLevel: 30, prescriptionRequired: true, controlledMedicine: false, shelfLifeValue: 24, shelfLifeUnit: "Months", description: "Selective COX-2 inhibitor for chronic joint pain (Low Stock alert)", status: "active" },
      { code: "MED-1009", name: "Ketorolac Tromethamine 10 mg", brandName: "Ketorol DT", genericName: "Ketorolac Tromethamine", category: "Analgesic", therapeuticCategory: "NSAID", manufacturer: "Dr. Reddy's Laboratories", supplier: "Metro Medical Supplies", countryOfOrigin: "India", dosageForm: "Dispersible Tablet", strength: "10 mg", packSize: "15 Tablets", unit: "Strip", price: 78, mrp: 92, gstRate: 12, purchasePrice: 55, margin: 23, sellingPrice: 78, availableStock: 0, batchNo: "KTR/26I", expiryDate: "2027-01-15", minStockLevel: 30, maxStockLevel: 200, reorderLevel: 20, prescriptionRequired: true, controlledMedicine: false, shelfLifeValue: 24, shelfLifeUnit: "Months", description: "Short-term dental and acute pain management (Out of Stock alert)", status: "active" },
      { code: "MED-1010", name: "Piroxicam 20 mg Capsule", brandName: "Dolonex 20", genericName: "Piroxicam", category: "Analgesic", therapeuticCategory: "NSAID", manufacturer: "Pfizer India", supplier: "Apex Pharma Distributors", countryOfOrigin: "India", dosageForm: "Capsule", strength: "20 mg", packSize: "10 Capsules", unit: "Strip", price: 45, mrp: 55, gstRate: 12, purchasePrice: 30, margin: 15, sellingPrice: 45, availableStock: 140, batchNo: "DLX/25J", expiryDate: "2025-08-30", minStockLevel: 20, maxStockLevel: 150, reorderLevel: 15, prescriptionRequired: true, controlledMedicine: false, shelfLifeValue: 24, shelfLifeUnit: "Months", description: "Long-acting NSAID for osteoarthritis (Expired Batch)", status: "expired" },

      // 11-25 Antibiotics & Antimicrobials
      { code: "MED-1011", name: "Amoxicillin 500 mg Capsule", brandName: "Mox 500", genericName: "Amoxicillin Trihydrate", category: "Antibiotic", therapeuticCategory: "Penicillin Antibiotic", manufacturer: "Ranbaxy / Sun Pharma", supplier: "National Health Logistics", countryOfOrigin: "India", dosageForm: "Capsule", strength: "500 mg", packSize: "10 Capsules", unit: "Strip", price: 70, mrp: 85, gstRate: 12, purchasePrice: 48, margin: 22, sellingPrice: 70, availableStock: 310, batchNo: "MOX/26K", expiryDate: "2027-10-15", minStockLevel: 40, maxStockLevel: 450, reorderLevel: 30, prescriptionRequired: true, controlledMedicine: false, shelfLifeValue: 24, shelfLifeUnit: "Months", description: "Broad-spectrum penicillin antibiotic", status: "active" },
      { code: "MED-1012", name: "Amoxicillin 500 mg + Clavulanic Acid 125 mg", brandName: "Augmentin 625 Duo", genericName: "Amoxicillin + Clavulanic Acid", category: "Antibiotic", therapeuticCategory: "Beta-lactamase Inhibitor", manufacturer: "GlaxoSmithKline India", supplier: "MediLife Pharma Wholesalers", countryOfOrigin: "India", dosageForm: "Tablet", strength: "625 mg", packSize: "10 Tablets", unit: "Strip", price: 200, mrp: 235, gstRate: 12, purchasePrice: 145, margin: 55, sellingPrice: 200, availableStock: 240, batchNo: "AUG/26L", expiryDate: "2027-11-20", minStockLevel: 50, maxStockLevel: 400, reorderLevel: 35, prescriptionRequired: true, controlledMedicine: false, shelfLifeValue: 24, shelfLifeUnit: "Months", description: "Gold standard for resistant bacterial infections", status: "active" },
      { code: "MED-1013", name: "Azithromycin 500 mg Tablet", brandName: "Azee 500", genericName: "Azithromycin", category: "Antibiotic", therapeuticCategory: "Macrolide Antibiotic", manufacturer: "Cipla Ltd", supplier: "Metro Medical Supplies", countryOfOrigin: "India", dosageForm: "Tablet", strength: "500 mg", packSize: "5 Tablets", unit: "Strip", price: 110, mrp: 132, gstRate: 12, purchasePrice: 78, margin: 32, sellingPrice: 110, availableStock: 380, batchNo: "AZI/26M", expiryDate: "2027-12-05", minStockLevel: 50, maxStockLevel: 500, reorderLevel: 40, prescriptionRequired: true, controlledMedicine: false, shelfLifeValue: 24, shelfLifeUnit: "Months", description: "Short-course macrolide for respiratory infections", status: "active" },
      { code: "MED-1014", name: "Ciprofloxacin 500 mg Tablet", brandName: "Ciplox 500", genericName: "Ciprofloxacin Hydrochloride", category: "Antibiotic", therapeuticCategory: "Fluoroquinolone", manufacturer: "Cipla Ltd", supplier: "Apex Pharma Distributors", countryOfOrigin: "India", dosageForm: "Tablet", strength: "500 mg", packSize: "10 Tablets", unit: "Strip", price: 42, mrp: 52, gstRate: 12, purchasePrice: 28, margin: 14, sellingPrice: 42, availableStock: 260, batchNo: "CPX/26N", expiryDate: "2027-08-30", minStockLevel: 30, maxStockLevel: 350, reorderLevel: 20, prescriptionRequired: true, controlledMedicine: false, shelfLifeValue: 24, shelfLifeUnit: "Months", description: "Urinary and gastrointestinal tract infection treatment", status: "active" },
      { code: "MED-1015", name: "Ofloxacin 200 mg Tablet", brandName: "Oflox 200", genericName: "Ofloxacin", category: "Antibiotic", therapeuticCategory: "Fluoroquinolone", manufacturer: "Ranbaxy / Sun Pharma", supplier: "National Health Logistics", countryOfOrigin: "India", dosageForm: "Tablet", strength: "200 mg", packSize: "10 Tablets", unit: "Strip", price: 65, mrp: 78, gstRate: 12, purchasePrice: 44, margin: 21, sellingPrice: 65, availableStock: 180, batchNo: "OFL/26O", expiryDate: "2027-06-15", minStockLevel: 25, maxStockLevel: 250, reorderLevel: 15, prescriptionRequired: true, controlledMedicine: false, shelfLifeValue: 24, shelfLifeUnit: "Months", description: "Broad-spectrum fluoroquinolone antibiotic", status: "active" },
      { code: "MED-1016", name: "Doxycycline 100 mg Capsule", brandName: "Doxicip 100", genericName: "Doxycycline Hyclate", category: "Antibiotic", therapeuticCategory: "Tetracycline Antibiotic", manufacturer: "Cipla Ltd", supplier: "MediLife Pharma Wholesalers", countryOfOrigin: "India", dosageForm: "Capsule", strength: "100 mg", packSize: "10 Capsules", unit: "Strip", price: 95, mrp: 115, gstRate: 12, purchasePrice: 66, margin: 29, sellingPrice: 95, availableStock: 220, batchNo: "DOX/26P", expiryDate: "2027-09-10", minStockLevel: 30, maxStockLevel: 300, reorderLevel: 20, prescriptionRequired: true, controlledMedicine: false, shelfLifeValue: 24, shelfLifeUnit: "Months", description: "Effective for acne, respiratory, and vector-borne infections", status: "active" },
      { code: "MED-1017", name: "Ceftriaxone 1 g Injection", brandName: "Monocef 1g", genericName: "Ceftriaxone Sodium", category: "Antibiotic", therapeuticCategory: "3rd Gen Cephalosporin", manufacturer: "Aristo Pharmaceuticals", supplier: "Metro Medical Supplies", countryOfOrigin: "India", dosageForm: "Injection", strength: "1000 mg", packSize: "1 Vial", unit: "Vial", price: 62, mrp: 74, gstRate: 12, purchasePrice: 40, margin: 22, sellingPrice: 62, availableStock: 150, batchNo: "MNC/26Q", expiryDate: "2027-04-25", minStockLevel: 30, maxStockLevel: 300, reorderLevel: 25, prescriptionRequired: true, controlledMedicine: false, shelfLifeValue: 24, shelfLifeUnit: "Months", description: "Parenteral cephalosporin for severe hospital admissions", status: "active" },
      { code: "MED-1018", name: "Cefixime 200 mg Tablet", brandName: "Taxim-O 200", genericName: "Cefixime Trihydrate", category: "Antibiotic", therapeuticCategory: "3rd Gen Cephalosporin", manufacturer: "Alkem Laboratories", supplier: "Apex Pharma Distributors", countryOfOrigin: "India", dosageForm: "Tablet", strength: "200 mg", packSize: "10 Tablets", unit: "Strip", price: 105, mrp: 126, gstRate: 12, purchasePrice: 72, margin: 33, sellingPrice: 105, availableStock: 175, batchNo: "TXM/26R", expiryDate: "2027-07-05", minStockLevel: 25, maxStockLevel: 250, reorderLevel: 20, prescriptionRequired: true, controlledMedicine: false, shelfLifeValue: 24, shelfLifeUnit: "Months", description: "Oral 3rd generation cephalosporin for ENT & UTI", status: "active" },
      { code: "MED-1019", name: "Metronidazole 400 mg Tablet", brandName: "Flagyl 400", genericName: "Metronidazole", category: "Antibiotic", therapeuticCategory: "Antiprotozoal / Antibacterial", manufacturer: "Abbott Healthcare", supplier: "National Health Logistics", countryOfOrigin: "India", dosageForm: "Tablet", strength: "400 mg", packSize: "15 Tablets", unit: "Strip", price: 22, mrp: 28, gstRate: 12, purchasePrice: 14, margin: 8, sellingPrice: 22, availableStock: 290, batchNo: "FGL/26S", expiryDate: "2027-11-10", minStockLevel: 40, maxStockLevel: 400, reorderLevel: 25, prescriptionRequired: true, controlledMedicine: false, shelfLifeValue: 24, shelfLifeUnit: "Months", description: "Anaerobic bacterial and amoebic infection treatment", status: "active" },
      { code: "MED-1020", name: "Levofloxacin 500 mg Tablet", brandName: "Levomac 500", genericName: "Levofloxacin", category: "Antibiotic", therapeuticCategory: "Fluoroquinolone", manufacturer: "Macleods Pharmaceuticals", supplier: "MediLife Pharma Wholesalers", countryOfOrigin: "India", dosageForm: "Tablet", strength: "500 mg", packSize: "10 Tablets", unit: "Strip", price: 92, mrp: 110, gstRate: 12, purchasePrice: 64, margin: 28, sellingPrice: 92, availableStock: 12, batchNo: "LVM/26T", expiryDate: "2026-12-15", minStockLevel: 40, maxStockLevel: 200, reorderLevel: 15, prescriptionRequired: true, controlledMedicine: false, shelfLifeValue: 24, shelfLifeUnit: "Months", description: "Potent respiratory fluoroquinolone (Reorder level alert)", status: "active" },
      { code: "MED-1021", name: "Clarithromycin 500 mg Tablet", brandName: "Claribid 500", genericName: "Clarithromycin", category: "Antibiotic", therapeuticCategory: "Macrolide Antibiotic", manufacturer: "Pfizer India", supplier: "Metro Medical Supplies", countryOfOrigin: "India", dosageForm: "Tablet", strength: "500 mg", packSize: "10 Tablets", unit: "Strip", price: 280, mrp: 330, gstRate: 12, purchasePrice: 200, margin: 80, sellingPrice: 280, availableStock: 80, batchNo: "CLR/26U", expiryDate: "2027-03-30", minStockLevel: 15, maxStockLevel: 150, reorderLevel: 10, prescriptionRequired: true, controlledMedicine: false, shelfLifeValue: 24, shelfLifeUnit: "Months", description: "H. pylori eradication and atypical pneumonia treatment", status: "active" },
      { code: "MED-1022", name: "Meropenem 1 g Injection", brandName: "Meronem 1g", genericName: "Meropenem Trihydrate", category: "Antibiotic", therapeuticCategory: "Carbapenem Antibiotic", manufacturer: "Pfizer / Astra Zeneca India", supplier: "Apex Pharma Distributors", countryOfOrigin: "India", dosageForm: "Injection", strength: "1000 mg", packSize: "1 Vial", unit: "Vial", price: 1250, mrp: 1480, gstRate: 12, purchasePrice: 950, margin: 300, sellingPrice: 1250, availableStock: 45, batchNo: "MRN/26V", expiryDate: "2027-08-20", minStockLevel: 10, maxStockLevel: 100, reorderLevel: 8, prescriptionRequired: true, controlledMedicine: false, shelfLifeValue: 24, shelfLifeUnit: "Months", description: "Reserve carbapenem for multi-drug resistant hospital ICU cases", status: "active" },
      { code: "MED-1023", name: "Cotrimoxazole 480 mg Tablet", brandName: "Septran DS", genericName: "Trimethoprim + Sulfamethoxazole", category: "Antibiotic", therapeuticCategory: "Sulfonamide Combo", manufacturer: "GlaxoSmithKline India", supplier: "National Health Logistics", countryOfOrigin: "India", dosageForm: "Tablet", strength: "960 mg", packSize: "10 Tablets", unit: "Strip", price: 28, mrp: 34, gstRate: 12, purchasePrice: 18, margin: 10, sellingPrice: 28, availableStock: 0, batchNo: "SEP/26W", expiryDate: "2027-01-20", minStockLevel: 25, maxStockLevel: 250, reorderLevel: 15, prescriptionRequired: true, controlledMedicine: false, shelfLifeValue: 24, shelfLifeUnit: "Months", description: "Folate synthesis inhibitor antibiotic (Out of Stock alert)", status: "active" },
      { code: "MED-1024", name: "Linezolid 600 mg Tablet", brandName: "Linid 600", genericName: "Linezolid", category: "Antibiotic", therapeuticCategory: "Oxazolidinone Antibiotic", manufacturer: "Cipla Ltd", supplier: "MediLife Pharma Wholesalers", countryOfOrigin: "India", dosageForm: "Tablet", strength: "600 mg", packSize: "10 Tablets", unit: "Strip", price: 340, mrp: 410, gstRate: 12, purchasePrice: 240, margin: 100, sellingPrice: 340, availableStock: 65, batchNo: "LND/26X", expiryDate: "2027-09-15", minStockLevel: 15, maxStockLevel: 120, reorderLevel: 10, prescriptionRequired: true, controlledMedicine: false, shelfLifeValue: 24, shelfLifeUnit: "Months", description: "Effective against MRSA and Vancomycin-resistant enterococci", status: "active" },
      { code: "MED-1025", name: "Nitrofurantoin 100 mg SR Tablet", brandName: "Niftran 100", genericName: "Nitrofurantoin Sustained Release", category: "Antibiotic", therapeuticCategory: "Urinary Antiseptic", manufacturer: "Ranbaxy / Sun Pharma", supplier: "Metro Medical Supplies", countryOfOrigin: "India", dosageForm: "Tablet", strength: "100 mg", packSize: "10 Tablets", unit: "Strip", price: 110, mrp: 135, gstRate: 12, purchasePrice: 78, margin: 32, sellingPrice: 110, availableStock: 110, batchNo: "NFT/26Y", expiryDate: "2027-05-10", minStockLevel: 20, maxStockLevel: 180, reorderLevel: 15, prescriptionRequired: true, controlledMedicine: false, shelfLifeValue: 24, shelfLifeUnit: "Months", description: "Specific therapeutic agent for acute and recurrent urinary tract infections", status: "active" },

      // 26-40 Antacid & Gastrointestinal
      { code: "MED-1026", name: "Pantoprazole 40 mg Tablet", brandName: "Pan-40", genericName: "Pantoprazole Sodium", category: "Antacid", therapeuticCategory: "Proton Pump Inhibitor", manufacturer: "Alkem Laboratories", supplier: "Apex Pharma Distributors", countryOfOrigin: "India", dosageForm: "Tablet", strength: "40 mg", packSize: "15 Tablets", unit: "Strip", price: 150, mrp: 178, gstRate: 12, purchasePrice: 105, margin: 45, sellingPrice: 150, availableStock: 480, batchNo: "PAN/26Z", expiryDate: "2027-10-30", minStockLevel: 60, maxStockLevel: 600, reorderLevel: 45, prescriptionRequired: false, controlledMedicine: false, shelfLifeValue: 24, shelfLifeUnit: "Months", description: "First-line proton pump inhibitor for GERD and acidity", status: "active" },
      { code: "MED-1027", name: "Omeprazole 20 mg Capsule", brandName: "Omez 20", genericName: "Omeprazole", category: "Antacid", therapeuticCategory: "Proton Pump Inhibitor", manufacturer: "Dr. Reddy's Laboratories", supplier: "National Health Logistics", countryOfOrigin: "India", dosageForm: "Capsule", strength: "20 mg", packSize: "20 Capsules", unit: "Strip", price: 65, mrp: 78, gstRate: 12, purchasePrice: 42, margin: 23, sellingPrice: 65, availableStock: 390, batchNo: "OMZ/27A", expiryDate: "2027-12-10", minStockLevel: 50, maxStockLevel: 500, reorderLevel: 35, prescriptionRequired: false, controlledMedicine: false, shelfLifeValue: 24, shelfLifeUnit: "Months", description: "Gastric acid suppression for peptic ulcer disease", status: "active" },
      { code: "MED-1028", name: "Rabeprazole 20 mg + Domperidone 30 mg SR", brandName: "Rabeloc-D SR", genericName: "Rabeprazole + Domperidone", category: "Antacid", therapeuticCategory: "PPI + Prokinetic", manufacturer: "Cadila Healthcare", supplier: "MediLife Pharma Wholesalers", countryOfOrigin: "India", dosageForm: "Capsule", strength: "20 mg / 30 mg", packSize: "10 Capsules", unit: "Strip", price: 135, mrp: 160, gstRate: 12, purchasePrice: 92, margin: 43, sellingPrice: 135, availableStock: 260, batchNo: "RBD/27B", expiryDate: "2027-11-15", minStockLevel: 30, maxStockLevel: 350, reorderLevel: 25, prescriptionRequired: true, controlledMedicine: false, shelfLifeValue: 24, shelfLifeUnit: "Months", description: "Combination PPI with prokinetic for reflux and nausea", status: "active" },
      { code: "MED-1029", name: "Ondansetron 4 mg Tablet", brandName: "Emset 4", genericName: "Ondansetron Hydrochloride", category: "Gastrointestinal", therapeuticCategory: "5-HT3 Antagonist", manufacturer: "Cipla Ltd", supplier: "Metro Medical Supplies", countryOfOrigin: "India", dosageForm: "Tablet", strength: "4 mg", packSize: "10 Tablets", unit: "Strip", price: 48, mrp: 58, gstRate: 12, purchasePrice: 30, margin: 18, sellingPrice: 48, availableStock: 310, batchNo: "EMS/27C", expiryDate: "2027-09-20", minStockLevel: 40, maxStockLevel: 400, reorderLevel: 30, prescriptionRequired: true, controlledMedicine: false, shelfLifeValue: 24, shelfLifeUnit: "Months", description: "Potent antiemetic for chemotherapy and post-op vomiting", status: "active" },
      { code: "MED-1030", name: "ORS Powder Packet 21.8 g", brandName: "Electral Powder", genericName: "Oral Rehydration Salts", category: "Gastrointestinal", therapeuticCategory: "Electrolyte Rehydrant", manufacturer: "FDC Ltd", supplier: "Apex Pharma Distributors", countryOfOrigin: "India", dosageForm: "Sachet", strength: "21.8 g", packSize: "1 Sachet", unit: "Packet", price: 22, mrp: 24, gstRate: 12, purchasePrice: 15, margin: 7, sellingPrice: 22, availableStock: 800, batchNo: "ELC/27D", expiryDate: "2028-02-28", minStockLevel: 100, maxStockLevel: 1000, reorderLevel: 80, prescriptionRequired: false, controlledMedicine: false, shelfLifeValue: 36, shelfLifeUnit: "Months", description: "WHO formulation oral rehydration therapy for dehydration", status: "active" },
      { code: "MED-1031", name: "Sucralfate 1000 mg / 10 ml Suspension", brandName: "Sucrafil 200ml", genericName: "Sucralfate", category: "Antacid", therapeuticCategory: "Mucosal Protectant", manufacturer: "Fourrts India", supplier: "National Health Logistics", countryOfOrigin: "India", dosageForm: "Syrup", strength: "1000 mg / 10 mL", packSize: "200 mL", unit: "Bottle", price: 190, mrp: 225, gstRate: 12, purchasePrice: 135, margin: 55, sellingPrice: 190, availableStock: 140, batchNo: "SCF/27E", expiryDate: "2027-06-30", minStockLevel: 20, maxStockLevel: 200, reorderLevel: 15, prescriptionRequired: true, controlledMedicine: false, shelfLifeValue: 24, shelfLifeUnit: "Months", description: "Cytoprotective coating agent for duodenal ulcers", status: "active" },
      { code: "MED-1032", name: "Ranitidine 150 mg Tablet", brandName: "Rantac 150", genericName: "Ranitidine Hydrochloride", category: "Antacid", therapeuticCategory: "H2 Receptor Blocker", manufacturer: "J.B. Chemicals", supplier: "MediLife Pharma Wholesalers", countryOfOrigin: "India", dosageForm: "Tablet", strength: "150 mg", packSize: "30 Tablets", unit: "Strip", price: 32, mrp: 40, gstRate: 12, purchasePrice: 20, margin: 12, sellingPrice: 32, availableStock: 0, batchNo: "RNT/24F", expiryDate: "2024-10-15", minStockLevel: 30, maxStockLevel: 300, reorderLevel: 20, prescriptionRequired: true, controlledMedicine: false, shelfLifeValue: 24, shelfLifeUnit: "Months", description: "H2 antagonist for mild hyperacidity (Archived/Expired status)", status: "archived" },
      { code: "MED-1033", name: "Loperamide 2 mg Capsule", brandName: "Imodium 2mg", genericName: "Loperamide Hydrochloride", category: "Gastrointestinal", therapeuticCategory: "Antidiarrheal", manufacturer: "Johnson & Johnson India", supplier: "Metro Medical Supplies", countryOfOrigin: "India", dosageForm: "Capsule", strength: "2 mg", packSize: "10 Capsules", unit: "Strip", price: 25, mrp: 30, gstRate: 12, purchasePrice: 16, margin: 9, sellingPrice: 25, availableStock: 230, batchNo: "IMD/27G", expiryDate: "2027-08-10", minStockLevel: 30, maxStockLevel: 250, reorderLevel: 20, prescriptionRequired: false, controlledMedicine: false, shelfLifeValue: 24, shelfLifeUnit: "Months", description: "Symptomatic control of acute non-specific diarrhea", status: "active" },
      { code: "MED-1034", name: "Dicyclomine 20 mg + Paracetamol 325 mg", brandName: "Meftal-Spas", genericName: "Dicyclomine + Paracetamol", category: "Gastrointestinal", therapeuticCategory: "Antispasmodic", manufacturer: "Blue Cross Laboratories", supplier: "Apex Pharma Distributors", countryOfOrigin: "India", dosageForm: "Tablet", strength: "20 mg / 325 mg", packSize: "10 Tablets", unit: "Strip", price: 48, mrp: 58, gstRate: 12, purchasePrice: 32, margin: 16, sellingPrice: 48, availableStock: 270, batchNo: "MFS/27H", expiryDate: "2027-07-25", minStockLevel: 35, maxStockLevel: 300, reorderLevel: 25, prescriptionRequired: true, controlledMedicine: false, shelfLifeValue: 24, shelfLifeUnit: "Months", description: "Smooth muscle relaxant for intestinal & renal colic spasm", status: "active" },
      { code: "MED-1035", name: "Lactulose 10 g / 15 ml Syrup", brandName: "Duphalac 150ml", genericName: "Lactulose", category: "Gastrointestinal", therapeuticCategory: "Osmotic Laxative", manufacturer: "Abbott Healthcare", supplier: "National Health Logistics", countryOfOrigin: "India", dosageForm: "Syrup", strength: "10 g / 15 mL", packSize: "150 mL", unit: "Bottle", price: 175, mrp: 210, gstRate: 12, purchasePrice: 120, margin: 55, sellingPrice: 175, availableStock: 120, batchNo: "DPH/27I", expiryDate: "2027-05-18", minStockLevel: 20, maxStockLevel: 180, reorderLevel: 15, prescriptionRequired: false, controlledMedicine: false, shelfLifeValue: 24, shelfLifeUnit: "Months", description: "Osmotic laxative for chronic constipation and hepatic encephalopathy", status: "active" },

      // 36-50 Antidiabetic & Cardiovascular
      { code: "MED-1036", name: "Metformin 500 mg SR Tablet", brandName: "Glycomet 500 SR", genericName: "Metformin Hydrochloride", category: "Antidiabetic", therapeuticCategory: "Biguanide", manufacturer: "USV Ltd", supplier: "MediLife Pharma Wholesalers", countryOfOrigin: "India", dosageForm: "Tablet", strength: "500 mg", packSize: "20 Tablets", unit: "Strip", price: 38, mrp: 46, gstRate: 12, purchasePrice: 24, margin: 14, sellingPrice: 38, availableStock: 520, batchNo: "GLY/27J", expiryDate: "2028-01-10", minStockLevel: 60, maxStockLevel: 700, reorderLevel: 50, prescriptionRequired: true, controlledMedicine: false, shelfLifeValue: 36, shelfLifeUnit: "Months", description: "First-line oral hypoglycemic agent for Type 2 Diabetes", status: "active" },
      { code: "MED-1037", name: "Metformin 1000 mg SR Tablet", brandName: "Glycomet 1g SR", genericName: "Metformin Hydrochloride", category: "Antidiabetic", therapeuticCategory: "Biguanide", manufacturer: "USV Ltd", supplier: "Metro Medical Supplies", countryOfOrigin: "India", dosageForm: "Tablet", strength: "1000 mg", packSize: "15 Tablets", unit: "Strip", price: 58, mrp: 70, gstRate: 12, purchasePrice: 38, margin: 20, sellingPrice: 58, availableStock: 340, batchNo: "GLY/27K", expiryDate: "2027-11-30", minStockLevel: 40, maxStockLevel: 450, reorderLevel: 30, prescriptionRequired: true, controlledMedicine: false, shelfLifeValue: 24, shelfLifeUnit: "Months", description: "High-dose sustained release Metformin", status: "active" },
      { code: "MED-1038", name: "Glimepiride 1 mg Tablet", brandName: "Amaryl 1mg", genericName: "Glimepiride", category: "Antidiabetic", therapeuticCategory: "Sulfonylurea", manufacturer: "Sanofi India", supplier: "Apex Pharma Distributors", countryOfOrigin: "India", dosageForm: "Tablet", strength: "1 mg", packSize: "15 Tablets", unit: "Strip", price: 72, mrp: 86, gstRate: 12, purchasePrice: 48, margin: 24, sellingPrice: 72, availableStock: 280, batchNo: "AMR/27L", expiryDate: "2027-09-25", minStockLevel: 35, maxStockLevel: 350, reorderLevel: 25, prescriptionRequired: true, controlledMedicine: false, shelfLifeValue: 24, shelfLifeUnit: "Months", description: "Insulin secretagogue for Type 2 diabetes management", status: "active" },
      { code: "MED-1039", name: "Glimepiride 2 mg + Metformin 500 mg SR", brandName: "Gluconorm-G2 SR", genericName: "Glimepiride + Metformin", category: "Antidiabetic", therapeuticCategory: "Sulfonylurea + Biguanide", manufacturer: "Lupin Ltd", supplier: "National Health Logistics", countryOfOrigin: "India", dosageForm: "Tablet", strength: "2 mg / 500 mg", packSize: "15 Tablets", unit: "Strip", price: 110, mrp: 132, gstRate: 12, purchasePrice: 75, margin: 35, sellingPrice: 110, availableStock: 290, batchNo: "GCN/27M", expiryDate: "2027-10-20", minStockLevel: 40, maxStockLevel: 400, reorderLevel: 30, prescriptionRequired: true, controlledMedicine: false, shelfLifeValue: 24, shelfLifeUnit: "Months", description: "Dual oral antidiabetic therapy for glycemic control", status: "active" },
      { code: "MED-1040", name: "Teneligliptin 20 mg Tablet", brandName: "Tenali-20", genericName: "Teneligliptin Hydrobromide", category: "Antidiabetic", therapeuticCategory: "DPP-4 Inhibitor", manufacturer: "Glenmark Pharmaceuticals", supplier: "MediLife Pharma Wholesalers", countryOfOrigin: "India", dosageForm: "Tablet", strength: "20 mg", packSize: "15 Tablets", unit: "Strip", price: 145, mrp: 175, gstRate: 12, purchasePrice: 100, margin: 45, sellingPrice: 145, availableStock: 190, batchNo: "TNL/27N", expiryDate: "2027-07-15", minStockLevel: 25, maxStockLevel: 250, reorderLevel: 20, prescriptionRequired: true, controlledMedicine: false, shelfLifeValue: 24, shelfLifeUnit: "Months", description: "Dipeptidyl peptidase-4 inhibitor for adults with T2DM", status: "active" },
      { code: "MED-1041", name: "Human Insulin 30/70 Injection 100 IU/ml", brandName: "Mixtard 30/70 10ml", genericName: "Biphasic Isophane Insulin", category: "Antidiabetic", therapeuticCategory: "Human Insulin", manufacturer: "Novo Nordisk India", supplier: "Metro Medical Supplies", countryOfOrigin: "India", dosageForm: "Injection", strength: "100 IU / mL", packSize: "10 mL Vial", unit: "Vial", price: 215, mrp: 255, gstRate: 5, purchasePrice: 160, margin: 55, sellingPrice: 215, availableStock: 95, batchNo: "MIX/27O", expiryDate: "2027-04-10", minStockLevel: 15, maxStockLevel: 120, reorderLevel: 12, prescriptionRequired: true, controlledMedicine: false, shelfLifeValue: 18, shelfLifeUnit: "Months", description: "Premixed biphasic human insulin for glycemic management", status: "active" },
      { code: "MED-1042", name: "Amlodipine 5 mg Tablet", brandName: "Amcard 5", genericName: "Amlodipine Besylate", category: "Antihypertensive", therapeuticCategory: "Calcium Channel Blocker", manufacturer: "Cipla Ltd", supplier: "Apex Pharma Distributors", countryOfOrigin: "India", dosageForm: "Tablet", strength: "5 mg", packSize: "15 Tablets", unit: "Strip", price: 28, mrp: 35, gstRate: 12, purchasePrice: 18, margin: 10, sellingPrice: 28, availableStock: 410, batchNo: "AMC/27P", expiryDate: "2028-02-15", minStockLevel: 50, maxStockLevel: 500, reorderLevel: 35, prescriptionRequired: true, controlledMedicine: false, shelfLifeValue: 36, shelfLifeUnit: "Months", description: "Long-acting calcium channel blocker for essential hypertension", status: "active" },
      { code: "MED-1043", name: "Telmisartan 40 mg Tablet", brandName: "Telma 40", genericName: "Telmisartan", category: "Antihypertensive", therapeuticCategory: "Angiotensin Receptor Blocker", manufacturer: "Glenmark Pharmaceuticals", supplier: "National Health Logistics", countryOfOrigin: "India", dosageForm: "Tablet", strength: "40 mg", packSize: "15 Tablets", unit: "Strip", price: 95, mrp: 115, gstRate: 12, purchasePrice: 65, margin: 30, sellingPrice: 95, availableStock: 330, batchNo: "TLM/27Q", expiryDate: "2027-12-01", minStockLevel: 40, maxStockLevel: 400, reorderLevel: 30, prescriptionRequired: true, controlledMedicine: false, shelfLifeValue: 24, shelfLifeUnit: "Months", description: "24-hour blood pressure control and cardiovascular protection", status: "active" },
      { code: "MED-1044", name: "Telmisartan 40 mg + Hydrochlorothiazide 12.5 mg", brandName: "Telma-H", genericName: "Telmisartan + Hydrochlorothiazide", category: "Antihypertensive", therapeuticCategory: "ARB + Thiazide Diuretic", manufacturer: "Glenmark Pharmaceuticals", supplier: "MediLife Pharma Wholesalers", countryOfOrigin: "India", dosageForm: "Tablet", strength: "40 mg / 12.5 mg", packSize: "15 Tablets", unit: "Strip", price: 125, mrp: 150, gstRate: 12, purchasePrice: 85, margin: 40, sellingPrice: 125, availableStock: 210, batchNo: "TLH/27R", expiryDate: "2027-10-05", minStockLevel: 30, maxStockLevel: 300, reorderLevel: 20, prescriptionRequired: true, controlledMedicine: false, shelfLifeValue: 24, shelfLifeUnit: "Months", description: "Combination antihypertensive with mild diuretic", status: "active" },
      { code: "MED-1045", name: "Losartan Potassium 50 mg Tablet", brandName: "Repace 50", genericName: "Losartan Potassium", category: "Antihypertensive", therapeuticCategory: "Angiotensin Receptor Blocker", manufacturer: "Sun Pharma", supplier: "Metro Medical Supplies", countryOfOrigin: "India", dosageForm: "Tablet", strength: "50 mg", packSize: "15 Tablets", unit: "Strip", price: 78, mrp: 94, gstRate: 12, purchasePrice: 52, margin: 26, sellingPrice: 78, availableStock: 190, batchNo: "RPC/27S", expiryDate: "2027-08-20", minStockLevel: 25, maxStockLevel: 250, reorderLevel: 20, prescriptionRequired: true, controlledMedicine: false, shelfLifeValue: 24, shelfLifeUnit: "Months", description: "Renoprotective antihypertensive for diabetic nephropathy", status: "active" },
      { code: "MED-1046", name: "Atorvastatin 10 mg Tablet", brandName: "Atorva 10", genericName: "Atorvastatin Calcium", category: "Cardiac", therapeuticCategory: "HMG-CoA Reductase Inhibitor", manufacturer: "Zydus Cadila", supplier: "Apex Pharma Distributors", countryOfOrigin: "India", dosageForm: "Tablet", strength: "10 mg", packSize: "15 Tablets", unit: "Strip", price: 85, mrp: 102, gstRate: 12, purchasePrice: 58, margin: 27, sellingPrice: 85, availableStock: 360, batchNo: "ATV/27T", expiryDate: "2027-11-10", minStockLevel: 45, maxStockLevel: 450, reorderLevel: 30, prescriptionRequired: true, controlledMedicine: false, shelfLifeValue: 24, shelfLifeUnit: "Months", description: "Lipid-lowering statin for dyslipidemia and ASCVD", status: "active" },
      { code: "MED-1047", name: "Rosuvastatin 10 mg Tablet", brandName: "Rosuvas 10", genericName: "Rosuvastatin Calcium", category: "Cardiac", therapeuticCategory: "HMG-CoA Reductase Inhibitor", manufacturer: "Ranbaxy / Sun Pharma", supplier: "National Health Logistics", countryOfOrigin: "India", dosageForm: "Tablet", strength: "10 mg", packSize: "15 Tablets", unit: "Strip", price: 165, mrp: 198, gstRate: 12, purchasePrice: 115, margin: 50, sellingPrice: 165, availableStock: 240, batchNo: "RSV/27U", expiryDate: "2027-09-05", minStockLevel: 30, maxStockLevel: 300, reorderLevel: 20, prescriptionRequired: true, controlledMedicine: false, shelfLifeValue: 24, shelfLifeUnit: "Months", description: "High-efficacy statin for hypercholesterolemia control", status: "active" },
      { code: "MED-1048", name: "Clopidogrel 75 mg Tablet", brandName: "Deplatt 75", genericName: "Clopidogrel Bisulfate", category: "Cardiac", therapeuticCategory: "Antiplatelet Agent", manufacturer: "Torrent Pharmaceuticals", supplier: "MediLife Pharma Wholesalers", countryOfOrigin: "India", dosageForm: "Tablet", strength: "75 mg", packSize: "15 Tablets", unit: "Strip", price: 115, mrp: 138, gstRate: 12, purchasePrice: 80, margin: 35, sellingPrice: 115, availableStock: 280, batchNo: "DPL/27V", expiryDate: "2027-06-25", minStockLevel: 30, maxStockLevel: 350, reorderLevel: 25, prescriptionRequired: true, controlledMedicine: false, shelfLifeValue: 24, shelfLifeUnit: "Months", description: "Antiplatelet therapy following coronary stent placement", status: "active" },
      { code: "MED-1049", name: "Atenolol 50 mg Tablet", brandName: "Aten 50", genericName: "Atenolol", category: "Antihypertensive", therapeuticCategory: "Beta Blocker", manufacturer: "Zydus Cadila", supplier: "Metro Medical Supplies", countryOfOrigin: "India", dosageForm: "Tablet", strength: "50 mg", packSize: "14 Tablets", unit: "Strip", price: 26, mrp: 32, gstRate: 12, purchasePrice: 17, margin: 9, sellingPrice: 26, availableStock: 300, batchNo: "ATN/27W", expiryDate: "2027-12-20", minStockLevel: 35, maxStockLevel: 350, reorderLevel: 25, prescriptionRequired: true, controlledMedicine: false, shelfLifeValue: 24, shelfLifeUnit: "Months", description: "Cardioselective beta-1 adrenergic receptor blocker", status: "active" },
      { code: "MED-1050", name: "Nitroglycerin 2.6 mg CR Tablet", brandName: "Nitrocontin 2.6", genericName: "Nitroglycerin Controlled Release", category: "Cardiac", therapeuticCategory: "Vasodilator / Antianginal", manufacturer: "Modi-Mundipharma", supplier: "Apex Pharma Distributors", countryOfOrigin: "India", dosageForm: "Tablet", strength: "2.6 mg", packSize: "30 Tablets", unit: "Bottle", price: 210, mrp: 250, gstRate: 12, purchasePrice: 150, margin: 60, sellingPrice: 210, availableStock: 85, batchNo: "NTR/27X", expiryDate: "2027-03-15", minStockLevel: 15, maxStockLevel: 120, reorderLevel: 10, prescriptionRequired: true, controlledMedicine: false, shelfLifeValue: 24, shelfLifeUnit: "Months", description: "Prophylactic management of angina pectoris attacks", status: "active" },

      // 51-65 Respiratory, Allergy, Vitamins & Supplements
      { code: "MED-1051", name: "Cetirizine 10 mg Tablet", brandName: "Okacet 10", genericName: "Cetirizine Hydrochloride", category: "Antihistamine", therapeuticCategory: "H1 Receptor Antagonist", manufacturer: "Cipla Ltd", supplier: "National Health Logistics", countryOfOrigin: "India", dosageForm: "Tablet", strength: "10 mg", packSize: "10 Tablets", unit: "Strip", price: 18, mrp: 22, gstRate: 12, purchasePrice: 11, margin: 7, sellingPrice: 18, availableStock: 600, batchNo: "OKA/28A", expiryDate: "2028-04-10", minStockLevel: 80, maxStockLevel: 800, reorderLevel: 60, prescriptionRequired: false, controlledMedicine: false, shelfLifeValue: 36, shelfLifeUnit: "Months", description: "Non-drowsy 2nd generation antihistamine for allergic rhinitis", status: "active" },
      { code: "MED-1052", name: "Levocetirizine 5 mg + Montelukast 10 mg", brandName: "Monticope", genericName: "Levocetirizine + Montelukast", category: "Respiratory", therapeuticCategory: "Antihistamine + Leukotriene Antagonist", manufacturer: "Mankind Pharma", supplier: "MediLife Pharma Wholesalers", countryOfOrigin: "India", dosageForm: "Tablet", strength: "5 mg / 10 mg", packSize: "10 Tablets", unit: "Strip", price: 115, mrp: 138, gstRate: 12, purchasePrice: 80, margin: 35, sellingPrice: 115, availableStock: 340, batchNo: "MNC/27Y", expiryDate: "2027-10-15", minStockLevel: 40, maxStockLevel: 400, reorderLevel: 30, prescriptionRequired: true, controlledMedicine: false, shelfLifeValue: 24, shelfLifeUnit: "Months", description: "Dual action therapy for asthma and allergic bronchitis", status: "active" },
      { code: "MED-1053", name: "Salbutamol 100 mcg Inhaler", brandName: "Asthalin Inhaler", genericName: "Salbutamol Sulphate", category: "Respiratory", therapeuticCategory: "Short-acting Beta-2 Agonist", manufacturer: "Cipla Ltd", supplier: "Metro Medical Supplies", countryOfOrigin: "India", dosageForm: "Inhaler", strength: "100 mcg / dose", packSize: "200 Doses", unit: "Canister", price: 145, mrp: 170, gstRate: 12, purchasePrice: 100, margin: 45, sellingPrice: 145, availableStock: 180, batchNo: "AST/27Z", expiryDate: "2027-09-30", minStockLevel: 25, maxStockLevel: 250, reorderLevel: 20, prescriptionRequired: true, controlledMedicine: false, shelfLifeValue: 24, shelfLifeUnit: "Months", description: "Rescue bronchodilator inhaler for acute bronchospasm", status: "active" },
      { code: "MED-1054", name: "Budesonide 200 mcg Inhaler", brandName: "Budecort 200", genericName: "Budesonide", category: "Respiratory", therapeuticCategory: "Inhaled Corticosteroid", manufacturer: "Cipla Ltd", supplier: "Apex Pharma Distributors", countryOfOrigin: "India", dosageForm: "Inhaler", strength: "200 mcg / dose", packSize: "200 Doses", unit: "Canister", price: 310, mrp: 365, gstRate: 12, purchasePrice: 220, margin: 90, sellingPrice: 310, availableStock: 120, batchNo: "BUD/27A", expiryDate: "2027-07-20", minStockLevel: 20, maxStockLevel: 180, reorderLevel: 15, prescriptionRequired: true, controlledMedicine: false, shelfLifeValue: 24, shelfLifeUnit: "Months", description: "Maintenance corticosteroid inhaler for bronchial asthma", status: "active" },
      { code: "MED-1055", name: "Ambroxol 30 mg / 5 ml Syrup 100 ml", brandName: "Mucolite Syrup", genericName: "Ambroxol Hydrochloride", category: "Respiratory", therapeuticCategory: "Mucolytic Agent", manufacturer: "Dr. Reddy's Laboratories", supplier: "National Health Logistics", countryOfOrigin: "India", dosageForm: "Syrup", strength: "30 mg / 5 mL", packSize: "100 mL", unit: "Bottle", price: 82, mrp: 98, gstRate: 12, purchasePrice: 56, margin: 26, sellingPrice: 82, availableStock: 210, batchNo: "MUC/27B", expiryDate: "2027-06-10", minStockLevel: 30, maxStockLevel: 300, reorderLevel: 20, prescriptionRequired: false, controlledMedicine: false, shelfLifeValue: 24, shelfLifeUnit: "Months", description: "Mucolytic agent for productive cough and thick mucus", status: "active" },
      { code: "MED-1056", name: "Calcium Carbonate 500 mg + Vitamin D3 250 IU", brandName: "Shelcal 500", genericName: "Calcium + Vitamin D3", category: "Vitamins & Supplements", therapeuticCategory: "Mineral & Vitamin Supplement", manufacturer: "Torrent Pharmaceuticals", supplier: "MediLife Pharma Wholesalers", countryOfOrigin: "India", dosageForm: "Tablet", strength: "500 mg / 250 IU", packSize: "15 Tablets", unit: "Strip", price: 118, mrp: 142, gstRate: 12, purchasePrice: 82, margin: 36, sellingPrice: 118, availableStock: 450, batchNo: "SHL/28B", expiryDate: "2028-03-15", minStockLevel: 50, maxStockLevel: 500, reorderLevel: 35, prescriptionRequired: false, controlledMedicine: false, shelfLifeValue: 36, shelfLifeUnit: "Months", description: "Essential calcium supplement for bone density and osteoporosis", status: "active" },
      { code: "MED-1057", name: "Cholecalciferol 60,000 IU Softgel Capsule", brandName: "Uprise-D3 60K", genericName: "Cholecalciferol (Vitamin D3)", category: "Vitamins & Supplements", therapeuticCategory: "Fat Soluble Vitamin", manufacturer: "Alkem Laboratories", supplier: "Metro Medical Supplies", countryOfOrigin: "India", dosageForm: "Capsule", strength: "60,000 IU", packSize: "4 Capsules", unit: "Strip", price: 125, mrp: 150, gstRate: 12, purchasePrice: 88, margin: 37, sellingPrice: 125, availableStock: 320, batchNo: "UPR/27C", expiryDate: "2027-11-05", minStockLevel: 40, maxStockLevel: 400, reorderLevel: 30, prescriptionRequired: false, controlledMedicine: false, shelfLifeValue: 24, shelfLifeUnit: "Months", description: "Weekly high-potency Vitamin D3 for deficiency correction", status: "active" },
      { code: "MED-1058", name: "Multivitamin + B-Complex + Zinc Capsule", brandName: "Becosules Z", genericName: "B-Complex Fortified with Vitamin C and Zinc", category: "Vitamins & Supplements", therapeuticCategory: "Nutritional Supplement", manufacturer: "Pfizer India", supplier: "Apex Pharma Distributors", countryOfOrigin: "India", dosageForm: "Capsule", strength: "Standard B-Complex", packSize: "20 Capsules", unit: "Strip", price: 45, mrp: 54, gstRate: 12, purchasePrice: 30, margin: 15, sellingPrice: 45, availableStock: 580, batchNo: "BEC/28C", expiryDate: "2028-05-20", minStockLevel: 60, maxStockLevel: 600, reorderLevel: 45, prescriptionRequired: false, controlledMedicine: false, shelfLifeValue: 36, shelfLifeUnit: "Months", description: "Nutritional support for tissue repair and immunity booster", status: "active" },
      { code: "MED-1059", name: "Ferrous Ascorbate + Folic Acid Tablet", brandName: "Orofer XT", genericName: "Ferrous Ascorbate + Folic Acid", category: "Vitamins & Supplements", therapeuticCategory: "Hematinic", manufacturer: "Emcure Pharmaceuticals", supplier: "National Health Logistics", countryOfOrigin: "India", dosageForm: "Tablet", strength: "100 mg / 1.5 mg", packSize: "10 Tablets", unit: "Strip", price: 160, mrp: 192, gstRate: 12, purchasePrice: 110, margin: 50, sellingPrice: 160, availableStock: 260, batchNo: "ORF/27D", expiryDate: "2027-08-15", minStockLevel: 30, maxStockLevel: 300, reorderLevel: 25, prescriptionRequired: false, controlledMedicine: false, shelfLifeValue: 24, shelfLifeUnit: "Months", description: "Hematinic combination for iron-deficiency anemia", status: "active" },
      { code: "MED-1060", name: "Vitamin C 500 mg Chewable Tablet", brandName: "Celin 500", genericName: "Ascorbic Acid", category: "Vitamins & Supplements", therapeuticCategory: "Water Soluble Vitamin", manufacturer: "GlaxoSmithKline India", supplier: "MediLife Pharma Wholesalers", countryOfOrigin: "India", dosageForm: "Tablet", strength: "500 mg", packSize: "25 Tablets", unit: "Strip", price: 38, mrp: 45, gstRate: 12, purchasePrice: 24, margin: 14, sellingPrice: 38, availableStock: 490, batchNo: "CLN/28D", expiryDate: "2028-01-30", minStockLevel: 50, maxStockLevel: 500, reorderLevel: 35, prescriptionRequired: false, controlledMedicine: false, shelfLifeValue: 36, shelfLifeUnit: "Months", description: "Antioxidant Vitamin C supplement for immunity support", status: "active" },
      { code: "MED-1061", name: "Methylcobalamin 1500 mcg Tablet", brandName: "Nurokind-OD", genericName: "Methylcobalamin (Vitamin B12)", category: "Vitamins & Supplements", therapeuticCategory: "Neurotropic Vitamin", manufacturer: "Mankind Pharma", supplier: "Metro Medical Supplies", countryOfOrigin: "India", dosageForm: "Tablet", strength: "1500 mcg", packSize: "10 Tablets", unit: "Strip", price: 105, mrp: 125, gstRate: 12, purchasePrice: 72, margin: 33, sellingPrice: 105, availableStock: 310, batchNo: "NRK/27E", expiryDate: "2027-10-25", minStockLevel: 40, maxStockLevel: 400, reorderLevel: 30, prescriptionRequired: false, controlledMedicine: false, shelfLifeValue: 24, shelfLifeUnit: "Months", description: "Active Vitamin B12 form for peripheral neuropathy management", status: "active" },
      { code: "MED-1062", name: "Paracetamol Paediatric Drops 100 mg / ml", brandName: "Calpol Paediatric Drops", genericName: "Paracetamol", category: "Pediatric", therapeuticCategory: "Pediatric Antipyretic", manufacturer: "GlaxoSmithKline India", supplier: "Apex Pharma Distributors", countryOfOrigin: "India", dosageForm: "Drops", strength: "100 mg / mL", packSize: "15 mL", unit: "Bottle", price: 34, mrp: 40, gstRate: 12, purchasePrice: 22, margin: 12, sellingPrice: 34, availableStock: 220, batchNo: "CLP/27F", expiryDate: "2027-06-20", minStockLevel: 30, maxStockLevel: 250, reorderLevel: 20, prescriptionRequired: false, controlledMedicine: false, shelfLifeValue: 24, shelfLifeUnit: "Months", description: "Infant fever and post-vaccination pain drops", status: "active" },
      { code: "MED-1063", name: "Povidone-Iodine 5% Ointment 15 g", brandName: "Betadine 5% Ointment", genericName: "Povidone-Iodine", category: "Dermatology", therapeuticCategory: "Topical Antiseptic", manufacturer: "Win-Medicare", supplier: "National Health Logistics", countryOfOrigin: "India", dosageForm: "Ointment", strength: "5% w/w", packSize: "15 g Tube", unit: "Tube", price: 65, mrp: 78, gstRate: 12, purchasePrice: 44, margin: 21, sellingPrice: 65, availableStock: 240, batchNo: "BET/27G", expiryDate: "2027-09-10", minStockLevel: 30, maxStockLevel: 250, reorderLevel: 20, prescriptionRequired: false, controlledMedicine: false, shelfLifeValue: 24, shelfLifeUnit: "Months", description: "Microbicidal topical ointment for minor wounds and burns", status: "active" },
      { code: "MED-1064", name: "Diclofenac 1% Gel 30 g", brandName: "Volini Gel 30g", genericName: "Diclofenac Diethylamine", category: "Dermatology", therapeuticCategory: "Topical Analgesic", manufacturer: "Ranbaxy / Sun Pharma", supplier: "MediLife Pharma Wholesalers", countryOfOrigin: "India", dosageForm: "Cream", strength: "1% w/w", packSize: "30 g Tube", unit: "Tube", price: 110, mrp: 130, gstRate: 12, purchasePrice: 75, margin: 35, sellingPrice: 110, availableStock: 290, batchNo: "VLN/27H", expiryDate: "2027-11-25", minStockLevel: 35, maxStockLevel: 300, reorderLevel: 25, prescriptionRequired: false, controlledMedicine: false, shelfLifeValue: 24, shelfLifeUnit: "Months", description: "Topical pain relief gel for joint strain and muscle stiffness", status: "active" },
      { code: "MED-1065", name: "Ketoconazole 2% Anti-Dandruff Shampoo 100 ml", brandName: "Scalpe Plus Shampoo", genericName: "Ketoconazole + ZPTO", category: "Dermatology", therapeuticCategory: "Topical Antifungal", manufacturer: "Glenmark Pharmaceuticals", supplier: "Metro Medical Supplies", countryOfOrigin: "India", dosageForm: "Cream", strength: "2% w/v", packSize: "100 mL", unit: "Bottle", price: 240, mrp: 285, gstRate: 12, purchasePrice: 170, margin: 70, sellingPrice: 240, availableStock: 130, batchNo: "SCP/27I", expiryDate: "2027-04-15", minStockLevel: 20, maxStockLevel: 150, reorderLevel: 15, prescriptionRequired: false, controlledMedicine: false, shelfLifeValue: 24, shelfLifeUnit: "Months", description: "Medicated antifungal shampoo for seborrheic dermatitis", status: "active" },

      // 66-75 Neurology, Controlled Drugs & Emergency Critical Care
      { code: "MED-1066", name: "Alprazolam 0.25 mg Tablet", brandName: "Alprax 0.25", genericName: "Alprazolam", category: "Neurology", therapeuticCategory: "Anxiolytic / Benzodiazepine", manufacturer: "Torrent Pharmaceuticals", supplier: "Apex Pharma Distributors", countryOfOrigin: "India", dosageForm: "Tablet", strength: "0.25 mg", packSize: "15 Tablets", unit: "Strip", price: 32, mrp: 38, gstRate: 12, purchasePrice: 20, margin: 12, sellingPrice: 32, availableStock: 150, batchNo: "ALP/27J", expiryDate: "2027-08-30", minStockLevel: 30, maxStockLevel: 200, reorderLevel: 20, prescriptionRequired: true, controlledMedicine: true, shelfLifeValue: 24, shelfLifeUnit: "Months", description: "Short-acting benzodiazepine for acute panic and anxiety disorders", status: "active" },
      { code: "MED-1067", name: "Clonazepam 0.5 mg Tablet", brandName: "Zapiz 0.5", genericName: "Clonazepam", category: "Neurology", therapeuticCategory: "Anticonvulsant / Benzodiazepine", manufacturer: "Intas Pharmaceuticals", supplier: "National Health Logistics", countryOfOrigin: "India", dosageForm: "Tablet", strength: "0.5 mg", packSize: "15 Tablets", unit: "Strip", price: 48, mrp: 58, gstRate: 12, purchasePrice: 32, margin: 16, sellingPrice: 48, availableStock: 140, batchNo: "ZPZ/27K", expiryDate: "2027-09-10", minStockLevel: 25, maxStockLevel: 180, reorderLevel: 15, prescriptionRequired: true, controlledMedicine: true, shelfLifeValue: 24, shelfLifeUnit: "Months", description: "Antiepileptic and tranquilizer agent for seizure prophylaxis", status: "active" },
      { code: "MED-1068", name: "Escitalopram 10 mg Tablet", brandName: "Nexito 10", genericName: "Escitalopram Oxalate", category: "Neurology", therapeuticCategory: "SSRI Antidepressant", manufacturer: "Sun Pharma", supplier: "MediLife Pharma Wholesalers", countryOfOrigin: "India", dosageForm: "Tablet", strength: "10 mg", packSize: "15 Tablets", unit: "Strip", price: 110, mrp: 132, gstRate: 12, purchasePrice: 75, margin: 35, sellingPrice: 110, availableStock: 175, batchNo: "NXT/27L", expiryDate: "2027-10-05", minStockLevel: 25, maxStockLevel: 200, reorderLevel: 20, prescriptionRequired: true, controlledMedicine: false, shelfLifeValue: 24, shelfLifeUnit: "Months", description: "Selective serotonin reuptake inhibitor for major depressive disorder", status: "active" },
      { code: "MED-1069", name: "Gabapentin 300 mg Capsule", brandName: "Gabapin 300", genericName: "Gabapentin", category: "Neurology", therapeuticCategory: "Anticonvulsant / Neuropathic Pain", manufacturer: "Intas Pharmaceuticals", supplier: "Metro Medical Supplies", countryOfOrigin: "India", dosageForm: "Capsule", strength: "300 mg", packSize: "10 Capsules", unit: "Strip", price: 140, mrp: 168, gstRate: 12, purchasePrice: 95, margin: 45, sellingPrice: 140, availableStock: 160, batchNo: "GBP/27M", expiryDate: "2027-07-20", minStockLevel: 25, maxStockLevel: 200, reorderLevel: 15, prescriptionRequired: true, controlledMedicine: false, shelfLifeValue: 24, shelfLifeUnit: "Months", description: "Neuropathic pain management for diabetic neuropathy and post-herpetic neuralgia", status: "active" },
      { code: "MED-1070", name: "Phenytoin Sodium 100 mg Tablet", brandName: "Dilantin 100", genericName: "Phenytoin Sodium", category: "Neurology", therapeuticCategory: "Antiepileptic", manufacturer: "Pfizer India", supplier: "Apex Pharma Distributors", countryOfOrigin: "India", dosageForm: "Tablet", strength: "100 mg", packSize: "120 Tablets", unit: "Bottle", price: 195, mrp: 230, gstRate: 12, purchasePrice: 135, margin: 60, sellingPrice: 195, availableStock: 90, batchNo: "DLT/27N", expiryDate: "2027-05-15", minStockLevel: 15, maxStockLevel: 100, reorderLevel: 10, prescriptionRequired: true, controlledMedicine: false, shelfLifeValue: 24, shelfLifeUnit: "Months", description: "Hydantoin anticonvulsant for tonic-clonic seizure management", status: "active" },
      { code: "MED-1071", name: "Adrenaline 1 mg / ml Ampoule Injection", brandName: "Adrenaline Inj 1ml", genericName: "Epinephrine Injection", category: "Emergency", therapeuticCategory: "Adrenergic Agonist", manufacturer: "Harson Laboratories", supplier: "National Health Logistics", countryOfOrigin: "India", dosageForm: "Injection", strength: "1 mg / mL", packSize: "1 Ampoule", unit: "Ampoule", price: 18, mrp: 22, gstRate: 12, purchasePrice: 12, margin: 6, sellingPrice: 18, availableStock: 300, batchNo: "ADR/27O", expiryDate: "2027-08-10", minStockLevel: 50, maxStockLevel: 400, reorderLevel: 30, prescriptionRequired: true, controlledMedicine: false, shelfLifeValue: 24, shelfLifeUnit: "Months", description: "Emergency inotrope and anaphylaxis resuscitation drug", status: "active" },
      { code: "MED-1072", name: "Atropine Sulphate 0.6 mg / ml Injection", brandName: "Atropine Inj 1ml", genericName: "Atropine Sulphate", category: "Emergency", therapeuticCategory: "Anticholinergic", manufacturer: "Troikaa Pharmaceuticals", supplier: "MediLife Pharma Wholesalers", countryOfOrigin: "India", dosageForm: "Injection", strength: "0.6 mg / mL", packSize: "1 Ampoule", unit: "Ampoule", price: 15, mrp: 18, gstRate: 12, purchasePrice: 10, margin: 5, sellingPrice: 15, availableStock: 280, batchNo: "ATP/27P", expiryDate: "2027-09-05", minStockLevel: 40, maxStockLevel: 350, reorderLevel: 25, prescriptionRequired: true, controlledMedicine: false, shelfLifeValue: 24, shelfLifeUnit: "Months", description: "Emergency treatment for severe bradycardia and organophosphate poisoning", status: "active" },
      { code: "MED-1073", name: "Hydrocortisone 100 mg Powder for Injection", brandName: "Efcorlin 100", genericName: "Hydrocortisone Sodium Succinate", category: "Emergency", therapeuticCategory: "Corticosteroid Injection", manufacturer: "GlaxoSmithKline India", supplier: "Metro Medical Supplies", countryOfOrigin: "India", dosageForm: "Injection", strength: "100 mg", packSize: "1 Vial", unit: "Vial", price: 42, mrp: 50, gstRate: 12, purchasePrice: 28, margin: 14, sellingPrice: 42, availableStock: 240, batchNo: "EFC/27Q", expiryDate: "2027-06-25", minStockLevel: 30, maxStockLevel: 300, reorderLevel: 20, prescriptionRequired: true, controlledMedicine: false, shelfLifeValue: 24, shelfLifeUnit: "Months", description: "Emergency intravenous corticosteroid for acute adrenal crisis and severe asthma", status: "active" },
      { code: "MED-1074", name: "Furosemide 20 mg / 2 ml Ampoule Injection", brandName: "Lasix Inj 2ml", genericName: "Furosemide", category: "Emergency", therapeuticCategory: "Loop Diuretic", manufacturer: "Sanofi India", supplier: "Apex Pharma Distributors", countryOfOrigin: "India", dosageForm: "Injection", strength: "20 mg / 2 mL", packSize: "1 Ampoule", unit: "Ampoule", price: 12, mrp: 15, gstRate: 12, purchasePrice: 8, margin: 4, sellingPrice: 12, availableStock: 350, batchNo: "LSX/27R", expiryDate: "2027-11-30", minStockLevel: 50, maxStockLevel: 450, reorderLevel: 35, prescriptionRequired: true, controlledMedicine: false, shelfLifeValue: 24, shelfLifeUnit: "Months", description: "Potent loop diuretic for acute pulmonary edema and fluid overload", status: "active" },
      { code: "MED-1075", name: "Heparin Sodium 5000 IU / ml Injection", brandName: "Caprin 5000", genericName: "Heparin Sodium", category: "Emergency", therapeuticCategory: "Parenteral Anticoagulant", manufacturer: "Biological E Ltd", supplier: "National Health Logistics", countryOfOrigin: "India", dosageForm: "Injection", strength: "5000 IU / mL", packSize: "5 mL Vial", unit: "Vial", price: 260, mrp: 310, gstRate: 12, purchasePrice: 180, margin: 80, sellingPrice: 260, availableStock: 110, batchNo: "HPR/27S", expiryDate: "2027-04-30", minStockLevel: 20, maxStockLevel: 150, reorderLevel: 15, prescriptionRequired: true, controlledMedicine: false, shelfLifeValue: 24, shelfLifeUnit: "Months", description: "Intravenous anticoagulant for acute DVT, PE, and STEMI management", status: "quarantined" }
    ];

    let medInsertedCount = 0;
    let medUpdatedCount = 0;

    for (const medData of sample75Medicines) {
      let existingMed = await Medicine.findOne({ code: medData.code });
      if (!existingMed) {
        await Medicine.create(medData);
        medInsertedCount++;
      } else {
        await Medicine.findOneAndUpdate({ code: medData.code }, medData, { runValidators: true });
        medUpdatedCount++;
      }
    }

    // 17. Seed 15 realistic Indian Supplier records (Supplier)
    console.log("Seeding 15 realistic Indian Supplier records...");
    const sample15Suppliers = [
      { name: "CityCare Pharma Distributors", companyType: "Pharmaceutical Distributor", gstNumber: "07AAAAA1234A1Z5", contactPerson: "Ramesh Agarwal", designation: "Regional Sales Manager", phone: "+91 98111 22001", email: "info@citycarepharma.com", city: "New Delhi", state: "Delhi", category: "Pharmaceuticals", creditLimit: 500000, outstandingBalance: 45000, preferredSupplier: true, status: "active" },
      { name: "Agra MedSupply Pvt Ltd", companyType: "Medical Equipment Supplier", gstNumber: "09BBBBB5678B2Z1", contactPerson: "Vikas Malhotra", designation: "General Manager", phone: "+91 98111 22002", email: "sales@agramedsupply.com", city: "Agra", state: "Uttar Pradesh", category: "Surgical Equipment", creditLimit: 300000, outstandingBalance: 28000, preferredSupplier: true, status: "active" },
      { name: "Krishna Surgical Suppliers", companyType: "Surgical Supplier", gstNumber: "27CCCCC9012C3Z8", contactPerson: "Sanjay Gupta", designation: "Managing Director", phone: "+91 98111 22003", email: "contact@krishnasurgical.in", city: "Mumbai", state: "Maharashtra", category: "Surgical Equipment", creditLimit: 400000, outstandingBalance: 35000, preferredSupplier: false, status: "active" },
      { name: "North India Healthcare Distributors", companyType: "General Healthcare Distributor", gstNumber: "07DDDDD3456D4Z4", contactPerson: "Deepak Saxena", designation: "Head of Operations", phone: "+91 98111 22004", email: "orders@northindiahealth.com", city: "Gurugram", state: "Haryana", category: "General Healthcare", creditLimit: 600000, outstandingBalance: 52000, preferredSupplier: true, status: "active" },
      { name: "Bharat Medical Agencies", companyType: "Hospital Consumables Supplier", gstNumber: "08EEEEE7890E5Z9", contactPerson: "Pankaj Sharma", designation: "Supply Chain Lead", phone: "+91 98111 22005", email: "bharatmedical@agencies.in", city: "Jaipur", state: "Rajasthan", category: "Medical Consumables", creditLimit: 250000, outstandingBalance: 18000, preferredSupplier: false, status: "active" },
      { name: "Sunrise Pharma & Surgicals", companyType: "Pharmaceutical Distributor", gstNumber: "24FFFFF2345F6Z3", contactPerson: "Alok Srivastava", designation: "Key Account Officer", phone: "+91 98111 22006", email: "sunrise@pharmasurgical.com", city: "Ahmedabad", state: "Gujarat", category: "Pharmaceuticals", creditLimit: 450000, outstandingBalance: 40000, preferredSupplier: true, status: "active" },
      { name: "Metro Lab Supplies", companyType: "Laboratory Supplier", gstNumber: "19GGGGG6789G7Z7", contactPerson: "Sunil Verma", designation: "Technical Sales Director", phone: "+91 98111 22007", email: "laborders@metrolab.co.in", city: "Kolkata", state: "West Bengal", category: "Laboratory Supplies", creditLimit: 350000, outstandingBalance: 22000, preferredSupplier: true, status: "active" },
      { name: "Apex Healthcare Distributors", companyType: "PPE & Safety Supplier", gstNumber: "33HHHHH0123H8Z2", contactPerson: "Rajesh Kapoor", designation: "Commercial Lead", phone: "+91 98111 22008", email: "apex@healthdist.in", city: "Chennai", state: "Tamil Nadu", category: "PPE & Safety", creditLimit: 300000, outstandingBalance: 15000, preferredSupplier: false, status: "active" },
      { name: "Lifeline Hospital Supplies", companyType: "Hospital Consumables Supplier", gstNumber: "36IIIII4567I9Z6", contactPerson: "Amit Rastogi", designation: "Regional Head", phone: "+91 98111 22009", email: "support@lifelinesupplies.com", city: "Hyderabad", state: "Telangana", category: "Medical Consumables", creditLimit: 280000, outstandingBalance: 19000, preferredSupplier: false, status: "active" },
      { name: "MedTech Solutions India", companyType: "Medical Equipment Supplier", gstNumber: "29JJJJJ8901J0Z1", contactPerson: "Vivek Jain", designation: "Product Specialist", phone: "+91 98111 22010", email: "jain@medtechsolutions.in", city: "Bengaluru", state: "Karnataka", category: "Surgical Equipment", creditLimit: 700000, outstandingBalance: 65000, preferredSupplier: true, status: "active" },
      { name: "Imperial Disposable Care", companyType: "Hospital Consumables Supplier", gstNumber: "09KKKKK2345K1Z5", contactPerson: "Manoj Kumar", designation: "Accounts Manager", phone: "+91 98111 22011", email: "imperial@disposablecare.com", city: "Noida", state: "Uttar Pradesh", category: "Medical Consumables", creditLimit: 200000, outstandingBalance: 12000, preferredSupplier: false, status: "active" },
      { name: "Global Surgical Instruments", companyType: "Surgical Supplier", gstNumber: "07LLLLL6789L2Z9", contactPerson: "Nitin Garg", designation: "Managing Director", phone: "+91 98111 22012", email: "info@globalsurgical.in", city: "New Delhi", state: "Delhi", category: "Surgical Equipment", creditLimit: 500000, outstandingBalance: 48000, preferredSupplier: false, status: "active" },
      { name: "Vanguard Lab Reagents", companyType: "Laboratory Supplier", gstNumber: "27MMMMM0123M3Z3", contactPerson: "Pradeep Joshi", designation: "Scientific Officer", phone: "+91 98111 22013", email: "vanguard@labreagents.com", city: "Pune", state: "Maharashtra", category: "Laboratory Supplies", creditLimit: 320000, outstandingBalance: 24000, preferredSupplier: false, status: "active" },
      { name: "CarePlus Safety Wear", companyType: "PPE & Safety Supplier", gstNumber: "24NNNNN4567N4Z8", contactPerson: "Suresh Mehta", designation: "Logistics Coordinator", phone: "+91 98111 22014", email: "careplus@safetywear.in", city: "Surat", state: "Gujarat", category: "PPE & Safety", creditLimit: 180000, outstandingBalance: 9000, preferredSupplier: false, status: "active" },
      { name: "Precision BioMed Agencies", companyType: "General Healthcare Distributor", gstNumber: "09OOOOO8901O5Z2", contactPerson: "Anil Agrawal", designation: "Partner", phone: "+91 98111 22015", email: "agrawal@precisionbiomed.in", city: "Kanpur", state: "Uttar Pradesh", category: "General Healthcare", creditLimit: 150000, outstandingBalance: 0, preferredSupplier: false, status: "inactive" },
    ];

    let supplierInsertedCount = 0;
    let supplierUpdatedCount = 0;

    for (const supData of sample15Suppliers) {
      let existingSup = await Supplier.findOne({ name: supData.name });
      if (!existingSup) {
        await Supplier.create(supData);
        supplierInsertedCount++;
      } else {
        await Supplier.findOneAndUpdate({ name: supData.name }, supData, { runValidators: true });
        supplierUpdatedCount++;
      }
    }

    const dbSuppliers = await Supplier.find({});
    const getSupId = (cat) => {
      const match = dbSuppliers.find((s) => s.category === cat) || dbSuppliers[0];
      return match._id;
    };

    // 18. Seed 75 realistic Hospital InventoryItems (InventoryItem)
    console.log("Seeding 75 realistic Hospital InventoryItems...");
    const sample75InventoryItems = [
      // Consumables & Disposable Syringes
      { itemName: "Disposable Syringes 5ml with Needle", category: "Consumables", quantity: 1200, unit: "box", minimumStock: 200, supplierId: getSupId("Medical Consumables"), batchNumber: "BAT-2026-001", expiryDate: new Date("2028-06-30"), status: "active" },
      { itemName: "Disposable Syringes 2ml with Needle", category: "Consumables", quantity: 950, unit: "box", minimumStock: 150, supplierId: getSupId("Medical Consumables"), batchNumber: "BAT-2026-002", expiryDate: new Date("2028-08-15"), status: "active" },
      { itemName: "Disposable Syringes 10ml with Needle", category: "Consumables", quantity: 600, unit: "box", minimumStock: 100, supplierId: getSupId("Medical Consumables"), batchNumber: "BAT-2026-003", expiryDate: new Date("2028-05-20"), status: "active" },
      { itemName: "IV Cannula 20G (Pink)", category: "Consumables", quantity: 450, unit: "piece", minimumStock: 80, supplierId: getSupId("Medical Consumables"), batchNumber: "BAT-2026-004", expiryDate: new Date("2028-04-10"), status: "active" },
      { itemName: "IV Cannula 18G (Green)", category: "Consumables", quantity: 380, unit: "piece", minimumStock: 60, supplierId: getSupId("Medical Consumables"), batchNumber: "BAT-2026-005", expiryDate: new Date("2028-07-25"), status: "active" },
      { itemName: "IV Cannula 22G (Blue)", category: "Consumables", quantity: 300, unit: "piece", minimumStock: 50, supplierId: getSupId("Medical Consumables"), batchNumber: "BAT-2026-006", expiryDate: new Date("2028-03-18"), status: "active" },
      { itemName: "IV Infusion Set with Air Vent", category: "Consumables", quantity: 520, unit: "pack", minimumStock: 100, supplierId: getSupId("Medical Consumables"), batchNumber: "BAT-2026-007", expiryDate: new Date("2028-09-12"), status: "active" },

      // PPE & Safety Wear
      { itemName: "Surgical Latex Gloves Powder-Free Size 7.5", category: "PPE & Safety", quantity: 850, unit: "box", minimumStock: 150, supplierId: getSupId("PPE & Safety"), batchNumber: "BAT-2026-008", expiryDate: new Date("2028-11-30"), status: "active" },
      { itemName: "Surgical Latex Gloves Powder-Free Size 7.0", category: "PPE & Safety", quantity: 720, unit: "box", minimumStock: 120, supplierId: getSupId("PPE & Safety"), batchNumber: "BAT-2026-009", expiryDate: new Date("2028-10-15"), status: "active" },
      { itemName: "Surgical Face Mask 3-Ply Fluid Resistant", category: "PPE & Safety", quantity: 2500, unit: "box", minimumStock: 300, supplierId: getSupId("PPE & Safety"), batchNumber: "BAT-2026-010", expiryDate: new Date("2029-01-20"), status: "active" },
      { itemName: "N95 Particulate Respirator Mask (NIOSH)", category: "PPE & Safety", quantity: 420, unit: "piece", minimumStock: 80, supplierId: getSupId("PPE & Safety"), batchNumber: "BAT-2026-011", expiryDate: new Date("2028-12-05"), status: "active" },
      { itemName: "Disposable Surgical Gowns Fluid-Proof", category: "PPE & Safety", quantity: 210, unit: "piece", minimumStock: 50, supplierId: getSupId("PPE & Safety"), batchNumber: "BAT-2026-012", expiryDate: new Date("2028-06-18"), status: "active" },
      { itemName: "Protective Eyewear Safety Goggles", category: "PPE & Safety", quantity: 140, unit: "piece", minimumStock: 30, supplierId: getSupId("PPE & Safety"), batchNumber: "BAT-2026-013", expiryDate: null, status: "active" },

      // Dressing Materials & Bandages
      { itemName: "Absorbent Gauze Roll 90cm x 18m", category: "Dressing Materials", quantity: 180, unit: "roll", minimumStock: 30, supplierId: getSupId("Medical Consumables"), batchNumber: "BAT-2026-014", expiryDate: new Date("2029-02-10"), status: "active" },
      { itemName: "Sterile Gauze Swabs 10cm x 10cm (Pack of 100)", category: "Dressing Materials", quantity: 340, unit: "pack", minimumStock: 50, supplierId: getSupId("Medical Consumables"), batchNumber: "BAT-2026-015", expiryDate: new Date("2028-08-30"), status: "active" },
      { itemName: "Adhesive Micropore Tape 2.5cm", category: "Dressing Materials", quantity: 290, unit: "roll", minimumStock: 40, supplierId: getSupId("Medical Consumables"), batchNumber: "BAT-2026-016", expiryDate: new Date("2028-09-05"), status: "active" },
      { itemName: "Elastic Crepe Bandage 10cm", category: "Dressing Materials", quantity: 160, unit: "roll", minimumStock: 25, supplierId: getSupId("Medical Consumables"), batchNumber: "BAT-2026-017", expiryDate: new Date("2029-04-12"), status: "active" },
      { itemName: "Cotton Roll Absorbent 500g", category: "Dressing Materials", quantity: 220, unit: "roll", minimumStock: 35, supplierId: getSupId("Medical Consumables"), batchNumber: "BAT-2026-018", expiryDate: new Date("2029-03-01"), status: "active" },

      // Laboratory Supplies
      { itemName: "Blood Collection Tubes EDTA K2 (Purple Cap 3ml)", category: "Lab Supplies", quantity: 1500, unit: "box", minimumStock: 250, supplierId: getSupId("Laboratory Supplies"), batchNumber: "BAT-2026-019", expiryDate: new Date("2027-10-30"), status: "active" },
      { itemName: "Blood Collection Tubes Clot Activator (Red Cap 5ml)", category: "Lab Supplies", quantity: 1100, unit: "box", minimumStock: 200, supplierId: getSupId("Laboratory Supplies"), batchNumber: "BAT-2026-020", expiryDate: new Date("2027-11-15"), status: "active" },
      { itemName: "Microscopic Glass Slides Frosted End (75x25mm)", category: "Lab Supplies", quantity: 650, unit: "box", minimumStock: 100, supplierId: getSupId("Laboratory Supplies"), batchNumber: "BAT-2026-021", expiryDate: null, status: "active" },
      { itemName: "Urine Container Sterile 50ml", category: "Lab Supplies", quantity: 800, unit: "piece", minimumStock: 150, supplierId: getSupId("Laboratory Supplies"), batchNumber: "BAT-2026-022", expiryDate: new Date("2028-07-10"), status: "active" },
      { itemName: "Alcohol Swabs 70% Isopropyl (Box of 100)", category: "Lab Supplies", quantity: 420, unit: "box", minimumStock: 80, supplierId: getSupId("Laboratory Supplies"), batchNumber: "BAT-2026-023", expiryDate: new Date("2028-05-25"), status: "active" },
      { itemName: "Lancets Sterile 28G (Box of 100)", category: "Lab Supplies", quantity: 380, unit: "box", minimumStock: 60, supplierId: getSupId("Laboratory Supplies"), batchNumber: "BAT-2026-024", expiryDate: new Date("2028-12-15"), status: "active" },

      // Surgical Equipment & Instruments
      { itemName: "Sterile Scalpel Blade No. 11 (Box of 100)", category: "Surgical Equipment", quantity: 230, unit: "box", minimumStock: 40, supplierId: getSupId("Surgical Equipment"), batchNumber: "BAT-2026-025", expiryDate: new Date("2028-09-20"), status: "active" },
      { itemName: "Surgical Scissors Mayo Curved 17cm Stainless", category: "Surgical Equipment", quantity: 45, unit: "piece", minimumStock: 10, supplierId: getSupId("Surgical Equipment"), batchNumber: "BAT-2026-026", expiryDate: null, status: "active" },
      { itemName: "Artery Forceps Halsted Mosquito Straight 12.5cm", category: "Surgical Equipment", quantity: 60, unit: "piece", minimumStock: 15, supplierId: getSupId("Surgical Equipment"), batchNumber: "BAT-2026-027", expiryDate: null, status: "active" },
      { itemName: "Needle Holder Mayo-Hegar 18cm Stainless", category: "Surgical Equipment", quantity: 35, unit: "piece", minimumStock: 8, supplierId: getSupId("Surgical Equipment"), batchNumber: "BAT-2026-028", expiryDate: null, status: "active" },
      { itemName: "Chromic Catgut Suture 2-0 with Needle", category: "Surgical Equipment", quantity: 190, unit: "box", minimumStock: 30, supplierId: getSupId("Surgical Equipment"), batchNumber: "BAT-2026-029", expiryDate: new Date("2028-03-30"), status: "active" },
      { itemName: "Vicryl Polyglactin Suture 3-0 Reverse Cutting", category: "Surgical Equipment", quantity: 175, unit: "box", minimumStock: 30, supplierId: getSupId("Surgical Equipment"), batchNumber: "BAT-2026-030", expiryDate: new Date("2028-04-22"), status: "active" },

      // IV Fluids & Emergency Supplies
      { itemName: "Normal Saline 0.9% IV Infusion 500ml", category: "IV Supplies", quantity: 750, unit: "bottle", minimumStock: 150, supplierId: getSupId("Pharmaceuticals"), batchNumber: "BAT-2026-031", expiryDate: new Date("2027-12-31"), status: "active" },
      { itemName: "Ringer Lactate IV Infusion 500ml", category: "IV Supplies", quantity: 620, unit: "bottle", minimumStock: 120, supplierId: getSupId("Pharmaceuticals"), batchNumber: "BAT-2026-032", expiryDate: new Date("2027-11-20"), status: "active" },
      { itemName: "Dextrose 5% IV Infusion 500ml", category: "IV Supplies", quantity: 480, unit: "bottle", minimumStock: 100, supplierId: getSupId("Pharmaceuticals"), batchNumber: "BAT-2026-033", expiryDate: new Date("2027-10-15"), status: "active" },
      { itemName: "Central Venous Catheter Kit Triple Lumen 7Fr", category: "Emergency Supplies", quantity: 65, unit: "kit", minimumStock: 15, supplierId: getSupId("Surgical Equipment"), batchNumber: "BAT-2026-034", expiryDate: new Date("2028-01-10"), status: "active" },
      { itemName: "Endotracheal Tube Cuffed 7.5mm", category: "Emergency Supplies", quantity: 90, unit: "piece", minimumStock: 20, supplierId: getSupId("Surgical Equipment"), batchNumber: "BAT-2026-035", expiryDate: new Date("2028-06-25"), status: "active" },
      { itemName: "Foley Catheter 2-Way Silicone 16Fr", category: "Consumables", quantity: 140, unit: "piece", minimumStock: 30, supplierId: getSupId("Medical Consumables"), batchNumber: "BAT-2026-036", expiryDate: new Date("2028-05-14"), status: "active" },
      { itemName: "Urine Drainage Bag 2000ml with Anti-Reflux Valve", category: "Consumables", quantity: 310, unit: "piece", minimumStock: 50, supplierId: getSupId("Medical Consumables"), batchNumber: "BAT-2026-037", expiryDate: new Date("2028-09-08"), status: "active" },

      // Low Stock Items (Quantity <= MinimumStock)
      { itemName: "ECG Thermal Paper Roll 210mm x 20m", category: "Emergency Supplies", quantity: 15, unit: "roll", minimumStock: 25, supplierId: getSupId("General Healthcare"), batchNumber: "BAT-2026-038", expiryDate: null, status: "active" },
      { itemName: "Defibrillator Adult Pacing Pads (Pair)", category: "Emergency Supplies", quantity: 8, unit: "pack", minimumStock: 15, supplierId: getSupId("General Healthcare"), batchNumber: "BAT-2026-039", expiryDate: new Date("2027-04-18"), status: "active" },
      { itemName: "Suction Catheter Plain 14Fr", category: "Consumables", quantity: 12, unit: "piece", minimumStock: 20, supplierId: getSupId("Medical Consumables"), batchNumber: "BAT-2026-040", expiryDate: new Date("2027-08-30"), status: "active" },
      { itemName: "Nebulizer Kit with Adult Mask", category: "Respiratory", quantity: 10, unit: "kit", minimumStock: 25, supplierId: getSupId("General Healthcare"), batchNumber: "BAT-2026-041", expiryDate: new Date("2028-02-14"), status: "active" },
      { itemName: "Digital Clinical Thermometer Waterproof", category: "Consumables", quantity: 14, unit: "piece", minimumStock: 30, supplierId: getSupId("General Healthcare"), batchNumber: "BAT-2026-042", expiryDate: null, status: "active" },
      { itemName: "Sterile Oxygen Mask Adult with Tubing", category: "Respiratory", quantity: 18, unit: "piece", minimumStock: 40, supplierId: getSupId("Medical Consumables"), batchNumber: "BAT-2026-043", expiryDate: new Date("2028-03-25"), status: "active" },
      { itemName: "BP Cuff Adult Double Tube Nylon", category: "General Healthcare", quantity: 6, unit: "piece", minimumStock: 15, supplierId: getSupId("General Healthcare"), batchNumber: "BAT-2026-044", expiryDate: null, status: "active" },
      { itemName: "Stethoscope Dual Head Adult Stainless", category: "General Healthcare", quantity: 5, unit: "piece", minimumStock: 10, supplierId: getSupId("General Healthcare"), batchNumber: "BAT-2026-045", expiryDate: null, status: "active" },
      { itemName: "Infant Oxygen Hood Transparent", category: "Respiratory", quantity: 4, unit: "piece", minimumStock: 10, supplierId: getSupId("General Healthcare"), batchNumber: "BAT-2026-046", expiryDate: null, status: "active" },
      { itemName: "Tracheostomy Tube Cuffed 8.0mm", category: "Emergency Supplies", quantity: 7, unit: "piece", minimumStock: 15, supplierId: getSupId("Surgical Equipment"), batchNumber: "BAT-2026-047", expiryDate: new Date("2028-01-30"), status: "active" },
      { itemName: "Spinal Needle 25G (Orange)", category: "Surgical Equipment", quantity: 11, unit: "piece", minimumStock: 25, supplierId: getSupId("Surgical Equipment"), batchNumber: "BAT-2026-048", expiryDate: new Date("2027-12-20"), status: "active" },
      { itemName: "Epidural Anesthesia Kit 18G", category: "Surgical Equipment", quantity: 9, unit: "kit", minimumStock: 20, supplierId: getSupId("Surgical Equipment"), batchNumber: "BAT-2026-049", expiryDate: new Date("2027-11-10"), status: "active" },

      // Out of Stock Items (Quantity = 0)
      { itemName: "Pulse Oximeter Fingertip Sensor Probe", category: "Emergency Supplies", quantity: 0, unit: "piece", minimumStock: 15, supplierId: getSupId("General Healthcare"), batchNumber: "BAT-2026-050", expiryDate: null, status: "active" },
      { itemName: "Glucometer Test Strips (Box of 50)", category: "Lab Supplies", quantity: 0, unit: "box", minimumStock: 30, supplierId: getSupId("Laboratory Supplies"), batchNumber: "BAT-2026-051", expiryDate: new Date("2027-05-15"), status: "active" },
      { itemName: "Sterilization Pouches Reel 15cm x 200m", category: "Cleaning Supplies", quantity: 0, unit: "roll", minimumStock: 10, supplierId: getSupId("Medical Consumables"), batchNumber: "BAT-2026-052", expiryDate: null, status: "active" },
      { itemName: "Sodium Hypochlorite Disinfectant Solution 5L", category: "Cleaning Supplies", quantity: 0, unit: "canister", minimumStock: 20, supplierId: getSupId("Medical Consumables"), batchNumber: "BAT-2026-053", expiryDate: new Date("2026-10-30"), status: "active" },
      { itemName: "Biomedical Hazard Waste Bags Red 50L", category: "Cleaning Supplies", quantity: 0, unit: "pack", minimumStock: 50, supplierId: getSupId("Medical Consumables"), batchNumber: "BAT-2026-054", expiryDate: null, status: "active" },

      // Expired Stock Items (Expiry Date in Past)
      { itemName: "Sterile Surgical Gloves Powdered Size 8.0", category: "PPE & Safety", quantity: 80, unit: "box", minimumStock: 20, supplierId: getSupId("PPE & Safety"), batchNumber: "BAT-2024-EX1", expiryDate: new Date("2024-11-30"), status: "inactive" },
      { itemName: "Viral Transport Medium (VTM) Kit", category: "Lab Supplies", quantity: 120, unit: "kit", minimumStock: 30, supplierId: getSupId("Laboratory Supplies"), batchNumber: "BAT-2024-EX2", expiryDate: new Date("2025-02-15"), status: "inactive" },
      { itemName: "Rapid Dengue NS1 Antigen Test Cassette", category: "Lab Supplies", quantity: 50, unit: "box", minimumStock: 15, supplierId: getSupId("Laboratory Supplies"), batchNumber: "BAT-2024-EX3", expiryDate: new Date("2025-06-20"), status: "inactive" },

      // Additional Standard Consumables (55 to 75)
      { itemName: "Hand Sanitizer Rub 500ml Pump Bottle", category: "Cleaning Supplies", quantity: 450, unit: "bottle", minimumStock: 60, supplierId: getSupId("Medical Consumables"), batchNumber: "BAT-2026-058", expiryDate: new Date("2028-08-01"), status: "active" },
      { itemName: "Surface Disinfectant Spray 500ml", category: "Cleaning Supplies", quantity: 280, unit: "bottle", minimumStock: 40, supplierId: getSupId("Medical Consumables"), batchNumber: "BAT-2026-059", expiryDate: new Date("2028-07-15"), status: "active" },
      { itemName: "Eye Wash Sterile Saline Solution 250ml", category: "Emergency Supplies", quantity: 130, unit: "bottle", minimumStock: 20, supplierId: getSupId("Medical Consumables"), batchNumber: "BAT-2026-060", expiryDate: new Date("2028-09-30"), status: "active" },
      { itemName: "Humidifier Bottle for Oxygen Concentrator", category: "Respiratory", quantity: 95, unit: "piece", minimumStock: 15, supplierId: getSupId("General Healthcare"), batchNumber: "BAT-2026-061", expiryDate: null, status: "active" },
      { itemName: "Nasal Cannula Adult Twin Bore", category: "Respiratory", quantity: 320, unit: "piece", minimumStock: 50, supplierId: getSupId("Medical Consumables"), batchNumber: "BAT-2026-062", expiryDate: new Date("2028-10-10"), status: "active" },
      { itemName: "Venturi Mask Variable Concentration Adult", category: "Respiratory", quantity: 85, unit: "piece", minimumStock: 15, supplierId: getSupId("Medical Consumables"), batchNumber: "BAT-2026-063", expiryDate: new Date("2028-06-05"), status: "active" },
      { itemName: "Feeding Tube Ryle's Size 16Fr", category: "Consumables", quantity: 140, unit: "piece", minimumStock: 25, supplierId: getSupId("Medical Consumables"), batchNumber: "BAT-2026-064", expiryDate: new Date("2028-04-18"), status: "active" },
      { itemName: "Mucus Extractor Infant Disposable 25ml", category: "Pediatric", quantity: 110, unit: "piece", minimumStock: 20, supplierId: getSupId("Medical Consumables"), batchNumber: "BAT-2026-065", expiryDate: new Date("2028-03-22"), status: "active" },
      { itemName: "Umbilical Cord Clamp Sterile", category: "Pediatric", quantity: 260, unit: "piece", minimumStock: 40, supplierId: getSupId("Medical Consumables"), batchNumber: "BAT-2026-066", expiryDate: new Date("2028-11-08"), status: "active" },
      { itemName: "Tourniquet Latex-Free Buckle Type", category: "Consumables", quantity: 175, unit: "piece", minimumStock: 30, supplierId: getSupId("Medical Consumables"), batchNumber: "BAT-2026-067", expiryDate: null, status: "active" },
      { itemName: "Sharps Container Biohazard 5L", category: "Cleaning Supplies", quantity: 210, unit: "piece", minimumStock: 35, supplierId: getSupId("Medical Consumables"), batchNumber: "BAT-2026-068", expiryDate: null, status: "active" },
      { itemName: "Autoclave Indicator Tape 19mm x 50m", category: "Cleaning Supplies", quantity: 145, unit: "roll", minimumStock: 20, supplierId: getSupId("Medical Consumables"), batchNumber: "BAT-2026-069", expiryDate: null, status: "active" },
      { itemName: "Formalin Solution 10% Neutral Buffered 5L", category: "Lab Supplies", quantity: 60, unit: "canister", minimumStock: 10, supplierId: getSupId("Laboratory Supplies"), batchNumber: "BAT-2026-070", expiryDate: new Date("2028-02-28"), status: "active" },
      { itemName: "Giemsa Stain Solution 500ml", category: "Lab Supplies", quantity: 45, unit: "bottle", minimumStock: 10, supplierId: getSupId("Laboratory Supplies"), batchNumber: "BAT-2026-071", expiryDate: new Date("2028-01-15"), status: "active" },
      { itemName: "Gram Stain Kit 4x250ml", category: "Lab Supplies", quantity: 38, unit: "kit", minimumStock: 8, supplierId: getSupId("Laboratory Supplies"), batchNumber: "BAT-2026-072", expiryDate: new Date("2027-12-10"), status: "active" },
      { itemName: "Normal Saline Wash Bottle 500ml", category: "Consumables", quantity: 210, unit: "bottle", minimumStock: 30, supplierId: getSupId("Medical Consumables"), batchNumber: "BAT-2026-073", expiryDate: new Date("2028-05-12"), status: "active" },
      { itemName: "Sterile Wooden Tongue Depressors (Box of 100)", category: "Consumables", quantity: 380, unit: "box", minimumStock: 50, supplierId: getSupId("Medical Consumables"), batchNumber: "BAT-2026-074", expiryDate: null, status: "active" },
      { itemName: "Paper Bed Sheets Disposable (Roll 60cm x 50m)", category: "Consumables", quantity: 125, unit: "roll", minimumStock: 20, supplierId: getSupId("Medical Consumables"), batchNumber: "BAT-2026-075", expiryDate: null, status: "active" },
    ];

    let invInsertedCount = 0;
    let invUpdatedCount = 0;

    for (const invData of sample75InventoryItems) {
      let existingInv = await InventoryItem.findOne({ itemName: invData.itemName, batchNumber: invData.batchNumber });
      if (!existingInv) {
        await InventoryItem.create(invData);
        invInsertedCount++;
      } else {
        await InventoryItem.findOneAndUpdate({ itemName: invData.itemName, batchNumber: invData.batchNumber }, invData, { runValidators: true });
        invUpdatedCount++;
      }
    }

    // ============================================================
    // STEP 19: SEED 80 PHARMACY SALES
    // ============================================================
    console.log("🌱 Seeding Pharmacy Sales (Target: 80)...");

    const fetchedMedicines = await Medicine.find({ status: "active" });
    const fetchedPatients = await Patient.find({ isDeleted: false });
    
    const pharmacistRoleObj = await Role.findOne({ name: ROLES.PHARMACIST });
    const superAdminRoleObj = await Role.findOne({ name: ROLES.SUPER_ADMIN });
    const billingRoleObj = await Role.findOne({ name: ROLES.BILLING });
    const receptionistRoleObj = await Role.findOne({ name: ROLES.RECEPTIONIST });

    const pharmacistRoleIds = [pharmacistRoleObj?._id, superAdminRoleObj?._id].filter(Boolean);
    const billingRoleIds = [billingRoleObj?._id, receptionistRoleObj?._id, superAdminRoleObj?._id].filter(Boolean);

    const pharmacistUsers = await User.find({ roleId: { $in: pharmacistRoleIds } });
    const activeAdmissions = await Admission.find({ status: "admitted" });

    // 80 sales: 20 walk-in, 40 OPD patient, 20 IPD patient
    const generatedSales = [];
    const paymentMethods = ["Cash", "UPI", "Card", "Credit"];

    for (let i = 1; i <= 80; i++) {
      const invoiceNo = `PH-2026-${String(i).padStart(4, "0")}`;
      let customerType = "Walk-in Customer";
      let patientObj = null;
      let customerName = "Walk-in Customer";
      let mobileNumber = `+91 98${10000000 + i}`;

      if (i <= 20) {
        customerType = "Walk-in Customer";
        customerName = `Walk-in Patient ${i}`;
      } else if (i <= 60) {
        customerType = "OPD Patient";
        patientObj = fetchedPatients[(i - 21) % fetchedPatients.length];
        customerName = patientObj.name;
        mobileNumber = patientObj.phone;
      } else {
        customerType = "IPD Patient";
        const adm = activeAdmissions[(i - 61) % activeAdmissions.length];
        const pMatch = fetchedPatients.find(p => p._id.toString() === adm.patientId.toString());
        patientObj = pMatch || fetchedPatients[i % fetchedPatients.length];
        customerName = patientObj.name;
        mobileNumber = patientObj.phone;
      }

      // Pick 1 to 4 items from fetchedMedicines
      const itemCount = (i % 4) + 1;
      const saleMedicines = [];
      let subTotal = 0;
      let totalQty = 0;

      for (let j = 0; j < itemCount; j++) {
        const med = fetchedMedicines[(i + j * 7) % fetchedMedicines.length];
        const quantity = ((i + j) % 3) + 1;
        const unitPrice = med.sellingPrice || med.mrp || 50;
        const amount = Number((quantity * unitPrice).toFixed(2));

        saleMedicines.push({
          medicineId: med._id,
          medicineName: med.brandName,
          batchNo: `BAT-2026-${String((i * 3 + j) % 50 + 1).padStart(3, "0")}`,
          expiryDate: med.expiry || new Date("2027-12-31"),
          quantity,
          unit: med.unit || "strip",
          unitPrice,
          amount
        });

        subTotal += amount;
        totalQty += quantity;
      }

      subTotal = Number(subTotal.toFixed(2));
      const discountAmount = i % 5 === 0 ? Number((subTotal * 0.1).toFixed(2)) : 0;
      const taxable = subTotal - discountAmount;
      const gstAmount = Number((taxable * 0.12).toFixed(2));
      const grandTotal = Number((taxable + gstAmount).toFixed(2));

      const paymentMethod = paymentMethods[i % paymentMethods.length];
      const isPending = i % 15 === 0 && paymentMethod === "Credit";
      const paymentStatus = isPending ? "pending" : "paid";
      const amountReceived = isPending ? 0 : (paymentMethod === "Cash" ? Math.ceil(grandTotal / 50) * 50 : grandTotal);
      const changeAmount = isPending ? 0 : Number((amountReceived - grandTotal).toFixed(2));

      const soldByUser = pharmacistUsers[i % pharmacistUsers.length] || pharmacistUsers[0];

      // Date range spread over past 60 days
      const saleDate = new Date(Date.now() - (80 - i) * 18 * 3600 * 1000);

      generatedSales.push({
        invoiceNo,
        customerType,
        customerName,
        mobileNumber,
        prescriptionNo: i % 2 === 0 ? `RX-2026-${String(i).padStart(4, "0")}` : null,
        patientId: patientObj ? patientObj._id : null,
        medicines: saleMedicines,
        totalItems: saleMedicines.length,
        totalQuantity: totalQty,
        subTotal,
        discountAmount,
        gstAmount,
        totalAmount: grandTotal,
        grandTotal,
        paymentMethod,
        amountReceived,
        changeAmount,
        notes: `Standard pharmacy sale record ${i}`,
        paymentStatus,
        printInvoice: true,
        soldBy: soldByUser._id,
        createdAt: saleDate,
        updatedAt: saleDate
      });
    }

    let saleInsertedCount = 0;
    let saleUpdatedCount = 0;

    for (const saleData of generatedSales) {
      let existingSale = await PharmacySale.findOne({ invoiceNo: saleData.invoiceNo });
      if (!existingSale) {
        await PharmacySale.create(saleData);
        saleInsertedCount++;
      } else {
        await PharmacySale.findOneAndUpdate({ invoiceNo: saleData.invoiceNo }, saleData, { runValidators: true });
        saleUpdatedCount++;
      }
    }

    // ============================================================
    // STEP 20: SEED 140 GENERAL INVOICES
    // ============================================================
    console.log("🌱 Seeding General Invoices (Target: 140)...");

    const allAppointments = await Appointment.find().populate("patientId doctorId departmentId");
    const allLabTests = await LabTest.find();
    const allRadTests = await RadiologyTest.find();
    const allSales = await PharmacySale.find();
    const billingUsers = await User.find({ roleId: { $in: billingRoleIds } });

    const generatedInvoices = [];

    // 140 Invoices distribution:
    // 1-50: OPD Consultations + Lab / Radiology / Pharmacy
    // 51-100: Pharmacy Direct Invoices (linking to PharmacySale)
    // 101-125: IPD Admissions (room charges + lab + rad + pharmacy)
    // 126-140: Multi-service Clinical Ledger Invoices
    for (let i = 1; i <= 140; i++) {
      const invoiceNumber = `INV-2026-${String(i).padStart(4, "0")}`;
      const pat = fetchedPatients[(i - 1) % fetchedPatients.length];
      const billUser = billingUsers[i % billingUsers.length] || billingUsers[0];

      let visitType = "OPD";
      const items = [];
      let subtotal = 0;

      if (i <= 50) {
        visitType = "OPD";
        const appt = allAppointments[(i - 1) % allAppointments.length];
        const docFee = (appt && appt.doctorId && appt.doctorId.consultationFee) ? appt.doctorId.consultationFee : 750;
        
        // Item 1: Consultation
        const consultAmt = docFee;
        items.push({
          description: `Outpatient Consultation - ${appt && appt.doctorId ? appt.doctorId.specialization : "General Medicine"}`,
          code: "CONS-001",
          sourceReference: appt ? appt.appointmentId : `APPT-${i}`,
          department: appt && appt.departmentId ? appt.departmentId.name : "OPD",
          sourceType: "consultation",
          sourceId: appt ? appt._id : null,
          quantity: 1,
          unitPrice: docFee,
          discount: 0,
          taxPercent: 0,
          amount: consultAmt
        });
        subtotal += consultAmt;

        // Optionally add lab or rad test
        if (i % 2 === 0 && allLabTests[(i / 2 - 1) % allLabTests.length]) {
          const lt = allLabTests[(i / 2 - 1) % allLabTests.length];
          const ltAmt = lt.cost || 500;
          items.push({
            description: `Laboratory Test: ${lt.testName}`,
            code: lt.testCode || "LAB-001",
            sourceReference: lt.orderId,
            department: "Pathology",
            sourceType: "lab_test",
            sourceId: lt._id,
            quantity: 1,
            unitPrice: ltAmt,
            discount: 0,
            taxPercent: 5,
            amount: ltAmt
          });
          subtotal += ltAmt;
        }

        if (i % 3 === 0 && allRadTests[(i / 3 - 1) % allRadTests.length]) {
          const rt = allRadTests[(i / 3 - 1) % allRadTests.length];
          const rtAmt = rt.cost || 1200;
          items.push({
            description: `Radiology Investigation: ${rt.testName} (${rt.modality})`,
            code: rt.testCode || "RAD-001",
            sourceReference: rt.orderId,
            department: "Radiology",
            sourceType: "radiology_test",
            sourceId: rt._id,
            quantity: 1,
            unitPrice: rtAmt,
            discount: 0,
            taxPercent: 5,
            amount: rtAmt
          });
          subtotal += rtAmt;
        }
      } else if (i <= 100) {
        visitType = "Pharmacy";
        const sale = allSales[(i - 51) % allSales.length];
        const saleAmt = sale.grandTotal || 350;
        items.push({
          description: `Pharmacy Dispensing Bill (${sale.invoiceNo})`,
          code: "PHARM-BILL",
          sourceReference: sale.invoiceNo,
          department: "Pharmacy",
          sourceType: "pharmacy",
          sourceId: sale._id,
          quantity: 1,
          unitPrice: saleAmt,
          discount: 0,
          taxPercent: 0,
          amount: saleAmt
        });
        subtotal += saleAmt;
      } else if (i <= 125) {
        visitType = "IPD";
        const adm = activeAdmissions[(i - 101) % activeAdmissions.length];
        const stayDays = ((i - 101) % 5) + 3;
        const dailyRent = 2500;
        const roomAmt = stayDays * dailyRent;

        items.push({
          description: `IPD Room Charges (${stayDays} Days @ ₹${dailyRent}/day)`,
          code: "ROOM-IPD",
          sourceReference: adm.admissionId,
          department: "Inpatient Care",
          sourceType: "room_charge",
          sourceId: adm._id,
          quantity: stayDays,
          unitPrice: dailyRent,
          discount: 0,
          taxPercent: 12,
          amount: roomAmt
        });
        subtotal += roomAmt;

        // Nursing & Care Charges
        const careAmt = stayDays * 500;
        items.push({
          description: `Nursing & Resident Care (${stayDays} Days)`,
          code: "NURSING-CARE",
          sourceReference: adm.admissionId,
          department: "Nursing",
          sourceType: "other",
          sourceId: adm._id,
          quantity: stayDays,
          unitPrice: 500,
          discount: 0,
          taxPercent: 0,
          amount: careAmt
        });
        subtotal += careAmt;
      } else {
        visitType = "OPD";
        items.push({
          description: "General Clinical Consultation & Health Screening",
          code: "GEN-HEALTH",
          sourceReference: `OPD-SCR-${i}`,
          department: "General Medicine",
          sourceType: "consultation",
          sourceId: null,
          quantity: 1,
          unitPrice: 1500,
          discount: 0,
          taxPercent: 0,
          amount: 1500
        });
        subtotal += 1500;
      }

      subtotal = Number(subtotal.toFixed(2));
      const discount = i % 7 === 0 ? Number((subtotal * 0.05).toFixed(2)) : 0;
      const taxableAmount = Number((subtotal - discount).toFixed(2));
      const gstAmount = Number((taxableAmount * 0.05).toFixed(2));
      const total = Number((taxableAmount + gstAmount).toFixed(2));

      // Financial status distribution
      // 100 paid, 20 partially-paid, 15 unpaid, 5 cancelled
      let status = "paid";
      let amountPaid = total;

      if (i > 135) {
        status = "cancelled";
        amountPaid = 0;
      } else if (i > 120) {
        status = "unpaid";
        amountPaid = 0;
      } else if (i > 100) {
        status = "partially-paid";
        amountPaid = Number((total * 0.5).toFixed(2));
      } else {
        status = "paid";
        amountPaid = total;
      }

      const dueAmount = status === "cancelled" ? 0 : Number((total - amountPaid).toFixed(2));

      const paymentHistory = [];
      const invDate = new Date(Date.now() - (140 - i) * 12 * 3600 * 1000);

      if (amountPaid > 0) {
        if (status === "partially-paid") {
          paymentHistory.push({
            amount: amountPaid,
            mode: paymentMethods[i % paymentMethods.length],
            transactionId: `TXN-2026-${String(i).padStart(4, "0")}-1`,
            receivedBy: billUser._id,
            date: invDate
          });
        } else {
          paymentHistory.push({
            amount: amountPaid,
            mode: paymentMethods[i % paymentMethods.length],
            transactionId: `TXN-2026-${String(i).padStart(4, "0")}`,
            receivedBy: billUser._id,
            date: invDate
          });
        }
      }

      generatedInvoices.push({
        invoiceNumber,
        patientId: pat._id,
        patientName: pat.name,
        patientPhone: pat.phone,
        uhid: pat.patientId || `UHID-${i}`,
        visitType,
        items,
        subtotal,
        discount,
        taxableAmount,
        gstAmount,
        total,
        amountPaid,
        dueAmount,
        status,
        paymentHistory,
        createdAt: invDate,
        updatedAt: invDate
      });
    }

    let invoiceInsertedCount = 0;
    let invoiceUpdatedCount = 0;

    for (const invData of generatedInvoices) {
      let existingInvoice = await Invoice.findOne({ invoiceNumber: invData.invoiceNumber });
      if (!existingInvoice) {
        await Invoice.create(invData);
        invoiceInsertedCount++;
      } else {
        await Invoice.findOneAndUpdate({ invoiceNumber: invData.invoiceNumber }, invData, { runValidators: true });
        invoiceUpdatedCount++;
      }
    }

    // ============================================================
    // STEP 21: SEED 40 INSURANCE POLICIES
    // ============================================================
    console.log("🌱 Seeding Insurance Policies (Target: 40)...");

    const indianProviders = [
      { name: "Star Health & Allied Insurance Co. Ltd.", tpa: "Health India TPA Services Pvt. Ltd." },
      { name: "HDFC ERGO General Insurance Co. Ltd.", tpa: "Medi Assist Insurance TPA Pvt. Ltd." },
      { name: "ICICI Lombard General Insurance Co. Ltd.", tpa: "Paramount Health Services & Insurance TPA Pvt. Ltd." },
      { name: "Niva Bupa Health Insurance Co. Ltd.", tpa: "FHPL (Family Health Plan Insurance TPA Ltd.)" },
      { name: "Care Health Insurance Ltd.", tpa: "Vidal Health TPA Services Pvt. Ltd." },
      { name: "Bajaj Allianz General Insurance Co. Ltd.", tpa: "MDIndia Health Insurance TPA Pvt. Ltd." },
      { name: "Aditya Birla Health Insurance Co. Ltd.", tpa: "Park Mediclaim TPA Pvt. Ltd." },
      { name: "New India Assurance Co. Ltd.", tpa: "Genins India Insurance TPA Ltd." }
    ];

    const policyTypes = ["Family Floater", "Individual", "Group Mediclaim", "Corporate", "Senior Citizen"];
    const coverageAmounts = [300000, 500000, 750000, 1000000, 1500000, 2500000];
    const relationships = ["Self", "Spouse", "Child", "Parent"];

    const generatedPolicies = [];
    const insuredPatients = fetchedPatients.slice(0, 40); // 40 insured patients out of 50

    for (let i = 0; i < insuredPatients.length; i++) {
      const pat = insuredPatients[i];
      const provObj = indianProviders[i % indianProviders.length];
      const policyNumber = `POL-2026-${String(i + 1).padStart(5, "0")}`;
      const memberId = `MEM-IN-${String(10000 + i + 1)}`;
      const coverageAmount = coverageAmounts[i % coverageAmounts.length];
      const policyType = policyTypes[i % policyTypes.length];

      let status = "Active";
      let validFrom = new Date(2025, 3, 1);
      let validUntil = new Date(2026, 2, 31);
      let renewalDate = new Date(2026, 2, 15);

      if (i % 10 === 0) {
        status = "Expired";
        validFrom = new Date(2024, 0, 1);
        validUntil = new Date(2024, 11, 31);
        renewalDate = new Date(2024, 11, 15);
      } else if (i % 13 === 0) {
        status = "Inactive";
      } else if (i % 17 === 0) {
        status = "Suspended";
      }

      generatedPolicies.push({
        patientId: pat._id,
        patientName: pat.name,
        uhid: pat.patientId || `UHID2026${String(i + 1).padStart(4, "0")}`,
        dateOfBirth: pat.dateOfBirth ? new Date(pat.dateOfBirth).toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" }) : "16 Aug 1990",
        mobileNumber: pat.phone || "+91 9876543210",
        providerName: provObj.name,
        policyNumber,
        memberId,
        policyType,
        tpaName: provObj.tpa,
        coverageAmount,
        sumInsured: coverageAmount,
        currency: "INR",
        validFrom,
        validUntil,
        renewalDate,
        status,
        employer: i % 2 === 0 ? "Tata Consultancy Services" : "Infosys Ltd.",
        relationship: relationships[i % relationships.length],
        notes: `Standard healthcare insurance policy record ${i + 1}`,
        documents: {
          policyDoc: `/docs/policy_${policyNumber}.pdf`,
          cardFront: `/images/card_front_${policyNumber}.png`,
          cardBack: `/images/card_back_${policyNumber}.png`,
          otherDoc: ""
        }
      });
    }

    let policyInsertedCount = 0;
    let policyUpdatedCount = 0;

    for (const polData of generatedPolicies) {
      let existingPolicy = await InsurancePolicy.findOne({ policyNumber: polData.policyNumber });
      if (!existingPolicy) {
        await InsurancePolicy.create(polData);
        policyInsertedCount++;
      } else {
        await InsurancePolicy.findOneAndUpdate({ policyNumber: polData.policyNumber }, polData, { runValidators: true });
        policyUpdatedCount++;
      }
    }

    // ============================================================
    // STEP 22: SEED 35 INSURANCE CLAIMS
    // ============================================================
    console.log("🌱 Seeding Insurance Claims (Target: 35)...");

    const activePolicies = await InsurancePolicy.find({ status: "Active" }).populate("patientId");
    const allSeededInvoices = await Invoice.find({ status: { $ne: "cancelled" } });

    const claimStatuses = [
      "Submitted", "Under Review", "Approved", "Partially Approved", "Rejected", "Settled", "Draft"
    ];
    const claimTypes = ["Cashless", "Reimbursement"];
    const admissionTypes = ["Outpatient (OPD)", "Inpatient (IPD)", "Emergency", "Day Care"];

    const generatedClaims = [];

    for (let i = 1; i <= 35; i++) {
      const claimNumber = `CLM-2026-${String(i).padStart(5, "0")}`;
      const policyObj = activePolicies[(i - 1) % activePolicies.length];
      const invObj = allSeededInvoices[(i - 1) % allSeededInvoices.length];

      const claimAmount = invObj ? invObj.total : 15000;
      const status = claimStatuses[(i - 1) % claimStatuses.length];

      let approvedAmount = 0;
      let settledAmount = 0;
      let patientPayable = claimAmount;
      let rejectionReason = null;
      let settlementDetails = {
        utrNumber: "",
        bankName: "",
        settlementDate: "",
        settledAmount: 0,
        paymentMode: "NEFT/RTGS"
      };

      if (status === "Approved") {
        approvedAmount = claimAmount;
        patientPayable = 0;
      } else if (status === "Partially Approved") {
        approvedAmount = Number((claimAmount * 0.75).toFixed(2));
        patientPayable = Number((claimAmount - approvedAmount).toFixed(2));
      } else if (status === "Settled") {
        approvedAmount = claimAmount;
        settledAmount = claimAmount;
        patientPayable = 0;
        settlementDetails = {
          utrNumber: `UTR-2026-${String(10000 + i)}`,
          bankName: "HDFC Bank Ltd.",
          settlementDate: "2026-08-15",
          settledAmount: claimAmount,
          paymentMode: "NEFT/RTGS"
        };
      } else if (status === "Rejected") {
        approvedAmount = 0;
        settledAmount = 0;
        patientPayable = claimAmount;
        rejectionReason = "Treatment excluded under policy terms clause 4.2";
      }

      generatedClaims.push({
        claimNumber,
        patientId: policyObj.patientId ? policyObj.patientId._id : invObj.patientId,
        patientName: policyObj.patientName,
        uhid: policyObj.uhid,
        policyId: policyObj._id,
        policyNumber: policyObj.policyNumber,
        providerName: policyObj.providerName,
        tpaName: policyObj.tpaName,
        policyValidity: `${policyObj.validFrom.toLocaleDateString("en-GB")} to ${policyObj.validUntil.toLocaleDateString("en-GB")}`,
        invoiceId: invObj ? invObj._id : null,
        invoiceNumber: invObj ? invObj.invoiceNumber : `INV-2026-${String(i).padStart(4, "0")}`,
        admissionType: admissionTypes[i % admissionTypes.length],
        treatmentDate: "2026-08-01",
        claimType: claimTypes[i % claimTypes.length],
        claimAmount,
        approvedAmount,
        settledAmount,
        patientPayable,
        preAuthNumber: i % 2 === 0 ? `PA-2026-${String(5000 + i)}` : "",
        status,
        submittedDate: "01 Aug 2026",
        expectedReviewDate: "15 Aug 2026",
        remarks: `Standard insurance claim record ${i}`,
        diagnosis: "Acute viral illness with gastrointestinal symptoms",
        treatmentSummary: "Outpatient clinical consultation, diagnostic workup, and pharmacotherapy.",
        rejectionReason,
        settlementDetails,
        internalNotes: [
          {
            noteText: "Pre-authorization approved by TPA desk.",
            author: "Insurance Coordinator",
            date: new Date()
          }
        ],
        documentsList: [
          {
            name: "Discharge Summary / OPD Consultation Slip",
            category: "Discharge Summary",
            url: `/docs/claim_${claimNumber}_summary.pdf`,
            uploadedAt: new Date()
          }
        ]
      });
    }

    let claimInsertedCount = 0;
    let claimUpdatedCount = 0;

    for (const claimData of generatedClaims) {
      let existingClaim = await InsuranceClaim.findOne({ claimNumber: claimData.claimNumber });
      if (!existingClaim) {
        await InsuranceClaim.create(claimData);
        claimInsertedCount++;
      } else {
        await InsuranceClaim.findOneAndUpdate({ claimNumber: claimData.claimNumber }, claimData, { runValidators: true });
        claimUpdatedCount++;
      }
    }

    // ============================================================
    // STEP 23: SEED 15 PHARMACY STOCK-IN (REFILL & EXPIRING) RECORDS
    // ============================================================
    console.log("🌱 Seeding Pharmacy Stock-In Refill & Expiring records (Target: 15)...");

    const activeSuppliers = await Supplier.find({ status: "active" });
    const stockInList = [];

    for (let i = 1; i <= 15; i++) {
      const invoiceNo = `SIN-INV-2026-${String(i).padStart(4, "0")}`;
      const sup = activeSuppliers[(i - 1) % activeSuppliers.length];

      const items = [];
      let subTotal = 0;

      // Add 2-3 medicine items per StockIn
      const medCount = (i % 2) + 2;
      for (let j = 0; j < medCount; j++) {
        const med = fetchedMedicines[(i * 3 + j) % fetchedMedicines.length];
        const qtyReceived = ((i + j) * 10) + 50;
        const purchasePrice = Math.round((med.sellingPrice || 100) * 0.7);
        const amount = qtyReceived * purchasePrice;

        // Make some items expire in 15-30 days, some normal future expiry
        const isExpiringSoon = (i % 3 === 0 && j === 0);
        const expDate = isExpiringSoon
          ? new Date(Date.now() + (i * 2 + 5) * 24 * 3600 * 1000) // 7 to 30 days from now
          : new Date("2028-06-30");

        items.push({
          medicineId: med._id,
          name: med.brandName || med.name,
          dosageForm: med.dosageForm || "Tablet",
          batchNo: `BATCH-SI-${String((i * 4 + j) % 90 + 10).padStart(3, "0")}`,
          expiryDate: expDate,
          purchasePrice,
          qtyReceived,
          unit: med.unit || "Strip",
          gstRate: 12,
          amount
        });

        subTotal += amount;
      }

      const totalGst = Number((subTotal * 0.12).toFixed(2));
      const grandTotal = Number((subTotal + totalGst).toFixed(2));

      stockInList.push({
        supplier: sup.name,
        invoiceNo,
        invoiceDate: new Date(Date.now() - i * 3 * 24 * 3600 * 1000),
        purchaseType: "Cash Purchase",
        items,
        subTotal,
        totalGst,
        grandTotal,
        receivedBy: "Rajiv Kapoor (Chief Pharmacist)",
        checkedBy: "Dr. Rajesh Kumar",
        storeLocation: "Main Pharmacy Store",
        status: "completed"
      });
    }

    let stockInInsertedCount = 0;
    let stockInUpdatedCount = 0;

    for (const sData of stockInList) {
      let existingStockIn = await StockIn.findOne({ invoiceNo: sData.invoiceNo });
      if (!existingStockIn) {
        await StockIn.create(sData);
        stockInInsertedCount++;
      } else {
        await StockIn.findOneAndUpdate({ invoiceNo: sData.invoiceNo }, sData, { runValidators: true });
        stockInUpdatedCount++;
      }
    }

    console.log("--------------------------------------------------");
    console.log("🌱 DATABASE SEEDING COMPLETED SUCCESSFULLY!");
    console.log(`- USERS: ${sample50Users.length} total (${userInsertedCount} inserted, ${userUpdatedCount} updated)`);
    console.log(`- DOCTORS: ${doctorInsertedCount + doctorUpdatedCount} total (${doctorInsertedCount} inserted, ${doctorUpdatedCount} updated)`);
    console.log(`- PATIENTS: ${sample50Patients.length} total (${patientInsertedCount} inserted, ${patientUpdatedCount} updated)`);
    console.log(`- APPOINTMENTS: ${generatedAppointments.length} total (${appointmentInsertedCount} inserted, ${appointmentUpdatedCount} updated)`);
    console.log(`- OPD VISITS: ${generatedOPDVisits.length} total (${opdInsertedCount} inserted, ${opdUpdatedCount} updated)`);
    console.log(`- WARDS: ${seededWards.length} total (${wardInsertedCount} inserted, ${wardUpdatedCount} updated)`);
    console.log(`- BEDS: ${seededBeds.length} total (55 Occupied, 35 Available, 10 Maintenance)`);
    console.log(`- ADMISSIONS: ${generatedAdmissions.length} total (55 Active Admitted, 30 Discharged)`);
    console.log(`- LAB TESTS: ${generatedLabTests.length} total (${labTestInsertedCount} inserted, ${labTestUpdatedCount} updated)`);
    console.log(`- LAB REPORTS: ${generatedLabReports.length} total (${reportInsertedCount} inserted, ${reportUpdatedCount} updated)`);
    console.log(`- RADIOLOGY TESTS: ${generatedRadTests.length} total (${radTestInsertedCount} inserted, ${radTestUpdatedCount} updated)`);
    console.log(`- RADIOLOGY REPORTS: ${generatedRadReports.length} total (${radReportInsertedCount} inserted, ${radReportUpdatedCount} updated)`);
    console.log(`- MEDICINES: ${sample75Medicines.length} total (${medInsertedCount} inserted, ${medUpdatedCount} updated)`);
    console.log(`- SUPPLIERS: ${sample15Suppliers.length} total (${supplierInsertedCount} inserted, ${supplierUpdatedCount} updated)`);
    console.log(`- INVENTORY ITEMS: ${sample75InventoryItems.length} total (${invInsertedCount} inserted, ${invUpdatedCount} updated)`);
    console.log(`- PHARMACY SALES: ${generatedSales.length} total (${saleInsertedCount} inserted, ${saleUpdatedCount} updated)`);
    console.log(`- GENERAL INVOICES: ${generatedInvoices.length} total (${invoiceInsertedCount} inserted, ${invoiceUpdatedCount} updated)`);
    console.log(`- INSURANCE POLICIES: ${generatedPolicies.length} total (${policyInsertedCount} inserted, ${policyUpdatedCount} updated)`);
    console.log(`- INSURANCE CLAIMS: ${generatedClaims.length} total (${claimInsertedCount} inserted, ${claimUpdatedCount} updated)`);
    console.log("--------------------------------------------------");
    try {
      await invalidatePattern("hms:route:*");
      console.log("🧹 Redis route cache invalidated successfully.");
    } catch (e) {
      // Ignore cache clear error if redis offline
    }

    process.exit(0);
  } catch (error) {
    console.error("Error seeding database:", error);
    process.exit(1);
  }
};

seedDatabase();
