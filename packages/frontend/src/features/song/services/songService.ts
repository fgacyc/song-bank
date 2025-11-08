import type { SongType } from "@/types/types";

export const songService = {
  async getSongByIdViaAPI(songId: string): Promise<SongType | null> {
    try {
      console.log(`Fetching song by ID: ${songId}`);
      const response = await fetch(`/api/songs?type=byId&id=${songId}`);

      if (!response.ok) {
        if (response.status === 404) {
          console.warn(`Song not found: ${songId}`);
          return null;
        }
        throw new Error(`Failed to fetch song: ${response.status}`);
      }

      const song = (await response.json()) as SongType;
      console.log(`Found song: "${song.name}"`);
      return song;
    } catch (error) {
      console.error(`Error fetching song ${songId}:`, error);
      throw error;
    }
  },

  async getTopHotSongsViaAPI(limit = 20): Promise<SongType[]> {
    try {
      console.log(`Fetching top hot songs, limit: ${limit}`);
      const response = await fetch(
        `/api/songs?type=topHotSongs&limit=${limit}`,
      );

      if (!response.ok) {
        throw new Error(`Failed to fetch top hot songs: ${response.status}`);
      }

      const songs = (await response.json()) as SongType[];
      console.log(`Found ${songs.length} top hot songs`);
      return songs;
    } catch (error) {
      console.error("Error fetching top hot songs:", error);
      throw error;
    }
  },
};
