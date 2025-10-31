import { db } from "@/lib/prisma";
import { spotifyService } from "@/features/spotify/services/spotifyService";
import type { Creator } from "@/types/types";

export const creatorService = {
  async getCreatorsWithCovers(limit?: number): Promise<Creator[]> {
    try {
      console.log(
        `Starting getCreatorsWithCovers (Spotify-only), limit: ${limit}`,
      );

      // Step 1: Fetch songs from database
      const songs = await db.song.findMany({
        select: {
          id: true,
          name: true,
          album: true,
          original_band: true,
          original_key: true,
          song_language: true,
          original_youtube_url: true,
          created_at: true,
          updated_at: true,
          cover_image_url: true,
        },
        orderBy: {
          original_band: "asc",
        },
      });

      console.log(`Found ${songs.length} songs in database`);

      // Step 2: Group songs by creator
      const creatorsMap = new Map<string, Creator>();

      songs.forEach((song) => {
        const creatorName = song.original_band ?? "Unknown Creator";

        if (!creatorsMap.has(creatorName)) {
          creatorsMap.set(creatorName, {
            id: `${creatorName.toLowerCase().replace(/\s+/g, "-")}`,
            name: creatorName,
            songs: [],
            albums: new Set(),
            songCount: 0,
            albumCount: 0,
            created_at: song.created_at!,
            updated_at: song.updated_at!,
            cover_image_url: null, // Will be fetched from Spotify
          });
        }

        const creator = creatorsMap.get(creatorName)!;

        creator.songs.push({
          id: song.id,
          name: song.name,
          album: song.album,
          original_key: song.original_key,
          song_language: song.song_language,
          original_youtube_url: song.original_youtube_url,
          cover_image_url: song.cover_image_url,
        });

        if (song.album) {
          (creator.albums as Set<string>).add(song.album);
        }

        creator.songCount = creator.songs.length;
        creator.albumCount = (creator.albums as Set<string>).size;

        // Update dates
        if (
          song.created_at &&
          creator.created_at &&
          song.created_at > creator.created_at
        ) {
          creator.created_at = song.created_at;
        }
        if (
          song.updated_at &&
          creator.updated_at &&
          song.updated_at > creator.updated_at
        ) {
          creator.updated_at = song.updated_at;
        }
      });

      const creators = Array.from(creatorsMap.values())
        .map((creator: Creator) => ({
          ...creator,
          albums: Array.from(creator.albums as Set<string>),
        }))
        .sort((a, b) => b.songCount - a.songCount);

      console.log(`Found ${creators.length} unique creators`);

      // Step 3: Fetch artist images from Spotify for all valid creators
      const creatorsToProcess = creators
        .filter((c) => c.name !== "Unknown Creator" && c.name)
        .slice(0, Math.min(limit ?? 4, 4)); // Limit Spotify calls

      const processedCreators: Creator[] = [];

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
            processedCreators.push({ ...creator, cover_image_url: coverUrl });
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
      const remainingCreators = creators.filter(
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
