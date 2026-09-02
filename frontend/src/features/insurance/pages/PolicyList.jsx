import React from "react";
import InsuranceHeader from "../components/InsuranceHeader.jsx";
import PolicyTable from "../components/PolicyTable.jsx";
import ClaimTable from "../components/ClaimTable.jsx";
import InsuranceSidebarWidgets from "../components/InsuranceSidebarWidgets.jsx";

import AddPolicyModal from "../components/modals/AddPolicyModal.jsx";
import PolicyDetailsModal from "../components/modals/PolicyDetailsModal.jsx";
import SubmitClaimModal from "../components/modals/SubmitClaimModal.jsx";
import ClaimDetailsModal from "../components/modals/ClaimDetailsModal.jsx";

import { useInsurance } from "../hooks/useInsurance.js";

export default function PolicyList() {
  const {
    activeTab,
    setActiveTab,

    policies,
    policyStatusFilter,
    setPolicyStatusFilter,
    policySearch,
    setPolicySearch,
    policiesLoading,

    claims,
    claimStatusFilter,
    setClaimStatusFilter,
    claimSearch,
    setClaimSearch,
    claimsLoading,

    addPolicyOpen,
    setAddPolicyOpen,
    selectedPolicy,
    setSelectedPolicy,
    policyDetailsOpen,
    setPolicyDetailsOpen,

    submitClaimOpen,
    setSubmitClaimOpen,
    selectedClaim,
    setSelectedClaim,
    claimDetailsOpen,
    setClaimDetailsOpen,

    handleAddPolicySubmit,
    handleDeactivatePolicy,
    handleSubmitClaimSubmit,
    handleUpdateClaimStatus,
  } = useInsurance();

  const isPoliciesTab = activeTab.toLowerCase().includes("polic") || activeTab === "all";
  const isClaimsTab = activeTab.toLowerCase().includes("claim");

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
                onViewPolicy={(pol) => {
                  setSelectedPolicy(pol);
                  setPolicyDetailsOpen(true);
                }}
                onEditPolicy={(pol) => {
                  setSelectedPolicy(pol);
                  setAddPolicyOpen(true);
                }}
                onDeletePolicy={handleDeactivatePolicy}
                loading={policiesLoading}
              />
            )}

            {/* Show Claim Table ONLY when Insurance Claims tab is active */}
            {isClaimsTab && (
              <ClaimTable
                claims={claims}
                statusFilter={claimStatusFilter}
                onStatusFilterChange={setClaimStatusFilter}
                searchQuery={claimSearch}
                onSearchChange={setClaimSearch}
                onOpenSubmitClaim={() => setSubmitClaimOpen(true)}
                onViewClaim={(clm) => {
                  setSelectedClaim(clm);
                  setClaimDetailsOpen(true);
                }}
                onUpdateStatus={handleUpdateClaimStatus}
                loading={claimsLoading}
              />
            )}
          </div>

          {/* RIGHT SIDEBAR COLUMN: Widgets */}
          <div className="lg:col-span-4">
            <InsuranceSidebarWidgets
              onOpenAddPolicy={() => setAddPolicyOpen(true)}
              onOpenSubmitClaim={() => setSubmitClaimOpen(true)}
              onOpenUploadDoc={() => alert("Select a claim or policy to upload documents.")}
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

      <PolicyDetailsModal
        isOpen={policyDetailsOpen}
        onClose={() => setPolicyDetailsOpen(false)}
        policy={selectedPolicy}
      />

      <SubmitClaimModal
        isOpen={submitClaimOpen}
        onClose={() => setSubmitClaimOpen(false)}
        onSubmit={handleSubmitClaimSubmit}
        policies={policies}
      />

      <ClaimDetailsModal
        isOpen={claimDetailsOpen}
        onClose={() => setClaimDetailsOpen(false)}
        claim={selectedClaim}
        onUpdateStatus={handleUpdateClaimStatus}
      />

      {/* Footer matching screenshot */}
      <div className="pt-6 border-t border-slate-200/80 text-center text-xs text-slate-400 font-medium">
        © 2025 CityCare Hospital Management System. All rights reserved.
      </div>
    </div>
  );
}
