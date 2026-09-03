import React, { useState, useEffect } from "react";
import { useForm, useWatch } from "react-hook-form";
import { CheckCircle2 } from "lucide-react";
import { createOPDVisitApi, updateOPDVisitApi } from "../services/opdVisit.api.js";
import { useDoctorOptions } from "../../../hooks/useDoctorOptions.js";
import { useDepartmentOptions } from "../../../hooks/useDepartmentOptions.js";
import { getAppointmentsApi } from "../../appointments/services/appointment.api.js";
import api from "../../../lib/axios.js";

import OpdVisitTypeSelector from "./form/OpdVisitTypeSelector.jsx";
import OpdPatientInfoSection from "./form/OpdPatientInfoSection.jsx";
import OpdDoctorDeptSection from "./form/OpdDoctorDeptSection.jsx";
import OpdVisitInfoSection from "./form/OpdVisitInfoSection.jsx";
import OpdSymptomsSection from "./form/OpdSymptomsSection.jsx";
import OpdVitalsSection from "./form/OpdVitalsSection.jsx";

export default function OpdVisitFormModal({ isOpen, onClose, onSuccess, defaultValues, isEdit }) {
  const [visitType, setVisitType] = useState("walk-in");
  const [selectedDept, setSelectedDept] = useState("");
  const [selectedPatientDetails, setSelectedPatientDetails] = useState(null);
  const [appointmentsList, setAppointmentsList] = useState([]);
  const [submitting, setSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const { departments: rawDepts } = useDepartmentOptions();
  const deptList = Array.isArray(rawDepts) ? rawDepts : rawDepts?.departments || [];

  const { doctors: rawDoctors, loading: loadingDoctors } = useDoctorOptions(selectedDept);
  const doctorList = Array.isArray(rawDoctors) ? rawDoctors : rawDoctors?.doctors || [];

  const defaultDateTime = new Date().toISOString().slice(0, 16);

  const {
    register,
    handleSubmit,
    control,
    setValue,
    reset,
    watch,
    formState: { errors },
  } = useForm({
    defaultValues: {
      patientId: "",
      departmentId: "",
      doctorId: "",
      appointmentId: "",
      symptoms: "",
      notes: "",
      visitDate: defaultDateTime,
      temp: "98.6",
      bp: "120/80",
      pulse: "78",
      weight: "65.2",
      height: "165",
      spO2: "98",
    },
  });

  useEffect(() => {
    if (defaultValues) {
      reset({
        patientId: defaultValues.patientId?._id || defaultValues.patientId || "",
        doctorId: defaultValues.doctorId?._id || defaultValues.doctorId || "",
        departmentId: defaultValues.departmentId?._id || defaultValues.departmentId || "",
        symptoms: defaultValues.symptoms || "",
        notes: defaultValues.notes || "",
        visitDate: defaultValues.visitDate ? new Date(defaultValues.visitDate).toISOString().slice(0, 16) : defaultDateTime,
        temp: defaultValues.vitals?.temperature || "98.6",
        bp: defaultValues.vitals?.bloodPressure || "120/80",
        pulse: defaultValues.vitals?.pulse || "78",
        weight: defaultValues.vitals?.weight || "65.2",
        height: defaultValues.vitals?.height || "165",
        spO2: defaultValues.vitals?.spO2 || "98",
      });
      if (defaultValues.doctorId?.departmentId?._id || defaultValues.departmentId) {
        setSelectedDept(defaultValues.doctorId?.departmentId?._id || defaultValues.departmentId);
      }
    }
  }, [defaultValues, reset, defaultDateTime]);

  const watchPatientId = useWatch({ control, name: "patientId" });
  const watchSymptoms = watch("symptoms") || "";
  const watchNotes = watch("notes") || "";

  useEffect(() => {
    if (!watchPatientId) {
      setSelectedPatientDetails(null);
      return;
    }
    const fetchPatient = async () => {
      try {
        const { data } = await api.get(`/patients/${watchPatientId}`);
        setSelectedPatientDetails(data.data);
      } catch (err) {
        setSelectedPatientDetails(null);
      }
    };
    fetchPatient();
  }, [watchPatientId]);

  useEffect(() => {
    if (visitType === "appointment") {
      const fetchAppts = async () => {
        try {
          const { data } = await getAppointmentsApi({ status: "scheduled", limit: 20 });
          setAppointmentsList(data.data?.appointments || []);
        } catch (err) {
          setAppointmentsList([]);
        }
      };
      fetchAppts();
    }
  }, [visitType]);

  if (!isOpen) return null;

  const handleFormSubmit = async (formData) => {
    setSubmitting(true);
    setErrorMsg("");
    try {
      const payload = {
        patientId: formData.patientId,
        doctorId: formData.doctorId,
        appointmentId: formData.appointmentId || null,
        visitType: visitType,
        symptoms: formData.symptoms || "Routine OPD Consultation",
        notes: formData.notes || "",
        visitDate: formData.visitDate,
        vitals: {
          temperature: parseFloat(formData.temp) || 98.6,
          bloodPressure: formData.bp || "120/80",
          pulse: parseInt(formData.pulse, 10) || 78,
          weight: parseFloat(formData.weight) || 65.2,
          height: parseFloat(formData.height) || 165,
          spO2: parseInt(formData.spO2, 10) || 98,
        },
      };

      if (isEdit && defaultValues?._id) {
        await updateOPDVisitApi(defaultValues._id, payload);
      } else {
        await createOPDVisitApi(payload);
      }

      reset();
      onClose();
      if (onSuccess) onSuccess();
    } catch (err) {
      setErrorMsg(err.response?.data?.message || "Failed to save OPD Visit");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white rounded-2xl border border-slate-200/90 shadow-xl max-w-2xl w-full p-5 space-y-4 my-8 max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <div>
            <h3 className="text-base font-bold text-slate-900">
              {isEdit ? "Edit OPD Visit" : "New OPD Visit (Walk-in / Appointment)"}
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">
              {isEdit ? "Update existing OPD visit record" : "Create a new OPD visit for the patient"}
            </p>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-700 text-sm font-semibold cursor-pointer"
          >
            ✕
          </button>
        </div>

        <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-4">
          <OpdVisitTypeSelector visitType={visitType} setVisitType={setVisitType} />

          <OpdPatientInfoSection
            control={control}
            errors={errors}
            selectedPatientDetails={selectedPatientDetails}
          />

          <OpdDoctorDeptSection
            register={register}
            errors={errors}
            loadingDoctors={loadingDoctors}
            doctorList={doctorList}
            selectedDept={selectedDept}
            setSelectedDept={setSelectedDept}
            setValue={setValue}
            deptList={deptList}
          />

          <OpdVisitInfoSection
            register={register}
            visitType={visitType}
            setVisitType={setVisitType}
            appointmentsList={appointmentsList}
          />

          <OpdSymptomsSection
            register={register}
            watchSymptoms={watchSymptoms}
            watchNotes={watchNotes}
          />

          <OpdVitalsSection register={register} />

          {errorMsg && (
            <div className="p-3 bg-rose-50 border border-rose-200 text-rose-700 text-xs rounded-xl font-medium">
              {errorMsg}
            </div>
          )}

          <div className="pt-2 border-t border-slate-100 flex items-center justify-between">
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold transition cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="px-6 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold shadow-sm shadow-blue-500/20 transition cursor-pointer flex items-center gap-1.5 disabled:opacity-50"
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>{submitting ? "Saving..." : isEdit ? "Update OPD Visit" : "Create OPD Visit"}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
