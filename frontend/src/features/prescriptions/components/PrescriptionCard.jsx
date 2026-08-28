import { Pill } from "lucide-react";

export default function PrescriptionCard({ prescription }) {
  return (
    <div className="bg-white border border-gray-200 rounded-xl p-6">
      <div className="flex items-center gap-2 mb-4">
        <Pill className="w-4 h-4 text-indigo-500" />
        <h2 className="text-sm font-semibold text-gray-900">Prescription</h2>
      </div>

      <div className="space-y-2">
        {prescription.medicines.map((med, i) => (
          <div key={i} className="flex items-start justify-between py-2 border-b border-gray-50 last:border-0">
            <div>
              <p className="text-sm font-medium text-gray-900">{med.name}</p>
              <p className="text-xs text-gray-500">
                {med.dosage} · {med.frequency} · {med.duration}
                {med.instructions && ` · ${med.instructions}`}
              </p>
            </div>
          </div>
        ))}
      </div>

      {prescription.instructions && (
        <p className="text-xs text-gray-500 mt-3 pt-3 border-t border-gray-100">
          <span className="font-medium">Note:</span> {prescription.instructions}
        </p>
      )}
    </div>
  );
}