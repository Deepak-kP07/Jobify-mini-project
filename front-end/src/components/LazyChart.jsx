import { useEffect, useState } from "react";

const ChartLoader = () => (
  <div className="h-[300px] flex items-center justify-center text-gray-500 border border-gray-200 rounded-lg bg-gray-50">
    <p>Loading chart...</p>
  </div>
);

export function LazyBarChartWrapper({ data }) {
  const [ChartComponent, setChartComponent] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Only import on client side after mount
    if (typeof window !== "undefined") {
      import("./BarChart")
        .then((module) => {
          setChartComponent(() => module.default);
          setIsLoading(false);
        })
        .catch((error) => {
          console.error("Failed to load BarChart:", error);
          setIsLoading(false);
        });
    }
  }, []);

  if (isLoading || !ChartComponent) {
    return <ChartLoader />;
  }

  return <ChartComponent data={data} />;
}

export function LazyAreaChartWrapper({ data }) {
  const [ChartComponent, setChartComponent] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Only import on client side after mount
    if (typeof window !== "undefined") {
      import("./AreaChart")
        .then((module) => {
          setChartComponent(() => module.default);
          setIsLoading(false);
        })
        .catch((error) => {
          console.error("Failed to load AreaChart:", error);
          setIsLoading(false);
        });
    }
  }, []);

  if (isLoading || !ChartComponent) {
    return <ChartLoader />;
  }

  return <ChartComponent data={data} />;
}
