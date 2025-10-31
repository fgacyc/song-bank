import { db } from "@/lib/prisma";
import { spotifyService } from "@/features/spotify/services/spotifyService";
import type { Album } from "@/types/types";

export const albumService = {
  async getAlbumsWithCovers(limit?: number): Promise<Album[]> {
    try {
      console.log(
        `Starting getAlbumsWithCovers (Spotify-only), limit: ${limit}`,
      );

      // Step 1: Fetch songs grouped by album from database
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
        where: {
          NOT: [{ album: null }, { album: "" }],
        },
        orderBy: { album: "asc" },
      });

      // Step 2: Group songs into albums
      const albumsMap = new Map<string, Album>();

      songs.forEach((song) => {
        const albumName = song.album!;

        if (!albumsMap.has(albumName)) {
          albumsMap.set(albumName, {
            id: `${albumName.toLowerCase().replace(/\s+/g, "-")}`,
            name: albumName,
            artist: song.original_band ?? "unknown",
            songs: [],
            songCount: 0,
            created_at: song.created_at!,
            updated_at: song.updated_at!,
            cover_image_url: null, // Will be fetched from Spotify
          });
        }

        const album = albumsMap.get(albumName)!;

        album.songs.push({
          id: song.id,
          name: song.name,
          original_key: song.original_key,
          song_language: song.song_language,
        });
        album.songCount = album.songs.length;

        // Update dates
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
      console.log(`Found ${albums.length} unique albums`);

      // Step 3: Fetch album covers from Spotify for all albums
      const albumsToProcess = albums.slice(
        0,
        Math.min(limit ?? albums.length, 8),
      ); // Limit Spotify calls
      const processedAlbums: Album[] = [];

      for (const album of albumsToProcess) {
        if (album.name && album.artist && album.artist !== "unknown") {
          try {
            console.log(
              `Searching Spotify for album: "${album.name}" by "${album.artist}"`,
            );
            const coverUrl = await spotifyService.searchAlbumCover(
              album.name,
              album.artist,
            );

            if (coverUrl) {
              console.log(
                `Found Spotify cover for album "${album.name}": ${coverUrl}`,
              );
              processedAlbums.push({ ...album, cover_image_url: coverUrl });
            } else {
              console.log(`No Spotify cover found for album "${album.name}"`);
              processedAlbums.push(album);
            }
          } catch (error) {
            console.error(
              `Failed to fetch Spotify cover for album "${album.name}":`,
              error,
            );
            processedAlbums.push(album);
          }

          // Rate limiting
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
