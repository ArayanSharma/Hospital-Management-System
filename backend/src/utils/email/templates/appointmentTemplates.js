import { baseEmailLayout } from "./baseLayout.js";

export const generateIcsInvite = ({
  summary = "Doctor Consultation - CityCare Hospital",
  description = "Scheduled medical consultation appointment.",
  location = "CityCare Hospital - Main OPD Building",
  startDateStr,
  startTimeStr = "10:00",
  endTimeStr = "10:30",
  organizerName = "CityCare Hospital",
  organizerEmail = "onboarding@resend.dev",
}) => {
  const parseDateTime = (dStr, tStr) => {
    try {
      if (!dStr) return new Date().toISOString().replace(/[-:]/g, "").split(".")[0] + "Z";
      let dt = new Date(dStr);
      if (isNaN(dt.getTime())) {
        const parts = dStr.split(/[-/]/);
        if (parts.length === 3) {
          if (parts[0].length === 4) dt = new Date(parts[0], parts[1] - 1, parts[2]);
          else dt = new Date(parts[2], parts[1] - 1, parts[0]);
        }
      }
      if (isNaN(dt.getTime())) dt = new Date();
      const [hours, mins] = (tStr || "10:00").split(":").map((n) => Number(n) || 0);
      dt.setUTCHours(hours || 10, mins || 0, 0, 0);
      return dt.toISOString().replace(/[-:]/g, "").split(".")[0] + "Z";
    } catch (err) {
      return new Date().toISOString().replace(/[-:]/g, "").split(".")[0] + "Z";
    }
  };

  const dtStart = parseDateTime(startDateStr, startTimeStr);
  const dtEnd = parseDateTime(startDateStr, endTimeStr);
  const dtStamp = new Date().toISOString().replace(/[-:]/g, "").split(".")[0] + "Z";
  const uid = `appt-${Date.now()}-${Math.floor(Math.random() * 1000)}@citycare.com`;

  return [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    "PRODID:-//CityCare Hospital//HMS Calendar System//EN",
    "CALSCALE:GREGORIAN",
    "METHOD:REQUEST",
    "BEGIN:VEVENT",
    `UID:${uid}`,
    `DTSTAMP:${dtStamp}`,
    `DTSTART:${dtStart}`,
    `DTEND:${dtEnd}`,
    `SUMMARY:${summary}`,
    `DESCRIPTION:${description}`,
    `LOCATION:${location}`,
    `ORGANIZER;CN=${organizerName}:MAILTO:${organizerEmail}`,
    "STATUS:CONFIRMED",
    "SEQUENCE:0",
    "END:VEVENT",
    "END:VCALENDAR",
  ].join("\r\n");
};

export const renderAppointmentEmail = ({ patientName, doctorName, date, timeSlot, department, appointmentId }) => {
  const bodyHtml = `
    <span class="badge">Appointment Confirmed</span>
    <h2>Doctor Appointment Booking 🗓️</h2>
    <p>Dear <strong>${patientName}</strong>, your medical appointment has been successfully scheduled.</p>
    <div class="card">
      <div class="card-row"><span>Appointment ID:</span> <strong>${appointmentId || "APT-001"}</strong></div>
      <div class="card-row"><span>Consulting Doctor:</span> <strong>${doctorName}</strong></div>
      <div class="card-row"><span>Department:</span> <strong>${department || "General OPD"}</strong></div>
      <div class="card-row"><span>Scheduled Date:</span> <strong>${date}</strong></div>
      <div class="card-row"><span>Time Slot:</span> <strong>${timeSlot}</strong></div>
      <div class="card-row"><span>Calendar Invite:</span> <strong style="color:#2563eb;">Attached (.ics)</strong></div>
    </div>
    <p>Please arrive 15 minutes prior to your scheduled time slot. An iCalendar (.ics) invite is attached so you can sync this appointment to your Google or Outlook Calendar.</p>
    <a href="http://localhost:5173/appointments" class="btn">View Appointment Details →</a>
  `;
  return baseEmailLayout({ title: "Appointment Confirmation & Calendar Invite", bodyHtml });
};

export const renderAppointmentReminderEmail = ({ patientName, doctorName, date, timeSlot, reminderType = "24-Hour" }) => {
  const bodyHtml = `
    <span class="badge" style="background:#fef3c7; color:#d97706;">Upcoming Consultation</span>
    <h2>${reminderType} Appointment Reminder ⏰</h2>
    <p>Hello <strong>${patientName}</strong>, this is a friendly reminder for your upcoming doctor appointment.</p>
    <div class="card">
      <div class="card-row"><span>Consulting Doctor:</span> <strong>${doctorName}</strong></div>
      <div class="card-row"><span>Scheduled Date:</span> <strong>${date}</strong></div>
      <div class="card-row"><span>Time Slot:</span> <strong>${timeSlot}</strong></div>
      <div class="card-row"><span>Reminder Lead Time:</span> <strong>${reminderType} Before Slot</strong></div>
    </div>
    <p>If you need to reschedule or cancel, please update your status on the patient portal at least 1 hour in advance.</p>
    <a href="http://localhost:5173/appointments" class="btn">Manage Appointment →</a>
  `;
  return baseEmailLayout({ title: `${reminderType} Appointment Reminder - CityCare`, bodyHtml });
};

export const renderAppointmentRescheduledEmail = ({ patientName, doctorName, oldDate, newDate, newTimeSlot, reason }) => {
  const bodyHtml = `
    <span class="badge" style="background:#e0e7ff; color:#4338ca;">Slot Updated</span>
    <h2>Appointment Rescheduled 📅</h2>
    <p>Dear <strong>${patientName}</strong>, your appointment with Dr. <strong>${doctorName}</strong> has been rescheduled.</p>
    <div class="card">
      <div class="card-row"><span>Previous Date:</span> <span style="text-decoration:line-through; color:#94a3b8;">${oldDate || "N/A"}</span></div>
      <div class="card-row"><span>New Date:</span> <strong style="color:#2563eb;">${newDate}</strong></div>
      <div class="card-row"><span>New Time Slot:</span> <strong>${newTimeSlot}</strong></div>
      <div class="card-row"><span>Reason:</span> <strong>${reason || "Patient / Schedule Adjustment"}</strong></div>
    </div>
    <p>Your updated calendar invite (.ics) has been refreshed.</p>
    <a href="http://localhost:5173/appointments" class="btn">View Updated Booking →</a>
  `;
  return baseEmailLayout({ title: "Appointment Rescheduled - CityCare", bodyHtml });
};

export const renderAppointmentCancelEmail = ({ patientName, doctorName, date, reason }) => {
  const bodyHtml = `
    <span class="badge" style="background:#fee2e2; color:#dc2626;">Appointment Status Update</span>
    <h2>Appointment Cancelled ⚠️</h2>
    <p>Dear <strong>${patientName}</strong>, your appointment with Dr. <strong>${doctorName}</strong> on ${date} has been cancelled.</p>
    <div class="card">
      <div class="card-row"><span>Cancellation Reason:</span> <strong>${reason || "Schedule conflict / Patient request"}</strong></div>
      <div class="card-row"><span>Action Needed:</span> <strong>Please re-book or choose another available doctor slot.</strong></div>
    </div>
    <a href="http://localhost:5173/appointments" class="btn" style="background:#dc2626;">Re-book Appointment →</a>
  `;
  return baseEmailLayout({ title: "Appointment Cancelled Update", bodyHtml });
};

export const renderOpdPrescriptionEmail = ({ patientName, doctorName, visitId, diagnosis, medicines = [], vitals }) => {
  const medicineRows = Array.isArray(medicines) && medicines.length > 0
    ? medicines.map((m) => `• <strong>${m.name || m.medicineName}</strong> (${m.dosage || "1-0-1"}, ${m.duration || "5 days"})`).join("<br/>")
    : "Standard Prescribed Medication Details attached in Summary.";

  const bodyHtml = `
    <span class="badge" style="background:#dcfce7; color:#15803d;">OPD Consultation Completed</span>
    <h2>Prescription & Consultation Summary 📄</h2>
    <p>Dear <strong>${patientName}</strong>, thank you for visiting CityCare Hospital. Here is your OPD consultation summary.</p>
    <div class="card">
      <div class="card-row"><span>Visit ID:</span> <strong>${visitId}</strong></div>
      <div class="card-row"><span>Attending Physician:</span> <strong>${doctorName}</strong></div>
      <div class="card-row"><span>Diagnosis:</span> <strong>${diagnosis || "General OPD Consultation"}</strong></div>
      ${vitals ? `<div class="card-row"><span>Vitals:</span> <span>BP: ${vitals.bloodPressure || "120/80"}, Temp: ${vitals.temperature || "98.6"}°F</span></div>` : ""}
    </div>
    <div style="background:#f8fafc; border-left:4px solid #16a34a; padding:16px; margin:16px 0; border-radius:8px;">
      <p style="margin:0 0 8px 0; font-weight:700; color:#15803d;">Prescribed Medications:</p>
      <p style="margin:0; font-size:13px; line-height:1.5;">${medicineRows}</p>
    </div>
    <p>You can view and print your complete digital prescription PDF directly from the hospital portal.</p>
    <a href="http://localhost:5173/opd" class="btn" style="background:#16a34a;">View Prescription PDF →</a>
  `;
  return baseEmailLayout({ title: "OPD Consultation Summary & Prescription - CityCare", bodyHtml });
};
