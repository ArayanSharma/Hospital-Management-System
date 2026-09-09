import { useState } from "react";
import { useRouteError, isRouteErrorResponse, useNavigate } from "react-router-dom";
import { AlertTriangle, RefreshCw, Home, ArrowLeft, Terminal, ShieldAlert, ChevronDown, ChevronUp } from "lucide-react";

export default function RouteErrorBoundary() {
  const error = useRouteError();
  const navigate = useNavigate();
  const [showDetails, setShowDetails] = useState(false);

  // Analyze error details
  let title = "Application Error Encountered";
  let message = "An unexpected error occurred while loading this page. Our team has been automatically notified.";
  let isChunkError = false;
  let statusCode = null;

  if (isRouteErrorResponse(error)) {
    statusCode = error.status;
    if (error.status === 404) {
      title = "Page Not Found (404)";
      message = "The page or resource you are looking for does not exist or has been moved.";
    } else if (error.status === 403) {
      title = "Access Denied (403)";
      message = "You do not have permission to access this resource. Please contact your administrator.";
    } else {
      title = `Route Error (${error.status})`;
      message = error.statusText || error.data?.message || message;
    }
  } else if (error instanceof Error) {
    const errString = error.message || error.toString();
    if (
      errString.includes("Failed to fetch dynamically imported module") ||
      errString.includes("Importing a module script failed") ||
      errString.includes("ChunkLoadError")
    ) {
      isChunkError = true;
      title = "Module Loading Interrupted";
      message = "A new application update was deployed or your network connection was briefly interrupted while loading this section.";
    } else {
      message = error.message || message;
    }
  }

  const handleReload = () => {
    window.location.reload();
  };

  const handleGoHome = () => {
    navigate("/", { replace: true });
  };

  const handleGoBack = () => {
    navigate(-1);
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#0B0F19] text-slate-800 dark:text-slate-100 flex items-center justify-center p-4 sm:p-6 transition-colors duration-200">
      <div className="max-w-xl w-full bg-white dark:bg-[#131B2E] border border-slate-200 dark:border-slate-800 rounded-2xl shadow-xl p-6 sm:p-8 space-y-6">
        
        {/* Header Badge & Icon */}
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-amber-600 dark:text-amber-400 flex items-center justify-center shrink-0">
            {isChunkError ? (
              <RefreshCw className="w-6 h-6 animate-spin-slow" />
            ) : (
              <ShieldAlert className="w-6 h-6" />
            )}
          </div>
          <div>
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-red-500/10 text-red-600 dark:text-red-400 border border-red-500/20">
              <AlertTriangle className="w-3 h-3" />
              <span>{statusCode ? `HTTP ${statusCode}` : "Runtime Error"}</span>
            </div>
            <h1 className="text-xl font-bold text-slate-900 dark:text-white mt-1">
              {title}
            </h1>
          </div>
        </div>

        {/* Message */}
        <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
          {message}
        </p>

        {/* Action Buttons */}
        <div className="flex flex-wrap items-center gap-3 pt-2">
          {isChunkError ? (
            <button
              onClick={handleReload}
              className="flex items-center gap-2 px-4 py-2.5 text-sm font-semibold bg-blue-600 hover:bg-blue-700 text-white rounded-xl shadow-sm transition cursor-pointer"
            >
              <RefreshCw className="w-4 h-4" /> Refresh & Reload Bundle
            </button>
          ) : (
            <button
              onClick={handleReload}
              className="flex items-center gap-2 px-4 py-2.5 text-sm font-semibold bg-slate-900 hover:bg-slate-800 dark:bg-slate-100 dark:hover:bg-white text-white dark:text-slate-900 rounded-xl shadow-sm transition cursor-pointer"
            >
              <RefreshCw className="w-4 h-4" /> Try Reloading
            </button>
          )}

          <button
            onClick={handleGoHome}
            className="flex items-center gap-2 px-4 py-2.5 text-sm font-semibold bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 rounded-xl transition cursor-pointer"
          >
            <Home className="w-4 h-4" /> Go to Dashboard
          </button>

          <button
            onClick={handleGoBack}
            className="flex items-center gap-2 px-3.5 py-2.5 text-sm font-medium text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200 transition cursor-pointer ml-auto"
          >
            <ArrowLeft className="w-4 h-4" /> Go Back
          </button>
        </div>

        {/* Developer Diagnostics Accordion */}
        <div className="border-t border-slate-100 dark:border-slate-800/80 pt-4">
          <button
            onClick={() => setShowDetails(!showDetails)}
            className="flex items-center justify-between w-full text-xs font-semibold text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 transition cursor-pointer"
          >
            <span className="flex items-center gap-1.5">
              <Terminal className="w-3.5 h-3.5" /> Technical Error Information
            </span>
            {showDetails ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          </button>

          {showDetails && (
            <div className="mt-3 p-3.5 bg-slate-900 text-slate-200 rounded-xl text-xs font-mono overflow-x-auto space-y-2 border border-slate-800">
              <div className="text-amber-400 font-semibold">
                Timestamp: {new Date().toISOString()}
              </div>
              <div className="text-red-400">
                {error?.stack || error?.message || (typeof error === "string" ? error : JSON.stringify(error, null, 2))}
              </div>
            </div>
          )}
        </div>

      </div>
    </div>
  );
}
