import axios from "axios";

// const baseURL = import.meta.env.VITE_API_URL || "http://localhost:5200/api/v1";
// Use relative URL in production (same domain), absolute URL in development
const baseURL =
  import.meta.env.VITE_API_URL ||
  (import.meta.env.PROD ? "/api/v1" : "http://localhost:5200/api/v1");

export default axios.create({
  baseURL,
  withCredentials: true,
});
