/**
 * Utility helper to handle binary file downloads (CSV, PDF, Excel) from backend API blobs.
 */
export const downloadFileBlob = (blobData, fileName) => {
  const blob = new Blob([blobData], { type: "text/csv;charset=utf-8;" });
  const url = window.URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.setAttribute("download", fileName);
  document.body.appendChild(link);
  link.click();
  link.remove();
  window.URL.revokeObjectURL(url);
};
