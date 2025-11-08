import type { ArtistType, AlbumType, SongType } from "@/types/types";

export const homeService = {
  async getLatestAlbums(): Promise<AlbumType[]> {
    try {
      const response = await fetch("/api/albums?limit=8");
      if (!response.ok) throw new Error("Failed to fetch albums");
      const albums = (await response.json()) as AlbumType[];
      return albums;
    } catch (error) {
      console.error("Error fetching latest albums:", error);
      throw error;
    }
  },

  async getFeaturedArtists(): Promise<ArtistType[]> {
    try {
      const response = await fetch("/api/artists?limit=4");
      if (!response.ok) throw new Error("Failed to fetch artists");
      const artists = (await response.json()) as ArtistType[];
      return artists;
    } catch (error) {
      console.error("Error fetching featured artists:", error);
      throw error;
    }
  },

  async getTopHotSongs(): Promise<SongType[]> {
    try {
      const response = await fetch("/api/songs?type=topHotSongs&limit=20");
      if (!response.ok) throw new Error("Failed to fetch top hot songs");
      const songs = (await response.json()) as SongType[];
      return songs;
    } catch (error) {
      console.error("Error fetching top hot songs:", error);
      throw error;
    }
  },
};
