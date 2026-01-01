import { Search, X } from "lucide-react";
import { Form, useSearchParams } from "react-router-dom";
import { JOB_STATUS, JOB_TYPE } from "../utils/constants";
import { useRef, useEffect } from "react";

export default function SearchJobs() {
  const [searchParams] = useSearchParams();
  const timeoutRef = useRef(null);

  // Get current values from URL params for controlled inputs
  const currentSearch = searchParams.get("search") || "";
  const currentJobStatus = searchParams.get("jobStatus") || "all";
  const currentJobType = searchParams.get("jobType") || "all";
  const currentSort = searchParams.get("sort") || "latest";

  // Cleanup timeout on unmount
  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  const handleSearchChange = (e) => {
    const form = e.currentTarget.form;

    // Reset to page 1 when searching
    const pageInput = form.querySelector('input[name="page"]');
    if (pageInput) {
      pageInput.value = "1";
    }

    // Clear existing timeout
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    // Set new timeout to submit after user stops typing (500ms delay)
    timeoutRef.current = setTimeout(() => {
      form.submit();
    }, 500);
  };

  const handleFilterChange = (e) => {
    const form = e.currentTarget.form;
    // Reset to page 1 when filtering
    const pageInput = form.querySelector('input[name="page"]');
    if (pageInput) {
      pageInput.value = "1";
    }
    form.submit();
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-4">
      <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-4">
        <Form method="get" className="space-y-4">
          {/* Hidden input to reset page to 1 when searching/filtering */}
          <input type="hidden" name="page" value="1" />

          {/* First Row: Search Input */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              name="search"
              defaultValue={currentSearch}
              placeholder="Search jobs by position, company..."
              onChange={handleSearchChange}
              className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#2EB0BC] focus:border-transparent"
            />
          </div>

          {/* Second Row: Filters in a single line */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
            {/* Job Status */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                Status
              </label>
              <select
                name="jobStatus"
                defaultValue={currentJobStatus}
                onChange={handleFilterChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#2EB0BC] focus:border-transparent text-sm"
              >
                <option value="all">All Status</option>
                {Object.values(JOB_STATUS).map((status) => (
                  <option key={status} value={status}>
                    {status.charAt(0).toUpperCase() + status.slice(1)}
                  </option>
                ))}
              </select>
            </div>

            {/* Job Type */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                Type
              </label>
              <select
                name="jobType"
                defaultValue={currentJobType}
                onChange={handleFilterChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#2EB0BC] focus:border-transparent text-sm"
              >
                <option value="all">All Types</option>
                {Object.values(JOB_TYPE).map((type) => (
                  <option key={type} value={type}>
                    {type.charAt(0).toUpperCase() +
                      type.slice(1).replace("-", " ")}
                  </option>
                ))}
              </select>
            </div>

            {/* Sort */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                Sort
              </label>
              <select
                name="sort"
                defaultValue={currentSort}
                onChange={handleFilterChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#2EB0BC] focus:border-transparent text-sm"
              >
                <option value="latest">Latest</option>
                <option value="oldest">Oldest</option>
                <option value="a-z">A-Z</option>
                <option value="z-a">Z-A</option>
              </select>
            </div>

            {/* Reset Button */}
            <div className="flex items-end">
              <a
                href="/dashboard/all-jobs"
                className="w-full px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-md transition-colors duration-200 flex items-center justify-center gap-2"
              >
                <X className="w-4 h-4" />
                Reset
              </a>
            </div>
          </div>
        </Form>
      </div>
    </div>
  );
}
