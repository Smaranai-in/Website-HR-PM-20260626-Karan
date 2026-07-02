import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";  // 👈 Tailwind included
import App from "./App";
import ErrorBoundary from "./components/ErrorBoundary";

// 🛡️ Validate critical environment variables at startup
const REQUIRED_ENV_VARS = [
  "REACT_APP_SUPABASE_URL",
  "REACT_APP_SUPABASE_ANON_KEY",
];

const missingVars = REQUIRED_ENV_VARS.filter((key) => !process.env[key]);
if (missingVars.length > 0) {
  document.getElementById("root").innerHTML = `
    <div style="min-height:100vh;display:flex;align-items:center;justify-content:center;background:#020617;font-family:system-ui;padding:20px;">
      <div style="text-align:center;max-width:480px;">
        <div style="font-size:48px;margin-bottom:16px;">⚙️</div>
        <h1 style="color:#f87171;font-size:24px;margin-bottom:8px;">Configuration Error</h1>
        <p style="color:#94a3b8;margin-bottom:16px;">The following required environment variables are missing:</p>
        <code style="display:block;background:#0f172a;color:#fbbf24;padding:12px 16px;border-radius:8px;text-align:left;border:1px solid #1e293b;">
          ${missingVars.map((v) => `${v}=<not set>`).join("<br/>")}
        </code>
        <p style="color:#64748b;margin-top:16px;font-size:13px;">Create a <strong style="color:#94a3b8">.env</strong> file in the Admin root with these values.</p>
      </div>
    </div>
  `;
  throw new Error(`Missing env vars: ${missingVars.join(", ")}`);
}

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <ErrorBoundary>
      <App />
    </ErrorBoundary>
  </React.StrictMode>
);
