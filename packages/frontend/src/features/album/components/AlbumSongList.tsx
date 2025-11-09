import React from "react";
import type { AlbumTypeWithSongs, SongType } from "../types/types";

interface AlbumSongProps {
  song: SongType;
  index: number;
}

const AlbumSong = ({ song, index }: AlbumSongProps) => {
  return (
    <div className="flex justify-between p-4">
      <div className="flex border">
        <div>{index + 1}</div>
        <div>cover</div>
        <div>
          <div>{song.name}</div>
          <div>tag</div>
        </div>
      </div>
      <div>key</div>
    </div>
  );
};

interface AlbumSongListProps {
  album: AlbumTypeWithSongs;
}

const AlbumSongList = ({ album }: AlbumSongListProps) => {
  return (
    <div className="flex items-center justify-center px-4">
      <div className="rounded-lg border border-border md:max-w-[70dvw]">
        {album.Song.map((song, index) => (
          <AlbumSong key={song.id} song={song} index={index} />
        ))}
      </div>
    </div>
  );
};

export default AlbumSongList;
