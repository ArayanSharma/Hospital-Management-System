/**
 * Production-Grade Responsive Base HTML Layout & Helpers
 */
export const baseEmailLayout = ({ title, bodyHtml, footerSubtext }) => `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${title}</title>
  <style>
    body { font-family: 'Segoe UI', Helvetica, Arial, sans-serif; background-color: #f4f7fc; margin: 0; padding: 0; color: #1e293b; }
    .container { max-width: 600px; margin: 30px auto; background: #ffffff; border-radius: 16px; overflow: hidden; box-shadow: 0 10px 25px rgba(0,0,0,0.05); border: 1px solid #e2e8f0; }
    .header { background-color: #2563eb; padding: 28px; text-align: center; color: #ffffff; }
    .header h1 { margin: 0; font-size: 24px; font-weight: 800; }
    .header p { margin: 4px 0 0 0; font-size: 12px; color: #93c5fd; text-transform: uppercase; letter-spacing: 1px; font-weight: 700; }
    .content { padding: 32px; font-size: 14px; line-height: 1.6; color: #334155; }
    .badge { display: inline-block; padding: 4px 12px; background: #e0e7ff; color: #4338ca; border-radius: 20px; font-weight: 700; font-size: 12px; margin-bottom: 16px; }
    .card { background: #f8fafc; border-radius: 12px; border: 1px solid #e2e8f0; padding: 16px; margin: 20px 0; }
    .card-row { display: flex; justify-content: space-between; padding: 8px 0; border-bottom: 1px dashed #cbd5e1; }
    .card-row:last-child { border-bottom: none; }
    .btn { display: inline-block; padding: 12px 24px; background-color: #2563eb; color: #ffffff; text-decoration: none; border-radius: 10px; font-weight: 700; font-size: 13px; text-align: center; margin-top: 16px; }
    .footer { background-color: #f1f5f9; padding: 20px; text-align: center; font-size: 11px; color: #64748b; border-top: 1px solid #e2e8f0; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>CityCare HOSPITAL</h1>
      <p>Better Care. Healthier Tomorrow.</p>
    </div>
    <div class="content">
      ${bodyHtml}
    </div>
    <div class="footer">
      <p><strong>CityCare Hospital Management System</strong></p>
      <p>${footerSubtext || "This is an automated notification email. Please do not reply directly."}</p>
      <p>© ${new Date().getFullYear()} CityCare Hospital. All rights reserved.</p>
    </div>
  </div>
</body>
</html>
`;
