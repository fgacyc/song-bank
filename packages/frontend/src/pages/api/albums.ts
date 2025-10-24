// src/pages/api/albums.ts
import type { NextApiRequest, NextApiResponse } from "next";
import { db } from "@/lib/prisma";
import type { Album } from "@/types/types";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  if (req.method !== "GET") return res.status(405).end();

  const { limit } = req.query;
  const take = limit ? parseInt(limit as string) : undefined;

  try {
    const songs = await db.song.findMany({
      select: {
        id: true,
        name: true,
        album: true,
        original_band: true,
        original_key: true,
        song_language: true,
        created_at: true,
        updated_at: true,
      },
      where: {
        album: {
          not: null,
        },
      },
      orderBy: {
        album: "asc",
      },
    });

    const albumsMap = new Map();

    songs.forEach((song) => {
      const albumName = song.album!;

      if (!albumsMap.has(albumName)) {
        albumsMap.set(albumName, {
          id: `album-${albumName.toLowerCase().replace(/\s+/g, "-")}`,
          name: albumName,
          artist: song.original_band,
          songs: [],
          songCount: 0,
          created_at: song.created_at,
          updated_at: song.updated_at,
        });
      }

      const album = albumsMap.get(albumName) as Album;
      album.songs.push({
        id: song.id,
        name: song.name,
        original_key: song.original_key,
        song_language: song.song_language,
      });
      album.songCount = album.songs.length;

      if (song.created_at! > album.created_at) {
        album.created_at = song.created_at!;
      }
      if (song.updated_at! > album.updated_at) {
        album.updated_at = song.updated_at!;
      }
    });

    let albums = Array.from(albumsMap.values()).sort(
      (a: Album, b: Album) => b.songCount - a.songCount,
    );

    if (take) {
      albums = albums.slice(0, take);
    }

    res.status(200).json(albums);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to fetch albums" });
  }
}
