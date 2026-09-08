import { useState } from "react";
import { getPatientByIdApi } from "../../patients/services/patient.api.js";

export function useAddPolicyForm(onSubmit, onClose) {
  // Section 1: Patient Info
  const [patientId, setPatientId] = useState("");
  const [patientDisplay, setPatientDisplay] = useState("");
  const [uhid, setUhid] = useState("");
  const [dateOfBirth, setDateOfBirth] = useState("");
  const [mobileNumber, setMobileNumber] = useState("");

  // Section 2: Policy Details
  const [providerName, setProviderName] = useState("Star Health & Allied Insurance Co. Ltd.");
  const [policyNumber, setPolicyNumber] = useState("");
  const [policyType, setPolicyType] = useState("Individual Health");
  const [tpaName, setTpaName] = useState("Health India TPA Services Pvt. Ltd.");
  const [sumInsured, setSumInsured] = useState("");
  const [currency, setCurrency] = useState("INR");

  const [validFrom, setValidFrom] = useState(() => {
    const today = new Date();
    return today.toISOString().split("T")[0];
  });
  const [validUntil, setValidUntil] = useState(() => {
    const nextYear = new Date();
    nextYear.setFullYear(nextYear.getFullYear() + 1);
    return nextYear.toISOString().split("T")[0];
  });

  const [status, setStatus] = useState("Active");
  const [renewalDate, setRenewalDate] = useState(() => {
    const nextYear = new Date();
    nextYear.setFullYear(nextYear.getFullYear() + 1);
    return nextYear.toISOString().split("T")[0];
  });
  const [employer, setEmployer] = useState("");
  const [relationship, setRelationship] = useState("Self");
  const [notes, setNotes] = useState("");

  // Section 3: Documents
  const [documents, setDocuments] = useState({
    policyDoc: null,
    cardFront: null,
    cardBack: null,
    otherDoc: null,
  });

  const [submitting, setSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const handlePatientSelect = async (pId, pName) => {
    setPatientId(pId);
    setPatientDisplay(pName);
    if (!pName || !pId) {
      setUhid("");
      setDateOfBirth("");
      setMobileNumber("");
      return;
    }

    if (pName.includes(" (")) {
      const match = pName.match(/\((.*?)\)/);
      if (match) setUhid(match[1]);
    }

    try {
      const { data } = await getPatientByIdApi(pId);
      if (data?.data) {
        const p = data.data;
        if (p.patientId || p.uhid) setUhid(p.patientId || p.uhid);
        if (p.phone) setMobileNumber(p.phone);
        if (p.dateOfBirth) {
          const dob = new Date(p.dateOfBirth).toLocaleDateString("en-GB", {
            day: "2-digit",
            month: "short",
            year: "numeric",
          });
          setDateOfBirth(dob);
        }
      }
    } catch (err) {
      console.error("Error fetching patient details:", err);
    }
  };

  const handleValidFromChange = (newVal) => {
    setValidFrom(newVal);
    if (newVal) {
      const fromDate = new Date(newVal);
      const untilDate = new Date(fromDate);
      untilDate.setFullYear(untilDate.getFullYear() + 1);
      untilDate.setDate(untilDate.getDate() - 1);
      setValidUntil(untilDate.toISOString().split("T")[0]);

      const renDate = new Date(fromDate);
      renDate.setFullYear(renDate.getFullYear() + 1);
      setRenewalDate(renDate.toISOString().split("T")[0]);
    }
  };

  const handleFileUpload = (docKey, e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        setErrorMsg(`File ${file.name} exceeds maximum limit of 5MB.`);
        return;
      }
      setDocuments((prev) => ({ ...prev, [docKey]: file.name }));
      setErrorMsg("");
    }
  };

  const handleSubmit = async (e) => {
    e?.preventDefault();
    if (!patientId || !patientDisplay) {
      setErrorMsg("Please select a patient from the search dropdown.");
      return;
    }
    if (!policyNumber || policyNumber.trim().length === 0) {
      setErrorMsg("Policy Number is required.");
      return;
    }
    if (!sumInsured || Number(sumInsured) <= 0) {
      setErrorMsg("Sum Insured / Coverage Amount must be greater than ₹ 0.");
      return;
    }
    if (new Date(validUntil) < new Date(validFrom)) {
      setErrorMsg("Valid Until date cannot be earlier than Valid From date.");
      return;
    }

    let autoStatus = status;
    if (new Date(validUntil) < new Date()) {
      autoStatus = "Expired";
    }

    setSubmitting(true);
    setErrorMsg("");
    try {
      await onSubmit({
        patientId,
        patientName: patientDisplay.split(" (")[0],
        uhid: uhid || "UHID",
        dateOfBirth,
        mobileNumber,
        providerName,
        policyNumber: policyNumber.trim(),
        policyType,
        tpaName,
        coverageAmount: Number(sumInsured),
        sumInsured: Number(sumInsured),
        currency,
        validFrom,
        validUntil,
        renewalDate,
        status: autoStatus,
        employer,
        relationship,
        notes,
        documents,
      });
    } catch (err) {
      setErrorMsg(err.response?.data?.message || err.message || "Failed to save policy.");
    } finally {
      setSubmitting(false);
    }
  };

  return {
    patientId,
    patientDisplay,
    uhid,
    dateOfBirth,
    setDateOfBirth,
    mobileNumber,
    setMobileNumber,
    handlePatientSelect,

    providerName,
    setProviderName,
    policyNumber,
    setPolicyNumber,
    policyType,
    setPolicyType,
    tpaName,
    setTpaName,
    sumInsured,
    setSumInsured,
    currency,
    setCurrency,
    validFrom,
    handleValidFromChange,
    validUntil,
    setValidUntil,
    status,
    setStatus,
    renewalDate,
    setRenewalDate,
    employer,
    setEmployer,
    relationship,
    setRelationship,
    notes,
    setNotes,

    documents,
    handleFileUpload,
    submitting,
    errorMsg,
    handleSubmit,
  };
}
