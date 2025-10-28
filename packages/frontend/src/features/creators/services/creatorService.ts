import { db } from "@/lib/prisma";
import { spotifyService } from "@/features/spotify/services/spotifyService";
import type { Creator } from "@/types/types";

export const creatorService = {
  async getCreatorsWithCovers(limit?: number): Promise<Creator[]> {
    try {
      console.log(`Fetching creators with covers, limit: ${limit}`);

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

      const creatorsMap = new Map<string, Creator>();

      songs.forEach((song) => {
        const creatorName = song.original_band ?? "Unknown Creator";

        if (!creatorsMap.has(creatorName)) {
          creatorsMap.set(creatorName, {
            id: `creator-${creatorName.toLowerCase().replace(/\s+/g, "-")}`,
            name: creatorName,
            songs: [],
            albums: new Set(),
            songCount: 0,
            albumCount: 0,
            created_at: song.created_at!,
            updated_at: song.updated_at!,
            cover_image_url: null, // Don't use song covers for artists
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

      // Fetch artist images from Spotify
      const creatorsToProcess = creators.slice(0, Math.min(4, creators.length));
      const processedCreators: Creator[] = [];

      for (const creator of creatorsToProcess) {
        if (creator.name === "Unknown Creator" || !creator.name) {
          processedCreators.push(creator);
          continue;
        }

        try {
          console.log(`Searching Spotify for artist: "${creator.name}"`);
          const coverUrl = await spotifyService.searchArtistImage(creator.name);

          if (coverUrl) {
            console.log(
              `Found cover for artist "${creator.name}": ${coverUrl}`,
            );
            processedCreators.push({ ...creator, cover_image_url: coverUrl });
          } else {
            console.log(`No cover found for artist "${creator.name}"`);
            processedCreators.push(creator);
          }
        } catch (error) {
          console.error(
            `Failed to fetch artist cover for "${creator.name}":`,
            error,
          );
          processedCreators.push(creator);
        }

        // Wait between requests
        await new Promise((resolve) => setTimeout(resolve, 300));
      }

      const remainingCreators = creators.slice(creatorsToProcess.length);
      processedCreators.push(...remainingCreators);

      console.log(
        `Processed ${creatorsToProcess.length} creators, returning ${processedCreators.length} total`,
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
