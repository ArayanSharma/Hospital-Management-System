export default function TopMedicinesList({ medicines }) {
  if (!medicines || medicines.length === 0) {
    return <p className="text-sm text-gray-400 py-8 text-center">No sales data</p>;
  }

  const maxQty = Math.max(...medicines.map((m) => m.totalQuantity));

  return (
    <div className="space-y-3">
      {medicines.map((m, i) => (
        <div key={m._id} className="flex items-center gap-3">
          <span className="text-xs font-medium text-gray-400 w-4">{i + 1}</span>
          <div className="flex-1 min-w-0">
            <div className="flex justify-between text-sm mb-1">
              <span className="text-gray-800 font-medium truncate">{m.medicineName}</span>
              <span className="text-gray-500 shrink-0 ml-2">{m.totalQuantity} units</span>
            </div>
            <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
              <div
                className="h-full bg-indigo-500 rounded-full transition-all duration-500"
                style={{ width: `${(m.totalQuantity / maxQty) * 100}%` }}
              />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}