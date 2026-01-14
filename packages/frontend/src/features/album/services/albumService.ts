import { db } from "@/lib/prisma";
import type { AlbumType } from "@/types/types";

export const albumService = {
  async getAlbums(limit?: number): Promise<AlbumType[]> {
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
      }) as AlbumType[];

      return albumsWithCounts;
    } catch (error) {
      console.error("Error in getAlbums:", error);
      throw new Error("Failed to fetch albums");
    }
  },

  async getAlbumById(albumId: string): Promise<AlbumType | null> {
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

      const { _count, Song, ...albumWithoutCount } = album;
      const albumWithCount: AlbumType = {
        ...albumWithoutCount,
        song_count: _count.Song,
        songs: Song,
      } as AlbumType;

      return albumWithCount;
    } catch (error) {
      console.error(`Error in getAlbumById for ID ${albumId}:`, error);
      throw new Error("Failed to fetch album by ID");
    }
  },
};
