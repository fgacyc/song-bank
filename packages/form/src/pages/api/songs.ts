/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
// src/pages/api/songs.ts
import { db } from "@/server/db";
import type { NextApiHandler } from "next";
import { Prisma } from "@prisma/client";

const handler: NextApiHandler = async (req, res) => {
  console.log(`API /songs called with method: ${req.method}`);

  try {
    switch (req.method) {
      case "GET":
        console.log("Attempting to fetch songs from database...");
        const songs = await db.song.findMany({
          orderBy: { created_at: "desc" },
        });
        console.log(`Successfully fetched ${songs.length} songs`);
        return res.status(200).json(songs);

      case "POST":
        console.log("Creating new song:", req.body);
        const newSong = await db.song.create({
          data: {
            name: req.body.name,
            album_old: req.body.album,
            original_band: req.body.artist,
            original_key: req.body.key,
            song_language: req.body.language,
            chord_lyrics: req.body.lyrics,
            original_youtube_url: req.body.youtubeUrl,
            artist_id: req.body.artistId || null,
            album_id: req.body.albumId || null,
          },
        });
        console.log("Successfully created song:", newSong.id);
        return res.status(201).json(newSong);

      case "PUT":
        const { id, ...updateData } = req.body;
        console.log("Updating song:", id, updateData);

        // Clean up the data - map form fields to database fields
        const cleanUpdateData = {
          name: updateData.name,
          album_old: updateData.album,
          original_band: updateData.artist,
          original_key: updateData.key,
          song_language: updateData.language,
          chord_lyrics: updateData.lyrics,
          original_youtube_url: updateData.youtubeUrl,
          artist_id: updateData.artistId || null,
          album_id: updateData.albumId || null,
        };

        const updatedSong = await db.song.update({
          where: { id },
          data: cleanUpdateData,
        });
        console.log("Successfully updated song:", updatedSong.id);
        return res.status(200).json(updatedSong);

      case "DELETE":
        const { id: deleteId } = req.body;
        console.log("Deleting song:", deleteId);
        await db.song.delete({
          where: { id: deleteId },
        });
        console.log("Successfully deleted song:", deleteId);
        return res.status(200).json({ message: "Song deleted successfully" });

      default:
        res.setHeader("Allow", ["GET", "POST", "PUT", "DELETE"]);
        return res.status(405).json({ error: "Method not allowed" });
    }
  } catch (error) {
    console.error("API Error in /api/songs:", error);

    // Handle Prisma specific errors
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      console.error("Prisma error code:", error.code);
      console.error("Prisma error message:", error.message);
      return res.status(400).json({
        error: "Database error",
        code: error.code,
        message: error.message,
      });
    }

    if (error instanceof Prisma.PrismaClientUnknownRequestError) {
      console.error("Unknown Prisma error:", error.message);
      return res.status(500).json({
        error: "Unknown database error",
        message: error.message,
      });
    }

    // Handle other errors
    return res.status(500).json({
      error: "Internal Server Error",
      message: error instanceof Error ? error.message : "Unknown error",
      stack:
        process.env.NODE_ENV === "development"
          ? (error as Error).stack
          : undefined,
    });
  }
};

export default handler;

export const config = {
  api: {
    externalResolver: true,
  },
};
