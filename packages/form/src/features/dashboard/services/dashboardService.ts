export interface DashboardCounts {
  artists: number;
  songs: number;
  albums: number;
}

export interface DashboardTopNewSong {
  id: string;
  name: string;
  image_cover_url: string | null;
  created_at: string | null;
  artist_name: string | null;
  album_name: string | null;
}

export interface DashboardPopularArtist {
  id: string;
  name: string;
  image_cover_url: string | null;
  song_count: number;
  album_count: number;
}

export interface DashboardPopularAlbum {
  id: string;
  name: string;
  artist_name: string | null;
  song_count: number;
}

export interface DashboardNewAlbum {
  id: string;
  name: string;
  song_count: number;
  image_cover_url: string | null;
  artist_name: string | null;
  release_date: string | null;
}

export interface DashboardPopularSong {
  id: string;
  name: string;
  artist_name: string | null;
  album_name: string | null;
  favorite_count: number;
}

export interface DashboardActivityLog {
  id: string;
  type: "song_added" | "search";
  title: string;
  detail: string;
  created_at: string;
}

export interface DashboardOverview {
  counts: DashboardCounts;
  top_new_songs: DashboardTopNewSong[];
  popular_artists: DashboardPopularArtist[];
  popular_albums: DashboardPopularAlbum[];
  new_albums: DashboardNewAlbum[];
  popular_songs: DashboardPopularSong[];
  recent_activities: DashboardActivityLog[];
}

export const dashboardService = {
  async getCounts(): Promise<DashboardCounts> {
    const response = await fetch("/api/total-count?type=all");

    if (!response.ok) {
      throw new Error("Failed to fetch dashboard counts");
    }

    return (await response.json()) as DashboardCounts;
  },

  async getOverview(top = 5, activity = 8): Promise<DashboardOverview> {
    const params = new URLSearchParams({
      top: String(top),
      activity: String(activity),
    });

    const response = await fetch(`/api/dashboard?${params.toString()}`);

    if (!response.ok) {
      throw new Error("Failed to fetch dashboard overview");
    }

    return (await response.json()) as DashboardOverview;
  },
};
