import { useEffect, useState } from "react";

import {
  dashboardService,
  type DashboardCounts,
} from "../services/dashboardService";

export const useDashboard = () => {
  const [counts, setCounts] = useState<DashboardCounts | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    let isMounted = true;

    const loadCounts = async () => {
      try {
        setIsLoading(true);
        setError(null);

        const data = await dashboardService.getCounts();

        if (isMounted) {
          setCounts(data);
        }
      } catch (err) {
        if (isMounted) {
          setError(
            err instanceof Error
              ? err
              : new Error("Failed to load dashboard counts"),
          );
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };

    void loadCounts();

    return () => {
      isMounted = false;
    };
  }, []);

  return {
    counts,
    isLoading,
    error,
  };
};
