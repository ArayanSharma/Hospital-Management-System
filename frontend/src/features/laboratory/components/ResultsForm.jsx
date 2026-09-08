import { useState } from "react";
import { Plus, Trash2 } from "lucide-react";
import Button from "../../../components/ui/Button.jsx";

export default function ResultsForm({ onSubmit, submitting }) {
  const [rows, setRows] = useState([{ key: "", value: "" }]);
  const [interpretation, setInterpretation] = useState("");

  const updateRow = (index, field, value) => {
    const next = [...rows];
    next[index][field] = value;
    setRows(next);
  };

  const addRow = () => setRows([...rows, { key: "", value: "" }]);
  const removeRow = (index) => setRows(rows.filter((_, i) => i !== index));

  const handleSubmit = (e) => {
    e.preventDefault();
    const results = {};
    rows.forEach((r) => {
      if (r.key.trim()) results[r.key.trim()] = r.value;
    });
    if (Object.keys(results).length === 0) {
      alert("Add at least one result parameter");
      return;
    }
    onSubmit({ results, interpretation });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <label className="block text-sm font-medium text-gray-700">Test Parameters</label>
        {rows.map((row, i) => (
          <div key={i} className="flex gap-2 items-center">
            <input
              value={row.key}
              onChange={(e) => updateRow(i, "key", e.target.value)}
              placeholder="e.g. Hemoglobin"
              className="flex-1 px-3 py-1.5 border border-gray-300 rounded-md text-sm"
            />
            <input
              value={row.value}
              onChange={(e) => updateRow(i, "value", e.target.value)}
              placeholder="e.g. 13.5 g/dL"
              className="flex-1 px-3 py-1.5 border border-gray-300 rounded-md text-sm"
            />
            {rows.length > 1 && (
              <button type="button" onClick={() => removeRow(i)} className="text-gray-400 hover:text-red-600">
                <Trash2 className="w-4 h-4" />
              </button>
            )}
          </div>
        ))}
        <button type="button" onClick={addRow} className="flex items-center gap-1.5 text-sm text-indigo-600 hover:text-indigo-700 font-medium cursor-pointer">
          <Plus className="w-4 h-4" /> Add parameter
        </button>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Interpretation</label>
        <textarea
          value={interpretation}
          onChange={(e) => setInterpretation(e.target.value)}
          rows={2}
          placeholder="e.g. Within normal range"
          className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
        />
      </div>

      <div className="flex justify-end pt-2">
        <Button type="submit" disabled={submitting}>{submitting ? "Saving..." : "Save Results"}</Button>
      </div>
    </form>
  );
}
