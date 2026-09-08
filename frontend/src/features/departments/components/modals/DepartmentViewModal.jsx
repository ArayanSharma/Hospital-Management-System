import React from "react";
import {
  Building2,
  UserCheck,
  Users,
  Calendar,
  IndianRupee,
  Bed,
  FileText,
  FlaskConical,
  Activity,
  HeartPulse,
  Brain,
  Bone,
  Baby,
  Ambulance,
  Wind,
} from "lucide-react";
import Modal from "../../../../components/ui/Modal.jsx";

const getDepartmentMeta = (deptName, deptCode) => {
  const name = deptName ? deptName.toLowerCase() : "";
  const code = deptCode ? deptCode.toLowerCase() : "";

  if (name.includes("cardio") || code.includes("card")) {
    return { icon: HeartPulse, iconStyle: "bg-rose-50 text-rose-600 border-rose-200" };
  }
  if (name.includes("neuro") || code.includes("neuro")) {
    return { icon: Brain, iconStyle: "bg-purple-50 text-purple-600 border-purple-200" };
  }
  if (name.includes("ortho") || code.includes("ortho")) {
    return { icon: Bone, iconStyle: "bg-blue-50 text-blue-600 border-blue-200" };
  }
  if (name.includes("pedia") || code.includes("ped")) {
    return { icon: Baby, iconStyle: "bg-pink-50 text-pink-600 border-pink-200" };
  }
  if (name.includes("emergency") || code.includes("emrg")) {
    return { icon: Ambulance, iconStyle: "bg-rose-50 text-rose-600 border-rose-200" };
  }
  if (name.includes("pulmo") || code.includes("pulmo")) {
    return { icon: Wind, iconStyle: "bg-cyan-50 text-cyan-600 border-cyan-200" };
  }
  return { icon: Activity, iconStyle: "bg-teal-50 text-teal-600 border-teal-200" };
};

export default function DepartmentViewModal({ viewingDept, onClose, navigate }) {
  if (!viewingDept) return null;

  const meta = getDepartmentMeta(viewingDept.name, viewingDept.code);
  const DeptIcon = meta.icon;
  const hodDoctor = viewingDept.headDoctorId;
  const hodName = hodDoctor?.userId?.name || hodDoctor?.name;
  const hodSpec = hodDoctor?.specialization || "Head Doctor";

  return (
    <Modal
      isOpen={!!viewingDept}
      onClose={onClose}
      title="Department Overview & Clinical Management"
      subtitle={`Detailed status & head doctor record for ${viewingDept.name}`}
      maxWidth="max-w-2xl"
    >
      <div className="space-y-4 text-xs">
        {/* Header Badge */}
        <div className="flex items-center justify-between p-4 bg-slate-50 border border-slate-200/80 rounded-2xl">
          <div className="flex items-center gap-3.5">
            <div className={`w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 border ${meta.iconStyle}`}>
              <DeptIcon className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base font-extrabold text-slate-900">{viewingDept.name}</h3>
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase bg-blue-50 text-blue-700 border border-blue-200">
                  {viewingDept.code}
                </span>
              </div>
              <p className="text-slate-500 font-medium text-[11px] mt-0.5">
                {viewingDept.status === "inactive" ? "Inactive Unit" : "Operational Hospital Department"}
              </p>
            </div>
          </div>

          <span className={`px-3 py-1 rounded-full text-xs font-bold ${viewingDept.status === 'inactive' ? 'bg-slate-100 text-slate-500 border border-slate-200' : 'bg-emerald-50 text-emerald-600 border border-emerald-200'}`}>
            {viewingDept.status === 'inactive' ? 'Inactive' : 'Active Department'}
          </span>
        </div>

        {/* Head of Department Info */}
        <div className="p-4 bg-white border border-slate-200/80 rounded-2xl shadow-2xs space-y-2">
          <span className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider">Head of Department (HOD)</span>
          {hodName ? (
            <div className="flex items-center gap-3 pt-1">
              {hodDoctor.photoUrl ? (
                <img
                  src={hodDoctor.photoUrl}
                  alt={hodName}
                  className="w-10 h-10 rounded-full object-cover border border-slate-200 shrink-0"
                />
              ) : (
                <div className="w-10 h-10 rounded-full bg-blue-100 text-blue-700 font-bold text-xs flex items-center justify-center shrink-0">
                  {hodName.replace("Dr. ", "").substring(0, 2).toUpperCase()}
                </div>
              )}
              <div>
                <p className="font-extrabold text-slate-900 text-sm">{hodName}</p>
                <p className="text-[11px] font-semibold text-slate-500">{hodSpec}</p>
              </div>
            </div>
          ) : (
            <p className="text-slate-400 font-semibold italic pt-1">No Head of Department currently assigned.</p>
          )}
        </div>

        {/* Department Description */}
        <div className="p-4 bg-slate-50 border border-slate-200/80 rounded-2xl">
          <span className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider">Department Description</span>
          <p className="font-semibold text-slate-800 leading-relaxed mt-1">
            {viewingDept.description || "No description provided for this department unit."}
          </p>
        </div>

        {/* Quick Nav Shortcuts */}
        <div className="grid grid-cols-3 gap-3 pt-1">
          <div
            onClick={() => {
              onClose();
              navigate(`/doctors?departmentId=${viewingDept._id}`);
            }}
            className="p-3 bg-slate-50/60 hover:bg-blue-50/50 border border-slate-200/80 hover:border-blue-200 rounded-xl transition cursor-pointer group"
          >
            <div className="w-8 h-8 rounded-lg bg-blue-100 text-blue-600 flex items-center justify-center mb-1.5 group-hover:scale-105 transition-transform">
              <Users className="w-4 h-4" />
            </div>
            <h4 className="text-xs font-bold text-slate-900 group-hover:text-blue-600 transition-colors">
              Manage Doctors
            </h4>
            <p className="text-[11px] text-slate-400 leading-tight mt-0.5">Assigned staff</p>
          </div>

          <div
            onClick={() => {
              onClose();
              navigate(`/patients?departmentId=${viewingDept._id}`);
            }}
            className="p-3 bg-slate-50/60 hover:bg-indigo-50/50 border border-slate-200/80 hover:border-indigo-200 rounded-xl transition cursor-pointer group"
          >
            <div className="w-8 h-8 rounded-lg bg-indigo-100 text-indigo-600 flex items-center justify-center mb-1.5 group-hover:scale-105 transition-transform">
              <Users className="w-4 h-4" />
            </div>
            <h4 className="text-xs font-bold text-slate-900 group-hover:text-indigo-600 transition-colors">
              View Patients
            </h4>
            <p className="text-[11px] text-slate-400 leading-tight mt-0.5">Department patients</p>
          </div>

          <div
            onClick={() => {
              onClose();
              navigate(`/appointments?departmentId=${viewingDept._id}`);
            }}
            className="p-3 bg-slate-50/60 hover:bg-purple-50/50 border border-slate-200/80 hover:border-purple-200 rounded-xl transition cursor-pointer group"
          >
            <div className="w-8 h-8 rounded-lg bg-purple-100 text-purple-600 flex items-center justify-center mb-1.5 group-hover:scale-105 transition-transform">
              <Calendar className="w-4 h-4" />
            </div>
            <h4 className="text-xs font-bold text-slate-900 group-hover:text-purple-600 transition-colors">
              Appointments
            </h4>
            <p className="text-[11px] text-slate-400 leading-tight mt-0.5">Bookings & slots</p>
          </div>
        </div>
      </div>
    </Modal>
  );
}
