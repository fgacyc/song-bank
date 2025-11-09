import { db } from "@/lib/prisma";
import { spotifyService } from "@/features/spotify/services/spotifyService";
import type { AlbumType } from "@/types/types";

export const albumService = {
  async getAlbumsWithCovers(limit?: number): Promise<AlbumType[]> {
    try {
      const albums = await db.album.findMany({
        orderBy: { release_date: "asc" },
        include: {
          artist: true,
          _count: {
            select: {
              Song: true,
            },
          },
        },
      });

      const albumsWithCounts = albums.map((album) => ({
        ...album,
        song_count: album._count.Song,
        _count: undefined,
      }));

      const albumsToProcess = albumsWithCounts.slice(
        0,
        Math.min(limit ?? albumsWithCounts.length, 8),
      );

      const processedAlbums: AlbumType[] = [];

      for (const album of albumsToProcess) {
        if (album.name && album.artist && album.artist.name !== "unknown") {
          try {
            console.log(
              `Searching Spotify for album: "${album.name}" by "${album.artist.name}" (${album.song_count} songs)`,
            );
            const coverUrl = await spotifyService.searchAlbumCover(
              album.name,
              album.artist.name,
            );

            if (coverUrl) {
              processedAlbums.push({ ...album, image_cover_url: coverUrl });
            } else {
              processedAlbums.push(album);
            }
          } catch (error) {
            console.error(
              `Failed to fetch Spotify cover for album "${album.name}":`,
              error,
            );
            processedAlbums.push(album);
          }

          await new Promise((resolve) => setTimeout(resolve, 300));
        } else {
          processedAlbums.push(album);
        }
      }

      console.log(`Processed ${albumsToProcess.length} albums via Spotify`);
      return processedAlbums;
    } catch (error) {
      console.error("Error in getAlbumsWithCovers:", error);
      throw new Error("Failed to fetch albums with covers");
    }
  },
};
