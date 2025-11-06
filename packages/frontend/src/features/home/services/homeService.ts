import type { AlbumWithArtist, SongWithAlbumAndArtist } from "@/types/types";
import type { Artist } from "@prisma/client";

export const homeService = {
  async getLatestAlbums(): Promise<AlbumWithArtist[]> {
    try {
      const response = await fetch("/api/albums?limit=8");
      if (!response.ok) throw new Error("Failed to fetch albums");
      const albums = (await response.json()) as AlbumWithArtist[];
      return albums;
    } catch (error) {
      console.error("Error fetching latest albums:", error);
      throw error;
    }
  },

  async getFeaturedArtists(): Promise<Artist[]> {
    try {
      const response = await fetch("/api/artists?limit=4&withCovers=true");
      if (!response.ok) throw new Error("Failed to fetch artists");
      const artists = (await response.json()) as Artist[];
      return artists;
    } catch (error) {
      console.error("Error fetching featured artists:", error);
      throw error;
    }
  },

  async getTopHotSongs(): Promise<SongWithAlbumAndArtist[]> {
    try {
      const response = await fetch("/api/songs?type=topHotSongs&limit=20");
      if (!response.ok) throw new Error("Failed to fetch top hot songs");
      const songs = (await response.json()) as SongWithAlbumAndArtist[];
      return songs;
    } catch (error) {
      console.error("Error fetching top hot songs:", error);
      throw error;
    }
  },
};
