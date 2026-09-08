/**
 * Radiology PDF Print and Download Helper
 */

export function downloadRadiologyReportPdf(elementId = "radiology-report-preview-card", fileName = "Radiology_Report.pdf") {
  let element = document.getElementById(elementId);
  if (!element) {
    element = document.getElementById("radiology-study-details-tab") || document.getElementById("radiology-report-entry-section");
  }

  if (!element) {
    alert("Report content for PDF generation could not be located on the current page.");
    return;
  }

  const printWindow = window.open("", "_blank", "width=850,height=1100");
  if (!printWindow) {
    alert("Please allow popups to download/print the Radiology Report PDF.");
    return;
  }

  const htmlContent = `
    <!DOCTYPE html>
    <html>
      <head>
        <title>${fileName}</title>
        <meta charset="utf-8" />
        <script src="https://cdn.tailwindcss.com"></script>
        <style>
          @media print {
            body { margin: 0; padding: 20px; -webkit-print-color-adjust: exact; }
            .no-print { display: none !important; }
          }
          body { font-family: 'Inter', system-ui, -apple-system, sans-serif; background: #fff; color: #0f172a; }
        </style>
      </head>
      <body class="p-6">
        <div class="max-w-3xl mx-auto">
          ${element.innerHTML}
        </div>
        <script>
          window.onload = function() {
            setTimeout(function() {
              window.print();
            }, 300);
          };
        </script>
      </body>
    </html>
  `;

  printWindow.document.write(htmlContent);
  printWindow.document.close();
}
