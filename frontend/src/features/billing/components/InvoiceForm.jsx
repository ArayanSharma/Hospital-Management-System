import { useForm, useFieldArray, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Plus, Trash2 } from "lucide-react";
import { invoiceSchema } from "../validation/invoice.schema.js";
import PatientAutocomplete from "../../../components/common/PatientAutocomplete.jsx";
import Button from "../../../components/ui/Button.jsx";

const emptyItem = { description: "", quantity: 1, unitPrice: 0 };

export default function InvoiceForm({ onSubmit, onCancel, submitting }) {
  const {
    register,
    control,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(invoiceSchema),
    defaultValues: { items: [emptyItem], discount: 0, tax: 0 },
  });

  const { fields, append, remove } = useFieldArray({ control, name: "items" });

  // Live watch — totals real-time update honge
  const items = watch("items");
  const discount = Number(watch("discount")) || 0;
  const tax = Number(watch("tax")) || 0;

  const subtotal = items.reduce(
    (sum, item) => sum + (Number(item.quantity) || 0) * (Number(item.unitPrice) || 0),
    0
  );
  const total = Math.max(subtotal - discount + tax, 0);

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Patient</label>
        <Controller
          name="patientId"
          control={control}
          render={({ field }) => (
            <PatientAutocomplete value={field.value} onChange={(id) => field.onChange(id)} error={errors.patientId?.message} />
          )}
        />
      </div>

      {/* Line items table */}
      <div>
        <div className="border border-gray-200 rounded-lg overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="text-left px-3 py-2 font-medium text-gray-600 text-xs">DESCRIPTION</th>
                <th className="text-right px-3 py-2 font-medium text-gray-600 text-xs w-20">QTY</th>
                <th className="text-right px-3 py-2 font-medium text-gray-600 text-xs w-28">PRICE</th>
                <th className="text-right px-3 py-2 font-medium text-gray-600 text-xs w-28">AMOUNT</th>
                <th className="w-8"></th>
              </tr>
            </thead>
            <tbody>
              {fields.map((field, index) => {
                const qty = Number(items[index]?.quantity) || 0;
                const price = Number(items[index]?.unitPrice) || 0;
                return (
                  <tr key={field.id} className="border-b border-gray-100 last:border-0">
                    <td className="px-3 py-2">
                      <input
                        {...register(`items.${index}.description`)}
                        placeholder="e.g. Consultation Fee"
                        className="w-full text-sm focus:outline-none"
                      />
                    </td>
                    <td className="px-3 py-2">
                      <input
                        type="number"
                        {...register(`items.${index}.quantity`)}
                        className="w-full text-sm text-right focus:outline-none"
                      />
                    </td>
                    <td className="px-3 py-2">
                      <input
                        type="number"
                        step="0.01"
                        {...register(`items.${index}.unitPrice`)}
                        className="w-full text-sm text-right focus:outline-none"
                      />
                    </td>
                    <td className="px-3 py-2 text-right text-gray-700 font-medium">
                      ₹{(qty * price).toFixed(2)}
                    </td>
                    <td className="px-2">
                      {fields.length > 1 && (
                        <button type="button" onClick={() => remove(index)} className="text-gray-300 hover:text-red-600">
                          <Trash2 className="w-4 h-4" />
                        </button>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
        {errors.items?.root && <p className="text-xs text-red-600 mt-1">{errors.items.root.message}</p>}

        <button
          type="button"
          onClick={() => append(emptyItem)}
          className="flex items-center gap-1.5 text-sm text-indigo-600 hover:text-indigo-700 font-medium mt-2"
        >
          <Plus className="w-4 h-4" /> Add line item
        </button>
      </div>

      {/* Totals summary */}
      <div className="flex justify-end">
        <div className="w-64 space-y-2 text-sm">
          <div className="flex justify-between text-gray-600">
            <span>Subtotal</span>
            <span>₹{subtotal.toFixed(2)}</span>
          </div>
          <div className="flex justify-between items-center text-gray-600">
            <span>Discount</span>
            <input
              type="number"
              step="0.01"
              {...register("discount")}
              className="w-24 text-right border-b border-gray-200 focus:outline-none focus:border-gray-900"
            />
          </div>
          <div className="flex justify-between items-center text-gray-600">
            <span>Tax</span>
            <input
              type="number"
              step="0.01"
              {...register("tax")}
              className="w-24 text-right border-b border-gray-200 focus:outline-none focus:border-gray-900"
            />
          </div>
          <div className="flex justify-between font-semibold text-gray-900 text-base pt-2 border-t border-gray-200">
            <span>Total</span>
            <span>₹{total.toFixed(2)}</span>
          </div>
        </div>
      </div>

      <div className="flex justify-end gap-2 pt-2">
        <Button type="button" variant="secondary" onClick={onCancel}>Cancel</Button>
        <Button type="submit" disabled={submitting}>
          {submitting ? "Creating..." : "Create Invoice"}
        </Button>
      </div>
    </form>
  );
}