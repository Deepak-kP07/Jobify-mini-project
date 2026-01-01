import { useState } from "react";
import { LazyBarChartWrapper, LazyAreaChartWrapper } from "./LazyChart";
import ChartErrorBoundary from "./ChartErrorBoundary";

export default function ChartContainer({ data }) {
  const [barChart, setBarChart] = useState(true);

  if (!data || !Array.isArray(data) || data.length === 0) {
    return (
      <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-6 mt-8">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">Monthly Applications</h2>
        <p className="text-gray-500">No data available to display.</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-6 mt-8">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-gray-800">Monthly Applications</h2>
        <button
          type="button"
          onClick={() => setBarChart(!barChart)}
          className="bg-[#2EB0BC] hover:bg-teal-600 text-white px-4 py-2 rounded-md font-medium transition-colors duration-200"
        >
          {barChart ? "Show Area Chart" : "Show Bar Chart"}
        </button>
      </div>
      <ChartErrorBoundary>
        {barChart ? <LazyBarChartWrapper data={data} /> : <LazyAreaChartWrapper data={data} />}
      </ChartErrorBoundary>
    </div>
  );
}
