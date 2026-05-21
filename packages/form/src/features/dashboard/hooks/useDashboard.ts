import { useEffect, useState } from "react";

import {
  dashboardService,
  type DashboardOverview,
  type DashboardCounts,
} from "../services/dashboardService";

type DashboardServiceContract = {
  getOverview: (top?: number, activity?: number) => Promise<DashboardOverview>;
};

const typedDashboardService = dashboardService as DashboardServiceContract;

export const useDashboard = () => {
  const [counts, setCounts] = useState<DashboardCounts | null>(null);
  const [overview, setOverview] = useState<DashboardOverview | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    let isMounted = true;

    const loadDashboardData = async () => {
      try {
        setIsLoading(true);
        setError(null);

        const data = await typedDashboardService.getOverview(10, 8);

        if (isMounted) {
          setOverview(data);
          setCounts(data.counts);
        }
      } catch (err) {
        if (isMounted) {
          setError(
            err instanceof Error
              ? err
              : new Error("Failed to load dashboard data"),
          );
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };

    void loadDashboardData();

    return () => {
      isMounted = false;
    };
  }, []);

  return {
    counts,
    overview,
    isLoading,
    error,
  };
};
