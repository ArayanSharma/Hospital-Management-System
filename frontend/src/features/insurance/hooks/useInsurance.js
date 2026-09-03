import { useState, useEffect, useCallback } from "react";
import {
  getPoliciesApi,
  createPolicyApi,
  deletePolicyApi,
} from "../services/insurancePolicy.api.js";
import {
  getClaimsApi,
  createClaimApi,
  updateClaimStatusApi,
} from "../services/insuranceClaim.api.js";

export function useInsurance() {
  const [activeTab, setActiveTab] = useState("Insurance Policies");

  // Policies State
  const [policies, setPolicies] = useState([]);
  const [policyStatusFilter, setPolicyStatusFilter] = useState("All Status");
  const [policySearch, setPolicySearch] = useState("");
  const [policiesLoading, setPoliciesLoading] = useState(true);

  // Claims State
  const [claims, setClaims] = useState([]);
  const [claimStatusFilter, setClaimStatusFilter] = useState("All Status");
  const [claimSearch, setClaimSearch] = useState("");
  const [claimsLoading, setClaimsLoading] = useState(true);

  // Modal Control States
  const [addPolicyOpen, setAddPolicyOpen] = useState(false);
  const [selectedPolicy, setSelectedPolicy] = useState(null);
  const [policyDetailsOpen, setPolicyDetailsOpen] = useState(false);

  const [submitClaimOpen, setSubmitClaimOpen] = useState(false);
  const [selectedClaim, setSelectedClaim] = useState(null);
  const [claimDetailsOpen, setClaimDetailsOpen] = useState(false);

  // Fetch Policies
  const fetchPolicies = useCallback(async () => {
    setPoliciesLoading(true);
    try {
      const res = await getPoliciesApi({
        status: policyStatusFilter === "All Status" ? "" : policyStatusFilter,
        search: policySearch,
      });
      const dataPayload = res?.data?.data || res?.data || [];
      const list = Array.isArray(dataPayload)
        ? dataPayload
        : dataPayload.policies || dataPayload.data || [];
      setPolicies(Array.isArray(list) ? list : []);
    } catch (err) {
      console.error("Error fetching policies:", err);
      setPolicies([]);
    } finally {
      setPoliciesLoading(false);
    }
  }, [policyStatusFilter, policySearch]);

  // Fetch Claims
  const fetchClaims = useCallback(async () => {
    setClaimsLoading(true);
    try {
      const res = await getClaimsApi({
        status: claimStatusFilter === "All Status" ? "" : claimStatusFilter,
        search: claimSearch,
      });
      const dataPayload = res?.data?.data || res?.data || [];
      const list = Array.isArray(dataPayload)
        ? dataPayload
        : dataPayload.claims || dataPayload.data || [];
      setClaims(Array.isArray(list) ? list : []);
    } catch (err) {
      console.error("Error fetching claims:", err);
      setClaims([]);
    } finally {
      setClaimsLoading(false);
    }
  }, [claimStatusFilter, claimSearch]);

  useEffect(() => {
    fetchPolicies();
    fetchClaims();
  }, [fetchPolicies, fetchClaims]);

  // Handlers
  const handleAddPolicySubmit = async (payload) => {
    await createPolicyApi(payload);
    setAddPolicyOpen(false);
    fetchPolicies();
  };

  const handleDeactivatePolicy = async (policyId) => {
    if (window.confirm("Are you sure you want to deactivate this policy?")) {
      await deletePolicyApi(policyId);
      fetchPolicies();
    }
  };

  const handleSubmitClaimSubmit = async (payload) => {
    await createClaimApi(payload);
    setSubmitClaimOpen(false);
    fetchClaims();
  };

  const handleUpdateClaimStatus = async (claimId, status, extraData = {}) => {
    await updateClaimStatusApi(claimId, { status, ...extraData });
    fetchClaims();
  };

  return {
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
    refreshPolicies: fetchPolicies,
    refreshClaims: fetchClaims,
    refreshData: () => {
      fetchPolicies();
      fetchClaims();
    },
  };
}
