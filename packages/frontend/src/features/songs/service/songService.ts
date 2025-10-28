import { db } from "@/lib/prisma";
import { spotifyService } from "@/features/spotify/services/spotifyService";
import type { Song } from "@prisma/client";

export const songService = {
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

  async fetchAndStoreCover(song: Song): Promise<Song> {
    if (song.cover_image_url) {
      console.log(
        `Song "${song.name}" already has cover: ${song.cover_image_url}`,
      );
      return song;
    }

    if (!song.name) {
      console.log(`Song ${song.id} has no name, skipping cover fetch`);
      return song;
    }

    try {
      console.log(
        `Fetching cover for: "${song.name}" by "${song.original_band ?? "Unknown"}"`,
      );

      const coverUrl = await spotifyService.getTrackCover(
        song.name,
        song.original_band ?? undefined,
      );

      if (coverUrl) {
        console.log(`Found cover for "${song.name}": ${coverUrl}`);
        console.log(`Attempting to save cover to database...`);

        const updatedSong = await this.updateSongCover(song.id, coverUrl);
        console.log(`Successfully stored cover for "${song.name}"`);
        return updatedSong;
      } else {
        console.log(`No cover found for "${song.name}"`);
      }
    } catch (error) {
      console.error(`Failed to fetch cover for "${song.name}":`, error);
    }

    return song;
  },

  async getSongsWithCovers(limit?: number): Promise<Song[]> {
    console.log(`Starting getSongsWithCovers, limit: ${limit}`);

    const songs = await db.song.findMany({
      take: limit,
      orderBy: { created_at: "desc" },
    });

    console.log(`Found ${songs.length} songs in database`);

    // Process first 5 songs for testing
    const songsToProcess = songs.slice(0, 5);
    const updatedSongs: Song[] = [];

    for (let i = 0; i < songsToProcess.length; i++) {
      const song = songsToProcess[i];
      console.log(
        `Processing song ${i + 1}/${songsToProcess.length}: "${song.name}"`,
      );

      try {
        const updatedSong = await this.fetchAndStoreCover(song);
        updatedSongs.push(updatedSong);

        if (i < songsToProcess.length - 1) {
          console.log("Waiting 1 second before next request...");
          await new Promise((resolve) => setTimeout(resolve, 1000));
        }
      } catch (error) {
        console.error(`Error processing song "${song.name}":`, error);
        updatedSongs.push(song);
      }
    }

    const remainingSongs = songs.slice(5);
    updatedSongs.push(...remainingSongs);

    console.log(
      `Processed ${songsToProcess.length} songs, returning ${updatedSongs.length} total`,
    );

    const songsWithCovers = updatedSongs.filter((s) => s.cover_image_url);
    console.log(
      `Songs with covers: ${songsWithCovers.length}/${updatedSongs.length}`,
    );

    return updatedSongs;
  },
};
