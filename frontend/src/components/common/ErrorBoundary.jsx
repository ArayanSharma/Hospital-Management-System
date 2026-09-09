import { Component } from "react";
import { AlertTriangle, RefreshCw, Home, Terminal } from "lucide-react";

class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null, showDetails: false };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error("Global ErrorBoundary caught an error:", error, errorInfo);
  }

  handleReset = () => {
    this.setState({ hasError: false, error: null });
    if (this.props.onReset) this.props.onReset();
  };

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback(this.state.error, this.handleReset);
      }

      return (
        <div className="min-h-[450px] flex items-center justify-center p-6 bg-slate-50 dark:bg-[#0B0F19] transition-colors duration-200">
          <div className="text-center max-w-md w-full bg-white dark:bg-[#131B2E] border border-slate-200 dark:border-slate-800 p-8 rounded-2xl shadow-xl">
            <div className="w-14 h-14 rounded-2xl bg-red-500/10 border border-red-500/20 flex items-center justify-center mx-auto mb-4 text-red-500">
              <AlertTriangle className="w-7 h-7" />
            </div>
            <h2 className="text-lg font-bold text-slate-900 dark:text-white mb-2">
              {this.props.title || "Something went wrong"}
            </h2>
            <p className="text-sm text-slate-600 dark:text-slate-300 mb-6 leading-relaxed">
              {this.props.message ||
                "This component encountered an unexpected error. You can try reloading or return to the dashboard."}
            </p>

            <div className="flex items-center justify-center gap-3">
              <button
                onClick={this.handleReset}
                className="flex items-center gap-2 px-4 py-2.5 text-sm font-semibold bg-slate-900 hover:bg-slate-800 dark:bg-slate-100 dark:hover:bg-white text-white dark:text-slate-900 rounded-xl transition cursor-pointer"
              >
                <RefreshCw className="w-4 h-4" /> Try Again
              </button>
              <a
                href="/"
                className="flex items-center gap-2 px-4 py-2.5 text-sm font-semibold bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 rounded-xl transition"
              >
                <Home className="w-4 h-4" /> Go Home
              </a>
            </div>

            {this.state.error && (
              <div className="mt-6 text-left border-t border-slate-100 dark:border-slate-800/80 pt-4">
                <button
                  onClick={() => this.setState((prev) => ({ showDetails: !prev.showDetails }))}
                  className="flex items-center gap-1.5 text-xs font-semibold text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 transition cursor-pointer"
                >
                  <Terminal className="w-3.5 h-3.5" /> Technical Diagnostics
                </button>
                {this.state.showDetails && (
                  <pre className="mt-2.5 text-[11px] bg-slate-900 text-red-400 border border-slate-800 rounded-xl p-3 overflow-x-auto font-mono">
                    {this.state.error.toString()}
                  </pre>
                )}
              </div>
            )}
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;