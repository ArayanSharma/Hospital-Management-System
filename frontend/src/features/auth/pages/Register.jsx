import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useNavigate } from "react-router-dom";
import {
  User,
  Mail,
  Phone,
  Lock,
  Eye,
  EyeOff,
  UserPlus,
  CheckCircle2,
  ChevronDown,
  ShieldCheck,
} from "lucide-react";

import RegisterHeader from "../components/RegisterHeader.jsx";
import RegisterBanner from "../components/RegisterBanner.jsx";
import PasswordCriteriaBox from "../components/PasswordCriteriaBox.jsx";
import { registerSchema } from "../validation/auth.schema.js";
import { registerApi, getRegistrationOptionsApi } from "../services/auth.api.js";

const DEFAULT_ROLES = [
  { name: "Doctor" },
  { name: "Nurse" },
  { name: "Receptionist" },
  { name: "Accountant" },
  { name: "Pharmacist" },
  { name: "Lab Technician" },
];

const DEFAULT_DEPTS = [
  { name: "Cardiology" },
  { name: "General OPD" },
  { name: "Inpatient IPD" },
  { name: "Pharmacy" },
  { name: "Laboratory" },
  { name: "Radiology" },
];

export default function Register() {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [serverError, setServerError] = useState("");
  const [successMsg, setSuccessMsg] = useState("");
  const [loading, setLoading] = useState(false);
  const [roles, setRoles] = useState(DEFAULT_ROLES);
  const [departments, setDepartments] = useState(DEFAULT_DEPTS);

  useEffect(() => {
    async function fetchOptions() {
      try {
        const res = await getRegistrationOptionsApi();
        if (res.data?.data) {
          if (res.data.data.roles?.length) setRoles(res.data.data.roles);
          if (res.data.data.departments?.length) setDepartments(res.data.data.departments);
        }
      } catch (err) {
        console.warn("Using default registration options", err);
      }
    }
    fetchOptions();
  }, []);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      name: "",
      email: "",
      phone: "",
      roleId: "",
      departmentId: "",
      password: "",
      confirmPassword: "",
      terms: false,
    },
  });

  const watchPassword = watch("password", "");

  const passwordCriteria = {
    length: watchPassword.length >= 8,
    lowercase: /[a-z]/.test(watchPassword),
    uppercase: /[A-Z]/.test(watchPassword),
    numberOrSpecial: /(?=.*[0-9])|(?=.*[^A-Za-z0-9])/.test(watchPassword),
  };

  const onSubmit = async (data) => {
    setServerError("");
    setSuccessMsg("");
    setLoading(true);

    try {
      const payload = {
        name: data.name.trim(),
        email: data.email.trim(),
        phone: data.phone.startsWith("+91") ? data.phone : `+91 ${data.phone.trim()}`,
        roleId: data.roleId,
        departmentId: data.departmentId || undefined,
        password: data.password,
      };

      await registerApi(payload);
      setSuccessMsg("Account created successfully! Redirecting to login...");
      setTimeout(() => navigate("/login"), 1800);
    } catch (err) {
      setServerError(
        err.response?.data?.message || "Registration failed. Please check your details and try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F4F7FB] dark:bg-[#0B0F19] flex flex-col font-sans antialiased text-slate-800 dark:text-slate-100 transition-colors duration-200">
      <RegisterHeader />

      <main className="w-full max-w-7xl mx-auto px-4 sm:px-6 pb-12 flex-1 flex items-center justify-center">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-start w-full my-auto py-2">
          {/* Left Banner Column */}
          <RegisterBanner />

          {/* Right Form Column */}
          <div className="lg:col-span-7">
            <div className="bg-white dark:bg-[#111827] rounded-3xl p-6 sm:p-9 shadow-xl shadow-slate-200/60 dark:shadow-2xl dark:shadow-black/60 border border-slate-100 dark:border-slate-800/80">
              <div className="mb-6">
                <h3 className="text-xl sm:text-2xl font-extrabold text-slate-900 dark:text-white tracking-tight">
                  User Registration
                </h3>
                <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
                  Please fill in the details to create your account.
                </p>
              </div>

              {serverError && (
                <div className="mb-5 p-3.5 rounded-xl bg-red-50 border border-red-200 text-xs sm:text-sm text-red-600 flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-red-500 shrink-0"></span>
                  <span>{serverError}</span>
                </div>
              )}

              {successMsg && (
                <div className="mb-5 p-3.5 rounded-xl bg-emerald-50 border border-emerald-200 text-xs sm:text-sm text-emerald-700 flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>{successMsg}</span>
                </div>
              )}

              <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                {/* Row 1: Full Name & Email */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs sm:text-sm font-bold text-slate-800 mb-1.5">
                      Full Name <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                        <User className="w-4 h-4 stroke-[2.2]" />
                      </div>
                      <input
                        type="text"
                        {...register("name")}
                        placeholder="Enter your full name"
                        className={`w-full pl-10 pr-3.5 py-2.5 text-xs sm:text-sm bg-white border ${
                          errors.name ? "border-red-400" : "border-slate-200 focus:border-blue-600"
                        } rounded-xl focus:outline-none focus:ring-1 focus:ring-blue-600 text-slate-900 font-medium`}
                      />
                    </div>
                    {errors.name && <p className="text-[11px] text-red-500 mt-1">{errors.name.message}</p>}
                  </div>

                  <div>
                    <label className="block text-xs sm:text-sm font-bold text-slate-800 mb-1.5">
                      Email Address <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                        <Mail className="w-4 h-4 stroke-[2.2]" />
                      </div>
                      <input
                        type="email"
                        {...register("email")}
                        placeholder="Enter your email address"
                        className={`w-full pl-10 pr-3.5 py-2.5 text-xs sm:text-sm bg-white border ${
                          errors.email ? "border-red-400" : "border-slate-200 focus:border-blue-600"
                        } rounded-xl focus:outline-none focus:ring-1 focus:ring-blue-600 text-slate-900 font-medium`}
                      />
                    </div>
                    {errors.email && <p className="text-[11px] text-red-500 mt-1">{errors.email.message}</p>}
                  </div>
                </div>

                {/* Row 2: Phone & Role */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs sm:text-sm font-bold text-slate-800 mb-1.5">
                      Phone Number <span className="text-red-500">*</span>
                    </label>
                    <div className="relative flex rounded-xl border border-slate-200 bg-white focus-within:border-blue-600 focus-within:ring-1 focus-within:ring-blue-600 overflow-hidden">
                      <div className="px-3 py-2.5 bg-slate-50/80 border-r border-slate-200 flex items-center gap-1.5 text-xs sm:text-sm font-bold text-slate-700 shrink-0">
                        <Phone className="w-3.5 h-3.5 text-slate-500 stroke-[2.2]" />
                        <span>+91</span>
                        <ChevronDown className="w-3 h-3 text-slate-400 stroke-[2.5]" />
                      </div>
                      <input
                        type="tel"
                        {...register("phone")}
                        placeholder="Enter phone number"
                        className="w-full px-3.5 py-2.5 text-xs sm:text-sm bg-transparent focus:outline-none text-slate-900 font-medium"
                      />
                    </div>
                    {errors.phone && <p className="text-[11px] text-red-500 mt-1">{errors.phone.message}</p>}
                  </div>

                  <div>
                    <label className="block text-xs sm:text-sm font-bold text-slate-800 mb-1.5">
                      Role <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <select
                        {...register("roleId")}
                        className={`w-full px-3.5 py-2.5 text-xs sm:text-sm bg-white border ${
                          errors.roleId ? "border-red-400" : "border-slate-200 focus:border-blue-600"
                        } rounded-xl focus:outline-none focus:ring-1 focus:ring-blue-600 text-slate-900 font-medium appearance-none pr-9 cursor-pointer`}
                      >
                        <option value="">Select your role</option>
                        {roles.map((r, idx) => (
                          <option key={r._id || idx} value={r._id || r.name}>
                            {r.name}
                          </option>
                        ))}
                      </select>
                      <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none text-slate-400">
                        <ChevronDown className="w-4 h-4 stroke-[2.5]" />
                      </div>
                    </div>
                    {errors.roleId && <p className="text-[11px] text-red-500 mt-1">{errors.roleId.message}</p>}
                  </div>
                </div>

                {/* Row 3: Department & Password */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs sm:text-sm font-bold text-slate-800 mb-1.5">
                      Department <span className="text-slate-400 font-normal">(Optional)</span>
                    </label>
                    <div className="relative">
                      <select
                        {...register("departmentId")}
                        className="w-full px-3.5 py-2.5 text-xs sm:text-sm bg-white border border-slate-200 focus:border-blue-600 focus:ring-1 focus:ring-blue-600 rounded-xl focus:outline-none text-slate-900 font-medium appearance-none pr-9 cursor-pointer"
                      >
                        <option value="">Select department</option>
                        {departments.map((d, idx) => (
                          <option key={d._id || idx} value={d._id || d.name}>
                            {d.name}
                          </option>
                        ))}
                      </select>
                      <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none text-slate-400">
                        <ChevronDown className="w-4 h-4 stroke-[2.5]" />
                      </div>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs sm:text-sm font-bold text-slate-800 mb-1.5">
                      Password <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                        <Lock className="w-4 h-4 stroke-[2.2]" />
                      </div>
                      <input
                        type={showPassword ? "text" : "password"}
                        {...register("password")}
                        placeholder="Enter password"
                        className={`w-full pl-10 pr-10 py-2.5 text-xs sm:text-sm bg-white border ${
                          errors.password ? "border-red-400" : "border-slate-200 focus:border-blue-600"
                        } rounded-xl focus:outline-none focus:ring-1 focus:ring-blue-600 text-slate-900 font-medium`}
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-slate-600"
                      >
                        {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                    {errors.password && <p className="text-[11px] text-red-500 mt-1">{errors.password.message}</p>}
                  </div>
                </div>

                {/* Confirm Password */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs sm:text-sm font-bold text-slate-800 mb-1.5">
                      Confirm Password <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                        <Lock className="w-4 h-4 stroke-[2.2]" />
                      </div>
                      <input
                        type={showConfirmPassword ? "text" : "password"}
                        {...register("confirmPassword")}
                        placeholder="Confirm your password"
                        className={`w-full pl-10 pr-10 py-2.5 text-xs sm:text-sm bg-white border ${
                          errors.confirmPassword ? "border-red-400" : "border-slate-200 focus:border-blue-600"
                        } rounded-xl focus:outline-none focus:ring-1 focus:ring-blue-600 text-slate-900 font-medium`}
                      />
                      <button
                        type="button"
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-slate-600"
                      >
                        {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                    {errors.confirmPassword && (
                      <p className="text-[11px] text-red-500 mt-1">{errors.confirmPassword.message}</p>
                    )}
                  </div>
                </div>

                {/* Password Criteria Checklist */}
                <PasswordCriteriaBox criteria={passwordCriteria} />

                {/* Terms & Conditions */}
                <div>
                  <label className="flex items-start gap-2.5 cursor-pointer select-none">
                    <input
                      type="checkbox"
                      {...register("terms")}
                      className="mt-0.5 rounded border-slate-300 text-blue-600 focus:ring-blue-500 w-4 h-4 cursor-pointer"
                    />
                    <span className="text-xs sm:text-sm text-slate-600 leading-tight">
                      I agree to the{" "}
                      <a href="#terms" onClick={(e) => e.preventDefault()} className="text-blue-600 font-semibold hover:underline">
                        Terms of Service
                      </a>{" "}
                      and{" "}
                      <a href="#privacy" onClick={(e) => e.preventDefault()} className="text-blue-600 font-semibold hover:underline">
                        Privacy Policy
                      </a>
                      <span className="text-red-500 ml-0.5">*</span>
                    </span>
                  </label>
                  {errors.terms && <p className="text-[11px] text-red-500 mt-1">{errors.terms.message}</p>}
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-[#1D61E7] hover:bg-[#1853C7] active:bg-[#1546AA] text-white font-semibold py-3.5 px-4 rounded-xl shadow-lg shadow-blue-600/25 transition-all flex items-center justify-center gap-2 text-sm sm:text-base disabled:opacity-60 cursor-pointer mt-2"
                >
                  {loading ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      <span>Creating Account...</span>
                    </>
                  ) : (
                    <>
                      <UserPlus className="w-4 h-4 stroke-[2.5]" />
                      <span>Create Account</span>
                    </>
                  )}
                </button>

                {/* OR Divider */}
                <div className="relative flex py-2 items-center">
                  <div className="flex-grow border-t border-slate-200"></div>
                  <span className="flex-shrink mx-4 text-xs font-bold text-slate-400 tracking-wider">
                    OR
                  </span>
                  <div className="flex-grow border-t border-slate-200"></div>
                </div>

                {/* Social Login Button */}
                <button
                  type="button"
                  onClick={() => alert("Google OAuth feature active in production environment.")}
                  className="w-full bg-white hover:bg-slate-50 text-slate-700 font-semibold py-3 px-4 rounded-xl border border-slate-200 shadow-sm transition-all flex items-center justify-center gap-2.5 text-xs sm:text-sm cursor-pointer"
                >
                  <svg className="w-4 h-4" viewBox="0 0 24 24">
                    <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                    <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"/>
                    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"/>
                  </svg>
                  <span>Sign up with Google</span>
                </button>
              </form>
            </div>
          </div>
        </div>
      </main>

      <footer className="w-full text-center pb-6 text-xs text-slate-500 font-medium flex items-center justify-center gap-1.5">
        <ShieldCheck className="w-4 h-4 text-slate-400" />
        <span>Your information is protected and secure with industry-standard encryption.</span>
      </footer>
    </div>
  );
}
