import React from "react";

export default function PatientKpiCards({ patient, kpis }) {
  const ageDisplay = patient?.age ? `${patient.age} Yrs` : (kpis?.age || "N/A");
  const bloodGroup = patient?.bloodGroup || kpis?.bloodGroup || "N/A";
  const lastVisit = patient?.lastVisit ? new Date(patient.lastVisit).toLocaleDateString() : (kpis?.lastVisit || "No visits");
  const nextAppt = patient?.nextAppointment ? new Date(patient.nextAppointment).toLocaleDateString() : (kpis?.nextAppointment || "None");
  const activeMeds = patient?.activeMedicationsCount ?? kpis?.activeMedicationsCount ?? (patient?.medications ? patient.medications.length : 0);
  const conditionsCount = patient?.conditionsCount ?? kpis?.activeConditionsCount ?? (patient?.conditions ? patient.conditions.length : 0);
  const pendingTests = patient?.pendingLabTestsCount ?? kpis?.pendingTestsCount ?? (patient?.labTests ? patient.labTests.filter(t => t.status === "Pending").length : 0);
  const dueBalance = patient?.dueBalance !== undefined ? `₹${patient.dueBalance}` : (kpis?.outstandingBalance || "₹0");

  const cards = [
    { label: "AGE", value: ageDisplay, colorClass: "text-slate-900" },
    { label: "BLOOD GROUP", value: bloodGroup, colorClass: "text-rose-600" },
    { label: "LAST VISIT", value: lastVisit, colorClass: "text-slate-800" },
    { label: "NEXT APPT", value: nextAppt, colorClass: "text-blue-600" },
    { label: "ACTIVE MEDS", value: activeMeds, colorClass: "text-slate-900" },
    { label: "CONDITIONS", value: conditionsCount, colorClass: "text-slate-900" },
    { label: "PENDING TESTS", value: pendingTests, colorClass: "text-amber-600" },
    { label: "DUE BALANCE", value: dueBalance, colorClass: "text-rose-600" },
  ];

  return (
    <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-3">
      {cards.map((card, idx) => (
        <div
          key={idx}
          className="bg-white border border-slate-200/80 rounded-2xl p-3 text-center shadow-2xs flex flex-col justify-between"
        >
          <span className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider">
            {card.label}
          </span>
          <p className={`text-sm font-black mt-1 truncate ${card.colorClass}`}>
            {card.value}
          </p>
        </div>
      ))}
    </div>
  );
}

