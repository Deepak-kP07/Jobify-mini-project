import { redirect } from "react-router-dom";
import customFetch from "../utils/customFetch";
import { toast } from "react-toastify";

export const editJobLoader = async ({ params }) => {
  try {
    const { data } = await customFetch.get(`/jobs/${params.id}`);
    return data; // Returns: { job: {...} }
  } catch (error) {
    toast.error(error?.response?.data?.msg);
    return redirect("/dashboard/all-jobs");
  }
};

