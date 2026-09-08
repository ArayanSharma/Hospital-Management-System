import React, { useState } from "react";
import InsuranceHeader from "../components/InsuranceHeader.jsx";
import PolicyTable from "../components/PolicyTable.jsx";
import ClaimTable from "../components/ClaimTable.jsx";
import InsuranceSidebarWidgets from "../components/InsuranceSidebarWidgets.jsx";

import AddPolicyModal from "../components/modals/AddPolicyModal.jsx";
import ViewPolicyDetailModal from "../components/modals/ViewPolicyDetailModal.jsx";
import EditPolicyModal from "../components/modals/EditPolicyModal.jsx";
import SubmitClaimModal from "../components/modals/SubmitClaimModal.jsx";
import PolicyClaimsHistoryModal from "../components/modals/PolicyClaimsHistoryModal.jsx";
import UploadPolicyDocumentModal from "../components/modals/UploadPolicyDocumentModal.jsx";

// Claim Modals
import ViewClaimDetailModal from "../components/modals/ViewClaimDetailModal.jsx";
import EditClaimModal from "../components/modals/EditClaimModal.jsx";
import ClaimSettlementDetailsModal from "../components/modals/ClaimSettlementDetailsModal.jsx";
import ClaimRejectionDetailsModal from "../components/modals/ClaimRejectionDetailsModal.jsx";
import AddClaimNoteModal from "../components/modals/AddClaimNoteModal.jsx";
import UploadClaimDocumentModal from "../components/modals/UploadClaimDocumentModal.jsx";

import { useInsurance } from "../hooks/useInsurance.js";
import {
  updatePolicyApi,
  togglePolicyStatusApi,
  togglePolicyArchiveApi,
} from "../services/insurancePolicy.api.js";
import {
  updateClaimApi,
  updateClaimStatusApi,
  addClaimNoteApi,
  uploadClaimDocumentApi,
} from "../services/insuranceClaim.api.js";
import { downloadRadiologyReportPdf } from "../../radiology/helpers/radiologyPdfHelper.js";

export default function PolicyList() {
  const {
    activeTab,
    setActiveTab,

    policies,
    setPolicies,
    policyStatusFilter,
    setPolicyStatusFilter,
    policySearch,
    setPolicySearch,
    policiesLoading,

    claims,
    setClaims,
    claimStatusFilter,
    setClaimStatusFilter,
    claimSearch,
    setClaimSearch,
    claimsLoading,

    addPolicyOpen,
    setAddPolicyOpen,
    selectedPolicy,
    setSelectedPolicy,

    submitClaimOpen,
    setSubmitClaimOpen,

    handleAddPolicySubmit,
    handleDeactivatePolicy,
    handleSubmitClaimSubmit,
    refreshPolicies,
    refreshClaims,
  } = useInsurance();

  // Active Policy Modals
  const [viewDetailPolicy, setViewDetailPolicy] = useState(null);
  const [editPolicy, setEditPolicy] = useState(null);
  const [claimsHistoryPolicy, setClaimsHistoryPolicy] = useState(null);
  const [uploadDocPolicy, setUploadDocPolicy] = useState(null);

  // Active Claim Modals
  const [viewDetailClaim, setViewDetailClaim] = useState(null);
  const [editClaim, setEditClaim] = useState(null);
  const [settlementClaim, setSettlementClaim] = useState(null);
  const [rejectionClaim, setRejectionClaim] = useState(null);
  const [addNoteClaim, setAddNoteClaim] = useState(null);
  const [uploadDocClaim, setUploadDocClaim] = useState(null);

  const isPoliciesTab = activeTab.toLowerCase().includes("polic") || activeTab === "all";
  const isClaimsTab = activeTab.toLowerCase().includes("claim");

  // Policy Handlers
  const handleEditPolicySubmit = async (id, updatedData) => {
    try {
      await updatePolicyApi(id, updatedData).catch(() => null);
      setPolicies((prev) =>
        prev.map((p) => (p._id === id || p.id === id || p.policyNumber === updatedData.policyNumber ? { ...p, ...updatedData } : p))
      );
    } catch (err) {
      console.error("Failed to update policy:", err);
    }
  };

  const handleToggleStatus = async (pol) => {
    const targetId = pol._id || pol.policyNumber || pol.id;
    const isInactive = (pol.status || "").toLowerCase() === "inactive";
    const nextStatus = isInactive ? "Active" : "Inactive";

    setPolicies((prev) =>
      prev.map((item) =>
        (item._id && item._id === pol._id) || item.policyNumber === pol.policyNumber
          ? { ...item, status: nextStatus }
          : item
      )
    );

    try {
      if (targetId) await togglePolicyStatusApi(targetId);
    } catch (err) {
      console.error("Failed to toggle policy status in DB:", err);
    }
  };

  const handleToggleArchive = async (pol) => {
    const targetId = pol._id || pol.policyNumber || pol.id;
    const isArchived = (pol.status || "").toLowerCase() === "archived";
    const nextStatus = isArchived ? "Active" : "Archived";

    setPolicies((prev) =>
      prev.map((item) =>
        (item._id && item._id === pol._id) || item.policyNumber === pol.policyNumber
          ? { ...item, status: nextStatus }
          : item
      )
    );

    try {
      if (targetId) await togglePolicyArchiveApi(targetId);
    } catch (err) {
      console.error("Failed to archive policy in DB:", err);
    }
  };

  // Claim Handlers
  const handleUpdateClaimStatusHandler = async (claimId, status, extraData = {}) => {
    // Optimistic UI Update
    setClaims((prev) =>
      prev.map((c) =>
        c._id === claimId || c.claimNumber === claimId ? { ...c, status, ...extraData } : c
      )
    );

    try {
      await updateClaimStatusApi(claimId, { status, ...extraData });
      refreshClaims?.();
    } catch (err) {
      console.error("Failed to update claim status in DB:", err);
    }
  };

  const handleEditClaimSubmit = async (claimId, updatedData) => {
    setClaims((prev) =>
      prev.map((c) => (c._id === claimId || c.claimNumber === claimId ? { ...c, ...updatedData } : c))
    );

    try {
      await updateClaimApi(claimId, updatedData);
      refreshClaims?.();
    } catch (err) {
      console.error("Failed to edit claim:", err);
    }
  };

  const handleAddClaimNoteSubmit = async (claimId, noteText) => {
    try {
      await addClaimNoteApi(claimId, { noteText });
      refreshClaims?.();
    } catch (err) {
      console.error("Failed to add claim note:", err);
    }
  };

  const handleUploadClaimDocSubmit = async (claimId, docData) => {
    try {
      await uploadClaimDocumentApi(claimId, docData);
      refreshClaims?.();
    } catch (err) {
      console.error("Failed to upload claim document:", err);
    }
  };

  const handlePrintClaim = (clm) => {
    downloadRadiologyReportPdf("claim-table-container", `${clm.claimNumber}_Insurance_Claim.pdf`);
  };

  return (
    <div className="space-y-6 min-h-screen flex flex-col justify-between">
      <div className="space-y-5">
        {/* Top Header Title & Navigation Tabs */}
        <InsuranceHeader activeTab={activeTab} onTabChange={setActiveTab} />

        {/* 2-Column Split Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
          {/* LEFT MAIN COLUMN: Active Tab Table */}
          <div className="lg:col-span-8 space-y-5">
            {/* Show Policy Table ONLY when Insurance Policies tab is active */}
            {isPoliciesTab && (
              <PolicyTable
                policies={policies}
                statusFilter={policyStatusFilter}
                onStatusFilterChange={setPolicyStatusFilter}
                searchQuery={policySearch}
                onSearchChange={setPolicySearch}
                onOpenAddPolicy={() => setAddPolicyOpen(true)}
                onViewPolicy={(pol) => setViewDetailPolicy(pol)}
                onEditPolicy={(pol) => setEditPolicy(pol)}
                onToggleStatus={handleToggleStatus}
                onToggleArchive={handleToggleArchive}
                onSubmitClaim={(pol) => {
                  setSelectedPolicy(pol);
                  setSubmitClaimOpen(true);
                }}
                onUploadDoc={(pol) => setUploadDocPolicy(pol)}
                onViewClaimsHistory={(pol) => setClaimsHistoryPolicy(pol)}
                loading={policiesLoading}
              />
            )}

            {/* Show Claim Table ONLY when Insurance Claims tab is active */}
            {isClaimsTab && (
              <div id="claim-table-container">
                <ClaimTable
                  claims={claims}
                  statusFilter={claimStatusFilter}
                  onStatusFilterChange={setClaimStatusFilter}
                  searchQuery={claimSearch}
                  onSearchChange={setClaimSearch}
                  onOpenSubmitClaim={() => setSubmitClaimOpen(true)}
                  onViewClaim={(clm) => setViewDetailClaim(clm)}
                  onEditClaim={(clm) => setEditClaim(clm)}
                  onUploadDoc={(clm) => setUploadDocClaim(clm)}
                  onAddNote={(clm) => setAddNoteClaim(clm)}
                  onViewSettlement={(clm) => setSettlementClaim(clm)}
                  onViewRejection={(clm) => setRejectionClaim(clm)}
                  onViewHistory={(clm) => setViewDetailClaim(clm)}
                  onUpdateStatus={handleUpdateClaimStatusHandler}
                  onPrintClaim={handlePrintClaim}
                  loading={claimsLoading}
                />
              </div>
            )}
          </div>

          {/* RIGHT SIDEBAR COLUMN: Widgets */}
          <div className="lg:col-span-4">
            <InsuranceSidebarWidgets
              onOpenAddPolicy={() => setAddPolicyOpen(true)}
              onOpenSubmitClaim={() => setSubmitClaimOpen(true)}
              onOpenUploadDoc={() => {
                if (claims.length > 0) setUploadDocClaim(claims[0]);
              }}
              onOpenReport={() => alert("Insurance Analytics Report generated.")}
            />
          </div>
        </div>
      </div>

      {/* Modals */}
      <AddPolicyModal
        isOpen={addPolicyOpen}
        onClose={() => setAddPolicyOpen(false)}
        onSubmit={handleAddPolicySubmit}
      />

      {/* View Policy Detail Modal */}
      <ViewPolicyDetailModal
        isOpen={!!viewDetailPolicy}
        onClose={() => setViewDetailPolicy(null)}
        policy={viewDetailPolicy}
        claims={claims}
        onOpenSubmitClaim={(pol) => {
          setSelectedPolicy(pol);
          setSubmitClaimOpen(true);
        }}
        onOpenUploadDoc={(pol) => setUploadDocPolicy(pol)}
      />

      {/* Edit Policy Master Modal */}
      <EditPolicyModal
        isOpen={!!editPolicy}
        onClose={() => setEditPolicy(null)}
        policy={editPolicy}
        onSuccess={handleEditPolicySubmit}
      />

      {/* Submit Claim Modal */}
      <SubmitClaimModal
        isOpen={submitClaimOpen}
        onClose={() => setSubmitClaimOpen(false)}
        policy={selectedPolicy || (policies.length > 0 ? policies[0] : null)}
        onSuccess={async (id, data) => {
          await handleSubmitClaimSubmit(data);
          refreshClaims?.();
        }}
      />

      {/* Claims History Timeline Modal */}
      <PolicyClaimsHistoryModal
        isOpen={!!claimsHistoryPolicy}
        onClose={() => setClaimsHistoryPolicy(null)}
        policy={claimsHistoryPolicy}
        claims={claims}
      />

      {/* Upload Policy Document Modal */}
      <UploadPolicyDocumentModal
        isOpen={!!uploadDocPolicy}
        onClose={() => setUploadDocPolicy(null)}
        policy={uploadDocPolicy}
      />

      {/* View Claim Master Detail Modal */}
      <ViewClaimDetailModal
        isOpen={!!viewDetailClaim}
        onClose={() => setViewDetailClaim(null)}
        claim={viewDetailClaim}
        onOpenSettlement={(clm) => setSettlementClaim(clm)}
        onOpenRejection={(clm) => setRejectionClaim(clm)}
        onOpenAddNote={(clm) => setAddNoteClaim(clm)}
      />

      {/* Edit Claim Modal */}
      <EditClaimModal
        isOpen={!!editClaim}
        onClose={() => setEditClaim(null)}
        claim={editClaim}
        onSuccess={handleEditClaimSubmit}
      />

      {/* Claim Settlement Details Modal */}
      <ClaimSettlementDetailsModal
        isOpen={!!settlementClaim}
        onClose={() => setSettlementClaim(null)}
        claim={settlementClaim}
        onSuccess={handleUpdateClaimStatusHandler}
      />

      {/* Claim Rejection Details & Appeals Modal */}
      <ClaimRejectionDetailsModal
        isOpen={!!rejectionClaim}
        onClose={() => setRejectionClaim(null)}
        claim={rejectionClaim}
        onAppealSuccess={handleUpdateClaimStatusHandler}
      />

      {/* Add Claim Note Modal */}
      <AddClaimNoteModal
        isOpen={!!addNoteClaim}
        onClose={() => setAddNoteClaim(null)}
        claim={addNoteClaim}
        onSuccess={handleAddClaimNoteSubmit}
      />

      {/* Upload Claim Document Modal */}
      <UploadClaimDocumentModal
        isOpen={!!uploadDocClaim}
        onClose={() => setUploadDocClaim(null)}
        claim={uploadDocClaim}
        onSuccess={handleUploadClaimDocSubmit}
      />

      {/* Footer */}
      <div className="pt-6 border-t border-slate-200/80 text-center text-xs text-slate-400 font-medium">
        © 2025 CityCare Hospital Management System. All rights reserved.
      </div>
    </div>
  );
}
