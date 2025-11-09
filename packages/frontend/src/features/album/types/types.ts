import type { Album, Artist, Song, Tag } from "@prisma/client";

export type SongType = Song & {
  tags: Tag[];
};

// Base album type (without songs)
export type AlbumTypeBase = Album & {
  artist: Artist;
  song_count: number;
};

// Album type with songs included
export type AlbumTypeWithSongs = AlbumTypeBase & {
  Song: SongType[];
};

// For backward compatibility
export type AlbumType = AlbumTypeWithSongs;
