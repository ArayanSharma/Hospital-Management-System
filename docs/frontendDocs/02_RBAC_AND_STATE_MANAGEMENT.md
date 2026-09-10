# 02. Role-Based Access Control (RBAC) & State Engine

Welcome to the **Frontend RBAC & State Management Guide** for the Hospital Management System (HMS). This document details how user roles, fine-grained permissions, JWT session persistence, and UI component gates operate across the frontend application.

---

## 🔒 Permission Engine & `usePermission` Hook

The frontend utilizes a custom permission hook (`src/hooks/usePermission.js`) that reconciles user permissions against navigation menus and action buttons.

### Fine-Grained Permission Matrix (`PERM_TO_ACTION_MODULE_MAP`)

```javascript
// Nav Permission Keys to Action Permissions Mapping
const PERM_TO_ACTION_MODULE_MAP = {
  "user:read": ["User Management"],
  "role:read": ["User Management"],
  "patient:read": ["Patient Management"],
  "doctor:read": ["User Management", "Patient Management"],
  "appointment:read": ["OPD Management"],
  "opd:read": ["OPD Management"],
  "admission:read": ["IPD Management"],
  "lab_test:read": ["Laboratory"],
  "radiology_test:read": ["Radiology"],
  "medicine:read": ["Pharmacy", "Inventory", "Prescriptions"],
  "invoice:read": ["Billing", "Billing & Invoicing"],
  "insurance:read": ["Billing", "Billing & Invoicing"],
  "audit_log:read": ["Audit Log"],
};
```

### Hook Contract (`usePermission.js`)

```javascript
export const usePermission = () => {
  const { user } = useAuth();

  // Super Admin bypass: Has unrestricted access to all modules and actions
  const isSuperAdmin = user?.roleName?.toUpperCase() === "SUPER_ADMIN" || user?.role === "super_admin";

  const hasPermission = (permissionKey) => {
    if (isSuperAdmin) return true;
    if (!user || !user.permissions) return false;
    return user.permissions.includes(permissionKey);
  };

  const hasModuleAccess = (moduleName) => {
    if (isSuperAdmin) return true;
    if (!user) return false;
    // Checks actionPermissions array or permissions list for module access
    return (
      user.actionPermissions?.some((ap) => ap.moduleName === moduleName) ||
      Object.entries(PERM_TO_ACTION_MODULE_MAP).some(
        ([perm, modules]) => modules.includes(moduleName) && user.permissions?.includes(perm)
      )
    );
  };

  return { hasPermission, hasModuleAccess, isSuperAdmin };
};
```

---

## 🛡️ Permission Gate Components

To conditionally render buttons or protect routes based on RBAC permissions:

### 1. Route Permission Gate
```jsx
// Used in routes.jsx to protect entire pages
<PermissionGate module="Pharmacy">
  <PharmacyDashboard />
</PermissionGate>
```

### 2. Action Button Permission Check
```jsx
// Used inside pages/tables to conditionally show create/edit/delete buttons
const { hasPermission } = usePermission();

{hasPermission("patient:create") && (
  <button onClick={openNewPatientModal} className="btn-primary">
    + Register New Patient
  </button>
)}
```

---

## 💾 Auth Session Persistence & Re-Hydration

```
[Browser Reload] ──► LocalStorage check (token & user)
                           │
             ┌─────────────┴─────────────┐
             ▼                           ▼
      [Token Found]               [No Token]
             │                           │
  Fetch /auth/me via Axios        Redirect to /login
             │
  Re-hydrate AuthContext State
```

1. **Token Storage**: JWT Token stored in `localStorage.getItem('token')`.
2. **Session Verification**: On app launch, `useAuth` invokes `/auth/me` to refresh user permissions and verify server-side session validity.
3. **Graceful Logout**: Revokes token, clears `localStorage`, and resets AuthContext state.
