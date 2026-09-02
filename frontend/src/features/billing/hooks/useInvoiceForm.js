import { useState, useEffect, useCallback } from "react";
import {
  getNextInvoiceNumberApi,
  getPatientEncountersApi,
  getBillableCatalogApi,
} from "../services/invoice.api.js";
import { calculateItemAmount, calculateInvoiceTotals, formatRupee } from "../helpers/invoiceCalculations.js";

export function useInvoiceForm(onSubmit) {
  const [patientId, setPatientId] = useState("");
  const [patientDisplay, setPatientDisplay] = useState("");
  const [uhid, setUhid] = useState("");
  const [autoInvoiceId, setAutoInvoiceId] = useState("INV-2026-000001");

  const [encountersList, setEncountersList] = useState([]);
  const [visitEncounter, setVisitEncounter] = useState("");
  const [visitType, setVisitType] = useState("OPD");
  const [department, setDepartment] = useState("Radiology");
  const [referredBy, setReferredBy] = useState("");

  const [invoiceDate, setInvoiceDate] = useState(() => {
    const today = new Date();
    return today.toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" });
  });
  const [paymentTerms, setPaymentTerms] = useState("Immediate");
  const [dueDate, setDueDate] = useState(() => {
    const today = new Date();
    return today.toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" });
  });

  const [activeCategory, setActiveCategory] = useState("Radiology & Imaging");
  const [itemSearch, setItemSearch] = useState("");
  const [catalogOptions, setCatalogOptions] = useState([]);
  const [showCatalogDropdown, setShowCatalogDropdown] = useState(false);
  const [catalogLoading, setCatalogLoading] = useState(false);

  // Initial items start completely empty (0 auto-selected items)
  const [items, setItems] = useState([]);

  const [manualDiscount, setManualDiscount] = useState("0.00");
  const [roundOffInput, setRoundOffInput] = useState("0.00");
  const [notes, setNotes] = useState("");
  const [validationError, setValidationError] = useState("");

  const categories = [
    "Consultation",
    "Lab Tests",
    "Radiology & Imaging",
    "Pharmacy & Medicines",
    "Room & Bed",
    "Surgeries & Others",
  ];

  // 1. Fetch next sequential Invoice ID on mount
  useEffect(() => {
    async function fetchNextNumber() {
      try {
        const { data } = await getNextInvoiceNumberApi();
        if (data?.data?.nextInvoiceNumber) {
          setAutoInvoiceId(data.data.nextInvoiceNumber);
        }
      } catch (err) {
        console.error("Error fetching next invoice number:", err);
      }
    }
    fetchNextNumber();
  }, []);

  // 2. Fetch catalog options for live search dropdown when category tab changes
  const fetchCatalogOptions = useCallback(async (categoryName) => {
    setCatalogLoading(true);
    try {
      const { data } = await getBillableCatalogApi(categoryName);
      if (data?.data && Array.isArray(data.data)) {
        setCatalogOptions(data.data);
      }
    } catch (err) {
      console.error("Error fetching catalog options:", err);
    } finally {
      setCatalogLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchCatalogOptions(activeCategory);
  }, [activeCategory, fetchCatalogOptions]);

  const handleCategoryClick = (categoryName) => {
    setActiveCategory(categoryName);
    fetchCatalogOptions(categoryName);
    setShowCatalogDropdown(true);
  };

  // 3. Select an item from live search dropdown and append to items table
  const handleSelectCatalogItem = (catalogItem) => {
    setItems((prev) => [
      ...prev,
      {
        description: catalogItem.description,
        code: catalogItem.code || "",
        sourceReference: catalogItem.sourceReference || catalogItem.code || "",
        department: catalogItem.department || activeCategory,
        quantity: 1,
        unitPrice: Number(catalogItem.unitPrice) || 0,
        discount: Number(catalogItem.discount) || 0,
        taxPercent: Number(catalogItem.taxPercent) || 12,
      },
    ]);
    setItemSearch("");
    setShowCatalogDropdown(false);
  };

  // 4. Add clean empty custom item row
  const handleAddBlankCustomItem = () => {
    setItems((prev) => [
      ...prev,
      {
        description: "",
        code: "",
        sourceReference: "",
        department: activeCategory || "Radiology",
        quantity: 1,
        unitPrice: 0.0,
        discount: 0.0,
        taxPercent: 12,
      },
    ]);
  };

  // Handle patient selection from PatientAutocomplete
  const handleSelectPatient = async (pId, pName) => {
    setPatientId(pId);
    setPatientDisplay(pName);
    if (!pId) {
      setUhid("");
      setEncountersList([]);
      setVisitEncounter("");
      setReferredBy("");
      return;
    }

    try {
      const { data } = await getPatientEncountersApi(pId);
      if (data?.data) {
        const res = data.data;
        if (res.uhid) setUhid(res.uhid);
        if (Array.isArray(res.encounters) && res.encounters.length > 0) {
          setEncountersList(res.encounters);
          const first = res.encounters[0];
          setVisitEncounter(first.id);
          setVisitType(first.visitType || "OPD");
          setDepartment(first.department || "Radiology");
          setReferredBy(first.referredBy || "");
        }
      }
    } catch (err) {
      console.error("Error fetching patient encounters:", err);
    }
  };

  // Auto-calculate Due Date based on Payment Terms
  useEffect(() => {
    try {
      const baseDate = new Date();
      let addDays = 0;
      if (paymentTerms === "7 Days") addDays = 7;
      else if (paymentTerms === "15 Days") addDays = 15;
      else if (paymentTerms === "30 Days") addDays = 30;

      if (addDays > 0) {
        baseDate.setDate(baseDate.getDate() + addDays);
        const formatted = baseDate.toLocaleDateString("en-GB", {
          day: "2-digit",
          month: "short",
          year: "numeric",
        });
        setDueDate(formatted);
      } else {
        const today = new Date();
        setDueDate(today.toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" }));
      }
    } catch (err) {
      console.error("Error calculating due date:", err);
    }
  }, [paymentTerms]);

  // Financial Totals Computation using helper
  const totals = calculateInvoiceTotals(items, manualDiscount, roundOffInput);

  // Real-time validation checks
  useEffect(() => {
    if (totals.grandDiscount > totals.rawSubTotal && totals.rawSubTotal > 0) {
      setValidationError(`Discount (${formatRupee(totals.grandDiscount)}) cannot exceed subtotal (${formatRupee(totals.rawSubTotal)}).`);
    } else if (items.length === 0) {
      setValidationError("Add at least one billable item to the invoice.");
    } else {
      setValidationError("");
    }
  }, [totals.grandDiscount, totals.rawSubTotal, items]);

  // Table Handlers
  const handleItemChange = (index, field, value) => {
    setItems((prev) => {
      const updated = [...prev];
      updated[index] = { ...updated[index], [field]: value };
      return updated;
    });
  };

  const handleQtyChange = (index, delta) => {
    setItems((prev) => {
      const updated = [...prev];
      const currentQty = updated[index].quantity || 1;
      updated[index].quantity = Math.max(1, currentQty + delta);
      return updated;
    });
  };

  const handleRemoveItem = (index) => {
    setItems((prev) => prev.filter((_, i) => i !== index));
  };

  // Filter catalog options by search term
  const filteredCatalogOptions = catalogOptions.filter(
    (opt) =>
      opt.description.toLowerCase().includes(itemSearch.toLowerCase()) ||
      opt.code.toLowerCase().includes(itemSearch.toLowerCase())
  );

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!patientId && !patientDisplay) {
      alert("Please select a patient from the database.");
      return;
    }
    if (totals.grandDiscount > totals.rawSubTotal && totals.rawSubTotal > 0) {
      alert("Discount cannot exceed subtotal.");
      return;
    }
    if (items.length === 0) {
      alert("Add at least one billable item to the invoice.");
      return;
    }

    const payload = {
      patientId: patientId || undefined,
      patientName: patientDisplay ? patientDisplay.split(" (")[0] : "",
      uhid,
      visitEncounter,
      visitType,
      paymentTerms,
      invoiceDate,
      dueDate,
      departments: [department],
      referredBy,
      items: items.map((i) => ({
        ...i,
        quantity: Math.max(1, Number(i.quantity)),
        unitPrice: Math.max(0, Number(i.unitPrice)),
        discount: Math.max(0, Number(i.discount)),
        taxPercent: Math.max(0, Number(i.taxPercent)),
        amount: calculateItemAmount(i),
      })),
      discount: totals.extraDiscount,
      roundOff: totals.roundOff,
      status: "unpaid",
      notes,
    };
    if (onSubmit) onSubmit(payload);
  };

  return {
    patientId,
    patientDisplay,
    uhid,
    autoInvoiceId,
    encountersList,
    visitEncounter,
    setVisitEncounter,
    visitType,
    setVisitType,
    department,
    setDepartment,
    referredBy,
    setReferredBy,
    invoiceDate,
    setInvoiceDate,
    paymentTerms,
    setPaymentTerms,
    dueDate,
    activeCategory,
    categories,
    itemSearch,
    setItemSearch,
    showCatalogDropdown,
    setShowCatalogDropdown,
    catalogLoading,
    filteredCatalogOptions,
    items,
    manualDiscount,
    setManualDiscount,
    roundOffInput,
    setRoundOffInput,
    notes,
    setNotes,
    validationError,
    totals,
    handleCategoryClick,
    handleSelectCatalogItem,
    handleAddBlankCustomItem,
    handleSelectPatient,
    handleItemChange,
    handleQtyChange,
    handleRemoveItem,
    handleSubmit,
  };
}
