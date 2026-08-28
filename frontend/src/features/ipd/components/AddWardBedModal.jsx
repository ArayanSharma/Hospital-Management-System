import React, { useState, useEffect } from "react";
import { Building2, Bed as BedIcon, Plus, CheckCircle2, AlertCircle } from "lucide-react";
import api from "../../../lib/axios.js";

export default function AddWardBedModal({ isOpen, onClose, onSuccess }) {
  const [activeTab, setActiveTab] = useState("ward"); // "ward" | "bed"
  const [wards, setWards] = useState([]);
  const [loadingWards, setLoadingWards] = useState(false);

  // Ward Form State
  const [wardName, setWardName] = useState("");
  const [wardType, setWardType] = useState("General");
  const [floor, setFloor] = useState("Floor 1");
  const [capacity, setCapacity] = useState(10);

  // Bed Form State
  const [selectedWardId, setSelectedWardId] = useState("");
  const [bedNumber, setBedNumber] = useState("");

  // Status & Errors
  const [submitting, setSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [successMsg, setSuccessMsg] = useState("");

  useEffect(() => {
    if (isOpen) {
      fetchWards();
      setErrorMsg("");
      setSuccessMsg("");
    }
  }, [isOpen]);

  const fetchWards = async () => {
    setLoadingWards(true);
    try {
      const { data } = await api.get("/wards");
      const list = Array.isArray(data.data) ? data.data : data.data?.wards || [];
      setWards(list);
      if (list.length > 0 && !selectedWardId) {
        setSelectedWardId(list[0]._id);
      }
    } catch (err) {
      setWards([]);
    } finally {
      setLoadingWards(false);
    }
  };

  if (!isOpen) return null;

  // Handle Add Ward Submit
  const handleAddWard = async (e) => {
    e.preventDefault();
    if (!wardName.trim()) {
      setErrorMsg("Ward name is required.");
      return;
    }
    if (capacity <= 0) {
      setErrorMsg("Capacity must be greater than 0.");
      return;
    }

    setSubmitting(true);
    setErrorMsg("");
    setSuccessMsg("");
    try {
      await api.post("/wards", {
        name: wardName.trim(),
        type: wardType,
        floor,
        capacity: Number(capacity),
      });
      setSuccessMsg(`Ward "${wardName}" created successfully!`);
      setWardName("");
      setCapacity(10);
      if (onSuccess) onSuccess();

      setTimeout(() => {
        setSuccessMsg("");
        onClose();
      }, 500);
    } catch (err) {
      setErrorMsg(err.response?.data?.message || "Failed to create Ward.");
    } finally {
      setSubmitting(false);
    }
  };

  // Handle Add Bed Submit
  const handleAddBed = async (e) => {
    e.preventDefault();
    if (!selectedWardId) {
      setErrorMsg("Please select a ward.");
      return;
    }
    if (!bedNumber.trim()) {
      setErrorMsg("Bed number is required.");
      return;
    }

    setSubmitting(true);
    setErrorMsg("");
    setSuccessMsg("");
    try {
      await api.post("/beds", {
        wardId: selectedWardId,
        bedNumber: bedNumber.trim(),
      });
      setSuccessMsg(`Bed "${bedNumber}" created successfully!`);
      setBedNumber("");
      if (onSuccess) onSuccess();

      setTimeout(() => {
        setSuccessMsg("");
        onClose();
      }, 500);
    } catch (err) {
      setErrorMsg(err.response?.data?.message || "Failed to create Bed.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl border border-slate-200/90 shadow-xl max-w-lg w-full p-5 space-y-4">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <div>
            <h3 className="text-base font-bold text-slate-900">
              Add Ward / Bed
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">
              Create a new ward or add a bed to an existing ward
            </p>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-700 text-sm font-semibold cursor-pointer"
          >
            ✕
          </button>
        </div>

        {/* Tab Switcher */}
        <div className="bg-slate-100 p-1 rounded-xl grid grid-cols-2 gap-1 text-xs font-semibold">
          <button
            type="button"
            onClick={() => {
              setActiveTab("ward");
              setErrorMsg("");
              setSuccessMsg("");
            }}
            className={`py-2 rounded-lg transition cursor-pointer flex items-center justify-center gap-1.5 ${
              activeTab === "ward"
                ? "bg-white text-blue-600 shadow-2xs font-bold"
                : "text-slate-500 hover:text-slate-800"
            }`}
          >
            <Building2 className="w-3.5 h-3.5" />
            <span>Add New Ward</span>
          </button>

          <button
            type="button"
            onClick={() => {
              setActiveTab("bed");
              setErrorMsg("");
              setSuccessMsg("");
            }}
            className={`py-2 rounded-lg transition cursor-pointer flex items-center justify-center gap-1.5 ${
              activeTab === "bed"
                ? "bg-white text-blue-600 shadow-2xs font-bold"
                : "text-slate-500 hover:text-slate-800"
            }`}
          >
            <BedIcon className="w-3.5 h-3.5" />
            <span>Add New Bed</span>
          </button>
        </div>

        {/* Error / Success Notifications */}
        {errorMsg && (
          <div className="p-3 bg-rose-50 border border-rose-200 text-rose-700 text-xs rounded-xl font-medium flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{errorMsg}</span>
          </div>
        )}

        {successMsg && (
          <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs rounded-xl font-medium flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 shrink-0" />
            <span>{successMsg}</span>
          </div>
        )}

        {/* Tab 1: Add Ward Form */}
        {activeTab === "ward" && (
          <form onSubmit={handleAddWard} className="space-y-3 text-xs">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">
                Ward Name <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                value={wardName}
                onChange={(e) => setWardName(e.target.value)}
                placeholder="e.g. ICU, General Ward - Male, Deluxe Room"
                className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-800 focus:outline-none"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Ward Type <span className="text-rose-500">*</span>
                </label>
                <select
                  value={wardType}
                  onChange={(e) => setWardType(e.target.value)}
                  className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-800 focus:outline-none cursor-pointer"
                >
                  <option value="ICU">ICU</option>
                  <option value="General">General</option>
                  <option value="Private">Private</option>
                  <option value="Semi-Private">Semi-Private</option>
                  <option value="Emergency">Emergency</option>
                </select>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Floor <span className="text-rose-500">*</span>
                </label>
                <select
                  value={floor}
                  onChange={(e) => setFloor(e.target.value)}
                  className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-800 focus:outline-none cursor-pointer"
                >
                  <option value="Floor 1">Floor 1</option>
                  <option value="Floor 2">Floor 2</option>
                  <option value="Floor 3">Floor 3</option>
                  <option value="Ground Floor">Ground Floor</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">
                Total Capacity (Max Beds) <span className="text-rose-500">*</span>
              </label>
              <input
                type="number"
                min="1"
                max="100"
                value={capacity}
                onChange={(e) => setCapacity(e.target.value)}
                className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-800 focus:outline-none"
              />
            </div>

            <div className="pt-2 border-t border-slate-100 flex items-center justify-end gap-2">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold cursor-pointer"
              >
                Close
              </button>
              <button
                type="submit"
                disabled={submitting}
                className="px-5 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold shadow-sm shadow-blue-500/20 cursor-pointer flex items-center gap-1.5 disabled:opacity-50"
              >
                <Plus className="w-4 h-4" />
                <span>{submitting ? "Creating Ward..." : "Create Ward"}</span>
              </button>
            </div>
          </form>
        )}

        {/* Tab 2: Add Bed Form */}
        {activeTab === "bed" && (
          <form onSubmit={handleAddBed} className="space-y-3 text-xs">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">
                Select Target Ward <span className="text-rose-500">*</span>
              </label>
              <select
                value={selectedWardId}
                onChange={(e) => setSelectedWardId(e.target.value)}
                disabled={loadingWards}
                className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-800 focus:outline-none cursor-pointer"
              >
                {wards.length === 0 && <option value="">No wards found. Create a ward first.</option>}
                {wards.map((w) => (
                  <option key={w._id} value={w._id}>
                    {w.name} ({w.floor || "Floor 1"}) — Capacity: {w.capacity || 10} beds
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">
                Bed Number / Code <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                value={bedNumber}
                onChange={(e) => setBedNumber(e.target.value)}
                placeholder="e.g. ICU-05, M-101, B-204"
                className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-800 focus:outline-none"
              />
              <p className="text-[10px] text-slate-400 mt-1">
                Bed number must be unique within the selected ward.
              </p>
            </div>

            <div className="pt-2 border-t border-slate-100 flex items-center justify-end gap-2">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold cursor-pointer"
              >
                Close
              </button>
              <button
                type="submit"
                disabled={submitting || wards.length === 0}
                className="px-5 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold shadow-sm shadow-blue-500/20 cursor-pointer flex items-center gap-1.5 disabled:opacity-50"
              >
                <Plus className="w-4 h-4" />
                <span>{submitting ? "Creating Bed..." : "Create Bed"}</span>
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
