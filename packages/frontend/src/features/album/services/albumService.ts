import { db } from "@/lib/prisma";
import { spotifyService } from "@/features/spotify/services/spotifyService";
import type { Album } from "@prisma/client";

export const albumService = {
  // TODO: remove this once new form is created where user can select the image they want before inputting
  async getAlbumsWithCovers(limit?: number): Promise<Album[]> {
    try {
      const albums = await db.album.findMany({
        orderBy: { release_date: "asc" },
        include: {
          artist: true,
        },
      });

      // Step 3: Fetch album covers from Spotify for all albums
      const albumsToProcess = albums.slice(
        0,
        Math.min(limit ?? albums.length, 8),
      ); // Limit Spotify calls
      const processedAlbums: Album[] = [];

      for (const album of albumsToProcess) {
        if (album.name && album.artist && album.artist.name !== "unknown") {
          try {
            console.log(
              `Searching Spotify for album: "${album.name}" by "${album.artist.name}"`,
            );
            const coverUrl = await spotifyService.searchAlbumCover(
              album.name,
              album.artist.name as string,
            );

            if (coverUrl) {
              console.log(
                `Found Spotify cover for album "${album.name}": ${coverUrl}`,
              );
              processedAlbums.push({ ...album, image_cover_url: coverUrl });
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
