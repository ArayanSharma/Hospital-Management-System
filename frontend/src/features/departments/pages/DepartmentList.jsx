import React, { useState } from "react";
import { Plus, Users, Calendar, Bed, IndianRupee, Package, FlaskConical } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useDepartments } from "../hooks/useDepartments.js";
import {
  createDepartmentApi,
  updateDepartmentApi,
} from "../services/department.api.js";
import { useDoctors } from "../../doctors/hooks/useDoctors.js";
import Modal from "../../../components/ui/Modal.jsx";
import DepartmentForm from "../components/DepartmentForm.jsx";
import DepartmentStatsCards from "../components/DepartmentStatsCards.jsx";
import DepartmentFilterBar from "../components/DepartmentFilterBar.jsx";
import DepartmentTable from "../components/DepartmentTable.jsx";
import DepartmentViewModal from "../components/modals/DepartmentViewModal.jsx";
import DepartmentAssignHodModal from "../components/modals/DepartmentAssignHodModal.jsx";

export default function DepartmentList() {
  const navigate = useNavigate();
  const {
    departments,
    stats,
    pagination,
    loading,
    error,
    page,
    setPage,
    search,
    setSearch,
    status,
    setStatus,
    hodDoctorId,
    setHodDoctorId,
    refetch,
  } = useDepartments();

  const { doctors: doctorList } = useDoctors();

  // Modal State
  const [modalOpen, setModalOpen] = useState(false);
  const [editingDept, setEditingDept] = useState(null);
  const [viewingDept, setViewingDept] = useState(null);
  const [assignHodDept, setAssignHodDept] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [showMoreFilters, setShowMoreFilters] = useState(false);
  const [limit, setLimit] = useState("10");

  const openCreateModal = () => {
    setEditingDept(null);
    setModalOpen(true);
  };

  const openEditModal = (dept) => {
    setEditingDept({
      _id: dept._id,
      name: dept.name,
      code: dept.code,
      description: dept.description,
      headDoctorId: dept.headDoctorId?._id || "",
      status: dept.status,
    });
    setModalOpen(true);
  };

  const handleSubmit = async (formData) => {
    setSubmitting(true);
    try {
      if (editingDept) {
        await updateDepartmentApi(editingDept._id, formData);
      } else {
        await createDepartmentApi(formData);
      }
      setModalOpen(false);
      refetch();
    } catch (err) {
      alert(err.response?.data?.message || "Something went wrong");
    } finally {
      setSubmitting(false);
    }
  };

  const handleToggleStatus = async (dept) => {
    const newStatus = dept.status === "active" ? "inactive" : "active";
    try {
      await updateDepartmentApi(dept._id, { status: newStatus });
      refetch();
    } catch (err) {
      alert(err.response?.data?.message || "Failed to update department status");
    }
  };

  const handleAssignHod = async (deptId, newHeadDoctorId) => {
    setSubmitting(true);
    try {
      await updateDepartmentApi(deptId, { headDoctorId: newHeadDoctorId || null });
      setAssignHodDept(null);
      refetch();
    } catch (err) {
      alert(err.response?.data?.message || "Failed to assign HOD");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="space-y-6 pb-12">
      {/* 1. Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-slate-900 tracking-tight">
            Departments
          </h1>
          <p className="text-xs font-medium text-slate-400 mt-0.5">
            Home &gt; <span className="text-slate-600">Departments</span>
          </p>
        </div>

        <button
          type="button"
          onClick={openCreateModal}
          className="self-start sm:self-auto bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold px-4 py-2.5 rounded-xl shadow-sm shadow-blue-500/20 flex items-center gap-2 transition cursor-pointer"
        >
          <Plus className="w-4 h-4 stroke-[2.5]" />
          <span>Add New Department</span>
        </button>
      </div>

      {/* 2. Department Statistics Cards */}
      <DepartmentStatsCards
        stats={stats}
        totalFallback={pagination?.total}
        departmentsLength={departments.length}
      />

      {/* 3. Search & Filter Bar */}
      <DepartmentFilterBar
        search={search}
        setSearch={setSearch}
        status={status}
        setStatus={setStatus}
        hodDoctorId={hodDoctorId}
        setHodDoctorId={setHodDoctorId}
        doctorList={doctorList}
        showMoreFilters={showMoreFilters}
        setShowMoreFilters={setShowMoreFilters}
      />

      {/* 4. Departments Table */}
      <DepartmentTable
        departments={departments}
        pagination={pagination}
        loading={loading}
        error={error}
        page={page}
        setPage={setPage}
        refetch={refetch}
        limit={limit}
        setLimit={setLimit}
        openEditModal={openEditModal}
        openViewModal={(d) => setViewingDept(d)}
        openAssignHodModal={(d) => setAssignHodDept(d)}
        handleToggleStatus={handleToggleStatus}
        navigate={navigate}
      />

      {/* Integrated Modules Bar */}
      <div className="bg-white border border-slate-200/80 rounded-2xl p-5 shadow-2xs space-y-3">
        <h3 className="text-sm font-bold text-slate-900 tracking-tight">
          Integrated Modules
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-6 gap-3">
          <div
            onClick={() => navigate("/doctors")}
            className="p-3.5 bg-slate-50/60 hover:bg-blue-50/50 border border-slate-200/80 hover:border-blue-200 rounded-xl transition cursor-pointer group"
          >
            <div className="w-8 h-8 rounded-lg bg-blue-100 text-blue-600 flex items-center justify-center mb-2 group-hover:scale-105 transition-transform">
              <Users className="w-4 h-4" />
            </div>
            <h4 className="text-xs font-bold text-slate-900 group-hover:text-blue-600 transition-colors">
              Doctors
            </h4>
            <p className="text-[11px] text-slate-400 leading-tight mt-0.5">
              Doctors belong to departments
            </p>
          </div>

          <div
            onClick={() => navigate("/appointments")}
            className="p-3.5 bg-slate-50/60 hover:bg-blue-50/50 border border-slate-200/80 hover:border-blue-200 rounded-xl transition cursor-pointer group"
          >
            <div className="w-8 h-8 rounded-lg bg-blue-100 text-blue-600 flex items-center justify-center mb-2 group-hover:scale-105 transition-transform">
              <Calendar className="w-4 h-4" />
            </div>
            <h4 className="text-xs font-bold text-slate-900 group-hover:text-blue-600 transition-colors">
              Appointments
            </h4>
            <p className="text-[11px] text-slate-400 leading-tight mt-0.5">
              Book by department
            </p>
          </div>

          <div
            onClick={() => navigate("/ipd")}
            className="p-3.5 bg-slate-50/60 hover:bg-cyan-50/50 border border-slate-200/80 hover:border-cyan-200 rounded-xl transition cursor-pointer group"
          >
            <div className="w-8 h-8 rounded-lg bg-cyan-100 text-cyan-600 flex items-center justify-center mb-2 group-hover:scale-105 transition-transform">
              <Bed className="w-4 h-4" />
            </div>
            <h4 className="text-xs font-bold text-slate-900 group-hover:text-cyan-600 transition-colors">
              IPD & Wards
            </h4>
            <p className="text-[11px] text-slate-400 leading-tight mt-0.5">
              Wards under departments
            </p>
          </div>

          <div
            onClick={() => navigate("/billing")}
            className="p-3.5 bg-slate-50/60 hover:bg-teal-50/50 border border-slate-200/80 hover:border-teal-200 rounded-xl transition cursor-pointer group"
          >
            <div className="w-8 h-8 rounded-lg bg-teal-100 text-teal-600 flex items-center justify-center mb-2 group-hover:scale-105 transition-transform">
              <IndianRupee className="w-4 h-4" />
            </div>
            <h4 className="text-xs font-bold text-slate-900 group-hover:text-teal-600 transition-colors">
              Billing & Reports
            </h4>
            <p className="text-[11px] text-slate-400 leading-tight mt-0.5">
              Department-wise reports
            </p>
          </div>

          <div
            onClick={() => navigate("/pharmacy/inventory")}
            className="p-3.5 bg-slate-50/60 hover:bg-purple-50/50 border border-slate-200/80 hover:border-purple-200 rounded-xl transition cursor-pointer group"
          >
            <div className="w-8 h-8 rounded-lg bg-purple-100 text-purple-600 flex items-center justify-center mb-2 group-hover:scale-105 transition-transform">
              <Package className="w-4 h-4" />
            </div>
            <h4 className="text-xs font-bold text-slate-900 group-hover:text-purple-600 transition-colors">
              Inventory
            </h4>
            <p className="text-[11px] text-slate-400 leading-tight mt-0.5">
              Stock by department
            </p>
          </div>

          <div
            onClick={() => navigate("/laboratory")}
            className="p-3.5 bg-slate-50/60 hover:bg-indigo-50/50 border border-slate-200/80 hover:border-indigo-200 rounded-xl transition cursor-pointer group"
          >
            <div className="w-8 h-8 rounded-lg bg-indigo-100 text-indigo-600 flex items-center justify-center mb-2 group-hover:scale-105 transition-transform">
              <FlaskConical className="w-4 h-4" />
            </div>
            <h4 className="text-xs font-bold text-slate-900 group-hover:text-indigo-600 transition-colors">
              Laboratory
            </h4>
            <p className="text-[11px] text-slate-400 leading-tight mt-0.5">
              Tests by department
            </p>
          </div>
        </div>
      </div>

      {/* View Department Details Modal */}
      <DepartmentViewModal
        viewingDept={viewingDept}
        onClose={() => setViewingDept(null)}
        navigate={navigate}
      />

      {/* Assign / Change HOD Modal */}
      <DepartmentAssignHodModal
        department={assignHodDept}
        doctorList={doctorList}
        isOpen={!!assignHodDept}
        onClose={() => setAssignHodDept(null)}
        onAssign={handleAssignHod}
        submitting={submitting}
      />

      {/* Department Add/Edit Form Modal */}
      <Modal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        title={editingDept ? "Edit Department" : "Add New Department"}
        subtitle={editingDept ? "Update department details or assigned HOD" : "Create a new hospital department with unique code"}
      >
        <DepartmentForm
          defaultValues={editingDept}
          isEdit={!!editingDept}
          onSubmit={handleSubmit}
          onCancel={() => setModalOpen(false)}
          submitting={submitting}
        />
      </Modal>
    </div>
  );
}