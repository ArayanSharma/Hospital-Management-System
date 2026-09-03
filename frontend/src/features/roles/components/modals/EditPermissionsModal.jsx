import React, { useState, useRef, useEffect } from "react";
import {
  X,
  Save,
  RotateCcw,
  ArrowLeft,
  Stethoscope,
  Shield,
  ChevronRight,
  Info,
  CheckCircle2,
  MinusCircle,
  Edit3,
  XCircle,
  Sliders,
  PieChart,
  Lock,
  Check,
  ChevronDown,
} from "lucide-react";
import EditPermissionsRightSidebar from "../EditPermissionsRightSidebar.jsx";
import CustomDropdown from "../../../../components/ui/CustomDropdown.jsx";

const ACCESS_LEVEL_OPTIONS = [
  { value: "Full Access", label: "🟢 Full Access" },
  { value: "Read Only", label: "🔵 Read Only" },
  { value: "Limited Access", label: "🟠 Limited Access" },
  { value: "No Access", label: "🔴 No Access" },
];

const EDIT_PERM_MODULES = [
  { key: "Patient Management", name: "Patient Management", sub: "Patients, registration, profiles" },
  { key: "OPD Management", name: "OPD Management", sub: "OPD visits, queue, consultations" },
  { key: "IPD Management", name: "IPD Management", sub: "Admissions, bed, discharge" },
  { key: "Prescriptions", name: "Prescriptions", sub: "Prescriptions, medicines" },
  { key: "Laboratory", name: "Laboratory", sub: "Lab tests, reports" },
  { key: "Radiology", name: "Radiology", sub: "Imaging, reports" },
  { key: "Billing & Invoicing", name: "Billing & Invoicing", sub: "Invoices, payments, refunds" },
  { key: "Pharmacy", name: "Pharmacy", sub: "Inventory, dispensing" },
  { key: "User Management", name: "User Management", sub: "Users, roles, staff" },
  { key: "Reports", name: "Reports", sub: "Reports & analytics" },
  { key: "Audit Log", name: "Audit Log", sub: "System audit logs" },
];

export default function EditPermissionsModal({ isOpen, onClose, onSubmit, role }) {
  if (!isOpen || !role) return null;

  const [activeTab, setActiveTab] = useState("matrix"); // "matrix", "module", "summary"
  const [actionPermissions, setActionPermissions] = useState({});
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (role && role.actionPermissions && Object.keys(role.actionPermissions).length > 0) {
      setActionPermissions(role.actionPermissions);
    } else if (role && role.modulePermissions && Object.keys(role.modulePermissions).length > 0) {
      // Build actionPermissions from existing modulePermissions
      const modPerms = role.modulePermissions;
      const initialActions = {};

      const mapToActions = (accessStr) => {
        if (accessStr === "Full Access") {
          return { create: true, read: true, update: true, delete: true, manage: true };
        } else if (accessStr === "Read Only") {
          return { create: false, read: true, update: false, delete: false, manage: false };
        } else if (accessStr === "Limited Access") {
          return { create: true, read: true, update: true, delete: false, manage: false };
        }
        return { create: false, read: false, update: false, delete: false, manage: false };
      };

      EDIT_PERM_MODULES.forEach((m) => {
        if (m.key === "Patient Management") {
          initialActions[m.key] = mapToActions(modPerms.Patient);
        } else if (m.key === "OPD Management" || m.key === "IPD Management") {
          initialActions[m.key] = mapToActions(modPerms.Appointment || modPerms.Patient);
        } else if (m.key === "Prescriptions") {
          initialActions[m.key] = mapToActions(modPerms.Doctor || modPerms.Pharmacy);
        } else if (m.key === "Laboratory") {
          initialActions[m.key] = mapToActions(modPerms.Laboratory);
        } else if (m.key === "Radiology") {
          initialActions[m.key] = mapToActions(modPerms.Radiology);
        } else if (m.key === "Billing & Invoicing") {
          initialActions[m.key] = mapToActions(modPerms.Billing);
        } else if (m.key === "Pharmacy") {
          initialActions[m.key] = mapToActions(modPerms.Pharmacy);
        } else if (m.key === "User Management") {
          initialActions[m.key] = mapToActions(modPerms.User || modPerms.Role);
        } else if (m.key === "Reports" || m.key === "Audit Log") {
          initialActions[m.key] = mapToActions(modPerms["Audit Log"] || modPerms.AuditLog);
        } else {
          initialActions[m.key] = { create: false, read: false, update: false, delete: false, manage: false };
        }
      });

      setActionPermissions(initialActions);
    } else if (role?.name === "SUPER_ADMIN" || role?.name === "ADMIN") {
      // SUPER_ADMIN dynamically defaults to ALL actions checked
      const superAdminAll = {};
      EDIT_PERM_MODULES.forEach((m) => {
        superAdminAll[m.key] = { create: true, read: true, update: true, delete: true, manage: true };
      });
      setActionPermissions(superAdminAll);
    } else {
      // Doctor / other initial setup matching reference image
      const doctorInitial = {};
      EDIT_PERM_MODULES.forEach((m) => {
        if (m.key === "Patient Management") {
          doctorInitial[m.key] = { create: false, read: true, update: true, delete: false, manage: false };
        } else if (m.key === "OPD Management" || m.key === "IPD Management") {
          doctorInitial[m.key] = { create: true, read: true, update: true, delete: false, manage: false };
        } else if (m.key === "Prescriptions") {
          doctorInitial[m.key] = { create: true, read: true, update: true, delete: true, manage: false };
        } else if (m.key === "Pharmacy" || m.key === "User Management") {
          doctorInitial[m.key] = { create: false, read: false, update: false, delete: false, manage: false };
        } else {
          doctorInitial[m.key] = { create: false, read: true, update: false, delete: false, manage: false };
        }
      });
      setActionPermissions(doctorInitial);
    }
  }, [role, isOpen]);

  const handleCheckboxToggle = (moduleKey, actionKey) => {
    setActionPermissions((prev) => ({
      ...prev,
      [moduleKey]: {
        ...prev[moduleKey],
        [actionKey]: !prev[moduleKey]?.[actionKey],
      },
    }));
  };

  const handleAccessLevelChange = (moduleKey, levelStr) => {
    setActionPermissions((prev) => {
      const copy = { ...prev };
      if (levelStr === "Full Access") {
        copy[moduleKey] = { create: true, read: true, update: true, delete: true, manage: true };
      } else if (levelStr === "Read Only") {
        copy[moduleKey] = { create: false, read: true, update: false, delete: false, manage: false };
      } else if (levelStr === "Limited Access") {
        copy[moduleKey] = { create: true, read: true, update: true, delete: false, manage: false };
      } else {
        copy[moduleKey] = { create: false, read: false, update: false, delete: false, manage: false };
      }
      return copy;
    });
  };

  const getModuleAccessLevel = (modKey) => {
    const p = actionPermissions[modKey] || {};
    if (p.create && p.read && p.update && p.delete && p.manage) return "Full Access";
    if (!p.create && p.read && !p.update && !p.delete && !p.manage) return "Read Only";
    if (p.create || p.read || p.update || p.delete || p.manage) return "Limited Access";
    return "No Access";
  };

  const handleSelectAll = () => {
    const updated = {};
    EDIT_PERM_MODULES.forEach((m) => {
      updated[m.key] = { create: true, read: true, update: true, delete: true, manage: true };
    });
    setActionPermissions(updated);
  };

  const handleCollapseAll = () => {
    const updated = {};
    EDIT_PERM_MODULES.forEach((m) => {
      updated[m.key] = { create: false, read: false, update: false, delete: false, manage: false };
    });
    setActionPermissions(updated);
  };

  const handleResetChanges = () => {
    if (role.actionPermissions) setActionPermissions(role.actionPermissions);
  };

  const handleSubmit = async () => {
    setSubmitting(true);
    try {
      const derivedModulePermissions = {
        Patient: getModuleAccessLevel("Patient Management"),
        Doctor: getModuleAccessLevel("User Management") !== "No Access" ? getModuleAccessLevel("User Management") : "Read Only",
        Appointment: getModuleAccessLevel("OPD Management"),
        Billing: getModuleAccessLevel("Billing & Invoicing"),
        Pharmacy: getModuleAccessLevel("Pharmacy"),
        Laboratory: getModuleAccessLevel("Laboratory"),
        Radiology: getModuleAccessLevel("Radiology"),
        Inventory: getModuleAccessLevel("Pharmacy"),
        User: getModuleAccessLevel("User Management"),
        Role: getModuleAccessLevel("User Management"),
        "Audit Log": getModuleAccessLevel("Audit Log"),
      };

      await onSubmit(role._id, {
        actionPermissions,
        modulePermissions: derivedModulePermissions,
      });
    } catch (err) {
      alert("Failed to save permissions.");
    } finally {
      setSubmitting(false);
    }
  };

  // Helper metrics for Summary tab
  const totalModules = EDIT_PERM_MODULES.length;
  let grantedModulesCount = 0;
  let restrictedModulesCount = 0;
  let totalActionsEnabled = 0;

  EDIT_PERM_MODULES.forEach((m) => {
    const lvl = getModuleAccessLevel(m.key);
    if (lvl !== "No Access") grantedModulesCount++;
    else restrictedModulesCount++;

    const p = actionPermissions[m.key] || {};
    if (p.create) totalActionsEnabled++;
    if (p.read) totalActionsEnabled++;
    if (p.update) totalActionsEnabled++;
    if (p.delete) totalActionsEnabled++;
    if (p.manage) totalActionsEnabled++;
  });

  const isSystem = role.roleType === "System" || role.isSystemRole;

  return (
    <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center z-50 p-4">
      <div className="bg-white border border-slate-200/90 rounded-2xl max-w-6xl w-full shadow-2xl flex flex-col max-h-[94vh] overflow-hidden text-xs text-slate-800">
        {/* Modal Page Header matching Screenshot */}
        <div className="px-6 py-4 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white shrink-0">
          <div>
            <h1 className="text-lg font-bold text-slate-900 tracking-tight">Edit Role Permissions</h1>
            <p className="text-xs text-slate-500 font-medium">
              Update permissions for the role: <span className="font-bold text-slate-900 font-mono">{role.name}</span>
            </p>
          </div>

          <div className="flex items-center gap-2">
            {/* Back to Roles Button */}
            <button
              type="button"
              onClick={onClose}
              className="group flex items-center gap-1.5 px-3 py-1.5 bg-white hover:bg-slate-100 border border-slate-200 text-slate-700 font-bold text-xs rounded-xl shadow-2xs transition-all duration-150 cursor-pointer active:scale-95"
            >
              <ArrowLeft className="w-3.5 h-3.5 text-slate-500 group-hover:-translate-x-1 transition-transform duration-200 ease-out" />
              <span>Back to Roles</span>
            </button>

            {/* Reset Changes Button */}
            <button
              type="button"
              onClick={handleResetChanges}
              className="group flex items-center gap-1.5 px-3 py-1.5 bg-white hover:bg-slate-100 border border-slate-200 text-slate-700 font-bold text-xs rounded-xl shadow-2xs transition-all duration-150 cursor-pointer active:scale-95"
            >
              <RotateCcw className="w-3.5 h-3.5 text-slate-500 group-hover:-rotate-180 transition-transform duration-300 ease-out" />
              <span>Reset Changes</span>
            </button>

            {/* Save Changes Button */}
            <button
              type="button"
              onClick={handleSubmit}
              disabled={submitting}
              className="group flex items-center gap-1.5 px-4 py-1.5 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-xl shadow-xs hover:shadow-md transition-all duration-150 cursor-pointer active:scale-95 disabled:opacity-50"
            >
              <Save className="w-3.5 h-3.5 group-hover:scale-110 transition-transform duration-200" />
              <span>{submitting ? "Saving..." : "Save Changes"}</span>
            </button>
          </div>
        </div>

        {/* Modal Scroll Body */}
        <div className="p-6 overflow-y-auto space-y-5 flex-1">
          {/* Top Role Summary Header Banner Card matching Screenshot */}
          <div className="bg-white border border-slate-200/90 rounded-2xl p-4 shadow-2xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-emerald-50 text-emerald-600 border border-emerald-200 flex items-center justify-center shrink-0">
                {role.name === "DOCTOR" ? (
                  <Stethoscope className="w-5 h-5" />
                ) : (
                  <Shield className="w-5 h-5" />
                )}
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h2 className="text-base font-black text-slate-900 font-mono">{role.name}</h2>
                  <span
                    className={`px-2.5 py-0.5 rounded-md text-[10px] font-black border ${
                      isSystem
                        ? "bg-purple-50 text-purple-700 border-purple-200"
                        : "bg-orange-50 text-orange-700 border-orange-200"
                    }`}
                  >
                    {isSystem ? "System Role" : "Custom Role"}
                  </span>
                </div>
                <p className="text-xs text-slate-500 font-medium">
                  {role.description || "Access to OPD/IPD, prescriptions, medical records and reports."}
                </p>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-6 border-t sm:border-t-0 sm:border-l border-slate-100 pt-3 sm:pt-0 sm:pl-6 text-xs font-bold">
              <div>
                <span className="text-[10px] text-slate-400 font-medium block">Role Code</span>
                <span className="font-mono text-slate-900">{role.roleCode || role.name}</span>
              </div>
              <div>
                <span className="text-[10px] text-slate-400 font-medium block">Role Type</span>
                <span className="text-purple-700 bg-purple-50 px-2 py-0.5 rounded-md text-[10px] border border-purple-200">
                  {isSystem ? "System Role" : "Custom Role"}
                </span>
              </div>
              <div>
                <span className="text-[10px] text-slate-400 font-medium block">Status</span>
                <span className="text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full text-[10px] border border-emerald-200">
                  ● Active
                </span>
              </div>
              <div>
                <span className="text-[10px] text-slate-400 font-medium block">Users Assigned</span>
                <span className="text-slate-900">{role.userCount || 18}</span>
              </div>
            </div>
          </div>

          {/* 3 Tabs Row matching Screenshot */}
          <div className="flex items-center gap-6 border-b border-slate-200/80 px-2 text-xs font-bold">
            <button
              type="button"
              onClick={() => setActiveTab("matrix")}
              className={`py-2.5 transition relative cursor-pointer ${
                activeTab === "matrix" ? "text-blue-600 font-black" : "text-slate-500 hover:text-slate-800"
              }`}
            >
              <span>Permission Matrix</span>
              {activeTab === "matrix" && (
                <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-600 rounded-full"></span>
              )}
            </button>

            <button
              type="button"
              onClick={() => setActiveTab("module")}
              className={`py-2.5 transition relative cursor-pointer ${
                activeTab === "module" ? "text-blue-600 font-black" : "text-slate-500 hover:text-slate-800"
              }`}
            >
              <span>Module Permissions</span>
              {activeTab === "module" && (
                <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-600 rounded-full"></span>
              )}
            </button>

            <button
              type="button"
              onClick={() => setActiveTab("summary")}
              className={`py-2.5 transition relative cursor-pointer ${
                activeTab === "summary" ? "text-blue-600 font-black" : "text-slate-500 hover:text-slate-800"
              }`}
            >
              <span>Summary</span>
              {activeTab === "summary" && (
                <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-600 rounded-full"></span>
              )}
            </button>
          </div>

          {/* Main Layout Split */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
            {/* LEFT COLUMN: TAB CONTENT */}
            <div className="lg:col-span-8 space-y-4">
              {/* TAB 1: PERMISSION MATRIX */}
              {activeTab === "matrix" && (
                <div className="bg-white border border-slate-200/90 rounded-2xl p-4 shadow-2xs space-y-3">
                  <div className="flex items-center justify-between border-b border-slate-100 pb-2.5">
                    <div>
                      <h3 className="text-xs font-extrabold text-slate-900 tracking-wide">
                        Permission Matrix
                      </h3>
                      <p className="text-[10px] text-slate-400 font-medium">
                        Set permissions for each module and action.
                      </p>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={handleCollapseAll}
                        className="px-2.5 py-1 bg-slate-50 hover:bg-slate-100 text-slate-700 font-bold text-[11px] rounded-lg transition border border-slate-200 cursor-pointer"
                      >
                        Collapse All
                      </button>
                      <button
                        type="button"
                        onClick={handleSelectAll}
                        className="px-2.5 py-1 bg-blue-50 hover:bg-blue-100 text-blue-700 font-bold text-[11px] rounded-lg transition border border-blue-200 cursor-pointer"
                      >
                        Select All
                      </button>
                    </div>
                  </div>

                  {/* 11 Modules x 5 Action Checkboxes Grid */}
                  <div className="border border-slate-200/80 rounded-xl overflow-x-auto">
                    <table className="w-full text-left text-xs border-collapse min-w-[650px]">
                      <thead>
                        <tr className="bg-slate-50/80 border-b border-slate-200/80 text-[10px] font-bold text-slate-500 uppercase tracking-wider">
                          <th className="py-3 px-3">Module (Resource)</th>
                          <th className="py-3 px-2 text-center w-20">Create</th>
                          <th className="py-3 px-2 text-center w-20">Read</th>
                          <th className="py-3 px-2 text-center w-20">Update</th>
                          <th className="py-3 px-2 text-center w-20">Delete</th>
                          <th className="py-3 px-2 text-center w-20">Manage</th>
                          <th className="py-3 px-2 text-center w-8"></th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100 font-medium text-slate-800">
                        {EDIT_PERM_MODULES.map((m) => {
                          const modPerms = actionPermissions[m.key] || {
                            create: false,
                            read: true,
                            update: false,
                            delete: false,
                            manage: false,
                          };

                          return (
                            <tr key={m.key} className="hover:bg-slate-50/50 transition-colors">
                              <td className="py-2.5 px-3">
                                <p className="font-extrabold text-slate-900">{m.name}</p>
                                <p className="text-[10px] text-slate-400 font-medium">{m.sub}</p>
                              </td>

                              <td className="py-2.5 px-2 text-center">
                                <input
                                  type="checkbox"
                                  checked={!!modPerms.create}
                                  onChange={() => handleCheckboxToggle(m.key, "create")}
                                  className="w-4 h-4 text-blue-600 rounded-md border-slate-300 focus:ring-blue-500 cursor-pointer"
                                />
                              </td>

                              <td className="py-2.5 px-2 text-center">
                                <input
                                  type="checkbox"
                                  checked={!!modPerms.read}
                                  onChange={() => handleCheckboxToggle(m.key, "read")}
                                  className="w-4 h-4 text-blue-600 rounded-md border-slate-300 focus:ring-blue-500 cursor-pointer"
                                />
                              </td>

                              <td className="py-2.5 px-2 text-center">
                                <input
                                  type="checkbox"
                                  checked={!!modPerms.update}
                                  onChange={() => handleCheckboxToggle(m.key, "update")}
                                  className="w-4 h-4 text-blue-600 rounded-md border-slate-300 focus:ring-blue-500 cursor-pointer"
                                />
                              </td>

                              <td className="py-2.5 px-2 text-center">
                                <input
                                  type="checkbox"
                                  checked={!!modPerms.delete}
                                  onChange={() => handleCheckboxToggle(m.key, "delete")}
                                  className="w-4 h-4 text-blue-600 rounded-md border-slate-300 focus:ring-blue-500 cursor-pointer"
                                />
                              </td>

                              <td className="py-2.5 px-2 text-center">
                                <input
                                  type="checkbox"
                                  checked={!!modPerms.manage}
                                  onChange={() => handleCheckboxToggle(m.key, "manage")}
                                  className="w-4 h-4 text-blue-600 rounded-md border-slate-300 focus:ring-blue-500 cursor-pointer"
                                />
                              </td>

                              <td className="py-2.5 px-2 text-center text-slate-400">
                                <ChevronRight className="w-4 h-4 inline-block" />
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>

                  {/* Legend Status Bar */}
                  <div className="flex flex-wrap items-center gap-4 text-[10px] font-bold text-slate-600 pt-2 border-t border-slate-100">
                    <div className="flex items-center gap-1.5">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                      <span>Full Access (All Actions)</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <MinusCircle className="w-3.5 h-3.5 text-blue-600" />
                      <span>Read Only</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <Edit3 className="w-3.5 h-3.5 text-amber-600" />
                      <span>Limited Access (Selected)</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <XCircle className="w-3.5 h-3.5 text-rose-500" />
                      <span>No Access</span>
                    </div>
                  </div>
                </div>
              )}

              {/* TAB 2: MODULE PERMISSIONS */}
              {activeTab === "module" && (
                <div className="bg-white border border-slate-200/90 rounded-2xl p-4 shadow-2xs space-y-4">
                  <div className="border-b border-slate-100 pb-3">
                    <h3 className="text-xs font-extrabold text-slate-900 tracking-wide">
                      Module Permissions Management
                    </h3>
                    <p className="text-[10px] text-slate-400 font-medium">
                      Configure overall access levels per module or fine-tune individual actions.
                    </p>
                  </div>

                  <div className="grid grid-cols-1 gap-3">
                    {EDIT_PERM_MODULES.map((m) => {
                      const accessLvl = getModuleAccessLevel(m.key);
                      const p = actionPermissions[m.key] || {};

                      return (
                        <div
                          key={m.key}
                          className="p-3 bg-slate-50/60 border border-slate-200/80 rounded-xl space-y-3"
                        >
                          <div className="flex items-center justify-between">
                            <div>
                              <h4 className="font-extrabold text-slate-900 text-xs">{m.name}</h4>
                              <p className="text-[10px] text-slate-400 font-medium">{m.sub}</p>
                            </div>

                            <CustomDropdown
                              value={accessLvl}
                              options={ACCESS_LEVEL_OPTIONS}
                              onChange={(newVal) => handleAccessLevelChange(m.key, newVal)}
                              minWidth="135px"
                              alignRight
                            />
                          </div>

                          {/* Action Checkbox Chips */}
                          <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-slate-200/60 text-[11px]">
                            {["create", "read", "update", "delete", "manage"].map((act) => (
                              <label
                                key={act}
                                className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg border font-bold cursor-pointer transition ${
                                  p[act]
                                    ? "bg-blue-50 border-blue-200 text-blue-700"
                                    : "bg-white border-slate-200 text-slate-400"
                                }`}
                              >
                                <input
                                  type="checkbox"
                                  checked={!!p[act]}
                                  onChange={() => handleCheckboxToggle(m.key, act)}
                                  className="sr-only"
                                />
                                {p[act] && <Check className="w-3 h-3 text-blue-600" />}
                                <span className="capitalize">{act}</span>
                              </label>
                            ))}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* TAB 3: SUMMARY */}
              {activeTab === "summary" && (
                <div className="bg-white border border-slate-200/90 rounded-2xl p-4 shadow-2xs space-y-4">
                  <div className="border-b border-slate-100 pb-3">
                    <h3 className="text-xs font-extrabold text-slate-900 tracking-wide">
                      Permissions Summary & Security Audit
                    </h3>
                    <p className="text-[10px] text-slate-400 font-medium">
                      Overview of granted access levels, restricted resources, and total actions enabled for {role.name}.
                    </p>
                  </div>

                  {/* 4 Summary Cards */}
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                    <div className="p-3 bg-emerald-50/60 border border-emerald-100 rounded-xl">
                      <p className="text-xl font-black text-emerald-800">{grantedModulesCount}</p>
                      <p className="text-[10px] font-bold text-emerald-600">Granted Modules</p>
                    </div>

                    <div className="p-3 bg-rose-50/60 border border-rose-100 rounded-xl">
                      <p className="text-xl font-black text-rose-800">{restrictedModulesCount}</p>
                      <p className="text-[10px] font-bold text-rose-600">Restricted Modules</p>
                    </div>

                    <div className="p-3 bg-blue-50/60 border border-blue-100 rounded-xl">
                      <p className="text-xl font-black text-blue-800">{totalActionsEnabled}</p>
                      <p className="text-[10px] font-bold text-blue-600">Total Actions Enabled</p>
                    </div>

                    <div className="p-3 bg-purple-50/60 border border-purple-100 rounded-xl">
                      <p className="text-xl font-black text-purple-800">
                        {role.name === "SUPER_ADMIN" ? "Critical" : "Standard"}
                      </p>
                      <p className="text-[10px] font-bold text-purple-600">Security Risk Score</p>
                    </div>
                  </div>

                  {/* Granted vs Restricted Module List */}
                  <div className="space-y-2 pt-2">
                    <h4 className="font-extrabold text-slate-900 text-xs">Module Breakdown</h4>
                    <div className="border border-slate-200/80 rounded-xl overflow-hidden divide-y divide-slate-100">
                      {EDIT_PERM_MODULES.map((m) => {
                        const lvl = getModuleAccessLevel(m.key);
                        const p = actionPermissions[m.key] || {};
                        const enabledActs = Object.keys(p).filter((k) => p[k]);

                        return (
                          <div key={m.key} className="p-2.5 bg-slate-50/40 flex items-center justify-between">
                            <div>
                              <span className="font-bold text-slate-900">{m.name}</span>
                              <p className="text-[10px] text-slate-400 font-medium">
                                Actions: {enabledActs.length > 0 ? enabledActs.join(", ") : "None"}
                              </p>
                            </div>

                            <span
                              className={`px-2.5 py-0.5 rounded-full text-[10px] font-extrabold border ${
                                lvl === "Full Access"
                                  ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                                  : lvl === "Read Only"
                                  ? "bg-blue-50 text-blue-700 border-blue-200"
                                  : lvl === "Limited Access"
                                  ? "bg-amber-50 text-amber-700 border-amber-200"
                                  : "bg-rose-50 text-rose-700 border-rose-200"
                              }`}
                            >
                              {lvl}
                            </span>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>
              )}

              {/* Bottom Blue Note Alert Banner matching Screenshot */}
              <div className="bg-blue-50/80 border border-blue-200/80 rounded-xl p-3 flex items-center gap-2.5 text-xs text-blue-800">
                <Info className="w-4 h-4 text-blue-600 shrink-0" />
                <span className="font-bold">
                  Note: Permission changes are effective immediately for all users assigned to this role.
                </span>
              </div>
            </div>

            {/* RIGHT SIDEBAR COLUMN */}
            <div className="lg:col-span-4">
              <EditPermissionsRightSidebar role={role} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
