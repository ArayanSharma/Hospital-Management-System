/**
 * Centralized Helper Utilities for Formatting across the Healthcare SaaS Dashboard
 */

/**
 * Format date string into human readable format (e.g. 27 Aug 2026)
 */
export const formatDate = (dateStr) => {
  if (!dateStr) return "--";
  const d = new Date(dateStr);
  if (isNaN(d.getTime())) return "--";
  return d.toLocaleDateString("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
};

/**
 * Format time string into human readable 12-hour format (e.g. 06:45 AM)
 */
export const formatTime = (dateStr) => {
  if (!dateStr) return "--";
  const d = new Date(dateStr);
  if (isNaN(d.getTime())) return "--";
  return d.toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  });
};

/**
 * Format datetime string into human readable format (e.g. 27 Aug 2026, 06:45 AM)
 */
export const formatDateTime = (dateStr) => {
  if (!dateStr) return "--";
  const d = new Date(dateStr);
  if (isNaN(d.getTime())) return "--";
  return `${formatDate(dateStr)}, ${formatTime(dateStr)}`;
};

/**
 * Calculate age from dateOfBirth and format with gender (e.g. "28 Y / Male")
 */
export const formatGenderAge = (dateOfBirth, gender) => {
  let age = 28;
  if (dateOfBirth) {
    const dob = new Date(dateOfBirth);
    if (!isNaN(dob.getTime())) {
      const diffMs = Date.now() - dob.getTime();
      const ageDate = new Date(diffMs);
      age = Math.abs(ageDate.getUTCFullYear() - 1970);
    }
  }
  const formattedGender = gender
    ? gender.charAt(0).toUpperCase() + gender.slice(1).toLowerCase()
    : "Unspecified";

  return `${age} Y / ${formattedGender}`;
};

/**
 * Get 2-letter uppercase initials for avatar fallbacks (e.g. "Sneha Verma" -> "SV")
 */
export const getInitials = (name) => {
  if (!name || typeof name !== "string") return "PT";
  const clean = name.replace(/^Dr\.\s+/i, "").trim();
  const parts = clean.split(" ");
  if (parts.length === 1) return parts[0].substring(0, 2).toUpperCase();
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
};

/**
 * Format Indian Rupee currency (e.g. ₹ 2,500)
 */
export const formatCurrency = (amount) => {
  if (amount === undefined || amount === null) return "₹ 0";
  return `₹ ${Number(amount).toLocaleString("en-IN")}`;
};
