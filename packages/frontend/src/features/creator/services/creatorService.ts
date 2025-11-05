import { db } from "@/lib/prisma";
import { spotifyService } from "@/features/spotify/services/spotifyService";
import type { Artist } from "@prisma/client";

export const creatorService = {
  // TODO: remove this once new form is created where user can select the image they want before inputting
  async getCreatorsWithCovers(limit?: number): Promise<Artist[]> {
    try {
      console.log(
        `Starting getCreatorsWithCovers (Spotify-only), limit: ${limit}`,
      );

      const artists = await db.artist.findMany({
        orderBy: {
          name: "asc",
        },
      });

      // Step 3: Fetch artist images from Spotify for all valid creators
      const creatorsToProcess = artists
        .filter((c) => c.name !== "Unknown Creator" && c.name)
        .slice(0, Math.min(limit ?? 4, 4)); // Limit Spotify calls

      const processedCreators: Artist[] = [];

      for (const creator of creatorsToProcess) {
        try {
          console.log(`Searching Spotify for artist: "${creator.name}"`);
          const coverUrl = await spotifyService.searchArtistImage(
            creator.name.toLowerCase(),
          );

          if (coverUrl) {
            console.log(
              `Found Spotify cover for artist "${creator.name}": ${coverUrl}`,
            );
            processedCreators.push({ ...creator, image_cover_url: coverUrl });
          } else {
            console.log(`No Spotify cover found for artist "${creator.name}"`);
            processedCreators.push(creator);
          }
        } catch (error) {
          console.error(
            `Failed to fetch Spotify cover for artist "${creator.name}":`,
            error,
          );
          processedCreators.push(creator);
        }

        // Rate limiting
        await new Promise((resolve) => setTimeout(resolve, 300));
      }

      // Add creators not processed (Unknown Creator, etc.)
      const remainingCreators = artists.filter(
        (c) =>
          c.name === "Unknown Creator" ||
          !c.name ||
          !creatorsToProcess.find((p) => p.id === c.id),
      );
      processedCreators.push(...remainingCreators);

      console.log(
        `Processed ${creatorsToProcess.length} creators via Spotify, returning ${processedCreators.length} total`,
      );

      if (limit) {
        return processedCreators.slice(0, limit);
      }

      return processedCreators;
    } catch (error) {
      console.error("Error in getCreatorsWithCovers:", error);
      throw new Error("Failed to fetch creators with covers");
    }
  },
};
