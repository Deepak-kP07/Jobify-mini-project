import { useLoaderData } from "react-router-dom";
import StatsContainer from "../components/StatsContainer";
import ChartContainer from "../components/ChartContainer";

export default function Stats() {
  const { defaultStats, monthlyApplications } = useLoaderData();
  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">Statistics</h1>
          <p className="text-gray-500">Overview of your job applications</p>
        </div>
        <StatsContainer defaultStats={defaultStats} />
        {monthlyApplications?.length > 0 && (
          <ChartContainer data={monthlyApplications} />
        )}
      </div>
    </div>
  );
}
