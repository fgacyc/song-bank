import React from "react";
import SongList from "../../shared/ui/SongList";
import type { AlbumType } from "@/types/types";

interface AlbumSongListProps {
  album: AlbumType;
}

const AlbumSongList = ({ album }: AlbumSongListProps) => {
  return (
    <div className="flex items-center justify-center px-4 pb-12">
      <SongList
        songs={album.songs}
        showAlbumName={false}
        containerClassName="w-full md:max-w-[60dvw]"
      />
    </div>
  );
};

export default AlbumSongList;
