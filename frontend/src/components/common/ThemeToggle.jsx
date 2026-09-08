import React from "react";
import { Sun, Moon } from "lucide-react";
import { useTheme } from "./ThemeProvider.jsx";

export default function ThemeToggle() {
  const { isDarkMode, toggleTheme } = useTheme();

  return (
    <button
      onClick={toggleTheme}
      type="button"
      className="relative w-8 h-8 rounded-full bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 flex items-center justify-center transition-all duration-300 border border-slate-200/80 dark:border-slate-700/80 cursor-pointer group"
      title={isDarkMode ? "Switch to Light Mode" : "Switch to Dark Mode"}
      aria-label="Toggle Theme"
    >
      {isDarkMode ? (
        <Sun className="w-4 h-4 text-amber-400 transform group-hover:rotate-45 transition-transform duration-300" />
      ) : (
        <Moon className="w-4 h-4 text-slate-600 dark:text-slate-300 transform group-hover:-rotate-12 transition-transform duration-300" />
      )}
    </button>
  );
}
