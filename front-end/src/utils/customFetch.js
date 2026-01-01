import axios from "axios";

const baseURL = import.meta.env.VITE_API_URL || "http://localhost:5200/api/v1";

export default axios.create({
  baseURL,
  withCredentials: true,
});
