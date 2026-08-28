import { useState, useEffect, useCallback } from "react";
import { Plus } from "lucide-react";
import { getUsersApi, createUserApi, updateUserApi, deleteUserApi } from "../services/user.api.js";
import { useDebounce } from "../../../hooks/useDebounce.js";
import Table from "../../../components/ui/Table.jsx";
import Pagination from "../../../components/ui/Pagination.jsx";
import SearchInput from "../../../components/common/SearchInput.jsx";
import Badge from "../../../components/ui/Badge.jsx";
import Button from "../../../components/ui/Button.jsx";
import Modal from "../../../components/ui/Modal.jsx";
import UserForm from "../components/UserForm.jsx";
import Loading from "../../../components/common/Loading.jsx";
import ErrorState from "../../../components/common/ErrorState.jsx";

export default function UserList() {
  const [users, setUsers] = useState([]);
  const [pagination, setPagination] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const debouncedSearch = useDebounce(search, 400);

  const [modalOpen, setModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  const fetchUsers = useCallback(async () => {
    setLoading(true);
    try {
      const { data } = await getUsersApi({ page, limit: 10, search: debouncedSearch || undefined });
      setUsers(data.data.users);
      setPagination(data.data.pagination);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to load users");
    } finally {
      setLoading(false);
    }
  }, [page, debouncedSearch]);

  useEffect(() => { fetchUsers(); }, [fetchUsers]);
  useEffect(() => { setPage(1); }, [debouncedSearch]);

  const openCreateModal = () => {
    setEditingUser(null);
    setModalOpen(true);
  };

  const openEditModal = (user) => {
    setEditingUser({
      _id: user._id,
      name: user.name,
      roleId: user.roleId?._id,
      status: user.status,
    });
    setModalOpen(true);
  };

  const handleSubmit = async (formData) => {
    setSubmitting(true);
    try {
      if (editingUser) {
        const { _id, ...updateData } = formData;
        await updateUserApi(editingUser._id, updateData);
      } else {
        await createUserApi(formData);
      }
      setModalOpen(false);
      fetchUsers();
    } catch (err) {
      alert(err.response?.data?.message || "Something went wrong");
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (user) => {
    if (!confirm(`Deactivate ${user.name}?`)) return;
    try {
      await deleteUserApi(user._id);
      fetchUsers();
    } catch (err) {
      alert(err.response?.data?.message || "Failed to delete user");
    }
  };

  const columns = [
    { key: "name", label: "Name" },
    { key: "email", label: "Email" },
    { key: "role", label: "Role", render: (row) => row.roleId?.name || "—" },
    { key: "status", label: "Status", render: (row) => <Badge status={row.status} /> },
    {
      key: "actions", label: "",
      render: (row) => (
        <div className="flex gap-2">
          <button onClick={() => openEditModal(row)} className="text-sm text-blue-600 hover:underline">Edit</button>
          <button onClick={() => handleDelete(row)} className="text-sm text-red-600 hover:underline">Deactivate</button>
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-semibold text-gray-900">Users</h1>
          <p className="text-sm text-gray-500">Manage staff accounts</p>
        </div>
        <Button onClick={openCreateModal}>
          <span className="flex items-center gap-1.5"><Plus className="w-4 h-4" /> Add User</span>
        </Button>
      </div>

      <div className="w-72">
        <SearchInput value={search} onChange={setSearch} placeholder="Search by name or email..." />
      </div>

      {loading ? <Loading /> : error ? <ErrorState message={error} /> : (
        <>
          <Table columns={columns} data={users} emptyMessage="No users found" />
          <Pagination {...pagination} page={page} onPageChange={setPage} />
        </>
      )}

      <Modal isOpen={modalOpen} onClose={() => setModalOpen(false)} title={editingUser ? "Edit User" : "Add User"}>
        <UserForm
          defaultValues={editingUser}
          isEdit={!!editingUser}
          onSubmit={handleSubmit}
          onCancel={() => setModalOpen(false)}
          submitting={submitting}
        />
      </Modal>
    </div>
  );
}