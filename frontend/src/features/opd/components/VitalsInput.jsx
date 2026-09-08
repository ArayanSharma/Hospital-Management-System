import { Thermometer, Heart, Activity, Weight, Ruler } from "lucide-react";

const VITAL_FIELDS = [
  { key: "temperature", label: "Temp (°F)", icon: Thermometer, placeholder: "98.6" },
  { key: "bloodPressure", label: "BP (mmHg)", icon: Heart, placeholder: "120/80", isText: true },
  { key: "pulse", label: "Pulse (bpm)", icon: Activity, placeholder: "72" },
  { key: "weight", label: "Weight (kg)", icon: Weight, placeholder: "65" },
  { key: "height", label: "Height (cm)", icon: Ruler, placeholder: "170" },
];

export default function VitalsInput({ register }) {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
      {VITAL_FIELDS.map((field) => (
        <div key={field.key} className="bg-gray-50 border border-gray-200 rounded-lg p-3">
          <div className="flex items-center gap-1.5 mb-1.5">
            <field.icon className="w-3.5 h-3.5 text-gray-400" />
            <label className="text-xs font-medium text-gray-500">{field.label}</label>
          </div>
          <input
            type={field.isText ? "text" : "number"}
            step="0.1"
            placeholder={field.placeholder}
            {...register(`vitals.${field.key}`)}
            className="w-full bg-transparent text-sm font-medium text-gray-900 focus:outline-none placeholder:text-gray-300 placeholder:font-normal"
          />
        </div>
      ))}
    </div>
  );
}