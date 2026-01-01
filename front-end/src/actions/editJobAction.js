// import { redirect } from "react-router-dom";
import customFetch from "../utils/customFetch";

export const editJobAction = async ({ request, params }) => {
  try {
    const formData = await request.formData();
    const data = Object.fromEntries(formData);
    await customFetch.patch(`/jobs/${params.id}`, data);
    // Return success - toast will be shown in component
    return { success: true, redirect: "/dashboard/all-jobs" };
  } catch (error) {
    // Return error - toast will be shown in component
    return {
      error: error.response?.data?.msg || "Failed to update job",
    };
  }
};

