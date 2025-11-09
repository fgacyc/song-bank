import React from "react";
import AlbumBreadcrumb from "./AlbumBreadcrumb";
import AlbumHero from "./AlbumHero";
import AlbumSongList from "./AlbumSongList";
import type { AlbumTypeWithSongs } from "../types/types";

interface AlbumPageProps {
  album: AlbumTypeWithSongs;
}

const AlbumPage = ({ album }: AlbumPageProps) => {
  return (
    <div className="space-y-2 pt-6">
      <AlbumBreadcrumb album={album} />
      <div className="space-y-12">
        <AlbumHero album={album} />
        <AlbumSongList album={album} />
      </div>
    </div>
  );
};

export default AlbumPage;
