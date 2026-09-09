// Dynamic Nodemailer import helper for zero-crash ESM loading
const getNodemailer = async () => {
  try {
    const mod = await import("nodemailer");
    return mod.default || mod;
  } catch (err) {
    return null;
  }
};

/**
 * Safely converts attachment content to Base64 string
 */
const safeToBase64 = (content) => {
  if (!content) return "";
  if (Buffer.isBuffer(content)) return content.toString("base64");
  if (typeof content === "string") return Buffer.from(content).toString("base64");
  try {
    return Buffer.from(String(content)).toString("base64");
  } catch (e) {
    return "";
  }
};

/**
 * Sends an email using Resend API (Primary) or Nodemailer SMTP (Fallback)
 */
export const sendEmailRaw = async ({ to, subject, html, attachments = [] }) => {
  const from = process.env.MAIL_FROM || "CityCare Hospital <onboarding@resend.dev>";
  const resendApiKey = process.env.RESEND_API_KEY;

  // Edge Case Guard 1: Sanitize recipient email list
  const recipientList = (Array.isArray(to) ? to : [to])
    .filter((e) => e && typeof e === "string" && e.trim().includes("@"))
    .map((e) => e.trim().toLowerCase());

  if (recipientList.length === 0) {
    console.warn(`[Email Dispatcher Warning] Skipped dispatch. No valid recipient addresses: "${to}"`);
    return { success: false, reason: "No valid recipient emails" };
  }

  // Edge Case Guard 2: Format attachments safely for Resend API
  const resendAttachments = (attachments || [])
    .filter((att) => att && att.filename)
    .map((att) => ({
      filename: att.filename,
      content: safeToBase64(att.content),
    }))
    .filter((att) => att.content.length > 0);

  // 1. Primary Driver: Resend API (with 10s AbortSignal timeout)
  if (resendApiKey) {
    try {
      const payload = {
        from,
        to: recipientList,
        subject: subject || "CityCare Hospital Notification",
        html: html || "<p>Notification from CityCare Hospital</p>",
      };

      if (resendAttachments.length > 0) {
        payload.attachments = resendAttachments;
      }

      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 10000);

      const response = await fetch("https://api.resend.com/emails", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${resendApiKey}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
        signal: controller.signal,
      }).finally(() => clearTimeout(timeoutId));

      const resData = await response.json().catch(() => ({}));
      if (response.ok) {
        console.log(`[Email Dispatcher Success] Sent via Resend API to [${recipientList.join(", ")}] (ID: ${resData.id || "OK"})`);
        return { success: true, provider: "resend", data: resData };
      } else {
        console.warn(`[Email Dispatcher Warning] Resend API error (${response.status}):`, resData?.message || resData);
      }
    } catch (resendErr) {
      console.warn("[Email Dispatcher Warning] Resend API network error, switching to Nodemailer SMTP fallback:", resendErr.message);
    }
  }

  // 2. Secondary Driver: Nodemailer SMTP Fallback
  if (process.env.SMTP_USER && process.env.SMTP_PASS) {
    try {
      const nodemailer = await getNodemailer();
      if (!nodemailer) {
        console.warn("[Email Dispatcher Warning] Nodemailer package not available. Falling back to mock dispatch.");
      } else {
        const transporter = nodemailer.createTransport({
          host: process.env.SMTP_HOST || "smtp.gmail.com",
          port: Number(process.env.SMTP_PORT) || 465,
          secure: true,
          auth: {
            user: process.env.SMTP_USER,
            pass: process.env.SMTP_PASS,
          },
          connectionTimeout: 8000,
        });

        const info = await transporter.sendMail({
          from,
          to: recipientList.join(", "),
          subject: subject || "CityCare Hospital Notification",
          html: html || "<p>Notification from CityCare Hospital</p>",
          attachments,
        });

        console.log(`[Email Dispatcher Success] Sent via Nodemailer SMTP to [${recipientList.join(", ")}] (MessageID: ${info.messageId})`);
        return { success: true, provider: "nodemailer", data: info };
      }
    } catch (smtpErr) {
      console.error("[Email Dispatcher Error] Nodemailer SMTP fallback error:", smtpErr.message);
      return { success: false, provider: "nodemailer", error: smtpErr.message };
    }
  }

  console.log(`[Email Dispatcher Mock] Simulated email dispatch to [${recipientList.join(", ")}]: "${subject}"`);
  return { success: true, provider: "mock" };
};

