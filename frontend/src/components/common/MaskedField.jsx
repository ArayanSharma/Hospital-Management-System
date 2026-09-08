import React, { useState, useEffect } from "react";
import { Eye, EyeOff } from "lucide-react";

/**
 * Format and mask sensitive values for HIPAA / GDPR compliance
 * @param {string} val
 * @param {string} type - 'phone' | 'email' | 'aadhaar' | 'ssn' | 'text'
 */
function maskValue(val, type = "phone") {
  if (!val) return "N/A";
  const str = String(val).trim();

  switch (type) {
    case "phone": {
      // E.g. "+91 98765 43210" -> "+91 98765 *****" or "9876543210" -> "98765 *****"
      if (str.length >= 10) {
        const prefix = str.slice(0, Math.max(5, str.length - 5));
        return `${prefix} *****`;
      }
      return `${str.slice(0, 3)}*****`;
    }

    case "email": {
      // E.g. "arayan@gmail.com" -> "ar****@gmail.com"
      const parts = str.split("@");
      if (parts.length === 2) {
        const name = parts[0];
        const maskedName = name.length > 2 ? `${name.slice(0, 2)}****` : `${name}****`;
        return `${maskedName}@${parts[1]}`;
      }
      return `${str.slice(0, 2)}****`;
    }

    case "aadhaar": {
      // E.g. "1234-5678-9012" -> "XXXX-XXXX-9012"
      const clean = str.replace(/[^0-9]/g, "");
      if (clean.length >= 12) {
        return `XXXX-XXXX-${clean.slice(-4)}`;
      }
      return `XXXX-XXXX-${str.slice(-4)}`;
    }

    case "ssn": {
      // E.g. "123-45-6789" -> "***-**-6789"
      if (str.length >= 9) {
        return `***-**-${str.slice(-4)}`;
      }
      return `***-**-****`;
    }

    case "text":
    default: {
      if (str.length > 4) {
        return `${str.slice(0, 2)}****${str.slice(-2)}`;
      }
      return "*****";
    }
  }
}

export default function MaskedField({
  value,
  type = "phone",
  autoMaskDelayMs = 10000,
  className = "",
  showIcon = true,
}) {
  const [isRevealed, setIsRevealed] = useState(false);

  useEffect(() => {
    let timer;
    if (isRevealed && autoMaskDelayMs > 0) {
      // Auto re-mask after specified delay to prevent shoulder surfing
      timer = setTimeout(() => {
        setIsRevealed(false);
      }, autoMaskDelayMs);
    }
    return () => {
      if (timer) clearTimeout(timer);
    };
  }, [isRevealed, autoMaskDelayMs]);

  if (!value) return <span className="text-slate-400 font-medium">N/A</span>;

  const displayVal = isRevealed ? value : maskValue(value, type);

  return (
    <span className={`inline-flex items-center gap-1.5 font-mono ${className}`}>
      <span
        className={`transition-all duration-150 ${
          isRevealed ? "text-slate-900 font-semibold" : "text-slate-600"
        }`}
      >
        {displayVal}
      </span>

      {showIcon && (
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            setIsRevealed(!isRevealed);
          }}
          className="p-1 rounded-md text-slate-400 hover:text-blue-600 hover:bg-slate-100 transition duration-150 cursor-pointer active:scale-95"
          title={isRevealed ? "Click to mask sensitive data" : "Click to reveal full data"}
        >
          {isRevealed ? (
            <EyeOff className="w-3.5 h-3.5 text-blue-600" />
          ) : (
            <Eye className="w-3.5 h-3.5 text-slate-400 hover:text-slate-700" />
          )}
        </button>
      )}
    </span>
  );
}
