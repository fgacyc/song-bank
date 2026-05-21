import { db } from "@/server/db";
import type { NextApiHandler } from "next";

const parseLimit = (value: string | string[] | undefined, fallback: number) => {
  if (!value) return fallback;

  const parsed = Number.parseInt(
    Array.isArray(value) ? (value[0] ?? "") : value,
    10,
  );

  if (Number.isNaN(parsed) || parsed < 1) {
    return fallback;
  }

  return Math.min(parsed, 20);
};

const handler: NextApiHandler = async (req, res) => {
  if (req.method !== "GET") {
    res.setHeader("Allow", ["GET"]);
    return res.status(405).json({ error: "Method not allowed" });
  }

  const topLimit = parseLimit(req.query.top, 5);
  const activityLimit = parseLimit(req.query.activity, 8);

  try {
    const [
      songCount,
      albumCount,
      artistCount,
      topNewSongsRaw,
      artistsRaw,
      newAlbumsRaw,
      albumsRaw,
      songsByFavoriteRaw,
      recentSearches,
    ] = await Promise.all([
      db.song.count(),
      db.album.count(),
      db.artist.count(),
      db.song.findMany({
        take: topLimit,
        orderBy: {
          created_at: "desc",
        },
        select: {
          id: true,
          name: true,
          cover_image_url: true,
          created_at: true,
          artist: {
            select: {
              name: true,
            },
          },
          album: {
            select: {
              name: true,
            },
          },
        },
      }),
      db.artist.findMany({
        select: {
          id: true,
          name: true,
          image_cover_url: true,
          _count: {
            select: {
              Song: true,
              Album: true,
            },
          },
        },
      }),
      db.album.findMany({
        take: topLimit,
        orderBy: {
          release_date: "desc",
        },
        select: {
          id: true,
          name: true,
          image_cover_url: true,
          release_date: true,
          artist: {
            select: {
              name: true,
            },
          },
          _count: {
            select: {
              Song: true,
            },
          },
        },
      }),
      db.album.findMany({
        select: {
          id: true,
          name: true,
          artist: {
            select: {
              name: true,
            },
          },
          _count: {
            select: {
              Song: true,
            },
          },
        },
      }),
      db.song.findMany({
        select: {
          id: true,
          name: true,
          created_at: true,
          artist: {
            select: {
              name: true,
            },
          },
          album: {
            select: {
              name: true,
            },
          },
          _count: {
            select: {
              favorite: true,
            },
          },
        },
      }),
      db.searchHistory.findMany({
        take: activityLimit,
        orderBy: {
          created_at: "desc",
        },
        select: {
          id: true,
          search_content: true,
          search_category: true,
          created_at: true,
        },
      }),
    ]);

    const topNewSongs = topNewSongsRaw.map((song) => ({
      id: song.id,
      name: song.name ?? "Untitled song",
      image_cover_url: song.cover_image_url,
      created_at: song.created_at?.toISOString() ?? null,
      artist_name: song.artist?.name ?? null,
      album_name: song.album?.name ?? null,
    }));

    const popularArtists = artistsRaw
      .map((artist) => ({
        id: artist.id,
        name: artist.name,
        image_cover_url: artist.image_cover_url,
        song_count: artist._count.Song,
        album_count: artist._count.Album,
      }))
      .sort((a, b) => {
        if (b.song_count !== a.song_count) {
          return b.song_count - a.song_count;
        }

        if (b.album_count !== a.album_count) {
          return b.album_count - a.album_count;
        }

        return a.name.localeCompare(b.name);
      })
      .slice(0, topLimit);

    const newAlbums = newAlbumsRaw.map((album) => ({
      id: album.id,
      name: album.name,
      image_cover_url: album.image_cover_url,
      song_count: album._count.Song,
      artist_name: album.artist?.name ?? null,
      release_date: album.release_date?.toISOString() ?? null,
    }));

    const popularAlbums = albumsRaw
      .map((album) => ({
        id: album.id,
        name: album.name,
        artist_name: album.artist?.name ?? null,
        song_count: album._count.Song,
      }))
      .sort((a, b) => {
        if (b.song_count !== a.song_count) {
          return b.song_count - a.song_count;
        }

        return a.name.localeCompare(b.name);
      })
      .slice(0, topLimit);

    const popularSongs = songsByFavoriteRaw
      .map((song) => ({
        id: song.id,
        name: song.name ?? "Untitled song",
        artist_name: song.artist?.name ?? null,
        album_name: song.album?.name ?? null,
        favorite_count: song._count.favorite,
        created_at: song.created_at,
      }))
      .sort((a, b) => {
        if (b.favorite_count !== a.favorite_count) {
          return b.favorite_count - a.favorite_count;
        }

        const aTime = a.created_at ? a.created_at.getTime() : 0;
        const bTime = b.created_at ? b.created_at.getTime() : 0;
        return bTime - aTime;
      })
      .slice(0, topLimit)
      .map((song) => ({
        id: song.id,
        name: song.name,
        artist_name: song.artist_name,
        album_name: song.album_name,
        favorite_count: song.favorite_count,
      }));

    const activityFeed = [
      ...topNewSongs
        .filter(
          (
            song,
          ): song is typeof song & {
            created_at: string;
          } => song.created_at !== null,
        )
        .map((song) => ({
          id: `song-${song.id}`,
          type: "song_added" as const,
          title: `Song added: ${song.name}`,
          detail:
            [song.artist_name, song.album_name].filter(Boolean).join(" • ") ||
            "Song library",
          created_at: song.created_at,
        })),
      ...recentSearches.map((item) => ({
        id: `search-${item.id}`,
        type: "search" as const,
        title: `Search: ${item.search_content}`,
        detail: item.search_category
          ? `Category: ${item.search_category}`
          : "Search activity",
        created_at: item.created_at.toISOString(),
      })),
    ]
      .sort(
        (a, b) =>
          new Date(b.created_at).getTime() - new Date(a.created_at).getTime(),
      )
      .slice(0, activityLimit);

    return res.status(200).json({
      counts: {
        songs: songCount,
        albums: albumCount,
        artists: artistCount,
      },
      top_new_songs: topNewSongs,
      popular_artists: popularArtists,
      popular_albums: popularAlbums,
      new_albums: newAlbums,
      popular_songs: popularSongs,
      recent_activities: activityFeed,
    });
  } catch (error) {
    console.error("API Error in /api/dashboard:", error);
    return res.status(500).json({
      error: "Internal Server Error",
      message: error instanceof Error ? error.message : "Unknown error",
    });
  }
};

export default handler;

export const config = {
  api: {
    externalResolver: true,
  },
};
