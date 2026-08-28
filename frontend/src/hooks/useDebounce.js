import { useState, useEffect } from "react";

export const useDebounce = (value, delay = 400) => {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const timer = setTimeout(() => setDebouncedValue(value), delay);
    return () => clearTimeout(timer); // cleanup — purana timer cancel karo agar value phir se badli
  }, [value, delay]);

  return debouncedValue;
};