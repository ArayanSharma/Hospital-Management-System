import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Check } from "lucide-react";
import { getSettingsApi, updateSettingsApi } from "../services/setting.api.js";
import { settingsSchema } from "../validation/setting.schema.js";
import Toggle from "../../../components/ui/Toggle.jsx";
import Button from "../../../components/ui/Button.jsx";
import Loading from "../../../components/common/Loading.jsx";
import ErrorState from "../../../components/common/ErrorState.jsx";

export default function Settings() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  const [emailEnabled, setEmailEnabled] = useState(true);
  const [smsEnabled, setSmsEnabled] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({ resolver: zodResolver(settingsSchema) });

  const fetchSettings = async () => {
    setLoading(true);
    try {
      const { data } = await getSettingsApi();
      reset(data.data);
      setEmailEnabled(data.data.notificationSettings?.emailEnabled ?? true);
      setSmsEnabled(data.data.notificationSettings?.smsEnabled ?? false);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to load settings");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchSettings(); }, []);

  const onSubmit = async (formData) => {
    setSaving(true);
    try {
      await updateSettingsApi({
        ...formData,
        notificationSettings: { emailEnabled, smsEnabled },
      });
      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
    } catch (err) {
      alert(err.response?.data?.message || "Failed to save settings");
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <Loading message="Loading settings..." />;
  if (error) return <ErrorState message={error} />;

  return (
    <div className="max-w-2xl space-y-6">
      <div>
        <h1 className="text-xl font-semibold text-gray-900">Settings</h1>
        <p className="text-sm text-gray-500">Hospital configuration and preferences</p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {/* Hospital Info card */}
        <div className="bg-white border border-gray-200 rounded-xl p-6 space-y-4">
          <h2 className="text-sm font-semibold text-gray-900">Hospital Information</h2>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Hospital Name</label>
            <input {...register("hospitalName")} className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm" />
            {errors.hospitalName && <p className="text-xs text-red-600 mt-1">{errors.hospitalName.message}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Address</label>
            <input {...register("address")} className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm" />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
              <input {...register("phone")} className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
              <input {...register("email")} className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm" />
              {errors.email && <p className="text-xs text-red-600 mt-1">{errors.email.message}</p>}
            </div>
          </div>
        </div>

        {/* Invoice settings card */}
        <div className="bg-white border border-gray-200 rounded-xl p-6 space-y-4">
          <h2 className="text-sm font-semibold text-gray-900">Invoice Settings</h2>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Invoice Prefix</label>
              <input {...register("invoiceSettings.invoicePrefix")} placeholder="INV" className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Tax Percentage</label>
              <input type="number" step="0.01" {...register("invoiceSettings.taxPercentage")} className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm" />
            </div>
          </div>
        </div>

        {/* Notification preferences card */}
        <div className="bg-white border border-gray-200 rounded-xl p-6 space-y-4">
          <h2 className="text-sm font-semibold text-gray-900">Notification Preferences</h2>

          <Toggle label="Email Notifications" checked={emailEnabled} onChange={setEmailEnabled} />
          <Toggle label="SMS Notifications" checked={smsEnabled} onChange={setSmsEnabled} />
        </div>

        <div className="flex justify-end">
          <Button type="submit" disabled={saving}>
            {saving ? "Saving..." : saved ? (
              <span className="flex items-center gap-1.5"><Check className="w-4 h-4" /> Saved</span>
            ) : (
              "Save Settings"
            )}
          </Button>
        </div>
      </form>
    </div>
  );
}