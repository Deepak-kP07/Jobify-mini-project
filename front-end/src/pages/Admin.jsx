import { useLoaderData } from "react-router-dom";
import StatItem from "../components/StatItem";
import { Users, Briefcase, Shield, TrendingUp } from "lucide-react";

export default function Admin() {
  const { users, jobs } = useLoaderData();

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <Shield className="w-8 h-8 text-[#2EB0BC]" />
            <h1 className="text-3xl font-bold text-gray-800">
              Admin Dashboard
            </h1>
          </div>
          <p className="text-gray-500">
            Overview of application statistics and user management
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <StatItem
            title="Total Users"
            count={users || 0}
            icon={<Users className="w-8 h-8" />}
            color="blue"
          />
          <StatItem
            title="Total Jobs"
            count={jobs || 0}
            icon={<Briefcase className="w-8 h-8" />}
            color="green"
          />
          <StatItem
            title="Active Jobs"
            count={jobs || 0}
            icon={<TrendingUp className="w-8 h-8" />}
            color="teal"
          />
          <StatItem
            title="Pending Jobs"
            count={0}
            icon={<Briefcase className="w-8 h-8" />}
            color="orange"
          />
        </div>
      </div>
    </div>
  );
}
