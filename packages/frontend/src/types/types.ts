import type { Album, Artist, Song, Tag } from "@prisma/client";

export type AlbumWithArtist = Album & {
  artist: Artist;
};

export type SongWithAlbumAndArtist = Song & {
  artist: Artist;
  album: Album;
  tags: Tag[];
};
