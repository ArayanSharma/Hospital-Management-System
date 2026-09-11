import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Link } from "react-router-dom";      
import { Mail, Lock, LogIn, ShieldCheck } from "lucide-react";

import LoginHeader from "../components/LoginHeader.jsx";
import LoginBanner from "../components/LoginBanner.jsx";
import LoginHelpCard from "../components/LoginHelpCard.jsx";
import { loginSchema } from "../validation/auth.schema.js";
import { useAuth } from "../hooks/useAuth.js";
import { signInWithGoogle } from "../../../lib/firebase.js";

export default function Login() {
  const { login, googleLogin } = useAuth();
  const [showPassword, setShowPassword] = useState(false);
  const [serverError, setServerError] = useState("");
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);

  const handleGoogleLogin = async () => {
    setServerError("");
    setGoogleLoading(true);
    try {
      const { user: fbUser, idToken } = await signInWithGoogle();
      await googleLogin(idToken, fbUser);
    } catch (err) {
      if (err.code !== "auth/popup-closed-by-user") {
        setServerError(
          err.response?.data?.message || err.message || "Google sign-in failed. Please try again."
        );
      }
    } finally {
      setGoogleLoading(false);
    }
  };

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
      rememberMe: true,
    },
  });

  const onSubmit = async (data) => {
    setServerError("");
    setLoading(true);
    try {
      await login(data.email.trim(), data.password);
    } catch (err) {
      setServerError(
        err.response?.data?.message || "Invalid email or password. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F4F7FB] dark:bg-[#0B0F19] flex flex-col font-sans antialiased text-slate-800 dark:text-slate-100 transition-colors duration-200">
      <LoginHeader />

      <main className="w-full max-w-7xl mx-auto px-4 sm:px-6 pb-12 flex-1 flex items-center justify-center">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-start w-full my-auto py-2">
          {/* Left Marketing Banner Column */}
          <LoginBanner />

          {/* Right Form Column */}
          <div className="lg:col-span-7">
            <div className="bg-white dark:bg-[#111827] rounded-3xl p-6 sm:p-9 shadow-xl shadow-slate-200/60 dark:shadow-2xl dark:shadow-black/60 border border-slate-100 dark:border-slate-800/80">
              <div className="mb-6">
                <h3 className="text-xl sm:text-2xl font-extrabold text-slate-900 dark:text-white tracking-tight">
                  Login to Your Account
                </h3>
                <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
                  Enter your credentials to continue
                </p>
              </div>

              {serverError && (
                <div className="mb-5 p-3.5 rounded-xl bg-red-50 border border-red-200 text-xs sm:text-sm text-red-600 flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-red-500 shrink-0"></span>
                  <span>{serverError}</span>
                </div>
              )}

              <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                {/* Email Address */}
                <div>
                  <label className="block text-xs sm:text-sm font-bold text-slate-800 mb-1.5">
                    Email Address
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                      <Mail className="w-4 h-4 stroke-[2.2]" />
                    </div>
                    <input
                      type="email"
                      {...register("email")}
                      placeholder="Enter your email address"
                      className={`w-full pl-10 pr-3.5 py-3 text-xs sm:text-sm bg-white border ${
                        errors.email ? "border-red-400" : "border-slate-200 focus:border-blue-600"
                      } rounded-xl focus:outline-none focus:ring-1 focus:ring-blue-600 text-slate-900 font-medium`}
                    />
                  </div>
                  {errors.email && (
                    <p className="text-[11px] text-red-500 font-medium mt-1">
                      {errors.email.message}
                    </p>
                  )}
                </div>

                {/* Password */}
                <div>
                  <label className="block text-xs sm:text-sm font-bold text-slate-800 mb-1.5">
                    Password
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                      <Lock className="w-4 h-4 stroke-[2.2]" />
                    </div>
                    <input
                      type={showPassword ? "text" : "password"}
                      {...register("password")}
                      placeholder="Enter your password"
                      className={`w-full pl-10 pr-14 py-3 text-xs sm:text-sm bg-white border ${
                        errors.password ? "border-red-400" : "border-slate-200 focus:border-blue-600"
                      } rounded-xl focus:outline-none focus:ring-1 focus:ring-blue-600 text-slate-900 font-medium`}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-xs font-bold text-blue-600 hover:text-blue-700 cursor-pointer"
                    >
                      {showPassword ? "Hide" : "Show"}
                    </button>
                  </div>
                  {errors.password && (
                    <p className="text-[11px] text-red-500 font-medium mt-1">
                      {errors.password.message}
                    </p>
                  )}
                </div>

                {/* Remember Me & Forgot Password */}
                <div className="flex items-center justify-between pt-1">
                  <label className="flex items-center gap-2 cursor-pointer select-none">
                    <input
                      type="checkbox"
                      {...register("rememberMe")}
                      className="rounded border-slate-300 text-blue-600 focus:ring-blue-500 w-4 h-4 cursor-pointer"
                    />
                    <span className="text-xs sm:text-sm text-slate-600 font-medium">
                      Remember me
                    </span>
                  </label>
                  <a
                    href="#forgot"
                    onClick={(e) => {
                      e.preventDefault();
                      alert("Please contact your administrator to reset your password.");
                    }}
                    className="text-xs sm:text-sm font-bold text-blue-600 hover:underline"
                  >
                    Forgot Password?
                  </a>
                </div>

                {/* Submit Login Button */}
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-[#1D61E7] hover:bg-[#1853C7] active:bg-[#1546AA] text-white font-semibold py-3.5 px-4 rounded-xl shadow-lg shadow-blue-600/25 transition-all flex items-center justify-center gap-2 text-sm sm:text-base disabled:opacity-60 cursor-pointer mt-2"
                >
                  {loading ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      <span>Signing in...</span>
                    </>
                  ) : (
                    <>
                      <LogIn className="w-4 h-4 stroke-[2.5]" />
                      <span>Login</span>
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
                  onClick={handleGoogleLogin}
                  disabled={googleLoading || loading}
                  className="w-full bg-white hover:bg-slate-50 text-slate-700 font-semibold py-3 px-4 rounded-xl border border-slate-200 shadow-sm transition-all flex items-center justify-center gap-2.5 text-xs sm:text-sm cursor-pointer disabled:opacity-60"
                >
                  {googleLoading ? (
                    <>
                      <div className="w-4 h-4 border-2 border-slate-600 border-t-transparent rounded-full animate-spin"></div>
                      <span>Connecting Google...</span>
                    </>
                  ) : (
                    <>
                      <svg className="w-4 h-4" viewBox="0 0 24 24">
                        <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                        <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                        <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"/>
                        <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"/>
                      </svg>
                      <span>Sign in with Google</span>
                    </>
                  )}
                </button>

                {/* Help Card Component */}
                <LoginHelpCard />

                {/* Don't have an account link */}
                <p className="text-xs sm:text-sm text-center text-slate-500 pt-2 font-medium">
                  Don't have an account?{" "}
                  <Link to="/register" className="text-blue-600 font-bold hover:underline">
                    Register here
                  </Link>
                </p>
              </form>
            </div>
          </div>
        </div>
      </main>

      <footer className="w-full text-center pb-6 text-xs text-slate-500 font-medium flex items-center justify-center gap-1.5">
        <ShieldCheck className="w-4 h-4 text-slate-400" />
        <span>Your information is protected with industry-standard encryption.</span>
      </footer>
    </div>
  );
}