import type { NextApiRequest, NextApiResponse } from "next";
import { db } from "@/lib/prisma";
import type { SearchResult } from "@/features/search";
import type { Prisma } from "@prisma/client";

const ITEMS_PER_PAGE = 10;

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<SearchResult | { error: string }>,
) {
  if (req.method !== "GET") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const { query, language, keySignature, date, page = "1" } = req.query;

    if (!query || typeof query !== "string") {
      return res.status(400).json({ error: "Query parameter is required" });
    }

    const pageNum = parseInt(page as string, 10);
    const skip = (pageNum - 1) * ITEMS_PER_PAGE;

    // Build where clauses for each entity type
    const searchTerm = query.trim();

    // Song search with filters
    const songWhere: Prisma.SongWhereInput = {
      OR: [
        { name: { contains: searchTerm, mode: "insensitive" } },
        { alt_name: { contains: searchTerm, mode: "insensitive" } },
        { chord_lyrics: { contains: searchTerm, mode: "insensitive" } },
        { artist: { name: { contains: searchTerm, mode: "insensitive" } } },
        { album: { name: { contains: searchTerm, mode: "insensitive" } } },
      ],
    };

    // Apply language filter
    if (language && language !== "all") {
      songWhere.song_language = language as string;
    }

    // Apply key signature filter
    if (keySignature && keySignature !== "all") {
      songWhere.original_key = keySignature as string;
    }

    // Apply date filter (search albums released on or after this date)
    const albumDateFilter: Prisma.AlbumWhereInput = date
      ? { release_date: { gte: new Date(date as string) } }
      : {};

    // Search songs
    const [songs, songsCount] = await Promise.all([
      db.song.findMany({
        where: songWhere,
        include: {
          artist: true,
          album: true,
          tags: true,
        },
        take: ITEMS_PER_PAGE,
        skip,
        orderBy: [{ name: "asc" }],
      }),
      db.song.count({ where: songWhere }),
    ]);

    // Search albums
    const albumWhere: Prisma.AlbumWhereInput = {
      OR: [
        { name: { contains: searchTerm, mode: "insensitive" } },
        { artist: { name: { contains: searchTerm, mode: "insensitive" } } },
      ],
      ...albumDateFilter,
    };

    const [albumsRaw, albumsCount] = await Promise.all([
      db.album.findMany({
        where: albumWhere,
        include: {
          artist: true,
          _count: {
            select: {
              Song: true,
            },
          },
        },
        take: ITEMS_PER_PAGE,
        skip,
        orderBy: [{ name: "asc" }],
      }),
      db.album.count({ where: albumWhere }),
    ]);

    // Map albums to include song_count
    const albums = albumsRaw.map((album) => ({
      ...album,
      song_count: album._count.Song,
    }));

    // Search artists
    const artistWhere: Prisma.ArtistWhereInput = {
      name: { contains: searchTerm, mode: "insensitive" },
    };

    const [artistsRaw, artistsCount] = await Promise.all([
      db.artist.findMany({
        where: artistWhere,
        include: {
          _count: {
            select: {
              Album: true,
              Song: true,
            },
          },
        },
        take: ITEMS_PER_PAGE,
        skip,
        orderBy: [{ name: "asc" }],
      }),
      db.artist.count({ where: artistWhere }),
    ]);

    // Map artists to include counts
    const artists = artistsRaw.map((artist) => ({
      ...artist,
      album_count: artist._count.Album,
      song_count: artist._count.Song,
    }));

    const totalCount = songsCount + albumsCount + artistsCount;
    const totalItems = songs.length + albums.length + artists.length;
    const hasMore = skip + totalItems < totalCount;

    return res.status(200).json({
      songs,
      albums,
      artists,
      total: totalCount,
      page: pageNum,
      hasMore,
    });
  } catch (error) {
    console.error("Search error:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
}
