import { MapPinned, Calendar, Briefcase, Trash2, Edit, Building2, Clock } from "lucide-react";
import customFetch from "../utils/customFetch";
import { useNavigate, Link } from "react-router-dom";
import { toast } from "react-toastify";

const formatDate = (dateString) => {
  const date = new Date(dateString);
  const now = new Date();
  const diffTime = Math.abs(now - date);
  const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
  
  if (diffDays === 0) return "Today";
  if (diffDays === 1) return "Yesterday";
  if (diffDays < 7) return `${diffDays} days ago`;
  if (diffDays < 30) return `${Math.floor(diffDays / 7)} weeks ago`;
  if (diffDays < 365) return `${Math.floor(diffDays / 30)} months ago`;
  
  return date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
};

const getStatusColor = (status) => {
  const statusColors = {
    pending: "bg-amber-50 text-amber-700 border-amber-200 shadow-amber-100",
    interview: "bg-blue-50 text-blue-700 border-blue-200 shadow-blue-100",
    declined: "bg-rose-50 text-rose-700 border-rose-200 shadow-rose-100",
  };
  return statusColors[status] || "bg-gray-50 text-gray-700 border-gray-200 shadow-gray-100";
};

const getJobTypeColor = (type) => {
  const typeColors = {
    "full-time": "bg-emerald-50 text-emerald-700 border-emerald-200",
    "part-time": "bg-violet-50 text-violet-700 border-violet-200",
    internship: "bg-orange-50 text-orange-700 border-orange-200",
  };
  return typeColors[type] || "bg-gray-50 text-gray-700 border-gray-200";
};

const getStatusIcon = (status) => {
  const icons = {
    pending: "⏳",
    interview: "📅",
    declined: "❌",
  };
  return icons[status] || "📋";
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
    <div className="group bg-white border border-gray-200 rounded-xl shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden transform hover:-translate-y-1 relative">
      {/* Decorative gradient bar */}
      <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-[#2EB0BC] via-teal-400 to-cyan-400"></div>
      
      {/* Header with Company Initial */}
      <div className="bg-gradient-to-br from-[#2EB0BC] via-teal-500 to-cyan-500 p-5 relative overflow-hidden">
        <div className="absolute inset-0 bg-black/5 group-hover:bg-black/10 transition-colors duration-300"></div>
        <div className="relative flex items-center gap-4">
          <div className="w-16 h-16 rounded-xl bg-white/95 backdrop-blur-sm flex items-center justify-center text-[#2EB0BC] font-bold text-2xl shadow-lg transform group-hover:scale-110 transition-transform duration-300 border-2 border-white/50">
            {job.company?.charAt(0)?.toUpperCase() || "?"}
          </div>
          <div className="flex-1 text-white min-w-0">
            <h3 className="text-xl font-bold capitalize mb-1 truncate group-hover:text-teal-50 transition-colors">
              {job.position}
            </h3>
            <div className="flex items-center gap-2 text-teal-50/90">
              <Building2 className="w-4 h-4 flex-shrink-0" />
              <p className="text-sm font-medium truncate">{job.company}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Job Details */}
      <div className="p-6 space-y-5">
        {/* Location and Date */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="flex items-center gap-3 text-sm text-gray-700 bg-gray-50 rounded-lg p-3 hover:bg-gray-100 transition-colors">
            <div className="p-2 bg-[#2EB0BC]/10 rounded-lg">
              <MapPinned className="w-4 h-4 text-[#2EB0BC]" />
            </div>
            <span className="font-medium truncate">{job.jobLocation}</span>
          </div>
          <div className="flex items-center gap-3 text-sm text-gray-700 bg-gray-50 rounded-lg p-3 hover:bg-gray-100 transition-colors">
            <div className="p-2 bg-[#2EB0BC]/10 rounded-lg">
              <Clock className="w-4 h-4 text-[#2EB0BC]" />
            </div>
            <span className="font-medium">{formatDate(job.createdAt)}</span>
          </div>
        </div>

        {/* Job Type and Status */}
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <Briefcase className="w-4 h-4 text-[#2EB0BC] flex-shrink-0" />
            <span
              className={`px-4 py-1.5 rounded-lg text-xs font-semibold border-2 shadow-sm ${getJobTypeColor(
                job.jobType
              )}`}
            >
              {job.jobType.replace("-", " ")}
            </span>
          </div>
          <span
            className={`px-4 py-1.5 rounded-lg text-xs font-semibold border-2 shadow-sm flex items-center gap-1.5 ${getStatusColor(
              job.jobStatus
            )}`}
          >
            <span>{getStatusIcon(job.jobStatus)}</span>
            {job.jobStatus}
          </span>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-3 pt-4 border-t border-gray-100">
          <Link
            to={`/dashboard/edit-job/${job._id}`}
            className="flex-1 bg-gradient-to-r from-[#2EB0BC] to-teal-600 hover:from-teal-600 hover:to-[#2EB0BC] text-white px-4 py-2.5 rounded-lg text-sm font-semibold transition-all duration-200 flex items-center justify-center gap-2 shadow-md hover:shadow-lg transform hover:scale-[1.02] active:scale-[0.98]"
          >
            <Edit className="w-4 h-4" />
            Edit
          </Link>
          <button
            onClick={deleteHandler}
            type="button"
            className="flex-1 bg-gradient-to-r from-red-500 to-rose-600 hover:from-rose-600 hover:to-red-500 text-white px-4 py-2.5 rounded-lg text-sm font-semibold transition-all duration-200 flex items-center justify-center gap-2 shadow-md hover:shadow-lg transform hover:scale-[1.02] active:scale-[0.98]"
          >
            <Trash2 className="w-4 h-4" />
            Delete
          </button>
        </div>
      </div>
    </div>
  );
}
