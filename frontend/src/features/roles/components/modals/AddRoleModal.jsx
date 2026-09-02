import React, { useState, useEffect } from "react";
import { X, Save, Shield, Settings, ChevronRight } from "lucide-react";
import AddRoleRightSidebar from "../AddRoleRightSidebar.jsx";

const PERMISSION_MODULE_LIST = [
  { key: "Patient Management", name: "Patient Management", sub: "Patients, registration, profiles" },
  { key: "Doctor Management", name: "Doctor Management", sub: "Doctors, schedules, availability" },
  { key: "Appointment", name: "Appointment", sub: "OPD/IPD appointments" },
  { key: "Billing & Invoicing", name: "Billing & Invoicing", sub: "Invoices, payments, refunds" },
  { key: "Pharmacy", name: "Pharmacy", sub: "Drug inventory, dispensing" },
  { key: "Laboratory", name: "Laboratory", sub: "Lab tests, reports" },
  { key: "Radiology", name: "Radiology", sub: "Imaging, radiology reports" },
  { key: "Inventory / Store", name: "Inventory / Store", sub: "Inventory, stock management" },
  { key: "User Management", name: "User Management", sub: "Users, roles, staff" },
  { key: "Audit Log", name: "Audit Log", sub: "System audit logs" },
];

export default function AddRoleModal({ isOpen, onClose, onSubmit, editingRole }) {
  if (!isOpen) return null;

  // Section 1: Role Information
  const [name, setName] = useState("");
  const [roleCode, setRoleCode] = useState("");
  const [description, setDescription] = useState("");
  const [roleType, setRoleType] = useState("Custom");
  const [status, setStatus] = useState("active");

  // Section 2: Set Permissions (10 Modules x 5 Actions Checkbox Grid)
  const [actionPermissions, setActionPermissions] = useState(() => {
    const initial = {};
    PERMISSION_MODULE_LIST.forEach((m) => {
      initial[m.key] = { create: false, read: true, update: false, delete: false, manage: false };
    });
    return initial;
  });

  // Section 3: Additional Settings (Optional)
  const [parentRole, setParentRole] = useState("");
  const [maxUsers, setMaxUsers] = useState("");

  const [submitting, setSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  useEffect(() => {
    if (editingRole) {
      setName(editingRole.name || "");
      setRoleCode(editingRole.roleCode || editingRole.name || "");
      setDescription(editingRole.description || "");
      setRoleType(editingRole.roleType || "Custom");
      setStatus(editingRole.status || "active");
      setParentRole(editingRole.parentRole || "");
      setMaxUsers(editingRole.maxUsers || "");
      if (editingRole.actionPermissions) {
        setActionPermissions(editingRole.actionPermissions);
      }
    } else {
      setName("");
      setRoleCode("");
      setDescription("");
      setRoleType("Custom");
      setStatus("active");
      setParentRole("");
      setMaxUsers("");
    }
  }, [editingRole, isOpen]);

  const handleNameChange = (val) => {
    setName(val);
    if (!roleCode && val) {
      setRoleCode(val.toUpperCase().replace(/\s+/g, "_").replace(/[^A-Z0-9_]/g, ""));
    }
  };

  const handleCheckboxToggle = (moduleKey, actionKey) => {
    setActionPermissions((prev) => ({
      ...prev,
      [moduleKey]: {
        ...prev[moduleKey],
        [actionKey]: !prev[moduleKey]?.[actionKey],
      },
    }));
  };

  const handleSelectAll = () => {
    const updated = {};
    PERMISSION_MODULE_LIST.forEach((m) => {
      updated[m.key] = { create: true, read: true, update: true, delete: true, manage: true };
    });
    setActionPermissions(updated);
  };

  const handleCollapseAll = () => {
    const updated = {};
    PERMISSION_MODULE_LIST.forEach((m) => {
      updated[m.key] = { create: false, read: false, update: false, delete: false, manage: false };
    });
    setActionPermissions(updated);
  };

  const handleSubmit = async (e) => {
    e?.preventDefault();
    if (!name || name.trim().length === 0) {
      setErrorMsg("Role Name is required.");
      return;
    }
    if (!roleCode || roleCode.trim().length === 0) {
      setErrorMsg("Role Code is required.");
      return;
    }

    setSubmitting(true);
    setErrorMsg("");
    try {
      await onSubmit({
        name: name.trim().toUpperCase(),
        roleCode: roleCode.trim().toUpperCase(),
        description: description.substring(0, 255),
        roleType,
        status,
        parentRole,
        maxUsers: maxUsers ? Number(maxUsers) : null,
        actionPermissions,
      });
    } catch (err) {
      setErrorMsg(err.response?.data?.message || err.message || "Failed to save role.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center z-50 p-4">
      <div className="bg-white border border-slate-200/90 rounded-2xl max-w-5xl w-full shadow-2xl flex flex-col max-h-[92vh] overflow-hidden text-xs text-slate-800">
        {/* Modal Header Bar matching Screenshot */}
        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-white shrink-0">
          <div>
            <h2 className="text-base font-bold text-slate-900">
              {editingRole ? "Edit Role Details" : "Add New Role"}
            </h2>
            <p className="text-xs text-slate-500 font-medium">
              Create a new custom role and set its permissions
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {errorMsg && (
          <div className="mx-6 mt-3 p-3 bg-rose-50 border border-rose-200 rounded-xl text-xs font-semibold text-rose-600 shrink-0">
            ⚠️ {errorMsg}
          </div>
        )}

        {/* Modal Body: 2-Column Split (Form Left + Help Widgets Right) */}
        <div className="p-6 overflow-y-auto grid grid-cols-1 lg:grid-cols-12 gap-6 flex-1 items-start">
          {/* LEFT FORM COLUMN (3 SECTIONS) */}
          <div className="lg:col-span-8 space-y-5">
            {/* SECTION 1: Role Information */}
            <div className="bg-white border border-slate-200/90 rounded-2xl p-4 shadow-2xs space-y-3">
              <div className="flex items-center gap-2 border-b border-slate-100 pb-2.5">
                <span className="w-5 h-5 rounded-full bg-blue-600 text-white font-black text-[10px] flex items-center justify-center">
                  1
                </span>
                <h3 className="text-xs font-extrabold text-blue-700 tracking-wide">
                  Role Information
                </h3>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {/* Role Name */}
                <div className="space-y-1">
                  <label className="text-[11px] font-bold text-slate-700">
                    Role Name <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => handleNameChange(e.target.value)}
                    placeholder="Enter role name (e.g. LAB_TECHNICIAN)"
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-bold text-slate-800 focus:outline-none focus:border-blue-500 uppercase"
                  />
                  <p className="text-[10px] text-slate-400 font-medium">Role name must be unique</p>
                </div>

                {/* Role Code */}
                <div className="space-y-1">
                  <label className="text-[11px] font-bold text-slate-700">
                    Role Code <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={roleCode}
                    onChange={(e) => setRoleCode(e.target.value)}
                    placeholder="Enter role code (e.g. LAB_TECH)"
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-mono font-bold text-slate-800 focus:outline-none focus:border-blue-500 uppercase"
                  />
                  <p className="text-[10px] text-slate-400 font-medium">Short unique code for system use</p>
                </div>

                {/* Description */}
                <div className="space-y-1 sm:col-span-1">
                  <label className="text-[11px] font-bold text-slate-700">Description</label>
                  <textarea
                    rows={3}
                    maxLength={255}
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Enter role description..."
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-xs text-slate-800 focus:outline-none focus:border-blue-500 resize-none"
                  />
                  <p className="text-[10px] text-slate-400 font-mono text-right font-medium">
                    {description.length} / 255
                  </p>
                </div>

                {/* Role Type & Status */}
                <div className="space-y-3 sm:col-span-1">
                  <div className="space-y-1.5">
                    <label className="text-[11px] font-bold text-slate-700">
                      Role Type <span className="text-rose-500">*</span>
                    </label>
                    <div className="space-y-1.5 pt-1 text-xs">
                      <label className="flex items-center gap-2 cursor-pointer">
                        <input
                          type="radio"
                          name="roleType"
                          value="Custom"
                          checked={roleType === "Custom"}
                          onChange={() => setRoleType("Custom")}
                          className="w-4 h-4 text-blue-600"
                        />
                        <div>
                          <span className="font-extrabold text-slate-900">Custom Role</span>
                          <p className="text-[10px] text-slate-400 font-medium">
                            Custom roles can be edited and deleted
                          </p>
                        </div>
                      </label>

                      <label className="flex items-center gap-2 cursor-pointer">
                        <input
                          type="radio"
                          name="roleType"
                          value="System"
                          checked={roleType === "System"}
                          onChange={() => setRoleType("System")}
                          className="w-4 h-4 text-blue-600"
                        />
                        <div>
                          <span className="font-extrabold text-slate-900">System Role</span>
                          <p className="text-[10px] text-slate-400 font-medium">
                            System roles are protected and cannot be deleted
                          </p>
                        </div>
                      </label>
                    </div>
                  </div>

                  {/* Status Toggle Switch matching Screenshot */}
                  <div className="flex items-center justify-between pt-2 border-t border-slate-100">
                    <div>
                      <span className="text-xs font-bold text-slate-700">
                        Status <span className="text-rose-500">*</span>
                      </span>
                      <p className="text-[10px] text-slate-400 font-medium">
                        Inactive roles cannot be assigned to users
                      </p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={status === "active"}
                        onChange={(e) => setStatus(e.target.checked ? "active" : "inactive")}
                        className="sr-only peer"
                      />
                      <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-500"></div>
                    </label>
                  </div>
                </div>
              </div>
            </div>

            {/* SECTION 2: Set Permissions Granular Checkbox Matrix Table matching Screenshot */}
            <div className="bg-white border border-slate-200/90 rounded-2xl p-4 shadow-2xs space-y-3">
              <div className="flex items-center justify-between border-b border-slate-100 pb-2.5">
                <div className="flex items-center gap-2">
                  <span className="w-5 h-5 rounded-full bg-blue-600 text-white font-black text-[10px] flex items-center justify-center">
                    2
                  </span>
                  <div>
                    <h3 className="text-xs font-extrabold text-blue-700 tracking-wide">
                      Set Permissions
                    </h3>
                    <p className="text-[10px] text-slate-400 font-medium">
                      Select the modules and actions this role is allowed to access.
                    </p>
                  </div>
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

              {/* 10 Modules x 5 Action Checkboxes Grid */}
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
                    {PERMISSION_MODULE_LIST.map((m) => {
                      const modPerms = actionPermissions[m.key] || {
                        create: false,
                        read: true,
                        update: false,
                        delete: false,
                        manage: false,
                      };

                      return (
                        <tr key={m.key} className="hover:bg-slate-50/50 transition-colors">
                          {/* Module (Resource) */}
                          <td className="py-2.5 px-3">
                            <p className="font-extrabold text-slate-900">{m.name}</p>
                            <p className="text-[10px] text-slate-400 font-medium">{m.sub}</p>
                          </td>

                          {/* Create Checkbox */}
                          <td className="py-2.5 px-2 text-center">
                            <input
                              type="checkbox"
                              checked={!!modPerms.create}
                              onChange={() => handleCheckboxToggle(m.key, "create")}
                              className="w-4 h-4 text-blue-600 rounded-md border-slate-300 focus:ring-blue-500 cursor-pointer"
                            />
                          </td>

                          {/* Read Checkbox */}
                          <td className="py-2.5 px-2 text-center">
                            <input
                              type="checkbox"
                              checked={!!modPerms.read}
                              onChange={() => handleCheckboxToggle(m.key, "read")}
                              className="w-4 h-4 text-blue-600 rounded-md border-slate-300 focus:ring-blue-500 cursor-pointer"
                            />
                          </td>

                          {/* Update Checkbox */}
                          <td className="py-2.5 px-2 text-center">
                            <input
                              type="checkbox"
                              checked={!!modPerms.update}
                              onChange={() => handleCheckboxToggle(m.key, "update")}
                              className="w-4 h-4 text-blue-600 rounded-md border-slate-300 focus:ring-blue-500 cursor-pointer"
                            />
                          </td>

                          {/* Delete Checkbox */}
                          <td className="py-2.5 px-2 text-center">
                            <input
                              type="checkbox"
                              checked={!!modPerms.delete}
                              onChange={() => handleCheckboxToggle(m.key, "delete")}
                              className="w-4 h-4 text-blue-600 rounded-md border-slate-300 focus:ring-blue-500 cursor-pointer"
                            />
                          </td>

                          {/* Manage Checkbox */}
                          <td className="py-2.5 px-2 text-center">
                            <input
                              type="checkbox"
                              checked={!!modPerms.manage}
                              onChange={() => handleCheckboxToggle(m.key, "manage")}
                              className="w-4 h-4 text-blue-600 rounded-md border-slate-300 focus:ring-blue-500 cursor-pointer"
                            />
                          </td>

                          {/* Expand Arrow */}
                          <td className="py-2.5 px-2 text-center text-slate-400">
                            <ChevronRight className="w-4 h-4 inline-block" />
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>

            {/* SECTION 3: Additional Settings (Optional) */}
            <div className="bg-white border border-slate-200/90 rounded-2xl p-4 shadow-2xs space-y-3">
              <div className="flex items-center gap-2 border-b border-slate-100 pb-2.5">
                <span className="w-5 h-5 rounded-full bg-blue-600 text-white font-black text-[10px] flex items-center justify-center">
                  3
                </span>
                <h3 className="text-xs font-extrabold text-blue-700 tracking-wide">
                  Additional Settings (Optional)
                </h3>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {/* Role Hierarchy */}
                <div className="space-y-1">
                  <label className="text-[11px] font-bold text-slate-700">Role Hierarchy (Optional)</label>
                  <select
                    value={parentRole}
                    onChange={(e) => setParentRole(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-bold text-slate-800 focus:outline-none focus:border-blue-500 cursor-pointer h-[36px]"
                  >
                    <option value="">Select parent role (if any)</option>
                    <option value="SUPER_ADMIN">SUPER_ADMIN</option>
                    <option value="ADMIN">ADMIN</option>
                    <option value="DOCTOR">DOCTOR</option>
                  </select>
                  <p className="text-[10px] text-slate-400 font-medium">Used for role hierarchy and inheritance</p>
                </div>

                {/* Max Users */}
                <div className="space-y-1">
                  <label className="text-[11px] font-bold text-slate-700">Max Users (Optional)</label>
                  <input
                    type="number"
                    value={maxUsers}
                    onChange={(e) => setMaxUsers(e.target.value)}
                    placeholder="Enter maximum users"
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-bold text-slate-800 focus:outline-none focus:border-blue-500 h-[36px]"
                  />
                  <p className="text-[10px] text-slate-400 font-medium">Leave empty for unlimited users</p>
                </div>
              </div>
            </div>
          </div>

          {/* RIGHT SIDEBAR HELP COLUMN (3 CARDS) */}
          <div className="lg:col-span-4">
            <AddRoleRightSidebar />
          </div>
        </div>

        {/* Modal Action Footer matching Screenshot */}
        <div className="px-6 py-3 border-t border-slate-100 bg-slate-50/50 flex items-center justify-end gap-3 shrink-0">
          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2 bg-white border border-slate-200 hover:bg-slate-100 text-slate-700 font-bold text-xs rounded-xl shadow-2xs transition cursor-pointer"
          >
            Cancel
          </button>

          <button
            type="button"
            onClick={handleSubmit}
            disabled={submitting}
            className="flex items-center gap-1.5 px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-xl shadow-xs transition cursor-pointer disabled:opacity-50"
          >
            <Save className="w-3.5 h-3.5" />
            <span>{submitting ? "Saving..." : "Save Role"}</span>
          </button>
        </div>
      </div>
    </div>
  );
}
