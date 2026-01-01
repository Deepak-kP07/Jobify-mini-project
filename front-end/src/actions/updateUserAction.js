import customFetch from "../utils/customFetch";

export const updateUserAction = async ({ request }) => {
  try {
    const fd = await request.formData();
    await customFetch.patch("users/update-user", fd);
    return { success: true, redirect: "/dashboard/profile" };
  } catch (error) {
    console.error("Update user error:", error);
    return { errors: error.response?.data?.msg || "Failed to update user" };
  }
};
