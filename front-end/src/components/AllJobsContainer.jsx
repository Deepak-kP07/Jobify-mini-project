import Job from "./job";
import { Briefcase } from "lucide-react";
import PageBtnContainer from "./PageBtnContainer";

export default function AllJobsContainer({
  allJobs,
  totalJobs,
  numOfPages,
  currentPage,
}) {
  // Safety check: ensure allJobs is an array
  if (!allJobs || !Array.isArray(allJobs) || allJobs.length === 0) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="text-center py-16 bg-white rounded-lg border border-gray-200 shadow-sm">
          <Briefcase className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-gray-700 mb-2">
            No Jobs Found
          </h3>
          <p className="text-gray-500 mb-6">
            Get started by creating your first job posting!
          </p>
          <a
            href="/dashboard"
            className="inline-block bg-[#2EB0BC] hover:bg-teal-600 text-white px-6 py-2 rounded-md font-medium transition-colors duration-200"
          >
            Create Job
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-6">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-800">All Jobs</h2>
          <p className="text-gray-500 text-sm mt-1">
            Showing {allJobs.length} of {totalJobs}{" "}
            {totalJobs === 1 ? "job" : "jobs"}
            {numOfPages > 1 && ` (Page ${currentPage} of ${numOfPages})`}
          </p>
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {allJobs.map((job) => {
          return <Job key={job._id} job={job} />;
        })}
      </div>
      {/* Pagination */}
      <PageBtnContainer currentPage={currentPage} numOfPages={numOfPages} />
    </div>
  );
}
