import axios from "axios";

// Use relative URL in production (same domain), absolute URL in development
// Vite sets import.meta.env.PROD = true during build (npm run build)
// Vite sets import.meta.env.DEV = true during dev (npm run dev)
const baseURL =
  import.meta.env.VITE_API_URL ||
  (import.meta.env.MODE === "production"
    ? "/api/v1"
    : "http://localhost:5200/api/v1");

export default axios.create({
  baseURL,
  withCredentials: true,
});
