import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDoctorOptions } from "../../../hooks/useDoctorOptions.js";
import { createRadiologyTestApi } from "../services/radiologyTest.api.js";
import api from "../../../lib/axios.js";

export function useRadiologyTestOrder({ onClose, onSuccess }) {
  const navigate = useNavigate();
  const [submitting, setSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  // Section 1: Patient Selection & Metadata
  const [selectedPatientId, setSelectedPatientId] = useState("");
  const [patientDetails, setPatientDetails] = useState({
    patientId: "Auto generated",
    ageGender: "Select",
    phone: "",
  });

  // Section 2: Order Information
  const [doctorId, setDoctorId] = useState("");
  const [visitType, setVisitType] = useState("OPD Visit");
  const [orderDateTime, setOrderDateTime] = useState("2026-05-26T11:30");
  const [priority, setPriority] = useState("routine");

  // Section 3: Test / Scan Details
  const [modality, setModality] = useState("");
  const [bodyRegion, setBodyRegion] = useState("");
  const [clinicalInstructions, setClinicalInstructions] = useState("");
  const [checkedTests, setCheckedTests] = useState({
    CBC: false,
    "Lipid Profile": false,
    "Thyroid Profile": false,
    "Kidney Function Test": false,
    Other: false,
  });
  const [otherTestText, setOtherTestText] = useState("");

  // Section 4: Schedule
  const [scheduledDateTime, setScheduledDateTime] = useState("");
  const [locationRoom, setLocationRoom] = useState("Radiology Room 1");

  // Section 5: Attachments
  const [fileName, setFileName] = useState("");

  const { doctors: rawDoctors, loading: loadingDoctors } = useDoctorOptions("");
  const doctorList = Array.isArray(rawDoctors) ? rawDoctors : rawDoctors?.doctors || [];

  // Patient Select Handler
  const handlePatientSelect = async (patientId) => {
    setSelectedPatientId(patientId);
    if (!patientId) {
      setPatientDetails({ patientId: "Auto generated", ageGender: "Select", phone: "" });
      return;
    }
    try {
      const { data } = await api.get(`/patients/${patientId}`);
      const p = data.data;
      if (p) {
        let age = 32;
        if (p.dateOfBirth) {
          const dob = new Date(p.dateOfBirth);
          if (!isNaN(dob.getTime())) {
            age = Math.abs(new Date(Date.now() - dob.getTime()).getUTCFullYear() - 1970);
          }
        }
        const g = p.gender ? p.gender.charAt(0).toUpperCase() + p.gender.slice(1) : "Male";
        setPatientDetails({
          patientId: p.patientId || "PAT-000123",
          ageGender: `${age} Y / ${g}`,
          phone: p.phone || "9876543210",
        });
      }
    } catch {
      setPatientDetails({ patientId: "PAT-000123", ageGender: "32 Y / Male", phone: "9876543210" });
    }
  };

  const handleCheckboxChange = (name) => {
    setCheckedTests((prev) => ({ ...prev, [name]: !prev[name] }));
  };

  const handleNewPatientClick = () => {
    onClose();
    navigate("/patients?new=true");
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    if (!selectedPatientId) {
      setErrorMsg("Please select a patient.");
      return;
    }
    if (!doctorId) {
      setErrorMsg("Please select a referring doctor.");
      return;
    }
    if (!modality) {
      setErrorMsg("Please select scan modality.");
      return;
    }
    if (!bodyRegion) {
      setErrorMsg("Please select body region.");
      return;
    }

    setSubmitting(true);
    setErrorMsg("");

    const selectedAdditional = Object.keys(checkedTests).filter((k) => k !== "Other" && checkedTests[k]);
    if (checkedTests.Other && otherTestText) {
      selectedAdditional.push(otherTestText);
    }

    try {
      await createRadiologyTestApi({
        patientId: selectedPatientId,
        doctorId,
        visitType,
        modality,
        bodyRegion,
        testType: modality,
        bodyPart: bodyRegion,
        priority,
        clinicalInstructions: clinicalInstructions || "",
        additionalTests: selectedAdditional,
        scheduledAt: scheduledDateTime || orderDateTime,
        locationRoom,
        requestedAt: orderDateTime,
        attachmentUrl: fileName || null,
      });

      onClose();
      if (onSuccess) onSuccess();
      alert("Radiology scan order placed successfully!");
    } catch (err) {
      setErrorMsg(err.response?.data?.message || "Failed to place radiology order.");
    } finally {
      setSubmitting(false);
    }
  };

  return {
    submitting,
    errorMsg,
    selectedPatientId,
    patientDetails,
    doctorId,
    setDoctorId,
    doctorList,
    loadingDoctors,
    visitType,
    setVisitType,
    orderDateTime,
    setOrderDateTime,
    priority,
    setPriority,
    modality,
    setModality,
    bodyRegion,
    setBodyRegion,
    clinicalInstructions,
    setClinicalInstructions,
    checkedTests,
    otherTestText,
    setOtherTestText,
    scheduledDateTime,
    setScheduledDateTime,
    locationRoom,
    setLocationRoom,
    fileName,
    setFileName,
    handlePatientSelect,
    handleCheckboxChange,
    handleNewPatientClick,
    handleFormSubmit,
  };
}
