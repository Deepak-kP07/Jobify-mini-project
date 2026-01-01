import customFetch from "../utils/customFetch";

export const allJobsLoader = async ({ request }) => {
  try {
    // Extract query parameters from the URL
    const params = Object.fromEntries([
      ...new URL(request.url).searchParams.entries(),
    ]);

    // Backend returns: { totalJobs, numOfPages, currentPage, jobs }
    const { data } = await customFetch.get("/jobs", { params });

    // Return data in the format expected by the component
    // Component expects: { jobs, ...otherData }
    return {
      jobs: data.jobs || [],
      totalJobs: data.totalJobs || 0,
      numOfPages: data.numOfPages || 0,
      currentPage: data.currentPage || 1,
      searchValues: { ...params },
    };
  } catch (error) {
    console.error("Error loading jobs: ", error);
    // Return empty structure on error matching expected format
    return {
      jobs: [],
      totalJobs: 0,
      numOfPages: 0,
      currentPage: 1,
      searchValues: {},
    };
  }
};
