export default function Toggle({ label, checked, onChange, disabled = false, description }) {
  return (
    <label className={`flex items-center justify-between cursor-pointer ${disabled ? "opacity-50 cursor-not-allowed" : ""}`}>
      <div>
        {label && <span className="text-sm font-medium text-gray-700">{label}</span>}
        {description && <p className="text-xs text-gray-500">{description}</p>}
      </div>
      <button
        type="button"
        role="switch"
        aria-checked={checked}
        disabled={disabled}
        onClick={() => !disabled && onChange && onChange(!checked)}
        className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 ${
          checked ? "bg-indigo-600" : "bg-gray-200"
        } ${disabled ? "cursor-not-allowed" : ""}`}
      >
        <span
          className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
            checked ? "translate-x-5" : "translate-x-0"
          }`}
        />
      </button>
    </label>
  );
}
