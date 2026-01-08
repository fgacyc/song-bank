import type { Album, Artist, Song, Tag } from "@prisma/client";

export type ArtistType = Artist & {
  albums: AlbumType[];
  songs: SongType[];
  album_count: number;
  song_count: number;
};

export type AlbumType = Album & {
  artist: ArtistType;
  songs: SongType[];
};

export type SongType = Song & {
  artist: ArtistType;
  album: AlbumType;
  tags: Tag[];
};
