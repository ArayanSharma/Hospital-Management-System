import React, { createContext, useContext, useEffect, useState } from "react";

const ThemeContext = createContext(null);

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }
  return context;
};

export const ThemeProvider = ({ children }) => {
  const [theme, setThemeState] = useState(() => {
    return localStorage.getItem("hms_theme") || "system";
  });

  const [resolvedTheme, setResolvedTheme] = useState("light");

  useEffect(() => {
    const root = document.documentElement;

    const applyTheme = (targetTheme) => {
      let isDark = false;
      if (targetTheme === "dark") {
        isDark = true;
      } else if (targetTheme === "system") {
        isDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
      }

      if (isDark) {
        root.classList.add("dark");
        setResolvedTheme("dark");
      } else {
        root.classList.remove("dark");
        setResolvedTheme("light");
      }
    };

    applyTheme(theme);

    // Listen for OS System Preference changes if system mode is active
    if (theme === "system") {
      const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
      const handleChange = () => applyTheme("system");
      mediaQuery.addEventListener("change", handleChange);
      return () => mediaQuery.removeEventListener("change", handleChange);
    }
  }, [theme]);

  const setTheme = (newTheme) => {
    localStorage.setItem("hms_theme", newTheme);
    setThemeState(newTheme);
  };

  const toggleTheme = () => {
    const nextTheme = resolvedTheme === "dark" ? "light" : "dark";
    setTheme(nextTheme);
  };

  return (
    <ThemeContext.Provider value={{ theme, resolvedTheme, isDarkMode: resolvedTheme === "dark", setTheme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};
