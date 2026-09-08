import { lazy, Suspense } from "react";
import { createBrowserRouter, Navigate } from "react-router-dom";
import ProtectedRoute from "./ProtectedRoute.jsx";
import DashboardLayout from "../layouts/DashboardLayout.jsx";
import Loading from "../components/common/Loading.jsx";

// Auth pages
const Login = lazy(() => import("../features/auth/pages/Login.jsx"));
const Register = lazy(() => import("../features/auth/pages/Register.jsx"));
const CompleteProfile = lazy(() => import("../features/auth/pages/CompleteProfile.jsx"));

// Core pages
const Dashboard = lazy(() => import("../features/super-admin/pages/Dashboard.jsx"));
const PatientList = lazy(() => import("../features/patients/pages/PatientList.jsx"));
const DoctorList = lazy(() => import("../features/doctors/pages/DoctorList.jsx"));
const AppointmentList = lazy(() => import("../features/appointments/pages/AppointmentList.jsx"));
const VisitList = lazy(() => import("../features/opd/pages/VisitList.jsx"));
const VisitDetail = lazy(() => import("../features/opd/pages/VisitDetail.jsx"));
const InvoiceList = lazy(() => import("../features/billing/pages/InvoiceList.jsx"));
const InvoiceDetail = lazy(() => import("../features/billing/pages/InvoiceDetail.jsx"));
const Reports = lazy(() => import("../features/reports/pages/Reports.jsx"));
const RoleList = lazy(() => import("../features/roles/pages/RoleList.jsx"));
const RoleDetail = lazy(() => import("../features/roles/pages/RoleDetail.jsx"));
const UserList = lazy(() => import("../features/users/pages/UserList.jsx"));
const Settings = lazy(() => import("../features/settings/pages/Settings.jsx"));
const DepartmentList = lazy(() => import("../features/departments/pages/DepartmentList.jsx"));

// Pharmacy pages
const PharmacyLayout = lazy(() => import("../features/pharmacy/pages/PharmacyLayout.jsx"));
const PharmacyDashboard = lazy(() => import("../features/pharmacy/pages/PharmacyDashboard.jsx"));
const MedicineList = lazy(() => import("../features/pharmacy/pages/MedicineList.jsx"));
const InventoryList = lazy(() => import("../features/pharmacy/pages/InventoryList.jsx"));
const SaleList = lazy(() => import("../features/pharmacy/pages/SaleList.jsx"));
const SupplierList = lazy(() => import("../features/suppliers/pages/SupplierList.jsx"));

// IPD pages
const IPDLayout = lazy(() => import("../features/ipd/pages/IPDLayout.jsx"));
const BedGrid = lazy(() => import("../features/beds/pages/BedGrid.jsx"));
const AdmissionList = lazy(() => import("../features/admissions/pages/AdmissionList.jsx"));

// Lab & Radiology
const LabTestList = lazy(() => import("../features/laboratory/pages/LabTestList.jsx"));
const LabTestDetail = lazy(() => import("../features/laboratory/pages/LabTestDetail.jsx"));
const RadiologyTestList = lazy(() => import("../features/radiology/pages/RadiologyTestList.jsx"));
const RadiologyTestDetail = lazy(() => import("../features/radiology/pages/RadiologyTestDetail.jsx"));

// Insurance & Audit
const InsuranceLayout = lazy(() => import("../features/insurance/pages/InsuranceLayout.jsx"));
const PolicyList = lazy(() => import("../features/insurance/pages/PolicyList.jsx"));
const ClaimList = lazy(() => import("../features/insurance/pages/ClaimList.jsx"));
const AuditLogList = lazy(() => import("../features/audit-logs/pages/AuditLogList.jsx"));

const SuspenseWrapper = ({ children }) => (
  <Suspense fallback={<Loading message="Loading module..." />}>
    {children}
  </Suspense>
);

export const router = createBrowserRouter([
  {
    path: "/login",
    element: (
      <SuspenseWrapper>
        <Login />
      </SuspenseWrapper>
    ),
  },
  {
    path: "/register",
    element: (
      <SuspenseWrapper>
        <Register />
      </SuspenseWrapper>
    ),
  },
  {
    element: <ProtectedRoute />,
    children: [
      {
        path: "/complete-profile",
        element: (
          <SuspenseWrapper>
            <CompleteProfile />
          </SuspenseWrapper>
        ),
      },
      {
        path: "/",
        element: (
          <SuspenseWrapper>
            <DashboardLayout />
          </SuspenseWrapper>
        ),
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

