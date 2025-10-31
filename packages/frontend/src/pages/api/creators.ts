import type { NextApiRequest, NextApiResponse } from "next";
import { creatorService } from "@/features/creator/services/creatorService";
import type { Creator } from "@/types/types";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  if (req.method !== "GET") return res.status(405).end();

  const { limit, withCovers } = req.query;
  const take = limit ? parseInt(limit as string) : undefined;

  try {
    let creators;

    if (withCovers === "true") {
      creators = await creatorService.getCreatorsWithCovers(take);
    } else {
      const { db } = await import("@/lib/prisma");
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

      const creatorsMap = new Map<string, Creator & { albums: Set<string> }>();

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
            created_at: song.created_at ?? new Date(),
            updated_at: song.updated_at ?? new Date(),
            cover_image_url: song.cover_image_url ?? null,
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
          cover_image_url: song.cover_image_url ?? null,
        });

        if (song.album) {
          creator.albums.add(song.album);
        }

        creator.songCount = creator.songs.length;
        creator.albumCount = creator.albums.size;

        if (song.created_at! > creator.created_at) {
          creator.created_at = song.created_at ?? creator.created_at;
        }
        if (song.updated_at! > creator.updated_at) {
          creator.updated_at = song.updated_at ?? creator.updated_at;
        }
      });

      creators = Array.from(creatorsMap.values())
        .map((creator) => ({
          ...creator,
          albums: Array.from(creator.albums),
        }))
        .sort((a, b) => b.songCount - a.songCount);

      if (take) {
        creators = creators.slice(0, take);
      }
    }

    console.log(`Returning ${creators.length} creators`);
    res.status(200).json(creators);
  } catch (error) {
    console.error("API Error:", error);
    res.status(500).json({
      error: "Failed to fetch creators",
      details: error instanceof Error ? error.message : "Unknown error",
    });
  }
}
