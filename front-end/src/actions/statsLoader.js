import customFetch from "../utils/customFetch";
// import { redirect } from "react-router-dom";

export const statsLoader = async () => {
  const response = await customFetch.get("/jobs/stats");
  return response.data;
};
