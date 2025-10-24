import type { NextApiRequest, NextApiResponse } from "next";
import { db } from "@/lib/prisma";
import type { Creator } from "@/types/types";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  if (req.method !== "GET") return res.status(405).end();

  try {
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
      },
      orderBy: {
        original_band: "asc",
      },
    });

    const creatorsMap = new Map();

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
          created_at: song.created_at,
          updated_at: song.updated_at,
        });
      }

      const creator = creatorsMap.get(creatorName) as Creator;
      creator.songs.push({
        id: song.id,
        name: song.name,
        album: song.album,
        original_key: song.original_key,
        song_language: song.song_language,
        original_youtube_url: song.original_youtube_url,
      });

      if (song.album) {
        (creator.albums as Set<string>).add(song.album);
      }

      creator.songCount = creator.songs.length;
      creator.albumCount = (creator.albums as Set<string>).size;

      if (song.created_at! > creator.created_at) {
        creator.created_at = song.created_at ?? creator.created_at;
      }
      if (song.updated_at! > creator.updated_at) {
        creator.updated_at = song.updated_at ?? creator.updated_at;
      }
    });

    const creators = Array.from(creatorsMap.values())
      .map((creator: Creator) => ({
        ...creator,
        albums: Array.from(creator.albums as Set<string>),
      }))
      .sort((a, b) => b.songCount - a.songCount);

    res.status(200).json(creators);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to fetch creators" });
  }
}
