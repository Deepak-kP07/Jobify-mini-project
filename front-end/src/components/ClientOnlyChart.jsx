import { useEffect, useState } from "react";

/**
 * ClientOnlyChart - Wrapper component to ensure charts only render on the client side
 * This fixes recharts compatibility issues with React 19 SSR
 * Uses typeof window check to prevent any rendering during SSR
 */
export default function ClientOnlyChart({ children, fallback = null }) {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    // Only set to true after component mounts on client
    setIsClient(true);
  }, []);

  // During SSR and initial render, return fallback
  // This prevents recharts from trying to use hooks during SSR
  if (typeof window === "undefined" || !isClient) {
    return fallback || (
      <div className="h-[300px] flex items-center justify-center text-gray-500 border border-gray-200 rounded-lg bg-gray-50">
        <p>Loading chart...</p>
      </div>
    );
  }

  return <>{children}</>;
}

