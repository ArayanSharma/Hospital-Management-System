import { useState, useEffect } from "react";
import { formatReportDate } from "../../billing/helpers/invoiceCalculations.js";
import { getInvoicesApi } from "../../billing/services/invoice.api.js";
import { getPatientByIdApi } from "../../patients/services/patient.api.js";

export function useSubmitClaimForm(onSubmit, policies = []) {
  // Section 1: Patient & Policy
  const [patientId, setPatientId] = useState("");
  const [patientDisplay, setPatientDisplay] = useState("");
  const [uhid, setUhid] = useState("");
  const [selectedPolicyNum, setSelectedPolicyNum] = useState("");
  const [providerName, setProviderName] = useState("");
  const [policyNumber, setPolicyNumber] = useState("");
  const [tpaName, setTpaName] = useState("");
  const [policyValidity, setPolicyValidity] = useState("");
  const [policyStatus, setPolicyStatus] = useState("Active");
  const [sumInsured, setSumInsured] = useState(0);

  // Section 2: Claim & Invoice Details
  const [invoiceId, setInvoiceId] = useState("");
  const [invoiceNumber, setInvoiceNumber] = useState("");
  const [invoiceDate, setInvoiceDate] = useState("");
  const [invoiceTotal, setInvoiceTotal] = useState(0.0);
  const [invoicePaid, setInvoicePaid] = useState(0.0);
  const [invoiceDue, setInvoiceDue] = useState(0.0);

  const [admissionType, setAdmissionType] = useState("Outpatient (OPD)");
  const [treatmentDate, setTreatmentDate] = useState(() => {
    const today = new Date();
    return today.toISOString().split("T")[0];
  });
  const [claimType, setClaimType] = useState("Cashless");
  const [claimAmount, setClaimAmount] = useState("");
  const [approvedAmount, setApprovedAmount] = useState("0.00");
  const [patientPayable, setPatientPayable] = useState("0.00");
  const [preAuthNumber, setPreAuthNumber] = useState("");

  // Section 3: Status & Remarks
  const [status, setStatus] = useState("Submitted");
  const [submittedDate, setSubmittedDate] = useState(() => {
    const today = new Date();
    return today.toISOString().split("T")[0];
  });
  const [expectedReviewDate, setExpectedReviewDate] = useState(() => {
    const nextWeek = new Date();
    nextWeek.setDate(nextWeek.getDate() + 7);
    return nextWeek.toISOString().split("T")[0];
  });
  const [remarks, setRemarks] = useState("");

  // Section 4: Documents
  const [documents, setDocuments] = useState({
    claimForm: null,
    medicalReports: null,
    labReports: null,
    dischargeSummary: null,
    invoiceCopy: null,
    otherDocs: null,
  });

  const [invoicesList, setInvoicesList] = useState([]);
  const [submitting, setSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  // Fetch Invoices
  useEffect(() => {
    const fetchInvoices = async () => {
      try {
        const { data } = await getInvoicesApi({ limit: 20 });
        const fetched = data?.data?.invoices || data?.invoices || [];
        setInvoicesList(fetched);
        if (fetched.length > 0) {
          const first = fetched[0];
          setInvoiceId(first._id);
          setInvoiceNumber(first.invoiceNumber);
          setInvoiceDate(formatReportDate(first.createdAt || new Date()));
          const total = first.netTotal || first.totalAmount || 0;
          setInvoiceTotal(total);
          setInvoicePaid(first.paidAmount || 0);
          const due = first.dueAmount || total;
          setInvoiceDue(due);
          setClaimAmount(total.toString());
        }
      } catch (err) {
        console.error("Error fetching invoices:", err);
      }
    };
    fetchInvoices();
  }, []);

  const handlePolicySelect = (pNum) => {
    setSelectedPolicyNum(pNum);
    setPolicyNumber(pNum);
    const found = policies.find((p) => p.policyNumber === pNum);
    if (found) {
      setProviderName(found.providerName || "");
      setTpaName(found.tpaName || "Direct Settlement");
      setSumInsured(found.sumInsured || found.coverageAmount || 0);
      setPolicyStatus(found.status || "Active");
      if (found.validFrom && found.validUntil) {
        setPolicyValidity(`${formatReportDate(found.validFrom)} to ${formatReportDate(found.validUntil)}`);
      }
    }
  };

  useEffect(() => {
    if (policies.length > 0 && !selectedPolicyNum) {
      handlePolicySelect(policies[0].policyNumber);
    }
  }, [policies]);

  const handlePatientSelect = async (pId, pName) => {
    setPatientId(pId);
    setPatientDisplay(pName);
    if (!pName || !pId) {
      setUhid("");
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
      }
    } catch (err) {
      console.error("Error fetching patient:", err);
    }
  };

  const handleInvoiceSelect = (invNum) => {
    setInvoiceNumber(invNum);
    const found = invoicesList.find((i) => i.invoiceNumber === invNum);
    if (found) {
      setInvoiceId(found._id);
      setInvoiceDate(formatReportDate(found.createdAt || new Date()));
      const total = found.netTotal || found.totalAmount || 0;
      setInvoiceTotal(total);
      setInvoicePaid(found.paidAmount || 0.0);
      const due = found.dueAmount || total;
      setInvoiceDue(due);
      setClaimAmount(total.toString());
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

    // Edge Case 1: Mandatory Patient Selection
    if (!patientId || !patientDisplay) {
      setErrorMsg("Please select a patient from the search dropdown.");
      return;
    }

    // Edge Case 2: Expired or Inactive Policy Check
    if (policyStatus && (policyStatus.toLowerCase() === "expired" || policyStatus.toLowerCase() === "inactive")) {
      setErrorMsg("Cannot submit an insurance claim against an Expired or Inactive policy.");
      return;
    }

    // Edge Case 3: Mandatory Invoice Selection
    if (!invoiceNumber) {
      setErrorMsg("Please select an Invoice ID.");
      return;
    }

    // Edge Case 4: Positive Claim Amount Check
    const numericClaimAmount = Number(claimAmount);
    if (!claimAmount || numericClaimAmount <= 0) {
      setErrorMsg("Claim Amount must be greater than ₹ 0.");
      return;
    }

    // Edge Case 5: Claim Amount Exceeding Sum Insured
    if (sumInsured > 0 && numericClaimAmount > sumInsured) {
      setErrorMsg(`Claim amount (₹ ${numericClaimAmount.toLocaleString()}) cannot exceed policy sum insured (₹ ${sumInsured.toLocaleString()}).`);
      return;
    }

    // Edge Case 6: Claim Amount Exceeding Invoice Total
    if (invoiceTotal > 0 && numericClaimAmount > invoiceTotal) {
      setErrorMsg(`Claim amount (₹ ${numericClaimAmount.toLocaleString()}) cannot exceed invoice total (₹ ${invoiceTotal.toLocaleString()}).`);
      return;
    }

    // Edge Case 7: Future Treatment Date Check
    if (new Date(treatmentDate) > new Date()) {
      setErrorMsg("Date of treatment cannot be in the future.");
      return;
    }

    setSubmitting(true);
    setErrorMsg("");
    try {
      await onSubmit({
        patientId,
        patientName: patientDisplay.split(" (")[0],
        uhid: uhid || "UHID",
        policyNumber: policyNumber || selectedPolicyNum,
        providerName: providerName || "Insurance Provider",
        tpaName: tpaName || "Direct Settlement",
        policyValidity,
        invoiceId: invoiceId || undefined,
        invoiceNumber,
        admissionType,
        treatmentDate,
        claimType,
        claimAmount: numericClaimAmount,
        approvedAmount: Number(approvedAmount),
        patientPayable: Number(patientPayable),
        preAuthNumber,
        status,
        submittedDate,
        expectedReviewDate,
        remarks,
        documents,
      });
    } catch (err) {
      setErrorMsg(err.response?.data?.message || err.message || "Failed to submit claim.");
    } finally {
      setSubmitting(false);
    }
  };

  return {
    patientId,
    patientDisplay,
    uhid,
    selectedPolicyNum,
    providerName,
    policyNumber,
    tpaName,
    policyValidity,
    policyStatus,
    sumInsured,
    handlePatientSelect,
    handlePolicySelect,

    invoiceId,
    invoiceNumber,
    invoiceDate,
    invoiceTotal,
    invoicePaid,
    invoiceDue,
    invoicesList,
    handleInvoiceSelect,

    admissionType,
    setAdmissionType,
    treatmentDate,
    setTreatmentDate,
    claimType,
    setClaimType,
    claimAmount,
    setClaimAmount,
    approvedAmount,
    patientPayable,
    preAuthNumber,
    setPreAuthNumber,

    status,
    setStatus,
    submittedDate,
    setSubmittedDate,
    expectedReviewDate,
    setExpectedReviewDate,
    remarks,
    setNotes: setRemarks,
    remarksLength: remarks.length,
    setRemarks,

    documents,
    handleFileUpload,
    submitting,
    errorMsg,
    handleSubmit,
  };
}
