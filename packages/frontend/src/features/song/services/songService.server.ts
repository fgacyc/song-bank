import { db } from "@/lib/prisma";
import { spotifyService } from "@/features/spotify/services/spotifyService";
import type { Song } from "@prisma/client";

export const songServiceServer = {
  async updateSongCover(songId: string, coverUrl: string): Promise<Song> {
    console.log(`Updating song ${songId} with cover: ${coverUrl}`);
    try {
      const updatedSong = await db.song.update({
        where: { id: songId },
        data: { cover_image_url: coverUrl },
      });
      console.log(`Successfully updated song ${songId} with cover`);
      return updatedSong;
    } catch (error) {
      console.error(`Failed to update song ${songId}:`, error);
      throw error;
    }
  },

  async fetchAndStoreCoverFromSpotify(song: Song): Promise<Song> {
    // Step 1: Check if song already has cover in DB
    if (song.cover_image_url) {
      console.log(
        `Song "${song.name}" already has cover from DB: ${song.cover_image_url}`,
      );
      return song;
    }

    // Step 2: Skip if no song name
    if (!song.name) {
      console.log(`Song ${song.id} has no name, skipping Spotify fetch`);
      return song;
    }

    // Step 3: Search Spotify API only if no DB cover exists
    try {
      console.log(`DB has no cover for "${song.name}", searching Spotify...`);
      console.log(
        `Fetching cover for: "${song.name}" by "${song.original_band ?? "Unknown"}"`,
      );

      const coverUrl = await spotifyService.getTrackCover(
        song.name,
        song.original_band ?? undefined,
      );

      if (coverUrl) {
        console.log(`Found Spotify cover for "${song.name}": ${coverUrl}`);
        console.log(`Saving cover to database...`);

        const updatedSong = await this.updateSongCover(song.id, coverUrl);
        console.log(`Successfully stored cover for "${song.name}"`);
        return updatedSong;
      } else {
        console.log(`No Spotify cover found for "${song.name}"`);
      }
    } catch (error) {
      console.error(`Failed to fetch Spotify cover for "${song.name}":`, error);
    }

    return song;
  },

  async getSongById(songId: string): Promise<Song | null> {
    try {
      console.log(`Fetching song by ID: ${songId}`);

      const song = await db.song.findUnique({
        where: { id: songId },
      });

      if (!song) {
        console.warn(`Song not found with ID: ${songId}`);
        return null;
      }

      console.log(
        `Found song: "${song.name}" by ${song.original_band ?? "Unknown"}`,
      );

      // If song doesn't have cover, try to fetch from Spotify (Database-First approach)
      if (!song.cover_image_url && song.name) {
        try {
          console.log(
            `Song "${song.name}" has no cover, attempting Spotify fetch...`,
          );
          const updatedSong = await this.fetchAndStoreCoverFromSpotify(song);
          return updatedSong;
        } catch (error) {
          console.error(
            `Failed to fetch Spotify cover for song "${song.name}":`,
            error,
          );
          return song; // Return original song if Spotify fetch fails
        }
      }

      return song;
    } catch (error) {
      console.error(`Error fetching song by ID ${songId}:`, error);
      throw error;
    }
  },

  async getSongsWithCovers(limit?: number): Promise<Song[]> {
    console.log(
      `Starting getSongsWithCovers (DB-first approach), limit: ${limit}`,
    );

    try {
      // Step 1: Fetch songs from database
      const songs = await db.song.findMany({
        take: limit,
        orderBy: { created_at: "desc" },
      });

      console.log(`Found ${songs.length} songs in database`);

      // Step 2: Count songs with existing covers
      const songsWithCovers = songs.filter((s) => s.cover_image_url);
      const songsWithoutCovers = songs.filter((s) => !s.cover_image_url);

      console.log(`Songs with existing covers: ${songsWithCovers.length}`);
      console.log(`Songs needing Spotify lookup: ${songsWithoutCovers.length}`);

      // Step 3: Process only songs without covers (DB-first approach)
      const songsToProcess = songsWithoutCovers.slice(0, 3); // Limit Spotify calls
      const updatedSongs: Song[] = [...songsWithCovers]; // Start with songs that have covers

      for (let i = 0; i < songsToProcess.length; i++) {
        const song = songsToProcess[i];

        if (!song) {
          continue;
        }

        console.log(
          `Processing song ${i + 1}/${songsToProcess.length}: "${song.name}" (no DB cover)`,
        );

        try {
          const updatedSong = await this.fetchAndStoreCoverFromSpotify(song);
          updatedSongs.push(updatedSong);

          if (i < songsToProcess.length - 1) {
            console.log("Waiting 1 second before next Spotify request...");
            await new Promise((resolve) => setTimeout(resolve, 1000));
          }
        } catch (error) {
          console.error(`Error processing song "${song.name}":`, error);
          updatedSongs.push(song);
        }
      }

      // Step 4: Add remaining songs without processing
      const remainingSongsWithoutCovers = songsWithoutCovers.slice(3);
      updatedSongs.push(...remainingSongsWithoutCovers);

      console.log(
        `Processed ${songsToProcess.length} songs via Spotify, returning ${updatedSongs.length} total`,
      );

      const finalSongsWithCovers = updatedSongs.filter(
        (s) => s.cover_image_url,
      );
      console.log(
        `Final count - Songs with covers: ${finalSongsWithCovers.length}/${updatedSongs.length}`,
      );

      return updatedSongs;
    } catch (error) {
      console.error("Error in getSongsWithCovers:", error);
      throw error;
    }
  },

  async getAllSongs(limit?: number): Promise<Song[]> {
    try {
      console.log(`Fetching all songs, limit: ${limit}`);

      const songs = await db.song.findMany({
        take: limit,
        orderBy: { created_at: "desc" },
      });

      console.log(`Found ${songs.length} songs`);
      return songs;
    } catch (error) {
      console.error("Error fetching all songs:", error);
      throw error;
    }
  },
};
