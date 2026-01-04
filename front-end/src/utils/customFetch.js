import axios from "axios";

/**
 * API Base URL Configuration
 *
 * Environment Variable: VITE_API_URL
 *
 * Development (local):
 *   - Leave VITE_API_URL unset
 *   - Defaults to: http://localhost:5200/api/v1
 *
 * Production (Render):
 *   - Set VITE_API_URL=https://jobify-h3ys.onrender.com/api/v1
 *   - Or use relative URL: VITE_API_URL=/api/v1 (if same domain)
 */
const baseURL = import.meta.env.VITE_API_URL || "http://localhost:5200/api/v1";

export default axios.create({
  baseURL,
  withCredentials: true,
});
