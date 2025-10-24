import type { Album } from "@/types/types";
import type { Song } from "@prisma/client";

export const homeService = {
  async getLatestAlbums(): Promise<Album[]> {
    try {
      const response = await fetch("/api/albums?limit=5");
      if (!response.ok) throw new Error("Failed to fetch albums");
      const albums = (await response.json()) as Album[];

      return albums;
    } catch (error) {
      console.error("Error fetching latest albums:", error);
      throw error;
    }
  },
  async getTopHotSongs() {
    try {
      const response = await fetch("/api/songs?limit=20");
      if (!response.ok) throw new Error("Failed to fetch songs");
      const songs = (await response.json()) as Song[];
      return songs;
    } catch (error) {
      console.error("Error fetching top hot songs:", error);
      throw error;
    }
  },
};
