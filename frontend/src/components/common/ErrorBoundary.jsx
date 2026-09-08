import { Component } from "react";
import { AlertTriangle, RefreshCw, Home } from "lucide-react";

class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    // Agla render pe fallback UI dikhane ke liye state update karo
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    // Production mein yahan error tracking service (Sentry, LogRocket) call hoga
    console.error("ErrorBoundary caught an error:", error, errorInfo);
  }

  handleReset = () => {
    this.setState({ hasError: false, error: null });
    if (this.props.onReset) this.props.onReset();
  };

  render() {
    if (this.state.hasError) {
      // Custom fallback diya ho to wahi use karo, warna default
      if (this.props.fallback) {
        return this.props.fallback(this.state.error, this.handleReset);
      }

      return (
        <div className="min-h-[400px] flex items-center justify-center p-6">
          <div className="text-center max-w-sm">
            <div className="w-12 h-12 rounded-full bg-red-50 flex items-center justify-center mx-auto mb-4">
              <AlertTriangle className="w-6 h-6 text-red-500" />
            </div>
            <h2 className="text-base font-semibold text-gray-900 mb-1">
              {this.props.title || "Something went wrong"}
            </h2>
            <p className="text-sm text-gray-500 mb-5">
              {this.props.message || "This section encountered an unexpected error. You can try again or go back to the dashboard."}
            </p>
            <div className="flex items-center justify-center gap-2">
              <button
                onClick={this.handleReset}
                className="flex items-center gap-1.5 px-4 py-2 text-sm font-medium bg-gray-900 text-white rounded-md hover:bg-gray-800 transition cursor-pointer"
              >
                <RefreshCw className="w-3.5 h-3.5" /> Try Again
              </button>
              <a
                href="/"
                className="flex items-center gap-1.5 px-4 py-2 text-sm font-medium border border-gray-300 rounded-md hover:bg-gray-50 transition"
              >
                <Home className="w-3.5 h-3.5" /> Go Home
              </a>
            </div>

            {import.meta.env.DEV && this.state.error && (
              <details className="mt-5 text-left">
                <summary className="text-xs text-gray-400 cursor-pointer hover:text-gray-600">
                  Error details (dev only)
                </summary>
                <pre className="mt-2 text-[11px] bg-gray-50 border border-gray-200 rounded p-2 overflow-x-auto text-red-600 font-mono">
                  {this.state.error.toString()}
                </pre>
              </details>
            )}
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;