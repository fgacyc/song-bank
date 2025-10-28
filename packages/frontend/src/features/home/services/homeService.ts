import type { Album, Creator } from "@/types/types";
import type { Song } from "@prisma/client";

export const homeService = {
  async getLatestAlbums(): Promise<Album[]> {
    try {
      const response = await fetch("/api/albums?limit=8");
      if (!response.ok) throw new Error("Failed to fetch albums");
      const albums = (await response.json()) as Album[];

      return albums;
    } catch (error) {
      console.error("Error fetching latest albums:", error);
      throw error;
    }
  },

  async getFeaturedCreators(): Promise<Creator[]> {
    try {
      const response = await fetch("/api/creators?limit=4withCovers=true");
      if (!response.ok) throw new Error("Failed to fetch creators");
      const creators = (await response.json()) as Creator[];
      return creators;
    } catch (error) {
      console.error("Error fetching featured creators:", error);
      throw error;
    }
  },

  async getTopHotSongs() {
    try {
      const response = await fetch("/api/songs?limit=20&withCovers=true");
      if (!response.ok) throw new Error("Failed to fetch songs");
      const songs = (await response.json()) as Song[];
      return songs;
    } catch (error) {
      console.error("Error fetching top hot songs:", error);
      throw error;
    }
  },
};
