import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Plus, Lock } from "lucide-react";
import { getRolesApi, createRoleApi, deleteRoleApi } from "../services/role.api.js";
import Table from "../../../components/ui/Table.jsx";
import Button from "../../../components/ui/Button.jsx";
import Modal from "../../../components/ui/Modal.jsx";
import CreateRoleForm from "../components/CreateRoleForm.jsx";
import Loading from "../../../components/common/Loading.jsx";
import ErrorState from "../../../components/common/ErrorState.jsx";

export default function RoleList() {
  const navigate = useNavigate();
  const [roles, setRoles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const fetchRoles = async () => {
    setLoading(true);
    try {
      const { data } = await getRolesApi();
      setRoles(data.data);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to load roles");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchRoles(); }, []);

  const handleCreate = async (formData) => {
    setSubmitting(true);
    try {
      await createRoleApi(formData);
      setModalOpen(false);
      fetchRoles();
    } catch (err) {
      alert(err.response?.data?.message || "Something went wrong");
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (role) => {
    if (!confirm(`Delete role "${role.name}"?`)) return;
    try {
      await deleteRoleApi(role._id);
      fetchRoles();
    } catch (err) {
      alert(err.response?.data?.message || "Failed to delete role");
    }
  };

  const columns = [
    {
      key: "name", label: "Role",
      render: (row) => (
        <div className="flex items-center gap-2">
          <span className="font-medium">{row.name}</span>
          {row.isSystemRole && <Lock className="w-3 h-3 text-gray-400" title="System role" />}
        </div>
      ),
    },
    { key: "description", label: "Description" },
    { key: "permissions", label: "Permissions", render: (row) => `${row.permissionIds.length} assigned` },
    {
      key: "actions", label: "",
      render: (row) => (
        <div className="flex gap-3">
          <button onClick={() => navigate(`/roles/${row._id}`)} className="text-sm text-blue-600 hover:underline">
            Manage
          </button>
          {!row.isSystemRole && (
            <button onClick={() => handleDelete(row)} className="text-sm text-red-600 hover:underline">
              Delete
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
          <h1 className="text-xl font-semibold text-gray-900">Roles</h1>
          <p className="text-sm text-gray-500">Manage roles and their permissions</p>
        </div>
        <Button onClick={() => setModalOpen(true)}>
          <span className="flex items-center gap-1.5"><Plus className="w-4 h-4" /> Create Role</span>
        </Button>
      </div>

      {loading ? <Loading /> : error ? <ErrorState message={error} /> : (
        <Table columns={columns} data={roles} emptyMessage="No roles found" />
      )}

      <Modal isOpen={modalOpen} onClose={() => setModalOpen(false)} title="Create Role">
        <CreateRoleForm onSubmit={handleCreate} onCancel={() => setModalOpen(false)} submitting={submitting} />
      </Modal>
    </div>
  );
}