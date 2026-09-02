import { createBrowserRouter, Navigate } from "react-router-dom";
import Login from "../features/auth/pages/Login.jsx";
import ProtectedRoute from "./ProtectedRoute.jsx";
import DashboardLayout from "../layouts/DashboardLayout.jsx";
import Dashboard from "../features/super-admin/pages/Dashboard.jsx";
import PatientList from "../features/patients/pages/PatientList.jsx";
import DoctorList from "../features/doctors/pages/DoctorList.jsx";
import AppointmentList from "../features/appointments/pages/AppointmentList.jsx";
import VisitList from "../features/opd/pages/VisitList.jsx";
import VisitDetail from "../features/opd/pages/VisitDetail.jsx";
import InvoiceList from "../features/billing/pages/InvoiceList.jsx";
import InvoiceDetail from "../features/billing/pages/InvoiceDetail.jsx";
import Reports from "../features/reports/pages/Reports.jsx";
import RoleList from "../features/roles/pages/RoleList.jsx";
import RoleDetail from "../features/roles/pages/RoleDetail.jsx";
import UserList from "../features/users/pages/UserList.jsx";
import Settings from "../features/settings/pages/Settings.jsx";
import DepartmentList from "../features/departments/pages/DepartmentList.jsx";
import PermissionList from "../features/permissions/pages/PermissionList.jsx";
import PharmacyLayout from "../features/pharmacy/pages/PharmacyLayout.jsx";
import PharmacyDashboard from "../features/pharmacy/pages/PharmacyDashboard.jsx";
import MedicineList from "../features/pharmacy/pages/MedicineList.jsx";
import InventoryList from "../features/pharmacy/pages/InventoryList.jsx";
import SaleList from "../features/pharmacy/pages/SaleList.jsx";
import SupplierList from "../features/suppliers/pages/SupplierList.jsx";
import IPDLayout from "../features/ipd/pages/IPDLayout.jsx";
import BedGrid from "../features/beds/pages/BedGrid.jsx";
import AdmissionList from "../features/admissions/pages/AdmissionList.jsx";
import LabTestList from "../features/laboratory/pages/LabTestList.jsx";
import LabTestDetail from "../features/laboratory/pages/LabTestDetail.jsx";
import RadiologyTestList from "../features/radiology/pages/RadiologyTestList.jsx";
import RadiologyTestDetail from "../features/radiology/pages/RadiologyTestDetail.jsx";
import InsuranceLayout from "../features/insurance/pages/InsuranceLayout.jsx";
import PolicyList from "../features/insurance/pages/PolicyList.jsx";
import ClaimList from "../features/insurance/pages/ClaimList.jsx";
import AuditLogList from "../features/audit-logs/pages/AuditLogList.jsx";

export const router = createBrowserRouter([
  {
    path: "/login",
    element: <Login />,
  },
  {
    element: <ProtectedRoute />,
    children: [
      {
        path: "/",
        element: <DashboardLayout />,
        children: [
          { index: true, element: <Dashboard /> },
          { path: "dashboard", element: <Dashboard /> },
          { path: "patients", element: <PatientList /> },
          { path: "doctors", element: <DoctorList /> },
          { path: "appointments", element: <AppointmentList /> },
          { path: "opd-visits", element: <VisitList /> },
          { path: "opd-visits/:id", element: <VisitDetail /> },
          { path: "billing", element: <InvoiceList /> },
          { path: "billing/:id", element: <InvoiceDetail /> },
          { path: "reports", element: <Reports /> },
          { path: "roles", element: <RoleList /> },
          { path: "roles/:id", element: <RoleDetail /> },
          { path: "users", element: <UserList /> },
          { path: "settings", element: <Settings /> },
          { path: "departments", element: <DepartmentList /> },
          { path: "permissions", element: <Navigate to="/roles?tab=matrix" replace /> },
          {
            path: "pharmacy",
            element: <PharmacyLayout />,
            children: [
              { index: true, element: <PharmacyDashboard /> },
              { path: "overview", element: <PharmacyDashboard /> },
              { path: "medicines", element: <MedicineList /> },
              { path: "inventory", element: <InventoryList /> },
              { path: "sales", element: <SaleList /> },
              { path: "suppliers", element: <SupplierList /> },
            ],
          },
          {
            path: "ipd",
            element: <IPDLayout />,
            children: [
              { index: true, element: <BedGrid /> },
              { path: "beds", element: <BedGrid /> },
              { path: "admissions", element: <AdmissionList /> },
            ],
          },
          { path: "laboratory", element: <LabTestList /> },
          { path: "laboratory/:id", element: <LabTestDetail /> },
          { path: "radiology", element: <RadiologyTestList /> },
          { path: "radiology/:id", element: <RadiologyTestDetail /> },
          {
            path: "insurance",
            element: <InsuranceLayout />,
            children: [
              { index: true, element: <PolicyList /> },
              { path: "policies", element: <PolicyList /> },
              { path: "claims", element: <ClaimList /> },
            ],
          },
          { path: "audit-logs", element: <AuditLogList /> },
        ],
      },
    ],
  },
]);
