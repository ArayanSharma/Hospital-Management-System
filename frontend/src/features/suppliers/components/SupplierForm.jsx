import React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { supplierSchema } from "../validation/supplier.schema.js";
import {
  INDIAN_STATES,
  COMPANY_TYPES,
  SUPPLIER_CATEGORIES,
  PAYMENT_TERMS,
} from "../constants/supplierConstants.js";

export default function SupplierForm({ defaultValues, onSubmit, onCancel, submitting }) {
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(supplierSchema),
    defaultValues: defaultValues || {
      country: "India",
      category: "Pharmaceuticals",
      companyType: "",
      paymentTerms: "",
      preferredSupplier: "",
      notes: "",
      addAnother: false,
    },
  });

  const notesValue = watch("notes") || "";

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 text-xs text-slate-700 font-medium p-1">
      {/* SECTION 1: Supplier Information */}
      <div className="space-y-3.5">
        <h3 className="text-xs font-bold text-slate-900">Supplier Information</h3>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
          {/* Supplier Name * */}
          <div>
            <label className="block text-[11px] font-semibold text-slate-700 mb-1">
              Supplier Name <span className="text-rose-500">*</span>
            </label>
            <input
              {...register("name")}
              type="text"
              placeholder="Enter supplier name"
              className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-xs focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all placeholder:text-slate-400"
            />
            {errors.name && <p className="text-[10px] text-rose-500 mt-1 font-semibold">{errors.name.message}</p>}
          </div>

          {/* Company Type */}
          <div>
            <label className="block text-[11px] font-semibold text-slate-700 mb-1">Company Type</label>
            <select
              {...register("companyType")}
              className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-xs focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all cursor-pointer text-slate-700"
            >
              <option value="">Select company type</option>
              {COMPANY_TYPES.map((type) => (
                <option key={type} value={type}>
                  {type}
                </option>
              ))}
            </select>
          </div>

          {/* GST Number */}
          <div>
            <label className="block text-[11px] font-semibold text-slate-700 mb-1">GST Number</label>
            <input
              {...register("gstNumber")}
              type="text"
              placeholder="Enter GST number"
              className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-xs focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all placeholder:text-slate-400"
            />
          </div>

          {/* Contact Person * */}
          <div>
            <label className="block text-[11px] font-semibold text-slate-700 mb-1">
              Contact Person <span className="text-rose-500">*</span>
            </label>
            <input
              {...register("contactPerson")}
              type="text"
              placeholder="Enter contact person name"
              className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-xs focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all placeholder:text-slate-400"
            />
            {errors.contactPerson && (
              <p className="text-[10px] text-rose-500 mt-1 font-semibold">{errors.contactPerson.message}</p>
            )}
          </div>

          {/* Designation */}
          <div>
            <label className="block text-[11px] font-semibold text-slate-700 mb-1">Designation</label>
            <input
              {...register("designation")}
              type="text"
              placeholder="Enter designation"
              className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-xs focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all placeholder:text-slate-400"
            />
          </div>

          {/* Phone Number * */}
          <div>
            <label className="block text-[11px] font-semibold text-slate-700 mb-1">
              Phone Number <span className="text-rose-500">*</span>
            </label>
            <input
              {...register("phone")}
              type="text"
              placeholder="Enter phone number"
              className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-xs focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all placeholder:text-slate-400"
            />
            {errors.phone && <p className="text-[10px] text-rose-500 mt-1 font-semibold">{errors.phone.message}</p>}
          </div>

          {/* Email */}
          <div>
            <label className="block text-[11px] font-semibold text-slate-700 mb-1">Email</label>
            <input
              {...register("email")}
              type="email"
              placeholder="Enter email address"
              className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-xs focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all placeholder:text-slate-400"
            />
            {errors.email && <p className="text-[10px] text-rose-500 mt-1 font-semibold">{errors.email.message}</p>}
          </div>

          {/* Alternate Phone */}
          <div>
            <label className="block text-[11px] font-semibold text-slate-700 mb-1">Alternate Phone</label>
            <input
              {...register("alternatePhone")}
              type="text"
              placeholder="Enter alternate phone"
              className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-xs focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all placeholder:text-slate-400"
            />
          </div>

          {/* Website */}
          <div>
            <label className="block text-[11px] font-semibold text-slate-700 mb-1">Website</label>
            <input
              {...register("website")}
              type="text"
              placeholder="Enter website (optional)"
              className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-xs focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all placeholder:text-slate-400"
            />
          </div>
        </div>
      </div>

      {/* SECTION 2: Address Information */}
      <div className="space-y-3.5 pt-1">
        <h3 className="text-xs font-bold text-slate-900">Address Information</h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
          {/* Address Line 1 * */}
          <div>
            <label className="block text-[11px] font-semibold text-slate-700 mb-1">
              Address Line 1 <span className="text-rose-500">*</span>
            </label>
            <input
              {...register("addressLine1")}
              type="text"
              placeholder="Enter address line 1"
              className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-xs focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all placeholder:text-slate-400"
            />
          </div>

          {/* Address Line 2 */}
          <div>
            <label className="block text-[11px] font-semibold text-slate-700 mb-1">Address Line 2</label>
            <input
              {...register("addressLine2")}
              type="text"
              placeholder="Enter address line 2 (optional)"
              className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-xs focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all placeholder:text-slate-400"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-4 gap-3.5">
          {/* City * */}
          <div>
            <label className="block text-[11px] font-semibold text-slate-700 mb-1">
              City <span className="text-rose-500">*</span>
            </label>
            <input
              {...register("city")}
              type="text"
              placeholder="Enter city"
              className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-xs focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all placeholder:text-slate-400"
            />
          </div>

          {/* State * */}
          <div>
            <label className="block text-[11px] font-semibold text-slate-700 mb-1">
              State <span className="text-rose-500">*</span>
            </label>
            <select
              {...register("state")}
              className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-xs focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all cursor-pointer text-slate-700"
            >
              <option value="">Select state</option>
              {INDIAN_STATES.map((st) => (
                <option key={st} value={st}>
                  {st}
                </option>
              ))}
            </select>
          </div>

          {/* PIN Code * */}
          <div>
            <label className="block text-[11px] font-semibold text-slate-700 mb-1">
              PIN Code <span className="text-rose-500">*</span>
            </label>
            <input
              {...register("pinCode")}
              type="text"
              placeholder="Enter PIN code"
              className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-xs focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all placeholder:text-slate-400"
            />
          </div>

          {/* Country * */}
          <div>
            <label className="block text-[11px] font-semibold text-slate-700 mb-1">
              Country <span className="text-rose-500">*</span>
            </label>
            <select
              {...register("country")}
              className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-xs focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all cursor-pointer text-slate-700"
            >
              <option value="India">India</option>
              <option value="United States">United States</option>
              <option value="United Kingdom">United Kingdom</option>
              <option value="UAE">UAE</option>
            </select>
          </div>
        </div>
      </div>

      {/* SECTION 3: Business Information */}
      <div className="space-y-3.5 pt-1">
        <h3 className="text-xs font-bold text-slate-900">Business Information</h3>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
          {/* Supplier Category * */}
          <div>
            <label className="block text-[11px] font-semibold text-slate-700 mb-1">
              Supplier Category <span className="text-rose-500">*</span>
            </label>
            <select
              {...register("category")}
              className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-xs focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all cursor-pointer text-slate-700"
            >
              <option value="">Select category</option>
              {SUPPLIER_CATEGORIES.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
          </div>

          {/* Payment Terms */}
          <div>
            <label className="block text-[11px] font-semibold text-slate-700 mb-1">Payment Terms</label>
            <select
              {...register("paymentTerms")}
              className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-xs focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all cursor-pointer text-slate-700"
            >
              <option value="">Select payment terms</option>
              {PAYMENT_TERMS.map((term) => (
                <option key={term} value={term}>
                  {term}
                </option>
              ))}
            </select>
          </div>

          {/* Credit Limit (₹) */}
          <div>
            <label className="block text-[11px] font-semibold text-slate-700 mb-1">Credit Limit (₹)</label>
            <input
              {...register("creditLimit")}
              type="number"
              placeholder="Enter credit limit"
              className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-xs focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all placeholder:text-slate-400"
            />
          </div>

          {/* Preferred Supplier */}
          <div>
            <label className="block text-[11px] font-semibold text-slate-700 mb-1">Preferred Supplier</label>
            <select
              {...register("preferredSupplier")}
              className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-xs focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all cursor-pointer text-slate-700"
            >
              <option value="">Select yes/no</option>
              <option value="Yes">Yes</option>
              <option value="No">No</option>
            </select>
          </div>

          {/* PAN Number */}
          <div>
            <label className="block text-[11px] font-semibold text-slate-700 mb-1">PAN Number</label>
            <input
              {...register("panNumber")}
              type="text"
              placeholder="Enter PAN number"
              className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-xs focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all placeholder:text-slate-400"
            />
          </div>

          {/* Notes (Optional) */}
          <div className="sm:col-span-1">
            <label className="block text-[11px] font-semibold text-slate-700 mb-1">Notes (Optional)</label>
            <div className="relative">
              <textarea
                {...register("notes")}
                rows={2}
                placeholder="Enter any notes about this supplier..."
                className="w-full bg-white border border-slate-200 rounded-xl p-2.5 text-xs text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 resize-none placeholder:text-slate-400"
              />
              <span className="absolute right-2 bottom-1.5 text-[9px] text-slate-400 font-semibold">
                {notesValue.length} / 500
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Footer Bar */}
      <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
        <label className="flex items-center gap-2 text-xs font-semibold text-slate-700 cursor-pointer select-none">
          <input
            {...register("addAnother")}
            type="checkbox"
            className="w-4 h-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500/20 cursor-pointer"
          />
          <span>Add another supplier after saving</span>
        </label>

        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={onCancel}
            className="px-4 py-2 bg-white border border-slate-200 hover:border-slate-300 text-slate-700 rounded-xl text-xs font-bold transition-all cursor-pointer shadow-xs"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={submitting}
            className="px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold transition-all cursor-pointer shadow-sm disabled:opacity-50"
          >
            {submitting ? "Saving..." : "Save Supplier"}
          </button>
        </div>
      </div>
    </form>
  );
}
