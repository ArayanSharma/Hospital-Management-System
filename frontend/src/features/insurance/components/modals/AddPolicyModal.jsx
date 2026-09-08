import React from "react";
import { X, Save } from "lucide-react";
import { useAddPolicyForm } from "../../hooks/useAddPolicyForm.js";
import PatientInfoSection from "../form/PatientInfoSection.jsx";
import PolicyDetailsSection from "../form/PolicyDetailsSection.jsx";
import DocumentUploadGrid from "../form/DocumentUploadGrid.jsx";
import PolicySummarySidebar from "../form/PolicySummarySidebar.jsx";

const POLICY_DOC_ITEMS = [
  { key: "policyDoc", label: "Policy Document *", subText: "Upload policy document" },
  { key: "cardFront", label: "Insurance Card (Front)", subText: "Upload front side" },
  { key: "cardBack", label: "Insurance Card (Back)", subText: "Upload back side" },
  { key: "otherDoc", label: "Any Other Document", subText: "Upload any other document" },
];

export default function AddPolicyModal({ isOpen, onClose, onSubmit }) {
  if (!isOpen) return null;

  const form = useAddPolicyForm(onSubmit, onClose);

  return (
    <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center z-50 p-4">
      <div className="bg-white border border-slate-200/90 rounded-2xl max-w-5xl w-full shadow-2xl flex flex-col max-h-[92vh] overflow-hidden text-xs text-slate-800">
        {/* Modal Top Header Bar */}
        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-white shrink-0">
          <h2 className="text-sm font-bold text-slate-900">Add New Policy</h2>
          <button
            type="button"
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {form.errorMsg && (
          <div className="mx-6 mt-3 p-3 bg-rose-50 border border-rose-200 rounded-xl text-xs font-semibold text-rose-600 shrink-0">
            ⚠️ {form.errorMsg}
          </div>
        )}

        {/* Modal Body: 2-Column Modular Split */}
        <div className="p-6 overflow-y-auto grid grid-cols-1 lg:grid-cols-12 gap-6 flex-1">
          {/* LEFT COLUMN: 3 Main Form Section Components */}
          <div className="lg:col-span-8 space-y-5">
            <PatientInfoSection
              patientId={form.patientId}
              uhid={form.uhid}
              dateOfBirth={form.dateOfBirth}
              setDateOfBirth={form.setDateOfBirth}
              mobileNumber={form.mobileNumber}
              setMobileNumber={form.setMobileNumber}
              onPatientSelect={form.handlePatientSelect}
            />

            <PolicyDetailsSection
              providerName={form.providerName}
              setProviderName={form.setProviderName}
              policyNumber={form.policyNumber}
              setPolicyNumber={form.setPolicyNumber}
              policyType={form.policyType}
              setPolicyType={form.setPolicyType}
              tpaName={form.tpaName}
              setTpaName={form.setTpaName}
              sumInsured={form.sumInsured}
              setSumInsured={form.setSumInsured}
              currency={form.currency}
              setCurrency={form.setCurrency}
              validFrom={form.validFrom}
              onValidFromChange={form.handleValidFromChange}
              validUntil={form.validUntil}
              setValidUntil={form.setValidUntil}
              status={form.status}
              setStatus={form.setStatus}
              renewalDate={form.renewalDate}
              setRenewalDate={form.setRenewalDate}
              employer={form.employer}
              setEmployer={form.setEmployer}
              relationship={form.relationship}
              setRelationship={form.setRelationship}
              notes={form.notes}
              setNotes={form.setNotes}
            />

            <DocumentUploadGrid
              sectionTitle="3. Supporting Documents"
              subTitle="Upload scanned copy of policy / insurance card (JPG, PNG, PDF. Max 5MB each)"
              items={POLICY_DOC_ITEMS}
              documents={form.documents}
              onFileUpload={form.handleFileUpload}
            />
          </div>

          {/* RIGHT COLUMN: Summary Sidebar Component */}
          <div className="lg:col-span-4">
            <PolicySummarySidebar
              patientDisplay={form.patientDisplay}
              providerName={form.providerName}
              policyNumber={form.policyNumber}
              policyType={form.policyType}
              tpaName={form.tpaName}
              sumInsured={form.sumInsured}
              validFrom={form.validFrom}
              validUntil={form.validUntil}
              status={form.status}
              relationship={form.relationship}
            />
          </div>
        </div>

        {/* Modal Bottom Action Footer */}
        <div className="px-6 py-3 border-t border-slate-100 bg-slate-50/50 flex items-center justify-end gap-3 shrink-0">
          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2 bg-white border border-slate-200 hover:bg-slate-100 text-slate-700 font-bold text-xs rounded-xl shadow-2xs transition cursor-pointer"
          >
            Cancel
          </button>

          <button
            type="button"
            onClick={form.handleSubmit}
            disabled={form.submitting}
            className="flex items-center gap-1.5 px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-xl shadow-xs transition cursor-pointer disabled:opacity-50"
          >
            <Save className="w-3.5 h-3.5" />
            <span>{form.submitting ? "Saving..." : "Save Policy"}</span>
          </button>
        </div>
      </div>
    </div>
  );
}
