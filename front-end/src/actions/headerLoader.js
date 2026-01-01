import customFetch from "../utils/customFetch";

export const headerLoader = async () => {
  try {
    const { data } = await customFetch.get("/users/current-user");
    return data;
  } catch {
    // Return null or handle error as needed
    return null;
  }
};
