import axios from "axios";

// Detect if we're in production (deployed) or development
// In production: use relative URL (same domain)
// In development: use localhost
const getBaseURL = () => {
  // If explicitly set via environment variable, use it
  if (import.meta.env.VITE_API_URL) {
    return import.meta.env.VITE_API_URL;
  }

  // Check if we're running on localhost (development)
  const isLocalhost =
    window.location.hostname === "localhost" ||
    window.location.hostname === "127.0.0.1";

  // If localhost, use localhost API, otherwise use relative URL
  return isLocalhost ? "http://localhost:5200/api/v1" : "/api/v1";
};

const baseURL = getBaseURL();

export default axios.create({
  baseURL,
  withCredentials: true,
});
