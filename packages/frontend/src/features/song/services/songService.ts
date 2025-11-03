import type { Song, Tag } from "@prisma/client";

export const songService = {
  async getSongByIdViaAPI(
    songId: string,
  ): Promise<(Song & { tags: Tag[] }) | null> {
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

      const song = (await response.json()) as Song & { tags: Tag[] };
      console.log(`Found song: "${song.name}"`);
      return song;
    } catch (error) {
      console.error(`Error fetching song ${songId}:`, error);
      throw error;
    }
  },

  async getTopHotSongsViaAPI(limit = 20): Promise<Song & { tags: Tag[] }[]> {
    try {
      console.log(`Fetching top hot songs, limit: ${limit}`);
      const response = await fetch(
        `/api/songs?type=topHotSongs&limit=${limit}`,
      );

      if (!response.ok) {
        throw new Error(`Failed to fetch top hot songs: ${response.status}`);
      }

      const songs = (await response.json()) as Song & { tags: Tag[] }[];
      console.log(`Found ${songs.length} top hot songs`);
      return songs;
    } catch (error) {
      console.error("Error fetching top hot songs:", error);
      throw error;
    }
  },

  // Utility methods
  generateSongSlug(song: Song): string {
    const nameSlug = song.name
      ? song.name
          .toLowerCase()
          .replace(/[^a-z0-9\s-]/g, "") // Remove special chars except spaces and hyphens
          .replace(/\s+/g, "-") // Replace spaces with hyphens
          .replace(/-+/g, "-") // Replace multiple hyphens with single
          .replace(/^-+|-+$/g, "") // Remove leading/trailing hyphens
      : "unknown-song";

    // Add artist if available
    const artistSlug = song.original_band
      ? song.original_band
          .toLowerCase()
          .replace(/[^a-z0-9\s-]/g, "")
          .replace(/\s+/g, "-")
          .replace(/-+/g, "-")
          .replace(/^-+|-+$/g, "")
      : null;

    const fullSlug = artistSlug ? `${nameSlug}-by-${artistSlug}` : nameSlug;

    // Use underscore as delimiter before UUID
    return `${fullSlug}_${song.id}`;
  },

  extractSongId(songParam: string): string | null {
    try {
      const lastUnderscoreIndex = songParam.lastIndexOf("_");

      if (lastUnderscoreIndex === -1) {
        console.warn(`No underscore delimiter found in: ${songParam}`);
        return null;
      }

      const uuid = songParam.substring(lastUnderscoreIndex + 1);

      const uuidRegex =
        /^[a-f0-9]{8}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{12}$/i;

      if (uuidRegex.test(uuid)) {
        console.log(`Extracted song ID: ${uuid} from parameter: ${songParam}`);
        return uuid;
      }

      console.warn(`Invalid UUID format after underscore: ${uuid}`);
      return null;
    } catch (error) {
      console.error("Error extracting song ID:", error);
      return null;
    }
  },
};
