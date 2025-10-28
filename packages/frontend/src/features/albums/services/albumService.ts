import { db } from "@/lib/prisma";
import { spotifyService } from "@/features/spotify/services/spotifyService";
import type { Album } from "@/types/types";

export const albumService = {
  async getAlbumsWithCovers(limit?: number): Promise<Album[]> {
    try {
      // Fetch songs grouped by album
      const songs = await db.song.findMany({
        select: {
          id: true,
          name: true,
          album: true,
          original_band: true,
          original_key: true,
          song_language: true,
          created_at: true,
          updated_at: true,
          cover_image_url: true,
        },
        where: { album: { not: null } },
        orderBy: { album: "asc" },
      });

      const albumsMap = new Map<string, Album>();

      songs.forEach((song) => {
        const albumName = song.album!;

        if (!albumsMap.has(albumName)) {
          albumsMap.set(albumName, {
            id: `album-${albumName.toLowerCase().replace(/\s+/g, "-")}`,
            name: albumName,
            artist: song.original_band ?? "unknown",
            songs: [],
            songCount: 0,
            created_at: song.created_at!,
            updated_at: song.updated_at!,
            cover_image_url: song.cover_image_url,
          });
        }

        const album = albumsMap.get(albumName)!; // Safe non-null assertion since we just set it

        album.songs.push({
          id: song.id,
          name: song.name,
          original_key: song.original_key,
          song_language: song.song_language,
        });
        album.songCount = album.songs.length;

        // Use the first non-null cover image found
        if (!album.cover_image_url && song.cover_image_url) {
          album.cover_image_url = song.cover_image_url;
        }

        // Safe date comparisons
        if (
          song.created_at &&
          album.created_at &&
          song.created_at > album.created_at
        ) {
          album.created_at = song.created_at;
        }
        if (
          song.updated_at &&
          album.updated_at &&
          song.updated_at > album.updated_at
        ) {
          album.updated_at = song.updated_at;
        }
      });

      const albums = Array.from(albumsMap.values()).sort(
        (a, b) => b.songCount - a.songCount,
      );

      // Fetch missing album covers in batches
      const batchSize = 3;
      const albumsWithCovers: Album[] = [];

      for (let i = 0; i < albums.length; i += batchSize) {
        const batch = albums.slice(i, i + batchSize);

        const batchPromises = batch.map(async (album): Promise<Album> => {
          // Only fetch if no cover exists and we have both album name and artist
          if (!album.cover_image_url && album.name && album.artist) {
            try {
              const coverUrl = (await spotifyService.searchImage(
                `${album.name} ${album.artist}`,
                "album",
              ))!;
              return { ...album, cover_image_url: coverUrl };
            } catch (error) {
              console.error(
                `Failed to fetch album cover for ${album.name}:`,
                error,
              );
              return album;
            }
          }
          return album;
        });

        try {
          const batchResults = await Promise.all(batchPromises);
          albumsWithCovers.push(...batchResults);
        } catch (error) {
          console.error("Batch processing error:", error);
          // Add original albums if batch fails
          albumsWithCovers.push(...batch);
        }

        // Small delay between batches to respect rate limits
        if (i + batchSize < albums.length) {
          await new Promise((resolve) => setTimeout(resolve, 200));
        }
      }

      if (limit) {
        return albumsWithCovers.slice(0, limit);
      }

      return albumsWithCovers;
    } catch (error) {
      console.error("Error in getAlbumsWithCovers:", error);
      throw new Error("Failed to fetch albums with covers");
    }
  },
};
