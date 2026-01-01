import customFetch from "../utils/customFetch";

export const registerAction = async ({ request }) => {
  const fb = await request.formData();
  const data = Object.fromEntries(fb);
  try {
    await customFetch.post("/auth/register", data);
    // Registration successful - return success flag before redirect
    return { success: true, redirect: "/login" };
  } catch (error) {
    console.error("Registration error:", error.response?.data || error);

    // Return validation errors to display in component
    if (error.response?.data?.errors) {
      return { errors: error.response.data.errors };
    }

    // Return generic error message
    return {
      errors: [
        {
          field: "general",
          message:
            error.response?.data?.msg ||
            "Registration failed. Please try again.",
        },
      ],
    };
  }
};

