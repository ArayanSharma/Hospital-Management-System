export const TEST_NAME_OPTIONS = [
  "Lipid Profile",
  "Complete Blood Count (CBC)",
  "Thyroid Profile (T3, T4, TSH)",
  "Urine Routine Examination",
  "Blood Sugar Fasting & PP",
  "Kidney Function Test (KFT)",
  "Liver Function Test (LFT)",
];

export const SAMPLE_TYPE_OPTIONS = ["Blood", "Urine", "Stool", "Swab", "Sputum"];

export const TECHNICIAN_OPTIONS = ["Rakesh Kumar", "Suresh Nair", "Anita Sharma"];

export const CHECKED_BY_OPTIONS = ["Dr. Amit Patel", "Dr. Neha Sharma"];

export const TEST_PARAMETER_MAP = {
  "Lipid Profile": ["Total Cholesterol", "HDL Cholesterol", "LDL Cholesterol", "VLDL Cholesterol", "Triglycerides"],
  "Complete Blood Count (CBC)": ["Hemoglobin", "WBC Count", "RBC Count", "Platelets", "PCV"],
  "Thyroid Profile (T3, T4, TSH)": ["Total T3", "Total T4", "TSH Ultra-sensitive"],
  "Urine Routine Examination": ["Color", "pH", "Specific Gravity", "Protein", "Glucose"],
  "Blood Sugar Fasting & PP": ["Fasting Plasma Glucose", "Post Prandial Glucose", "HbA1c"],
  "Kidney Function Test (KFT)": ["Serum Creatinine", "Blood Urea Nitrogen", "Uric Acid", "Serum Sodium", "Serum Potassium"],
  "Liver Function Test (LFT)": ["SGOT / AST", "SGPT / ALT", "Total Bilirubin", "Direct Bilirubin", "Serum Albumin"],
};

export const INITIAL_ADDITIONAL_TESTS = {
  CBC: false,
  "Lipid Profile": false,
  "Thyroid Profile": false,
  "Liver Function Test": false,
  "Kidney Function Test": false,
  "Blood Sugar (Fasting)": false,
  Other: false,
};

export const getParamUnitAndRef = (paramName) => {
  const p = paramName.toLowerCase();
  if (p.includes("count")) return { unit: "10^3/uL", ref: "Normal Range" };
  if (p.includes("hemoglobin")) return { unit: "g/dL", ref: "Normal Range" };
  if (p.includes("cholesterol") || p.includes("triglycerides")) return { unit: "mg/dL", ref: "Normal Range" };
  return { unit: "mg/dL", ref: "Normal Range" };
};
