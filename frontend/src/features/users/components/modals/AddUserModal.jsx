import React, { useState, useEffect } from "react";
import { X, User, Lock, ShieldCheck, UploadCloud, Eye, EyeOff, UserPlus, AlertCircle } from "lucide-react";
import { USER_ROLES, USER_DEPARTMENTS } from "../../constants/user.constants.js";
import { validateUserForm } from "../../validation/user.validation.js";
import AddUserRightSidebar from "../AddUserRightSidebar.jsx";

// Reusable Form Field Wrapper for DRY JSX
function FormField({ label, required, error, children, helpText }) {
  return (
    <div className="space-y-1">
      <label className="text-[11px] font-bold text-slate-700">
        {label} {required && <span className="text-rose-500">*</span>}
      </label>
      {children}
      {error ? (
        <p className="text-[10px] text-rose-600 font-extrabold mt-0.5">⚠️ {error}</p>
      ) : helpText ? (
        <p className="text-[10px] text-slate-400 font-medium">{helpText}</p>
      ) : null}
    </div>
  );
}

export default function AddUserModal({ isOpen, onClose, onSubmit, editingUser }) {
  if (!isOpen) return null;

  // Form State
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    countryCode: "+91",
    dateOfBirth: "",
    gender: "",
    avatar: "",
    roleName: "DOCTOR",
    department: "Cardiology",
    designation: "",
    username: "",
    password: "",
    confirmPassword: "",
    forcePasswordChange: true,
    status: "active",
    emailVerified: "Unverified",
    loginAccess: "Allowed",
    sendWelcomeEmail: false,
    notes: "",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [fieldErrors, setFieldErrors] = useState({});

  useEffect(() => {
    setFieldErrors({});
    setErrorMsg("");
    if (editingUser) {
      setFormData({
        name: editingUser.name || "",
        email: editingUser.email || "",
        phone: editingUser.phone || "",
        countryCode: editingUser.countryCode || "+91",
        dateOfBirth: editingUser.dateOfBirth || "",
        gender: editingUser.gender || "",
        avatar: editingUser.avatar || "",
        roleName: editingUser.roleName || "DOCTOR",
        department: editingUser.department || "Cardiology",
        designation: editingUser.designation || "",
        username: editingUser.username || editingUser.email?.split("@")[0] || "",
        password: "",
        confirmPassword: "",
        forcePasswordChange: editingUser.forcePasswordChange !== undefined ? editingUser.forcePasswordChange : true,
        status: editingUser.status || "active",
        emailVerified: editingUser.emailVerified || "Unverified",
        loginAccess: editingUser.loginAccess || "Allowed",
        sendWelcomeEmail: editingUser.sendWelcomeEmail || false,
        notes: editingUser.notes || "",
      });
    } else {
      setFormData({
        name: "",
        email: "",
        phone: "",
        countryCode: "+91",
        dateOfBirth: "",
        gender: "",
        avatar: "",
        roleName: "DOCTOR",
        department: "Cardiology",
        designation: "",
        username: "",
        password: "",
        confirmPassword: "",
        forcePasswordChange: true,
        status: "active",
        emailVerified: "Unverified",
        loginAccess: "Allowed",
        sendWelcomeEmail: false,
        notes: "",
      });
    }
  }, [editingUser, isOpen]);

  const handleChange = (field, value) => {
    setFormData((prev) => {
      const next = { ...prev, [field]: value };
      if (field === "email" && !prev.username && value.includes("@")) {
        next.username = value.split("@")[0].toLowerCase().replace(/[^a-z0-9._]/g, "");
      }
      return next;
    });

    if (fieldErrors[field]) {
      setFieldErrors((prev) => {
        const copy = { ...prev };
        delete copy[field];
        return copy;
      });
    }
  };

  const handleImageUpload = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 2 * 1024 * 1024) {
      setErrorMsg("File size exceeds 2MB limit.");
      return;
    }
    const reader = new FileReader();
    reader.onloadend = () => handleChange("avatar", reader.result);
    reader.readAsDataURL(file);
  };

  const handleSubmit = async (e) => {
    e?.preventDefault();
    const { isValid, errors } = validateUserForm(formData, !!editingUser);
    if (!isValid) {
      setFieldErrors(errors);
      setErrorMsg("Please fix highlighted errors before submitting.");
      return;
    }

    setSubmitting(true);
    setErrorMsg("");
    try {
      await onSubmit({
        ...formData,
        name: formData.name.trim(),
        email: formData.email.trim().toLowerCase(),
        username: formData.username.trim().toLowerCase(),
        phone: formData.phone.trim(),
        department: formData.roleName.toUpperCase() === "DOCTOR" ? formData.department : formData.department || "General",
        notes: formData.notes.substring(0, 250),
        ...(formData.password ? { password: formData.password } : {}),
      });
    } catch (err) {
      setErrorMsg(err.response?.data?.message || err.message || "Failed to save user.");
    } finally {
      setSubmitting(false);
    }
  };

  const inputStyle = (field) =>
    `w-full bg-slate-50 border rounded-xl px-3 py-2 text-xs font-bold text-slate-800 focus:outline-none h-[36px] ${
      fieldErrors[field]
        ? "border-rose-500 bg-rose-50/40 focus:border-rose-600"
        : "border-slate-200 focus:border-blue-500"
    }`;

  return (
    <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center z-50 p-4">
      <div className="bg-white border border-slate-200/90 rounded-2xl max-w-5xl w-full shadow-2xl flex flex-col max-h-[92vh] overflow-hidden text-xs text-slate-800">
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-white shrink-0">
          <div>
            <h2 className="text-base font-bold text-slate-900">{editingUser ? "Edit User Details" : "Add New User"}</h2>
            <p className="text-xs text-slate-500 font-medium">Create a new system user and assign role & permissions.</p>
          </div>
          <button onClick={onClose} className="p-1 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-100 transition cursor-pointer">
            <X className="w-5 h-5" />
          </button>
        </div>

        {errorMsg && (
          <div className="mx-6 mt-3 p-3 bg-rose-50 border border-rose-200 rounded-xl text-xs font-semibold text-rose-600 shrink-0 flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
            <span>{errorMsg}</span>
          </div>
        )}

        {/* Form Body */}
        <div className="p-6 overflow-y-auto grid grid-cols-1 lg:grid-cols-12 gap-6 flex-1 items-start">
          <div className="lg:col-span-8 space-y-5">
            {/* Section 1: Personal Info */}
            <div className="bg-white border border-slate-200/90 rounded-2xl p-4 shadow-2xs space-y-3">
              <div className="flex items-center gap-2 border-b border-slate-100 pb-2.5">
                <User className="w-4 h-4 text-blue-600" />
                <h3 className="text-xs font-extrabold text-blue-700 tracking-wide">1. Personal Information</h3>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <FormField label="Full Name" required error={fieldErrors.name}>
                  <input type="text" value={formData.name} onChange={(e) => handleChange("name", e.target.value)} placeholder="Enter full name" className={inputStyle("name")} />
                </FormField>

                <FormField label="Email Address" required error={fieldErrors.email}>
                  <input type="email" value={formData.email} onChange={(e) => handleChange("email", e.target.value)} placeholder="Enter email address" className={inputStyle("email")} />
                </FormField>

                <FormField label="Phone Number" required error={fieldErrors.phone}>
                  <div className="flex items-center gap-1.5">
                    <select value={formData.countryCode} onChange={(e) => handleChange("countryCode", e.target.value)} className="bg-slate-50 border border-slate-200 rounded-xl px-2 py-2 text-xs font-bold text-slate-700 h-[36px]">
                      <option value="+91">🇮🇳 +91</option>
                      <option value="+1">🇺🇸 +1</option>
                      <option value="+44">🇬🇧 +44</option>
                    </select>
                    <input type="text" value={formData.phone} onChange={(e) => handleChange("phone", e.target.value)} placeholder="Enter mobile number" className={`${inputStyle("phone")} font-mono`} />
                  </div>
                </FormField>

                <FormField label="Date of Birth" error={fieldErrors.dateOfBirth}>
                  <input type="date" max={new Date().toISOString().split("T")[0]} value={formData.dateOfBirth} onChange={(e) => handleChange("dateOfBirth", e.target.value)} className={inputStyle("dateOfBirth")} />
                </FormField>

                <FormField label="Gender">
                  <select value={formData.gender} onChange={(e) => handleChange("gender", e.target.value)} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-bold text-slate-800 focus:outline-none focus:border-blue-500 h-[36px]">
                    <option value="">Select gender</option>
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                    <option value="Other">Other</option>
                  </select>
                </FormField>

                {/* Profile Picture */}
                <FormField label="Profile Picture (Optional)">
                  <input type="file" id="avatarUploadInput" accept="image/*" className="hidden" onChange={handleImageUpload} />
                  {formData.avatar ? (
                    <div className="flex items-center gap-3 p-2 bg-slate-50 border border-slate-200 rounded-xl relative">
                      <img src={formData.avatar} alt="Preview" className="w-10 h-10 rounded-full object-cover border border-blue-200" />
                      <div className="flex-1 min-w-0">
                        <p className="text-[11px] font-bold text-slate-800 truncate">Image uploaded</p>
                        <p className="text-[9px] text-emerald-600 font-bold">✓ Ready</p>
                      </div>
                      <button type="button" onClick={() => handleChange("avatar", "")} className="p-1 rounded-lg bg-rose-50 hover:bg-rose-100 text-rose-600 text-xs font-bold cursor-pointer">✕</button>
                    </div>
                  ) : (
                    <div onClick={() => document.getElementById("avatarUploadInput")?.click()} className="border-2 border-dashed border-slate-200 rounded-xl p-3 text-center bg-slate-50/50 hover:bg-blue-50/30 transition cursor-pointer flex flex-col items-center justify-center">
                      <UploadCloud className="w-5 h-5 text-blue-600 mb-1" />
                      <p className="text-[11px] font-extrabold text-blue-600">Click to upload <span className="text-slate-500 font-medium">or drag & drop</span></p>
                      <p className="text-[9px] text-slate-400 font-medium">JPG, PNG (Max. 2MB)</p>
                    </div>
                  )}
                </FormField>
              </div>
            </div>

            {/* Section 2: Account Information */}
            <div className="bg-white border border-slate-200/90 rounded-2xl p-4 shadow-2xs space-y-3">
              <div className="flex items-center gap-2 border-b border-slate-100 pb-2.5">
                <Lock className="w-4 h-4 text-blue-600" />
                <h3 className="text-xs font-extrabold text-blue-700 tracking-wide">2. Account Information</h3>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <FormField label="Role" required error={fieldErrors.roleName}>
                  <select value={formData.roleName} onChange={(e) => handleChange("roleName", e.target.value)} className={inputStyle("roleName")}>
                    <option value="">Select role</option>
                    {USER_ROLES.filter((r) => r !== "All Roles").map((r) => (
                      <option key={r} value={r}>{r}</option>
                    ))}
                  </select>
                </FormField>

                <FormField label="Department" required={formData.roleName.toUpperCase() === "DOCTOR"} error={fieldErrors.department}>
                  <select value={formData.department} onChange={(e) => handleChange("department", e.target.value)} className={inputStyle("department")}>
                    <option value="">Select department</option>
                    {USER_DEPARTMENTS.filter((d) => d !== "All Departments").map((d) => (
                      <option key={d} value={d}>{d}</option>
                    ))}
                  </select>
                </FormField>

                <FormField label="Designation / Position">
                  <input type="text" value={formData.designation} onChange={(e) => handleChange("designation", e.target.value)} placeholder="Enter designation" className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-800 focus:outline-none focus:border-blue-500 h-[36px]" />
                </FormField>

                <FormField label="Username" required error={fieldErrors.username} helpText="Used for system login (unique)">
                  <input type="text" value={formData.username} onChange={(e) => handleChange("username", e.target.value)} placeholder="Enter username" autoComplete="off" className={`${inputStyle("username")} font-mono`} />
                </FormField>

                <FormField label="Password" required={!editingUser} error={fieldErrors.password} helpText="Minimum 8 characters">
                  <div className="relative">
                    <input type={showPassword ? "text" : "password"} value={formData.password} onChange={(e) => handleChange("password", e.target.value)} placeholder="Enter temporary password" autoComplete="new-password" className={`${inputStyle("password")} font-mono pl-3 pr-9`} />
                    <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600">
                      {showPassword ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                    </button>
                  </div>
                </FormField>

                <FormField label="Confirm Password" required={!editingUser} error={fieldErrors.confirmPassword} helpText="Passwords must match">
                  <div className="relative">
                    <input type={showConfirmPassword ? "text" : "password"} value={formData.confirmPassword} onChange={(e) => handleChange("confirmPassword", e.target.value)} placeholder="Confirm password" autoComplete="new-password" className={`${inputStyle("confirmPassword")} font-mono pl-3 pr-9`} />
                    <button type="button" onClick={() => setShowConfirmPassword(!showConfirmPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600">
                      {showConfirmPassword ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                    </button>
                  </div>
                </FormField>
              </div>

              {/* Force Password Toggle */}
              <div className="flex items-center justify-between pt-3 border-t border-slate-100">
                <div>
                  <p className="text-xs font-extrabold text-slate-900">Force Password Change on First Login</p>
                  <p className="text-[10px] text-slate-400 font-medium">User will be required to change password at first login</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input type="checkbox" checked={formData.forcePasswordChange} onChange={(e) => handleChange("forcePasswordChange", e.target.checked)} className="sr-only peer" />
                  <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                </label>
              </div>
            </div>

            {/* Section 3: Status & Access */}
            <div className="bg-white border border-slate-200/90 rounded-2xl p-4 shadow-2xs space-y-3">
              <div className="flex items-center gap-2 border-b border-slate-100 pb-2.5">
                <ShieldCheck className="w-4 h-4 text-blue-600" />
                <h3 className="text-xs font-extrabold text-blue-700 tracking-wide">3. Status & Access</h3>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <FormField label="Account Status" required>
                  <select value={formData.status} onChange={(e) => handleChange("status", e.target.value)} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-bold text-slate-800 focus:outline-none focus:border-blue-500 cursor-pointer h-[36px]">
                    <option value="active">● Active</option>
                    <option value="inactive">● Inactive</option>
                    <option value="suspended">● Suspended</option>
                    <option value="blocked">● Blocked</option>
                  </select>
                </FormField>

                <FormField label="Email Verification">
                  <select value={formData.emailVerified} onChange={(e) => handleChange("emailVerified", e.target.value)} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-bold text-slate-800 focus:outline-none focus:border-blue-500 cursor-pointer h-[36px]">
                    <option value="Unverified">Unverified</option>
                    <option value="Verified">Verified</option>
                  </select>
                </FormField>

                <FormField label="Login Access">
                  <select value={formData.loginAccess} onChange={(e) => handleChange("loginAccess", e.target.value)} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-bold text-slate-800 focus:outline-none focus:border-blue-500 cursor-pointer h-[36px]">
                    <option value="Allowed">Allowed</option>
                    <option value="Restricted">Restricted</option>
                    <option value="Blocked">Blocked</option>
                  </select>
                </FormField>

                <div className="space-y-1 sm:col-span-3">
                  <label className="text-[11px] font-bold text-slate-700">Notes (Optional)</label>
                  <textarea rows={2} maxLength={250} value={formData.notes} onChange={(e) => handleChange("notes", e.target.value)} placeholder="Enter any additional notes..." className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-xs text-slate-800 focus:outline-none focus:border-blue-500 resize-none" />
                  <p className="text-[10px] text-slate-400 font-mono text-right font-medium">{formData.notes.length} / 250</p>
                </div>
              </div>

              {/* Actions Footer */}
              <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-3 border-t border-slate-100">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input type="checkbox" checked={formData.sendWelcomeEmail} onChange={(e) => handleChange("sendWelcomeEmail", e.target.checked)} className="w-4 h-4 text-blue-600 rounded-md border-slate-300 focus:ring-blue-500 cursor-pointer" />
                  <div>
                    <p className="text-xs font-extrabold text-slate-900">Send welcome email to user</p>
                    <p className="text-[10px] text-slate-400 font-medium">Email will contain login credentials and system access details.</p>
                  </div>
                </label>

                <div className="flex items-center gap-2 self-end sm:self-auto">
                  <button type="button" onClick={onClose} className="px-4 py-2 bg-white border border-slate-200 hover:bg-slate-100 text-slate-700 font-bold text-xs rounded-xl shadow-2xs transition cursor-pointer">Cancel</button>
                  <button type="button" onClick={handleSubmit} disabled={submitting} className="flex items-center gap-1.5 px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-xl shadow-xs transition cursor-pointer disabled:opacity-50">
                    <UserPlus className="w-3.5 h-3.5" />
                    <span>{submitting ? (editingUser ? "Updating..." : "Creating...") : editingUser ? "Update User" : "Create User"}</span>
                  </button>
                </div>
              </div>
            </div>
          </div>

          <div className="lg:col-span-4">
            <AddUserRightSidebar />
          </div>
        </div>
      </div>
    </div>
  );
}
