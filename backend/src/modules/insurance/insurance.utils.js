/**
 * Backend Insurance Utility Functions & Shared Helpers
 */

export const generateClaimNumber = (count) => {
  const seq = (count + 106).toString().padStart(6, "0");
  return `CLM-2025-${seq}`;
};

export const formatCurrentReportDate = () => {
  return new Date().toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
};

export const buildSearchQuery = (search, fields = []) => {
  if (!search) return {};
  const reg = new RegExp(search.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"), "i");
  return {
    $or: fields.map((field) => ({ [field]: reg })),
  };
};
