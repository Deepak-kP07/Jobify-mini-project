import axios from "axios";

/**
 * API Base URL Configuration
 *
 * Runtime detection: Checks current domain to determine API URL
 * This works even if environment variable wasn't set during build
 *
 * Development: http://localhost:5200/api/v1
 * Production: https://jobify-h3ys.onrender.com/api/v1 (or relative /api/v1)
 */
const getBaseURL = () => {
  // Priority 1: Explicitly set environment variable (build-time)
  if (import.meta.env.VITE_API_URL) {
    return import.meta.env.VITE_API_URL;
  }

  // Priority 2: Runtime detection based on current domain
  const hostname = window.location.hostname;

  // If running on localhost, use localhost API
  if (hostname === "localhost" || hostname === "127.0.0.1") {
    return "http://localhost:5200/api/v1";
  }

  // Production: Use relative URL (same domain)
  // Since frontend and backend are on same Render service, use relative URL
  return "/api/v1";
};

const baseURL = getBaseURL();

// Debug: Log API base URL (remove in production if needed)
console.log("🔗 API Base URL:", baseURL);
console.log("🌐 Current Hostname:", window.location.hostname);
console.log("🔧 VITE_API_URL:", import.meta.env.VITE_API_URL || "not set");

export default axios.create({
  baseURL,
  withCredentials: true,
});
