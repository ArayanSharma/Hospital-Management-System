import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { paymentSchema } from "../validation/invoice.schema.js";
import Button from "../../../components/ui/Button.jsx";

const METHODS = [
  { value: "cash", label: "Cash" },
  { value: "card", label: "Card" },
  { value: "upi", label: "UPI" },
  { value: "net-banking", label: "Net Banking" },
  { value: "insurance", label: "Insurance" },
];

export default function PaymentForm({ remainingAmount, onSubmit, onCancel, submitting }) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(paymentSchema),
    defaultValues: { amount: remainingAmount, method: "cash" },
  });

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <p className="text-sm text-gray-500">
        Remaining balance: <span className="font-semibold text-gray-900">₹{remainingAmount.toFixed(2)}</span>
      </p>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Amount</label>
        <input type="number" step="0.01" {...register("amount")} className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm" />
        {errors.amount && <p className="text-xs text-red-600 mt-1">{errors.amount.message}</p>}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Payment Method</label>
        <div className="grid grid-cols-3 gap-2">
          {METHODS.map((m) => (
            <label key={m.value} className="flex items-center gap-2 border border-gray-300 rounded-md px-3 py-2 text-sm cursor-pointer has-[:checked]:border-gray-900 has-[:checked]:bg-gray-50">
              <input type="radio" value={m.value} {...register("method")} className="accent-gray-900" />
              {m.label}
            </label>
          ))}
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Transaction ID (optional)</label>
        <input {...register("transactionId")} className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm" />
      </div>

      <div className="flex justify-end gap-2 pt-2">
        <Button type="button" variant="secondary" onClick={onCancel}>Cancel</Button>
        <Button type="submit" disabled={submitting}>
          {submitting ? "Recording..." : "Record Payment"}
        </Button>
      </div>
    </form>
  );
}