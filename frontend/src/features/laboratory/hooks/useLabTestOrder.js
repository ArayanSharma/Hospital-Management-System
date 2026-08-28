import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDoctorOptions } from "../../../hooks/useDoctorOptions.js";
import { createLabTestApi } from "../services/labTest.api.js";
import { INITIAL_ADDITIONAL_TESTS } from "../constants/labConstants.js";
import api from "../../../lib/axios.js";

export function useLabTestOrder({ onClose, onSuccess }) {
  const navigate = useNavigate();
  const [submitting, setSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  // Patient Selection & Details State
  const [selectedPatientId, setSelectedPatientId] = useState("");
  const [patientDetails, setPatientDetails] = useState({
    patientId: "Auto generated",
    ageGender: "Select",
    phone: "",
  });

  // Order Details State
  const [orderDateTime, setOrderDateTime] = useState("2026-05-26T11:30");
  const [doctorId, setDoctorId] = useState("");
  const [priority, setPriority] = useState("routine");
  const [visitType, setVisitType] = useState("OPD Visit");

  // Test Selection State
  const [testName, setTestName] = useState("Lipid Profile");
  const [sampleType, setSampleType] = useState("Blood");

  // Additional Tests State
  const [checkedTests, setCheckedTests] = useState(INITIAL_ADDITIONAL_TESTS);
  const [otherTestText, setOtherTestText] = useState("");

  // Notes & Attachment State
  const [clinicalNotes, setClinicalNotes] = useState("");
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
        const g = p.gender ? p.gender.charAt(0).toUpperCase() + p.gender.slice(1) : "Female";
        setPatientDetails({
          patientId: p.patientId || "PAT-000124",
          ageGender: `${age} Y / ${g}`,
          phone: p.phone || "9876543210",
        });
      }
    } catch {
      setPatientDetails({ patientId: "PAT-000124", ageGender: "32 Y / Female", phone: "9876543210" });
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

    setSubmitting(true);
    setErrorMsg("");

    const selectedAdditional = Object.keys(checkedTests).filter((k) => k !== "Other" && checkedTests[k]);
    if (checkedTests.Other && otherTestText) {
      selectedAdditional.push(otherTestText);
    }

    try {
      await createLabTestApi({
        patientId: selectedPatientId,
        doctorId,
        testName,
        sampleType,
        priority,
        visitType,
        requestedAt: orderDateTime,
        additionalTests: selectedAdditional,
        clinicalNotes: clinicalNotes || "",
      });

      onClose();
      if (onSuccess) onSuccess();
      alert("Lab test order placed successfully!");
    } catch (err) {
      setErrorMsg(err.response?.data?.message || "Failed to place lab test order.");
    } finally {
      setSubmitting(false);
    }
  };

  return {
    submitting,
    errorMsg,
    selectedPatientId,
    patientDetails,
    orderDateTime,
    setOrderDateTime,
    doctorId,
    setDoctorId,
    priority,
    setPriority,
    visitType,
    setVisitType,
    testName,
    setTestName,
    sampleType,
    setSampleType,
    checkedTests,
    otherTestText,
    setOtherTestText,
    clinicalNotes,
    setClinicalNotes,
    fileName,
    setFileName,
    doctorList,
    loadingDoctors,
    handlePatientSelect,
    handleCheckboxChange,
    handleNewPatientClick,
    handleFormSubmit,
  };
}
