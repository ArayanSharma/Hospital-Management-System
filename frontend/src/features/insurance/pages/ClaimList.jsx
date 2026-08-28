import { useState, useEffect, useCallback } from "react";
import { Plus } from "lucide-react";
import { getClaimsApi, createClaimApi, updateClaimStatusApi } from "../services/insuranceClaim.api.js";
import Table from "../../../components/ui/Table.jsx";
import Pagination from "../../../components/ui/Pagination.jsx";
import Badge from "../../../components/ui/Badge.jsx";
import Button from "../../../components/ui/Button.jsx";
import Modal from "../../../components/ui/Modal.jsx";
import ClaimForm from "../components/ClaimForm.jsx";
import Loading from "../../../components/common/Loading.jsx";
import ErrorState from "../../../components/common/ErrorState.jsx";

const STATUS_BADGE_MAP = {
  submitted: "pending",
  "under-review": "pending",
  approved: "completed",
  rejected: "cancelled",
  settled: "completed",
};

export default function ClaimList() {
  const [claims, setClaims] = useState([]);
  const [pagination, setPagination] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [page, setPage] = useState(1);
  const [modalOpen, setModalOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const fetchClaims = useCallback(async () => {
    setLoading(true);
    try {
      const { data } = await getClaimsApi({ page, limit: 10 });
      setClaims(data.data.claims || []);
      setPagination(data.data.pagination || {});
    } catch (err) {
      setError(err.response?.data?.message || "Failed to load claims");
    } finally {
      setLoading(false);
    }
  }, [page]);

  useEffect(() => { fetchClaims(); }, [fetchClaims]);

  const handleCreate = async (formData) => {
    setSubmitting(true);
    try {
      await createClaimApi(formData);
      setModalOpen(false);
      fetchClaims();
    } catch (err) {
      alert(err.response?.data?.message || "Something went wrong");
    } finally {
      setSubmitting(false);
    }
  };

  const handleUnderReview = async (claim) => {
    try {
      await updateClaimStatusApi(claim._id, { status: "under-review" });
      fetchClaims();
    } catch (err) {
      alert(err.response?.data?.message || "Failed to set under review");
    }
  };

  const handleApprove = async (claim) => {
    const inputAmount = prompt("Enter approved amount:", claim.claimAmount);
    if (inputAmount === null) return;
    const amount = Number(inputAmount);
    if (isNaN(amount) || amount < 0) {
      alert("Please enter a valid amount");
      return;
    }
    try {
      await updateClaimStatusApi(claim._id, { status: "approved", approvedAmount: amount });
      fetchClaims();
    } catch (err) {
      alert(err.response?.data?.message || "Failed to approve claim");
    }
  };

  const handleReject = async (claim) => {
    const reason = prompt("Enter rejection reason:");
    if (!reason) return;
    try {
      await updateClaimStatusApi(claim._id, { status: "rejected", rejectionReason: reason });
      fetchClaims();
    } catch (err) {
      alert(err.response?.data?.message || "Failed to reject claim");
    }
  };

  const handleSettle = async (claim) => {
    if (!confirm(`Settle payment of ₹${claim.approvedAmount || claim.claimAmount} for this claim?`)) return;
    try {
      await updateClaimStatusApi(claim._id, { status: "settled" });
      fetchClaims();
    } catch (err) {
      alert(err.response?.data?.message || "Failed to settle claim");
    }
  };

  const columns = [
    { key: "patient", label: "Patient", render: (row) => row.patientId?.name },
    { key: "provider", label: "Provider", render: (row) => row.policyId?.providerName },
    { key: "invoice", label: "Invoice", render: (row) => row.invoiceId?.invoiceNumber || row.invoiceId },
    { key: "amount", label: "Claim Amount", render: (row) => `₹${row.claimAmount?.toFixed(2)}` },
    { key: "status", label: "Status", render: (row) => <Badge status={STATUS_BADGE_MAP[row.status] || "pending"} label={row.status.replace("-", " ")} /> },
    {
      key: "actions", label: "Actions",
      render: (row) => (
        <div className="flex items-center gap-2">
          {(row.status === "submitted" || row.status === "under-review") && (
            <>
              {row.status === "submitted" && (
                <button onClick={() => handleUnderReview(row)} className="text-xs text-amber-600 hover:underline cursor-pointer">
                  Review
                </button>
              )}
              <button onClick={() => handleApprove(row)} className="text-xs text-green-600 hover:underline cursor-pointer font-medium">
                Approve
              </button>
              <button onClick={() => handleReject(row)} className="text-xs text-red-600 hover:underline cursor-pointer">
                Reject
              </button>
            </>
          )}
          {row.status === "approved" && (
            <button onClick={() => handleSettle(row)} className="text-xs text-blue-600 hover:underline cursor-pointer font-semibold">
              Settle Payment
            </button>
          )}
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-semibold text-gray-900">Insurance Claims</h1>
          <p className="text-sm text-gray-500">Track and process claims</p>
        </div>
        <Button onClick={() => setModalOpen(true)}>
          <span className="flex items-center gap-1.5"><Plus className="w-4 h-4" /> File Claim</span>
        </Button>
      </div>

      {loading ? <Loading /> : error ? <ErrorState message={error} /> : (
        <>
          <Table columns={columns} data={claims} emptyMessage="No claims found" />
          <Pagination {...pagination} page={page} onPageChange={setPage} />
        </>
      )}

      <Modal isOpen={modalOpen} onClose={() => setModalOpen(false)} title="File Insurance Claim">
        <ClaimForm onSubmit={handleCreate} onCancel={() => setModalOpen(false)} submitting={submitting} />
      </Modal>
    </div>
  );
}
