import { useState, useEffect } from "react";
import { Plus, Pill } from "lucide-react";
import { getMedicinesApi, createMedicineApi, updateMedicineApi } from "../services/medicine.api.js";
import { useDebounce } from "../../../hooks/useDebounce.js";
import Table from "../../../components/ui/Table.jsx";
import SearchInput from "../../../components/common/SearchInput.jsx";
import Badge from "../../../components/ui/Badge.jsx";
import Button from "../../../components/ui/Button.jsx";
import Modal from "../../../components/ui/Modal.jsx";
import MedicineForm from "../components/MedicineForm.jsx";
import Loading from "../../../components/common/Loading.jsx";
import ErrorState from "../../../components/common/ErrorState.jsx";

export default function MedicineList() {
  const [medicines, setMedicines] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const debouncedSearch = useDebounce(search, 400);

  const [modalOpen, setModalOpen] = useState(false);
  const [editingMed, setEditingMed] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  const fetchMedicines = async () => {
    setLoading(true);
    try {
      const { data } = await getMedicinesApi({ search: debouncedSearch || undefined });
      setMedicines(data.data);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to load medicines");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchMedicines(); }, [debouncedSearch]);

  const handleSubmit = async (formData) => {
    setSubmitting(true);
    try {
      if (editingMed) {
        await updateMedicineApi(editingMed._id, formData);
      } else {
        await createMedicineApi(formData);
      }
      setModalOpen(false);
      fetchMedicines();
    } catch (err) {
      alert(err.response?.data?.message || "Something went wrong");
    } finally {
      setSubmitting(false);
    }
  };

  const columns = [
    {
      key: "name", label: "Medicine",
      render: (row) => (
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-purple-50 flex items-center justify-center shrink-0">
            <Pill className="w-4 h-4 text-purple-600" />
          </div>
          <div>
            <p className="font-medium text-gray-900">{row.name}</p>
            <p className="text-xs text-gray-400">{row.genericName || "—"}</p>
          </div>
        </div>
      ),
    },
    { key: "category", label: "Category", render: (row) => row.category || "—" },
    { key: "unit", label: "Unit" },
    { key: "price", label: "Price", render: (row) => `₹${row.price.toFixed(2)}` },
    { key: "status", label: "Status", render: (row) => <Badge status={row.status} /> },
    {
      key: "actions", label: "",
      render: (row) => (
        <button onClick={() => { setEditingMed(row); setModalOpen(true); }} className="text-sm text-blue-600 hover:underline">
          Edit
        </button>
      ),
    },
  ];

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-semibold text-gray-900">Medicines</h1>
          <p className="text-sm text-gray-500">Medicine catalog and pricing</p>
        </div>
        <Button onClick={() => { setEditingMed(null); setModalOpen(true); }}>
          <span className="flex items-center gap-1.5"><Plus className="w-4 h-4" /> Add Medicine</span>
        </Button>
      </div>

      <div className="w-72">
        <SearchInput value={search} onChange={setSearch} placeholder="Search medicines..." />
      </div>

      {loading ? <Loading /> : error ? <ErrorState message={error} /> : (
        <Table columns={columns} data={medicines} emptyMessage="No medicines found" />
      )}

      <Modal isOpen={modalOpen} onClose={() => setModalOpen(false)} title={editingMed ? "Edit Medicine" : "Add Medicine"}>
        <MedicineForm defaultValues={editingMed} onSubmit={handleSubmit} onCancel={() => setModalOpen(false)} submitting={submitting} />
      </Modal>
    </div>
  );
}