import type { AlbumType } from "@/types/types";
import React from "react";

interface ArtistAlbumsProps {
  albums: AlbumType[];
}

const ArtistAlbums = ({ albums }: ArtistAlbumsProps) => {
  if (!albums || albums.length === 0) {
    return <div>No albums found</div>;
  }

  return (
    <div>
      {albums.map((album) => {
        return <div key={album.id}>{album.name}</div>;
      })}
    </div>
  );
};

export default ArtistAlbums;
