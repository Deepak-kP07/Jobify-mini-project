import { MapPinned, Calendar, Briefcase, Trash2, Edit } from "lucide-react";
import customFetch from "../utils/customFetch";
import { useNavigate, Link } from "react-router-dom";
import { toast } from "react-toastify";

const formatDate = (dateString) => {
  const date = new Date(dateString);
  return date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
};

const getStatusColor = (status) => {
  const statusColors = {
    pending: "bg-yellow-100 text-yellow-800 border-yellow-300",
    interview: "bg-blue-100 text-blue-800 border-blue-300",
    declined: "bg-red-100 text-red-800 border-red-300",
  };
  return statusColors[status] || "bg-gray-100 text-gray-800 border-gray-300";
};

const getJobTypeColor = (type) => {
  const typeColors = {
    "full-time": "bg-green-100 text-green-800",
    "part-time": "bg-purple-100 text-purple-800",
    internship: "bg-orange-100 text-orange-800",
  };
  return typeColors[type] || "bg-gray-100 text-gray-800";
};

export default function Job({ job }) {
  const navigate = useNavigate();

  const deleteHandler = async () => {
    try {
      await customFetch.delete(`/jobs/${job._id}`);
      toast.success("Job deleted successfully");
      navigate("/dashboard/all-jobs");
    } catch (error) {
      console.error("Delete error:", error);
      toast.error(error?.response?.data?.msg || "Failed to delete job");
    }
  };

  return (
    <div className="bg-white border border-gray-200 rounded-lg shadow-sm hover:shadow-md transition-shadow duration-200 overflow-hidden">
      {/* Header with Company Initial */}
      <div className="bg-gradient-to-r from-[#2EB0BC] to-teal-500 p-4">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-full bg-white flex items-center justify-center text-[#2EB0BC] font-bold text-xl shadow-md">
            {job.company?.charAt(0)?.toUpperCase() || "?"}
          </div>
          <div className="flex-1 text-white">
            <h3 className="text-lg font-semibold capitalize">{job.position}</h3>
            <p className="text-sm text-teal-50">{job.company}</p>
          </div>
        </div>
      </div>

      {/* Job Details */}
      <div className="p-5 space-y-4">
        {/* Location and Date */}
        <div className="flex items-center justify-between text-sm text-gray-600">
          <div className="flex items-center gap-2">
            <MapPinned className="w-4 h-4 text-[#2EB0BC]" />
            <span>{job.jobLocation}</span>
          </div>
          <div className="flex items-center gap-2">
            <Calendar className="w-4 h-4 text-[#2EB0BC]" />
            <span>{formatDate(job.createdAt)}</span>
          </div>
        </div>

        {/* Job Type and Status */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Briefcase className="w-4 h-4 text-[#2EB0BC]" />
            <span
              className={`px-3 py-1 rounded-full text-xs font-medium ${getJobTypeColor(
                job.jobType
              )}`}
            >
              {job.jobType}
            </span>
          </div>
          <span
            className={`px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(
              job.jobStatus
            )}`}
          >
            {job.jobStatus}
          </span>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-3 pt-2 border-t border-gray-100">
          <Link
            to={`/dashboard/edit-job/${job._id}`}
            className="flex-1 bg-[#2EB0BC] hover:bg-teal-600 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors duration-200 flex items-center justify-center gap-2"
          >
            <Edit className="w-4 h-4" />
            Edit
          </Link>
          <button
            onClick={deleteHandler}
            type="button"
            className="flex-1 bg-red-400 hover:bg-red-500 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors duration-200 flex items-center justify-center gap-2"
          >
            <Trash2 className="w-4 h-4" />
            Delete
          </button>
        </div>
      </div>
    </div>
  );
}
