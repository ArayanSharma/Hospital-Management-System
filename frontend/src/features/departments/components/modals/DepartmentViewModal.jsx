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
  Printer,
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
  const rawHodName = hodDoctor?.userId?.name || hodDoctor?.name;
  const hodName = rawHodName ? (rawHodName.startsWith("Dr.") ? rawHodName : `Dr. ${rawHodName}`) : null;
  const hodSpec = hodDoctor?.specialization || "Head Doctor";

  const nameStr = viewingDept.name || "Unnamed Department";
  const codeStr = viewingDept.code || "DEPT-N/A";
  const descStr = viewingDept.description || "No description recorded for this department unit.";
  const statusStr = (viewingDept.status || "Active").toUpperCase();

  const handlePrint = () => {
    window.print();
  };

  return (
    <Modal
      isOpen={!!viewingDept}
      onClose={onClose}
      title="Department Overview & Clinical Management"
      subtitle={`Detailed status & head doctor record for ${nameStr}`}
      maxWidth="max-w-3xl"
    >
      <div className="space-y-4 text-xs text-slate-700 font-medium">
        {/* Printable Action Bar (Hidden during print) */}
        <div className="flex items-center justify-between p-3 bg-slate-50 border border-slate-200/80 rounded-2xl print:hidden">
          <div className="flex items-center gap-2 text-slate-600 text-xs font-semibold">
            <Printer className="w-4 h-4 text-blue-600" />
            <span>Ready to print official Hospital Department Specification Sheet</span>
          </div>
          <button
            type="button"
            onClick={handlePrint}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold shadow-md shadow-blue-500/20 transition cursor-pointer flex items-center gap-2 active:scale-95"
          >
            <Printer className="w-4 h-4" />
            <span>Print Department Sheet</span>
          </button>
        </div>

        {/* PRINTABLE CONTAINER (Target for @media print CSS) */}
        <div
          id="printable-department-detail"
          className="bg-white p-6 rounded-2xl border border-slate-200/80 text-slate-900 text-xs space-y-5 shadow-xs"
        >
          {/* Hospital Letterhead Header */}
          <div className="flex items-start justify-between border-b-2 border-blue-600 pb-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-blue-600 text-white flex items-center justify-center font-black text-xl shadow-md">
                <Building2 className="w-7 h-7" />
              </div>
              <div>
                <h1 className="text-lg font-extrabold text-blue-700 uppercase tracking-tight">
                  CityCare Hospital &amp; Medical Research Center
                </h1>
                <p className="text-[11px] font-semibold text-slate-500">
                  Hospital Administration &amp; Clinical Departments Directory
                </p>
                <p className="text-[10px] text-slate-400 font-mono">
                  Department Code: {codeStr}
                </p>
              </div>
            </div>

            <div className="text-right">
              <div className="inline-block px-3 py-1 bg-blue-50 text-blue-700 border border-blue-200 rounded-full font-black text-[11px] tracking-wider uppercase mb-1">
                Department Master Data
              </div>
              <p className="text-[11px] font-bold text-slate-700 font-mono">{codeStr}</p>
              <p className="text-[10px] text-slate-400 font-medium">{new Date().toLocaleDateString()}</p>
            </div>
          </div>

          {/* Department Main Info */}
          <div className="grid grid-cols-2 gap-4 bg-slate-50 p-4 rounded-xl border border-slate-200/70 text-xs">
            <div className="space-y-1 border-r border-slate-200/80 pr-4">
              <span className="text-[10px] font-extrabold text-blue-700 uppercase tracking-wider">Department Details</span>
              <p className="font-extrabold text-slate-900 text-base pt-0.5">{nameStr}</p>
              <p className="text-[11px] font-mono font-bold text-blue-600">Code: {codeStr}</p>
              <p className="text-[11px] text-slate-500">Status: <span className="font-extrabold text-emerald-600">{statusStr}</span></p>
            </div>

            <div className="space-y-1 pl-2">
              <span className="text-[10px] font-extrabold text-purple-700 uppercase tracking-wider">Head of Department (HOD)</span>
              {hodName ? (
                <div>
                  <p className="font-extrabold text-slate-900 text-sm pt-0.5">{hodName}</p>
                  <p className="text-[11px] font-semibold text-purple-700">{hodSpec}</p>
                </div>
              ) : (
                <p className="text-slate-400 font-semibold italic pt-1">— Not Assigned —</p>
              )}
            </div>
          </div>

          {/* Description */}
          <div>
            <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-2 flex items-center gap-1.5 border-b border-slate-200 pb-1">
              <FileText className="w-4 h-4 text-slate-600" />
              <span>Department Overview &amp; Clinical Scope</span>
            </h3>
            <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-xl">
              <p className="font-medium text-slate-800 leading-relaxed">{descStr}</p>
            </div>
          </div>

          {/* Signatures & Footer */}
          <div className="pt-8 flex items-end justify-between border-t border-slate-200">
            <div className="space-y-0.5 text-[10px] text-slate-400">
              <p className="font-semibold text-slate-600">Record Verification:</p>
              <p>• Official department specification from CityCare Hospital EMR System.</p>
              <p>• Record printed on {new Date().toLocaleString()}</p>
            </div>

            <div className="text-center space-y-1">
              <div className="w-36 border-b-2 border-slate-400 pb-1 font-serif text-slate-600 italic">
                {hodName || "Medical Superintendent"}
              </div>
              <p className="font-extrabold text-slate-900 text-[10px]">Head of Department / Administrator Signature</p>
            </div>
          </div>
        </div>

        {/* Quick Nav Shortcuts (Hidden during print) */}
        <div className="grid grid-cols-3 gap-3 pt-1 print:hidden">
          <div
            onClick={() => {
              onClose();
              if (navigate) navigate(`/doctors?departmentId=${viewingDept._id}`);
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
              if (navigate) navigate(`/patients?departmentId=${viewingDept._id}`);
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
              if (navigate) navigate(`/appointments?departmentId=${viewingDept._id}`);
            }}
            className="p-3 bg-slate-50/60 hover:bg-purple-50/50 border border-slate-200/80 hover:border-purple-200 rounded-xl transition cursor-pointer group"
          >
            <div className="w-8 h-8 rounded-lg bg-purple-100 text-purple-600 flex items-center justify-center mb-1.5 group-hover:scale-105 transition-transform">
              <Calendar className="w-4 h-4" />
            </div>
            <h4 className="text-xs font-bold text-slate-900 group-hover:text-purple-600 transition-colors">
              Appointments
            </h4>
            <p className="text-[11px] text-slate-400 leading-tight mt-0.5">Bookings &amp; slots</p>
          </div>
        </div>

        {/* Footer Close Button */}
        <div className="pt-2 flex justify-end print:hidden">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold transition cursor-pointer"
          >
            Close
          </button>
        </div>
      </div>
    </Modal>
  );
}
