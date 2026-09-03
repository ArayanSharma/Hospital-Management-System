import React from "react";
import {
  Calendar,
  Clock,
  IndianRupee,
  Award,
  BookOpen,
  FileText,
  Bed,
  CheckCircle2,
  Stethoscope,
  HeartPulse,
  Brain,
  Bone,
  Baby,
  Sparkles,
  Activity,
} from "lucide-react";
import Modal from "../../../../components/ui/Modal.jsx";

const getDepartmentBadge = (deptName) => {
  const name = deptName || "General Medicine";
  if (name.toLowerCase().includes("cardio")) {
    return { icon: HeartPulse, style: "bg-rose-50 text-rose-600 border-rose-200" };
  }
  if (name.toLowerCase().includes("neuro")) {
    return { icon: Brain, style: "bg-purple-50 text-purple-600 border-purple-200" };
  }
  if (name.toLowerCase().includes("ortho")) {
    return { icon: Bone, style: "bg-blue-50 text-blue-600 border-blue-200" };
  }
  if (name.toLowerCase().includes("pedia")) {
    return { icon: Baby, style: "bg-pink-50 text-pink-600 border-pink-200" };
  }
  if (name.toLowerCase().includes("derma")) {
    return { icon: Sparkles, style: "bg-amber-50 text-amber-600 border-amber-200" };
  }
  return { icon: Activity, style: "bg-emerald-50 text-emerald-600 border-emerald-200" };
};

export default function DoctorViewModal({ viewingDoctor, onClose, navigate }) {
  if (!viewingDoctor) return null;

  const deptInfo = getDepartmentBadge(viewingDoctor.departmentId?.name);
  const DeptIcon = deptInfo.icon;
  const docName = viewingDoctor.userId?.name || viewingDoctor.name || "Doctor";
  const docEmail = viewingDoctor.userId?.email || viewingDoctor.email || "N/A";
  const docPhone = viewingDoctor.userId?.phone || viewingDoctor.phone || "N/A";

  return (
    <Modal
      isOpen={!!viewingDoctor}
      onClose={onClose}
      title="Doctor Profile & Clinical Schedule"
      subtitle={`Detailed overview for Dr. ${docName}`}
      maxWidth="max-w-3xl"
    >
      <div className="space-y-5 text-xs">
        {/* Doctor Header Profile */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 bg-slate-50 border border-slate-200/80 rounded-2xl">
          <div className="flex items-center gap-3.5">
            <div className="relative">
              {viewingDoctor.photoUrl ? (
                <img
                  src={viewingDoctor.photoUrl}
                  alt={docName}
                  className="w-14 h-14 rounded-2xl object-cover border border-slate-200 shadow-sm"
                />
              ) : (
                <div className="w-14 h-14 rounded-2xl bg-blue-600 text-white font-black text-base flex items-center justify-center shadow-sm shadow-blue-500/20">
                  {docName ? docName.substring(0, 2).toUpperCase() : "DOC"}
                </div>
              )}
              <span className="absolute -bottom-1 -right-1 w-4 h-4 rounded-full bg-emerald-500 border-2 border-white"></span>
            </div>

            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base font-extrabold text-slate-900">Dr. {docName}</h3>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-extrabold bg-blue-50 text-blue-700 border border-blue-200">
                  {viewingDoctor.doctorId || viewingDoctor._id}
                </span>
              </div>

              <div className="flex items-center gap-2 mt-1">
                <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-bold border ${deptInfo.style}`}>
                  <DeptIcon className="w-3 h-3" />
                  <span>{viewingDoctor.departmentId?.name || "General Medicine"}</span>
                </span>
                <span className="text-slate-400">•</span>
                <span className="text-xs font-semibold text-slate-600">
                  {viewingDoctor.specialization || "General Physician"}
                </span>
              </div>
            </div>
          </div>

          <div className="flex sm:flex-col items-center sm:items-end justify-between sm:justify-center border-t sm:border-t-0 pt-3 sm:pt-0 border-slate-200/70">
            <span className="text-[11px] font-medium text-slate-400">Consultation Fee</span>
            <div className="flex items-center text-lg font-black text-slate-900">
              <IndianRupee className="w-4 h-4 text-emerald-600 stroke-[3]" />
              <span>{viewingDoctor.consultationFee || 500}</span>
            </div>
          </div>
        </div>

        {/* Credentials Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div className="p-3.5 bg-white border border-slate-200/80 rounded-xl shadow-2xs">
            <div className="flex items-center gap-2 text-slate-400 mb-1">
              <BookOpen className="w-4 h-4 text-blue-500" />
              <span className="text-[10px] font-bold uppercase tracking-wider">Qualification</span>
            </div>
            <p className="font-extrabold text-slate-800">{viewingDoctor.qualification || "MBBS, MD"}</p>
          </div>

          <div className="p-3.5 bg-white border border-slate-200/80 rounded-xl shadow-2xs">
            <div className="flex items-center gap-2 text-slate-400 mb-1">
              <Award className="w-4 h-4 text-amber-500" />
              <span className="text-[10px] font-bold uppercase tracking-wider">Experience</span>
            </div>
            <p className="font-extrabold text-slate-800">{viewingDoctor.experience || 5} Years Clinical</p>
          </div>

          <div className="p-3.5 bg-white border border-slate-200/80 rounded-xl shadow-2xs">
            <div className="flex items-center gap-2 text-slate-400 mb-1">
              <CheckCircle2 className="w-4 h-4 text-emerald-500" />
              <span className="text-[10px] font-bold uppercase tracking-wider">Contact Details</span>
            </div>
            <p className="font-bold text-slate-800 truncate">{docPhone}</p>
            <p className="text-[11px] text-slate-500 truncate">{docEmail}</p>
          </div>
        </div>

        {/* Weekly Availability Schedule */}
        <div className="bg-slate-50/70 border border-slate-200/80 rounded-2xl p-4 space-y-3">
          <h4 className="text-xs font-extrabold text-slate-900 flex items-center gap-2">
            <Clock className="w-4 h-4 text-blue-600" />
            <span>OPD Weekly Availability & Timing</span>
          </h4>

          {viewingDoctor.availability && viewingDoctor.availability.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {viewingDoctor.availability.map((slot, idx) => (
                <div key={idx} className="flex items-center justify-between p-2.5 bg-white border border-slate-200/60 rounded-xl">
                  <div className="flex items-center gap-2 font-semibold text-slate-700">
                    <Calendar className="w-3.5 h-3.5 text-slate-400" />
                    <span>{slot.day}</span>
                  </div>
                  <span className="font-bold text-blue-700 bg-blue-50 px-2 py-0.5 rounded-md text-[11px]">
                    {slot.startTime} - {slot.endTime}
                  </span>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-slate-400 italic">No custom schedule set. Default OPD: Mon - Sat (09:00 AM - 05:00 PM)</p>
          )}
        </div>

        {/* Quick Nav Shortcuts */}
        <div className="grid grid-cols-3 gap-3">
          <div
            onClick={() => {
              onClose();
              navigate("/appointments");
            }}
            className="p-3 bg-slate-50/60 hover:bg-blue-50/50 border border-slate-200/80 hover:border-blue-200 rounded-xl transition cursor-pointer group"
          >
            <div className="w-8 h-8 rounded-lg bg-blue-100 text-blue-600 flex items-center justify-center mb-1.5 group-hover:scale-105 transition-transform">
              <Calendar className="w-4 h-4" />
            </div>
            <h4 className="text-xs font-bold text-slate-900 group-hover:text-blue-600 transition-colors">
              Appointments
            </h4>
            <p className="text-[11px] text-slate-400 leading-tight mt-0.5">Manage OPD slots</p>
          </div>

          <div
            onClick={() => {
              onClose();
              navigate("/pharmacy/medicines");
            }}
            className="p-3 bg-slate-50/60 hover:bg-rose-50/50 border border-slate-200/80 hover:border-rose-200 rounded-xl transition cursor-pointer group"
          >
            <div className="w-8 h-8 rounded-lg bg-rose-100 text-rose-600 flex items-center justify-center mb-1.5 group-hover:scale-105 transition-transform">
              <FileText className="w-4 h-4" />
            </div>
            <h4 className="text-xs font-bold text-slate-900 group-hover:text-rose-600 transition-colors">
              Prescriptions
            </h4>
            <p className="text-[11px] text-slate-400 leading-tight mt-0.5">Medicines & orders</p>
          </div>

          <div
            onClick={() => {
              onClose();
              navigate("/ipd");
            }}
            className="p-3 bg-slate-50/60 hover:bg-purple-50/50 border border-slate-200/80 hover:border-purple-200 rounded-xl transition cursor-pointer group"
          >
            <div className="w-8 h-8 rounded-lg bg-purple-100 text-purple-600 flex items-center justify-center mb-1.5 group-hover:scale-105 transition-transform">
              <Bed className="w-4 h-4" />
            </div>
            <h4 className="text-xs font-bold text-slate-900 group-hover:text-purple-600 transition-colors">
              IPD Admissions
            </h4>
            <p className="text-[11px] text-slate-400 leading-tight mt-0.5">Assigned wards</p>
          </div>
        </div>
      </div>
    </Modal>
  );
}
