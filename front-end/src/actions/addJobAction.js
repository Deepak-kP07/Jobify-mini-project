import customFetch from "../utils/customFetch";

export const addJobAction = async ({ request }) => {
  try {
    const formData = await request.formData();
    const data = Object.fromEntries(formData);
    await customFetch.post("/jobs", data);
    return { success: true, redirect: "/dashboard/all-jobs" };
  } catch (error) {
    return {
      error:
        error.response?.data?.msg || "Failed to add job. Please try again.",
    };
  }
};
