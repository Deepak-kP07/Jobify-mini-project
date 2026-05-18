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
const isLocalHost = (hostname) =>
  hostname === "localhost" || hostname === "127.0.0.1";

const isLoopbackApiUrl = (url) =>
  typeof url === "string" &&
  (url.includes("localhost") || url.includes("127.0.0.1"));

const getBaseURL = () => {
  const hostname = window.location.hostname;
  const onLocalDev = isLocalHost(hostname);

  // VITE_API_URL is build-time only — ignore localhost URL when app runs on Render/production
  const viteApiUrl = import.meta.env.VITE_API_URL;
  if (viteApiUrl && !(isLoopbackApiUrl(viteApiUrl) && !onLocalDev)) {
    return viteApiUrl;
  }

  if (onLocalDev) {
    return "http://localhost:5200/api/v1";
  }

  // Same Render service serves API + SPA — relative path avoids CORS
  return "/api/v1";
};

const baseURL = getBaseURL();

export default axios.create({
  baseURL,
  withCredentials: true,
});
