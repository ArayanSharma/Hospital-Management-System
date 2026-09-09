import { Suspense } from "react";
import { createBrowserRouter, Navigate } from "react-router-dom";
import ProtectedRoute from "./ProtectedRoute.jsx";
import DashboardLayout from "../layouts/DashboardLayout.jsx";
import Loading from "../components/common/Loading.jsx";
import RouteErrorBoundary from "../components/common/RouteErrorBoundary.jsx";
import lazyWithRetry from "../utils/lazyWithRetry.js";

// Auth pages
const Login = lazyWithRetry(() => import("../features/auth/pages/Login.jsx"));
const Register = lazyWithRetry(() => import("../features/auth/pages/Register.jsx"));
const CompleteProfile = lazyWithRetry(() => import("../features/auth/pages/CompleteProfile.jsx"));

// Core pages
const Dashboard = lazyWithRetry(() => import("../features/super-admin/pages/Dashboard.jsx"));
const PatientList = lazyWithRetry(() => import("../features/patients/pages/PatientList.jsx"));
const DoctorList = lazyWithRetry(() => import("../features/doctors/pages/DoctorList.jsx"));
const AppointmentList = lazyWithRetry(() => import("../features/appointments/pages/AppointmentList.jsx"));
const VisitList = lazyWithRetry(() => import("../features/opd/pages/VisitList.jsx"));
const VisitDetail = lazyWithRetry(() => import("../features/opd/pages/VisitDetail.jsx"));
const InvoiceList = lazyWithRetry(() => import("../features/billing/pages/InvoiceList.jsx"));
const InvoiceDetail = lazyWithRetry(() => import("../features/billing/pages/InvoiceDetail.jsx"));
const Reports = lazyWithRetry(() => import("../features/reports/pages/Reports.jsx"));
const RoleList = lazyWithRetry(() => import("../features/roles/pages/RoleList.jsx"));
const RoleDetail = lazyWithRetry(() => import("../features/roles/pages/RoleDetail.jsx"));
const UserList = lazyWithRetry(() => import("../features/users/pages/UserList.jsx"));
const Settings = lazyWithRetry(() => import("../features/settings/pages/Settings.jsx"));
const DepartmentList = lazyWithRetry(() => import("../features/departments/pages/DepartmentList.jsx"));

// Pharmacy pages
const PharmacyLayout = lazyWithRetry(() => import("../features/pharmacy/pages/PharmacyLayout.jsx"));
const PharmacyDashboard = lazyWithRetry(() => import("../features/pharmacy/pages/PharmacyDashboard.jsx"));
const MedicineList = lazyWithRetry(() => import("../features/pharmacy/pages/MedicineList.jsx"));
const InventoryList = lazyWithRetry(() => import("../features/pharmacy/pages/InventoryList.jsx"));
const SaleList = lazyWithRetry(() => import("../features/pharmacy/pages/SaleList.jsx"));
const SupplierList = lazyWithRetry(() => import("../features/suppliers/pages/SupplierList.jsx"));

// IPD pages
const IPDLayout = lazyWithRetry(() => import("../features/ipd/pages/IPDLayout.jsx"));
const BedGrid = lazyWithRetry(() => import("../features/beds/pages/BedGrid.jsx"));
const AdmissionList = lazyWithRetry(() => import("../features/admissions/pages/AdmissionList.jsx"));

// Lab & Radiology
const LabTestList = lazyWithRetry(() => import("../features/laboratory/pages/LabTestList.jsx"));
const LabTestDetail = lazyWithRetry(() => import("../features/laboratory/pages/LabTestDetail.jsx"));
const RadiologyTestList = lazyWithRetry(() => import("../features/radiology/pages/RadiologyTestList.jsx"));
const RadiologyTestDetail = lazyWithRetry(() => import("../features/radiology/pages/RadiologyTestDetail.jsx"));

// Insurance & Audit
const InsuranceLayout = lazyWithRetry(() => import("../features/insurance/pages/InsuranceLayout.jsx"));
const PolicyList = lazyWithRetry(() => import("../features/insurance/pages/PolicyList.jsx"));
const ClaimList = lazyWithRetry(() => import("../features/insurance/pages/ClaimList.jsx"));
const AuditLogList = lazyWithRetry(() => import("../features/audit-logs/pages/AuditLogList.jsx"));

const SuspenseWrapper = ({ children }) => (
  <Suspense fallback={<Loading message="Loading module..." />}>
    {children}
  </Suspense>
);

export const router = createBrowserRouter([
  {
    path: "/login",
    errorElement: <RouteErrorBoundary />,
    element: (
      <SuspenseWrapper>
        <Login />
      </SuspenseWrapper>
    ),
  },
  {
    path: "/register",
    errorElement: <RouteErrorBoundary />,
    element: (
      <SuspenseWrapper>
        <Register />
      </SuspenseWrapper>
    ),
  },
  {
    element: <ProtectedRoute />,
    errorElement: <RouteErrorBoundary />,
    children: [
      {
        path: "/complete-profile",
        errorElement: <RouteErrorBoundary />,
        element: (
          <SuspenseWrapper>
            <CompleteProfile />
          </SuspenseWrapper>
        ),
      },
      {
        path: "/",
        errorElement: <RouteErrorBoundary />,
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
          { path: "*", element: <RouteErrorBoundary /> },
        ],
      },
    ],
  },
  {
    path: "*",
    element: <RouteErrorBoundary />,
  },
]);

