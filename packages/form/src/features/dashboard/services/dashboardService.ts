export interface DashboardCounts {
  artists: number;
  songs: number;
  albums: number;
}

export const dashboardService = {
  async getCounts(): Promise<DashboardCounts> {
    const response = await fetch("/api/total-count?type=all");

    if (!response.ok) {
      throw new Error("Failed to fetch dashboard counts");
    }

    return (await response.json()) as DashboardCounts;
  },
};
