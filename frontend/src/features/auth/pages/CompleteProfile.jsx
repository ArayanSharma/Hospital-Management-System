import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { ArrowLeft, ArrowRight, User, CheckCircle2 } from "lucide-react";
import { setCredentials } from "../../../store/authSlice.js";
import { completeProfileApi } from "../services/auth.api.js";
import { useToast } from "../../../components/common/ToastProvider.jsx";

import ProfileNavbar from "../components/complete-profile/ProfileNavbar.jsx";
import ProfileSidebarTabs from "../components/complete-profile/ProfileSidebarTabs.jsx";
import ProfileFormSections from "../components/complete-profile/ProfileFormSections.jsx";
import AutoFillLegendCards from "../components/complete-profile/AutoFillLegendCards.jsx";

const STEPS = [
  { id: 1, label: "Account", tab: "personal" },
  { id: 2, label: "Personal", tab: "professional" },
  { id: 3, label: "Complete Profile", tab: "contact" },
  { id: 4, label: "Review", tab: "preferences" },
];

export default function CompleteProfile() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const toast = useToast();

  const [loading, setLoading] = useState(false);
  const [activeStep, setActiveStep] = useState(3);
  const [activeTab, setActiveTab] = useState("personal");

  const [formData, setFormData] = useState({
    name: "",
    dateOfBirth: "",
    gender: "Male",
    bloodGroup: "B+",
    maritalStatus: "Single",
    nationality: "Indian",
    roleName: "DOCTOR",
    department: "General",
    employeeId: "EMP-1024",
    joiningDate: "2024-08-01",
    email: "",
    phone: "",
    currentAddress: "",
  });

  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name || "",
        dateOfBirth: user.dateOfBirth || "2004-01-15",
        gender: user.gender || "Male",
        bloodGroup: user.bloodGroup || "B+",
        maritalStatus: user.maritalStatus || "Single",
        nationality: user.nationality || "Indian",
        roleName: user.roleName || user.role || "DOCTOR",
        department: user.department || "General",
        employeeId: user.employeeId || "EMP-1024",
        joiningDate: user.joiningDate || "2024-08-01",
        email: user.email || "",
        phone: user.phone || "+91 98765 43210",
        currentAddress: user.currentAddress || "Mathura, Uttar Pradesh, India - 281001",
      });
    }
  }, [user]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleStepClick = (step) => {
    setActiveStep(step.id);
    setActiveTab(step.tab);
  };

  const handleSubmit = async (e) => {
    e?.preventDefault();
    setLoading(true);
    try {
      const res = await completeProfileApi(formData);
      const updatedUser = res.data?.data || res.data;
      dispatch(setCredentials({ user: { ...updatedUser, isProfileComplete: true } }));

      toast?.addToast?.({
        title: "Profile Completed",
        message: "Your profile details have been saved successfully!",
        type: "billing",
      });
      navigate("/dashboard");
    } catch (err) {
      console.error("Profile completion error:", err);
      toast?.addToast?.({
        title: "Update Failed",
        message: err.response?.data?.message || "Failed to update profile. Please try again.",
        type: "critical",
      });
    } finally {
      setLoading(false);
    }
  };

  const getUserInitials = (nameStr) => {
    if (!nameStr) return "SA";
    const parts = nameStr.trim().split(" ");
    if (parts.length >= 2) {
      return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
    }
    return nameStr.substring(0, 2).toUpperCase();
  };

  const userInitials = getUserInitials(formData.name);

  return (
    <div className="min-h-screen bg-[#edf2f9] dark:bg-[#0b0f17] font-sans antialiased text-slate-800 dark:text-slate-100 flex flex-col">
      {/* Top Header Navbar */}
      <ProfileNavbar
        userName={formData.name}
        userRole={formData.roleName}
        initials={userInitials}
      />

      {/* Main Centered Container */}
      <main className="flex-1 max-w-6xl w-full mx-auto p-4 sm:p-6 lg:p-8">
        <form onSubmit={handleSubmit} className="bg-white dark:bg-[#111827] rounded-3xl p-6 lg:p-8 shadow-xl border border-slate-200/80 dark:border-slate-800/80 flex flex-col justify-between min-h-[640px]">
          <div>
            {/* Top Stepper Header Bar */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-6 border-b border-slate-100 dark:border-slate-800">
              <div className="flex items-center gap-3">
                <div className="p-2.5 rounded-2xl bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400">
                  <User className="w-5 h-5" />
                </div>
                <div>
                  <h2 className="text-xl font-extrabold text-slate-900 dark:text-white tracking-tight">
                    Complete Your Profile
                  </h2>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    Please verify and complete your information to get started.
                  </p>
                </div>
              </div>

              {/* Progress Stepper Bar */}
              <div className="flex items-center gap-2 sm:gap-4 self-center">
                {STEPS.map((step, idx) => {
                  const isCurrent = activeStep === step.id;
                  const isCompleted = activeStep > step.id;
                  return (
                    <React.Fragment key={step.id}>
                      <button
                        type="button"
                        onClick={() => handleStepClick(step)}
                        className={`flex items-center gap-1.5 text-xs font-bold transition-all ${
                          isCurrent
                            ? "text-blue-600 dark:text-blue-400"
                            : isCompleted
                            ? "text-slate-600 dark:text-slate-300"
                            : "text-slate-400 opacity-60"
                        }`}
                      >
                        <span
                          className={`w-6 h-6 rounded-full font-extrabold text-xs flex items-center justify-center transition-all ${
                            isCurrent
                              ? "bg-blue-600 text-white shadow-md shadow-blue-500/30 ring-4 ring-blue-100 dark:ring-blue-900/50"
                              : isCompleted
                              ? "bg-emerald-500 text-white"
                              : "bg-slate-100 dark:bg-slate-800 text-slate-500"
                          }`}
                        >
                          {isCompleted ? <CheckCircle2 className="w-3.5 h-3.5" /> : step.id}
                        </span>
                        <span className="hidden md:inline">{step.label}</span>
                      </button>

                      {idx < STEPS.length - 1 && (
                        <div
                          className={`w-4 h-[2px] rounded-full transition-colors ${
                            activeStep > step.id
                              ? "bg-emerald-500"
                              : "bg-slate-200 dark:bg-slate-800"
                          }`}
                        />
                      )}
                    </React.Fragment>
                  );
                })}
              </div>
            </div>

            {/* Profile Content Grid */}
            <div className="grid grid-cols-1 md:grid-cols-12 gap-6 mt-6">
              <ProfileSidebarTabs
                userName={formData.name}
                userRole={formData.roleName}
                initials={userInitials}
                activeTab={activeTab}
                setActiveTab={setActiveTab}
              />

              <div className="md:col-span-9 space-y-6">
                <ProfileFormSections
                  activeTab={activeTab}
                  formData={formData}
                  handleChange={handleChange}
                />
                <AutoFillLegendCards />
              </div>
            </div>
          </div>

          {/* Action Footer Buttons */}
          <div className="flex items-center justify-between pt-6 mt-6 border-t border-slate-100 dark:border-slate-800">
            <button
              type="button"
              onClick={() => navigate(-1)}
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 text-xs font-bold hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
            >
              <ArrowLeft className="w-4 h-4" /> Back
            </button>

            <button
              type="submit"
              disabled={loading}
              className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-extrabold shadow-lg shadow-blue-500/25 transition-all disabled:opacity-50"
            >
              {loading ? "Saving..." : "Save & Continue"}
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </form>
      </main>
    </div>
  );
}
