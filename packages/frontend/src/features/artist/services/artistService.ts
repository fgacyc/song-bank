import { db } from "@/lib/prisma";
import { spotifyService } from "@/features/spotify/services/spotifyService";
import type { Artist } from "@prisma/client";

export const artistService = {
  // TODO: remove this once new form is created where user can select the image they want before inputting
  async getArtistsWithCovers(limit?: number): Promise<Artist[]> {
    try {
      console.log(
        `Starting getArtistsWithCovers (Spotify-only), limit: ${limit}`,
      );

      const artists = await db.artist.findMany({
        orderBy: {
          name: "asc",
        },
      });

      // Step 3: Fetch artist images from Spotify for all valid artists
      const artistsToProcess = artists
        .filter((c) => c.name !== "Unknown Artist" && c.name)
        .slice(0, Math.min(limit ?? 4, 4)); // Limit Spotify calls

      const processedArtists: Artist[] = [];

      for (const artist of artistsToProcess) {
        try {
          console.log(`Searching Spotify for artist: "${artist.name}"`);
          const coverUrl = await spotifyService.searchArtistImage(
            artist.name.toLowerCase(),
          );

          if (coverUrl) {
            console.log(
              `Found Spotify cover for artist "${artist.name}": ${coverUrl}`,
            );
            processedArtists.push({ ...artist, image_cover_url: coverUrl });
          } else {
            console.log(`No Spotify cover found for artist "${artist.name}"`);
            processedArtists.push(artist);
          }
        } catch (error) {
          console.error(
            `Failed to fetch Spotify cover for artist "${artist.name}":`,
            error,
          );
          processedArtists.push(artist);
        }

        // Rate limiting
        await new Promise((resolve) => setTimeout(resolve, 300));
      }

      // Add artists not processed (Unknown Artist, etc.)
      const remainingArtists = artists.filter(
        (c) =>
          c.name === "Unknown Artist" ||
          !c.name ||
          !artistsToProcess.find((p) => p.id === c.id),
      );
      processedArtists.push(...remainingArtists);

      console.log(
        `Processed ${artistsToProcess.length} artists via Spotify, returning ${processedArtists.length} total`,
      );

      if (limit) {
        return processedArtists.slice(0, limit);
      }

      return processedArtists;
    } catch (error) {
      console.error("Error in getArtistsWithCovers:", error);
      throw new Error("Failed to fetch artists with covers");
    }
  },
};
