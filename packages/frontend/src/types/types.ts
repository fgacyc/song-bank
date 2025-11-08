import type { Album, Artist, Song, Tag } from "@prisma/client";

export type ArtistType = Artist & {
  album_count: number;
  song_count: number;
};

export type AlbumType = Album & {
  artist: Artist;
};

export type SongType = Song & {
  artist: Artist;
  album: Album;
  tags: Tag[];
};
