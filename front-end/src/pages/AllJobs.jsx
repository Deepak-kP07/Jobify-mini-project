import SearchJobs from "../components/SearchJobs";
import AllJobsContainer from "../components/AllJobsContainer";
import { useLoaderData } from "react-router-dom";

export default function AllJobs() {
  const { jobs, totalJobs, numOfPages, currentPage } = useLoaderData();

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <SearchJobs />
      <AllJobsContainer
        allJobs={jobs || []}
        totalJobs={totalJobs || 0}
        numOfPages={numOfPages || 0}
        currentPage={currentPage || 1}
      />
    </div>
  );
}
