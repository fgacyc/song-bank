import { db } from "@/lib/prisma";
import type { AlbumTypeBase, AlbumTypeWithSongs } from "../types/types";

export const albumService = {
  async getAlbums(limit?: number): Promise<AlbumTypeBase[]> {
    try {
      const albums = await db.album.findMany({
        orderBy: { release_date: "asc" },
        include: {
          artist: true,
          _count: {
            select: {
              Song: true,
            },
          },
        },
        take: limit ? limit : undefined,
      });

      if (!albums) return [];

      const albumsWithCounts = albums.map((album) => {
        const { _count, ...albumWithoutCount } = album;
        return {
          ...albumWithoutCount,
          song_count: _count.Song,
        };
      }) as AlbumTypeBase[];

      return albumsWithCounts;
    } catch (error) {
      console.error("Error in getAlbums:", error);
      throw new Error("Failed to fetch albums");
    }
  },

  async getAlbumById(albumId: string): Promise<AlbumTypeWithSongs | null> {
    try {
      const album = await db.album.findUnique({
        where: { id: albumId },
        include: {
          artist: true,
          Song: {
            include: {
              tags: true,
            },
          },
          _count: {
            select: {
              Song: true,
            },
          },
        },
      });

      if (!album) return null;

      const { _count, ...albumWithoutCount } = album;
      const albumWithCount: AlbumTypeWithSongs = {
        ...albumWithoutCount,
        song_count: _count.Song,
      } as AlbumTypeWithSongs;

      return albumWithCount;
    } catch (error) {
      console.error(`Error in getAlbumById for ID ${albumId}:`, error);
      throw new Error("Failed to fetch album by ID");
    }
  },
};
