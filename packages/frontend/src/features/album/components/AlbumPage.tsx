import type { AlbumType } from "@/types/types";
import React from "react";
import AlbumBreadcrumb from "./AlbumBreadcrumb";
import AlbumHero from "./AlbumHero";
import AlbumSongList from "./AlbumSongList";

interface AlbumPageProps {
  album: AlbumType;
}

const AlbumPage = ({ album }: AlbumPageProps) => {
  return (
    <div className="space-y-2 pt-6">
      <AlbumBreadcrumb album={album} />
      <AlbumHero />
      <AlbumSongList />
    </div>
  );
};

export default AlbumPage;
