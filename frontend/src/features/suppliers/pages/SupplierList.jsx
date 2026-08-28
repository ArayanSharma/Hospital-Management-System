import { useState, useEffect } from "react";
import { Plus, Truck } from "lucide-react";
import { getSuppliersApi, createSupplierApi, updateSupplierApi, deleteSupplierApi } from "../services/supplier.api.js";
import Table from "../../../components/ui/Table.jsx";
import Badge from "../../../components/ui/Badge.jsx";
import Button from "../../../components/ui/Button.jsx";
import Modal from "../../../components/ui/Modal.jsx";
import SupplierForm from "../components/SupplierForm.jsx";
import Loading from "../../../components/common/Loading.jsx";
import ErrorState from "../../../components/common/ErrorState.jsx";

export default function SupplierList() {
  const [suppliers, setSuppliers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [editingSupplier, setEditingSupplier] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  const fetchSuppliers = async () => {
    setLoading(true);
    try {
      const { data } = await getSuppliersApi();
      setSuppliers(data.data);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to load suppliers");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchSuppliers(); }, []);

  const handleSubmit = async (formData) => {
    setSubmitting(true);
    try {
      if (editingSupplier) {
        await updateSupplierApi(editingSupplier._id, formData);
      } else {
        await createSupplierApi(formData);
      }
      setModalOpen(false);
      fetchSuppliers();
    } catch (err) {
      alert(err.response?.data?.message || "Something went wrong");
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (supplier) => {
    if (!confirm(`Deactivate ${supplier.name}?`)) return;
    try {
      await deleteSupplierApi(supplier._id);
      fetchSuppliers();
    } catch (err) {
      alert(err.response?.data?.message || "Failed to deactivate supplier");
    }
  };

  const columns = [
    {
      key: "name", label: "Supplier",
      render: (row) => (
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-orange-50 flex items-center justify-center shrink-0">
            <Truck className="w-4 h-4 text-orange-600" />
          </div>
          <div>
            <p className="font-medium text-gray-900">{row.name}</p>
            <p className="text-xs text-gray-400">{row.company || "—"}</p>
          </div>
        </div>
      ),
    },
    { key: "phone", label: "Phone" },
    { key: "email", label: "Email", render: (row) => row.email || "—" },
    { key: "status", label: "Status", render: (row) => <Badge status={row.status} /> },
    {
      key: "actions", label: "",
      render: (row) => (
        <div className="flex gap-2">
          <button onClick={() => { setEditingSupplier(row); setModalOpen(true); }} className="text-sm text-blue-600 hover:underline">
            Edit
          </button>
          {row.status === "active" && (
            <button onClick={() => handleDelete(row)} className="text-sm text-red-600 hover:underline">
              Deactivate
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
          <h1 className="text-xl font-semibold text-gray-900">Suppliers</h1>
          <p className="text-sm text-gray-500">Manage vendor and supplier information</p>
        </div>
        <Button onClick={() => { setEditingSupplier(null); setModalOpen(true); }}>
          <span className="flex items-center gap-1.5"><Plus className="w-4 h-4" /> Add Supplier</span>
        </Button>
      </div>

      {loading ? <Loading /> : error ? <ErrorState message={error} /> : (
        <Table columns={columns} data={suppliers} emptyMessage="No suppliers found" />
      )}

      <Modal isOpen={modalOpen} onClose={() => setModalOpen(false)} title={editingSupplier ? "Edit Supplier" : "Add Supplier"}>
        <SupplierForm defaultValues={editingSupplier} onSubmit={handleSubmit} onCancel={() => setModalOpen(false)} submitting={submitting} />
      </Modal>
    </div>
  );
}
