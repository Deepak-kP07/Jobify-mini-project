// import { redirect } from "react-router-dom";
import customFetch from "../utils/customFetch";

export const loginAction = async ({ request }) => {
  const formData = await request.formData();
  const data = Object.fromEntries(formData);

  // Debug: Log before login attempt
  console.log("🔐 Login Attempt Started");
  console.log("📧 Email:", data.email);
  console.log("🔗 API Base URL:", customFetch.defaults.baseURL);
  console.log(
    "🎯 Full Login URL:",
    `${customFetch.defaults.baseURL}/auth/login`
  );

  try {
    await customFetch.post("/auth/login", data);
    console.log("✅ Login Successful");
    // Login successful - return success flag
    return { success: true, redirect: "/dashboard" };
  } catch (error) {
    console.error("Login error:", error.response?.data || error);
    // Return error to display in component
    return {
      error:
        error.response?.data?.msg ||
        error.response?.data?.message ||
        "Login failed. Please check your credentials.",
    };
  }
};
