import { Router } from "express";
import authRoutes from "../modules/auth/auth.routes.js";
import roleRoutes from "../modules/roles/role.routes.js";
import permissionRoutes from "../modules/permissions/permission.routes.js";
import userRoutes from "../modules/users/user.routes.js";
import auditLogRoutes from "../modules/audit-logs/audit-log.routes.js";
import departmentRoutes from "../modules/departments/department.routes.js";
import doctorRoutes from "../modules/doctors/doctor.routes.js";
import patientRoutes from "../modules/patients/patient.routes.js";
import appointmentRoutes from "../modules/appointments/appointment.routes.js";
import opdVisitRoutes from "../modules/opd/opdVisit.routes.js"; 
import wardRoutes from "../modules/wards/ward.routes.js";
import bedRoutes from "../modules/beds/bed.routes.js";  
import admissionRoutes from "../modules/ipd/admission.routes.js";
import prescriptionRoutes from "../modules/prescriptions/prescription.routes.js";
import medicalRecordRoutes from "../modules/medical-records/medicalRecord.routes.js";
import labTestRoutes from "../modules/laboratory/labTest.routes.js";
import labReportRoutes from "../modules/laboratory/labReport.routes.js";
import radiologyTestRoutes from "../modules/radiology/radiologyTest.routes.js";
import radiologyReportRoutes from "../modules/radiology/radiologyReport.routes.js";
import supplierRoutes from "../modules/suppliers/supplier.routes.js";
import inventoryItemRoutes from "../modules/inventory/inventoryItem.routes.js";
import medicineRoutes from "../modules/pharmacy/medicine.routes.js";
import pharmacySaleRoutes from "../modules/pharmacy/pharmacySale.routes.js";
import pharmacyDashboardRoutes from "../modules/pharmacy/pharmacyDashboard.routes.js";
import stockInRoutes from "../modules/pharmacy/stockIn.routes.js";
import inventoryRoutes from "../modules/pharmacy/inventory.routes.js";

import invoiceRoutes from "../modules/billing/invoice.routes.js";
import paymentRoutes from "../modules/payments/payment.routes.js";
import insurancePolicyRoutes from "../modules/insurance/insurancePolicy.routes.js";
import insuranceClaimRoutes from "../modules/insurance/insuranceClaim.routes.js";

import notificationRoutes from "../modules/notifications/notification.routes.js";
import settingRoutes from "../modules/settings/setting.routes.js";
import reportRoutes from "../modules/reports/report.routes.js";

import superAdminRoutes from "../modules/super-admin/superAdmin.routes.js";

const router = Router();

router.use("/auth", authRoutes);
router.use("/roles", roleRoutes);
router.use("/permissions", permissionRoutes);
router.use("/users", userRoutes);
router.use("/audit-logs", auditLogRoutes);
router.use("/departments", departmentRoutes);
router.use("/doctors", doctorRoutes);
router.use("/patients", patientRoutes);
router.use("/appointments", appointmentRoutes);
router.use("/opd-visits", opdVisitRoutes);
router.use("/wards", wardRoutes);
router.use("/beds", bedRoutes);
router.use("/admissions", admissionRoutes);
router.use("/prescriptions", prescriptionRoutes);
router.use("/medical-records", medicalRecordRoutes);
router.use("/lab-tests", labTestRoutes);
router.use("/laboratory/tests", labTestRoutes);
router.use("/laboratory", labTestRoutes);
router.use("/lab-reports", labReportRoutes);
router.use("/laboratory/reports", labReportRoutes);
router.use("/radiology-tests", radiologyTestRoutes);
router.use("/radiology-reports", radiologyReportRoutes);

router.use("/suppliers", supplierRoutes);
router.use("/inventory", inventoryItemRoutes);
router.use("/medicines", medicineRoutes);
router.use("/pharmacy-sales", pharmacySaleRoutes);
router.use("/pharmacy/stock-in", stockInRoutes);
router.use("/stock-in", stockInRoutes);
router.use("/pharmacy/inventory", inventoryRoutes);
router.use("/inventory-actions", inventoryRoutes);
router.use("/pharmacy", pharmacyDashboardRoutes);


router.use("/invoices", invoiceRoutes);
router.use("/payments", paymentRoutes);
router.use("/insurance-policies", insurancePolicyRoutes);
router.use("/insurance-claims", insuranceClaimRoutes);

router.use("/notifications", notificationRoutes);
router.use("/settings", settingRoutes);
router.use("/reports", reportRoutes);

router.use("/super-admin", superAdminRoutes);

export default router;