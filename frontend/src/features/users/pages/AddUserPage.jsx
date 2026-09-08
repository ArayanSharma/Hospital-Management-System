import React from "react";
import { Link, useNavigate } from "react-router-dom";
import AddUserModal from "../components/modals/AddUserModal.jsx";
import { createUserApi } from "../services/user.api.js";

export default function AddUserPage() {
  const navigate = useNavigate();

  const handleCreate = async (formData) => {
    await createUserApi(formData);
    navigate("/users");
  };

  return (
    <div className="space-y-4">
      {/* Top Breadcrumb Bar matching Screenshot */}
      <div className="flex items-center justify-between text-xs font-bold text-slate-500">
        <div>
          <h1 className="text-xl font-bold text-slate-900 tracking-tight">Add New User</h1>
          <p className="text-xs text-slate-500 font-medium">
            Create a new system user and assign role & permissions.
          </p>
        </div>

        <div className="flex items-center gap-1.5 text-xs font-extrabold text-slate-400">
          <Link to="/users" className="hover:text-blue-600">
            Users
          </Link>
          <span>›</span>
          <span className="text-slate-900">Add New User</span>
        </div>
      </div>

      {/* Render full layout form */}
      <AddUserModal
        isOpen={true}
        onClose={() => navigate("/users")}
        onSubmit={handleCreate}
      />
    </div>
  );
}
