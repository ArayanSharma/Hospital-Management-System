import { useState, useEffect } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { claimSchema } from "../validation/insurance.schema.js";
import { getPoliciesByPatientApi } from "../services/insurancePolicy.api.js";
import { getInvoicesApi } from "../../billing/services/invoice.api.js";
import PatientAutocomplete from "../../../components/common/PatientAutocomplete.jsx";
import Button from "../../../components/ui/Button.jsx";

export default function ClaimForm({ onSubmit, onCancel, submitting }) {
  const [policies, setPolicies] = useState([]);
  const [invoices, setInvoices] = useState([]);
  const [loadingOptions, setLoadingOptions] = useState(false);

  const {
    register,
    control,
    watch,
    setValue,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(claimSchema),
  });

  const selectedPatientId = watch("patientId");

  useEffect(() => {
    if (!selectedPatientId) {
      setPolicies([]);
      setInvoices([]);
      setValue("policyId", "");
      setValue("invoiceId", "");
      setValue("claimAmount", 0);
      return;
    }

    const fetchPatientData = async () => {
      setLoadingOptions(true);
      try {
        const [policiesRes, invoicesRes] = await Promise.all([
          getPoliciesByPatientApi(selectedPatientId),
          getInvoicesApi({ patientId: selectedPatientId, limit: 100 }),
        ]);

        const fetchedPolicies = policiesRes.data.data || [];
        const fetchedInvoices = invoicesRes.data.data?.invoices || invoicesRes.data.data || [];

        setPolicies(fetchedPolicies);
        setInvoices(fetchedInvoices);

        // Auto-select first policy if available
        if (fetchedPolicies.length > 0) {
          setValue("policyId", fetchedPolicies[0]._id);
        } else {
          setValue("policyId", "");
        }
      } catch (err) {
        console.error("Failed to fetch patient insurance & invoice details:", err);
      } finally {
        setLoadingOptions(false);
      }
    };

    fetchPatientData();
  }, [selectedPatientId, setValue]);

  const handleInvoiceChange = (e) => {
    const invId = e.target.value;
    setValue("invoiceId", invId);
    const selectedInv = invoices.find((i) => i._id === invId);
    if (selectedInv) {
      const amt = selectedInv.totalAmount ?? selectedInv.total ?? selectedInv.grandTotal ?? selectedInv.netAmount ?? 0;
      setValue("claimAmount", amt);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Patient
        </label>
        <Controller
          name="patientId"
          control={control}
          render={({ field }) => (
            <PatientAutocomplete
              value={field.value}
              onChange={(id) => field.onChange(id)}
              error={errors.patientId?.message}
            />
          )}
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Insurance Policy
        </label>
        <select
          {...register("policyId")}
          disabled={!selectedPatientId || loadingOptions}
          className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm disabled:bg-gray-50"
        >
          <option value="">
            {!selectedPatientId
              ? "Select patient first"
              : loadingOptions
              ? "Loading policies..."
              : policies.length === 0
              ? "No active policy found for this patient"
              : "Select policy"}
          </option>
          {policies.map((p) => (
            <option key={p._id} value={p._id}>
              {p.providerName} — Policy #{p.policyNumber} (Coverage: ₹{p.coverageAmount?.toLocaleString()})
            </option>
          ))}
        </select>
        {errors.policyId && (
          <p className="text-xs text-red-600 mt-1">{errors.policyId.message}</p>
        )}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Invoice
        </label>
        <select
          {...register("invoiceId")}
          onChange={handleInvoiceChange}
          disabled={!selectedPatientId || loadingOptions}
          className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm disabled:bg-gray-50"
        >
          <option value="">
            {!selectedPatientId
              ? "Select patient first"
              : loadingOptions
              ? "Loading invoices..."
              : invoices.length === 0
              ? "No invoices found for this patient"
              : "Select invoice"}
          </option>
          {invoices.map((inv) => {
            const amt = inv.totalAmount ?? inv.total ?? inv.grandTotal ?? inv.netAmount ?? 0;
            return (
              <option key={inv._id} value={inv._id}>
                Invoice #{inv.invoiceNumber || inv._id.slice(-6)} — ₹{amt} ({inv.status || inv.paymentStatus})
              </option>
            );
          })}
        </select>
        {errors.invoiceId && (
          <p className="text-xs text-red-600 mt-1">{errors.invoiceId.message}</p>
        )}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Claim Amount
        </label>
        <input
          type="number"
          step="any"
          {...register("claimAmount")}
          placeholder="Auto-filled when invoice is selected"
          className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
        />
        {errors.claimAmount && (
          <p className="text-xs text-red-600 mt-1">{errors.claimAmount.message}</p>
        )}
      </div>

      <div className="flex justify-end gap-2 pt-2">
        <Button type="button" variant="secondary" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit" disabled={submitting}>
          {submitting ? "Submitting..." : "Submit Claim"}
        </Button>
      </div>
    </form>
  );
}
