import React from "react";
import { ArrowLeft } from "lucide-react";
import { useSubmitClaimForm } from "../../hooks/useSubmitClaimForm.js";
import ClaimPatientPolicySection from "../form/ClaimPatientPolicySection.jsx";
import ClaimInvoiceDetailsSection from "../form/ClaimInvoiceDetailsSection.jsx";
import ClaimStatusWorkflowSection from "../form/ClaimStatusWorkflowSection.jsx";
import DocumentUploadGrid from "../form/DocumentUploadGrid.jsx";
import ClaimSummarySidebar from "../form/ClaimSummarySidebar.jsx";

const CLAIM_DOC_ITEMS = [
  { key: "claimForm", label: "Claim Form *", subText: "Upload claim form" },
  { key: "medicalReports", label: "Medical Reports *", subText: "Upload medical reports" },
  { key: "labReports", label: "Investigation Reports", subText: "Upload lab / test reports" },
  { key: "dischargeSummary", label: "Discharge Summary", subText: "Upload discharge summary" },
  { key: "invoiceCopy", label: "Bills / Invoice Copy *", subText: "Upload bills / invoice" },
  { key: "otherDocs", label: "Other Documents", subText: "Upload other documents" },
];

export default function SubmitClaimModal({ isOpen, onClose, onSubmit, policies = [] }) {
  if (!isOpen) return null;

  const form = useSubmitClaimForm(onSubmit, policies);

  return (
    <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center z-50 p-4">
      <div className="bg-white border border-slate-200/90 rounded-2xl max-w-6xl w-full shadow-2xl flex flex-col max-h-[94vh] overflow-hidden text-xs text-slate-800">
        {/* Header Action Bar */}
        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-white shrink-0">
          <div>
            <button
              type="button"
              onClick={onClose}
              className="text-[11px] font-bold text-blue-600 hover:text-blue-700 flex items-center gap-1 mb-1 transition cursor-pointer"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Back to Claims</span>
            </button>
            <h2 className="text-base font-bold text-slate-900">Submit New Claim</h2>
            <p className="text-[10px] font-medium text-slate-400">
              Insurance / Claims / Submit New Claim
            </p>
          </div>

          <div className="flex items-center gap-3">
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
              className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-xl shadow-xs transition cursor-pointer disabled:opacity-50"
            >
              {form.submitting ? "Submitting..." : "Submit Claim"}
            </button>
          </div>
        </div>

        {form.errorMsg && (
          <div className="mx-6 mt-3 p-3 bg-rose-50 border border-rose-200 rounded-xl text-xs font-semibold text-rose-600 shrink-0">
            ⚠️ {form.errorMsg}
          </div>
        )}

        {/* Modal Main Body */}
        <div className="p-6 overflow-y-auto grid grid-cols-1 lg:grid-cols-12 gap-6 flex-1">
          {/* LEFT MAIN COLUMN: 4 Sub-Components */}
          <div className="lg:col-span-8 space-y-5">
            <ClaimPatientPolicySection
              patientId={form.patientId}
              uhid={form.uhid}
              selectedPolicyNum={form.selectedPolicyNum}
              providerName={form.providerName}
              policyNumber={form.policyNumber}
              tpaName={form.tpaName}
              policyValidity={form.policyValidity}
              policyStatus={form.policyStatus}
              policies={policies}
              onPatientSelect={form.handlePatientSelect}
              onPolicySelect={form.handlePolicySelect}
            />

            <ClaimInvoiceDetailsSection
              invoiceNumber={form.invoiceNumber}
              invoiceDate={form.invoiceDate}
              invoiceTotal={form.invoiceTotal}
              invoicesList={form.invoicesList}
              admissionType={form.admissionType}
              setAdmissionType={form.setAdmissionType}
              treatmentDate={form.treatmentDate}
              setTreatmentDate={form.setTreatmentDate}
              claimType={form.claimType}
              setClaimType={form.setClaimType}
              claimAmount={form.claimAmount}
              setClaimAmount={form.setClaimAmount}
              approvedAmount={form.approvedAmount}
              patientPayable={form.patientPayable}
              preAuthNumber={form.preAuthNumber}
              setPreAuthNumber={form.setPreAuthNumber}
              onInvoiceSelect={form.handleInvoiceSelect}
            />

            <ClaimStatusWorkflowSection
              status={form.status}
              setStatus={form.setStatus}
              submittedDate={form.submittedDate}
              setSubmittedDate={form.setSubmittedDate}
              expectedReviewDate={form.expectedReviewDate}
              setExpectedReviewDate={form.setExpectedReviewDate}
              remarks={form.remarks}
              setRemarks={form.setRemarks}
              remarksLength={form.remarksLength}
            />

            <DocumentUploadGrid
              sectionTitle="4. Supporting Documents"
              subTitle="Upload required documents (JPG, PNG, PDF. Max 5MB each)"
              items={CLAIM_DOC_ITEMS}
              documents={form.documents}
              onFileUpload={form.handleFileUpload}
              infoBannerText="Note: Please ensure all documents are clear and valid. Incorrect or missing documents may lead to claim rejection."
            />
          </div>

          {/* RIGHT SIDEBAR COLUMN */}
          <div className="lg:col-span-4">
            <ClaimSummarySidebar
              providerName={form.providerName}
              policyNumber={form.policyNumber}
              tpaName={form.tpaName}
              sumInsured={form.sumInsured}
              policyValidity={form.policyValidity}
              policyStatus={form.policyStatus}
              invoiceNumber={form.invoiceNumber}
              invoiceDate={form.invoiceDate}
              invoiceTotal={form.invoiceTotal}
              invoicePaid={form.invoicePaid}
              invoiceDue={form.invoiceDue}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
