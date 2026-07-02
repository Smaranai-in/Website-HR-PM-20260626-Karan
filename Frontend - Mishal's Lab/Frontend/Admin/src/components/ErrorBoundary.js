import React from "react";

/**
 * 🛡️ ErrorBoundary — catches any unhandled JS error in child components
 * Prevents the entire app from going blank. Shows a styled recovery UI.
 */
class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, info) {
    // In production you would send this to Sentry / LogRocket etc.
    console.error("[ErrorBoundary] Uncaught error:", error, info.componentStack);
  }

  handleReset = () => {
    this.setState({ hasError: false, error: null });
    window.location.href = "/";
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-[#020617] px-4">
          <div className="text-center max-w-lg mx-auto">
            <div className="text-6xl mb-6">⚠️</div>
            <h1 className="text-3xl font-bold text-gray-800 dark:text-white mb-3">
              Something went wrong
            </h1>
            <p className="text-gray-500 dark:text-gray-400 mb-2">
              An unexpected error occurred. Our team has been notified.
            </p>
            {process.env.NODE_ENV === "development" && this.state.error && (
              <pre className="text-left text-xs bg-red-50 dark:bg-red-950/30 text-red-700 dark:text-red-400 p-4 rounded-xl mb-6 overflow-auto max-h-40 border border-red-200 dark:border-red-800">
                {this.state.error.toString()}
              </pre>
            )}
            <button
              onClick={this.handleReset}
              className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-emerald-500 to-teal-600 text-white rounded-xl font-semibold hover:from-emerald-600 hover:to-teal-700 transition-all shadow-lg shadow-emerald-500/20"
            >
              ↩ Return to Home
            </button>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}

export default ErrorBoundary;
