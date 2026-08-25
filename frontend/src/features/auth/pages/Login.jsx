import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { loginSchema } from "../validation/auth.schema.js";
import { useAuth } from "../hooks/useAuth.js";

export default function Login() {
  const { login } = useAuth();
  const [serverError, setServerError] = useState("");
  const [loading, setLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({ resolver: zodResolver(loginSchema) });

  const onSubmit = async (data) => {
    setServerError("");
    setLoading(true);
    try {
      await login(data.email, data.password);
    } catch (err) {
      setServerError(
        err.response?.data?.message || "Login failed. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="w-full max-w-sm bg-white p-8 rounded-lg shadow-sm border border-gray-200">
        <h1 className="text-2xl font-semibold text-gray-900 mb-1">Sign in</h1>
        <p className="text-sm text-gray-500 mb-6">
          Hospital Management System
        </p>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Email
            </label>
            <input
              type="email"
              {...register("email")}
              className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-gray-900"
              placeholder="you@hospital.com"
            />
            {errors.email && (
              <p className="text-xs text-red-600 mt-1">{errors.email.message}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Password
            </label>
            <input
              type="password"
              {...register("password")}
              className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-gray-900"
              placeholder="••••••••"
            />
            {errors.password && (
              <p className="text-xs text-red-600 mt-1">{errors.password.message}</p>
            )}
          </div>

          {serverError && (
            <p className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-md px-3 py-2">
              {serverError}
            </p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-gray-900 text-white text-sm font-medium py-2 rounded-md hover:bg-gray-800 disabled:opacity-50 transition"
          >
            {loading ? "Signing in..." : "Sign in"}
          </button>
        </form>
      </div>
    </div>
  );
}