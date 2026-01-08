import type { SongType } from "@/types/types";
import React from "react";

interface ArtistSongsProps {
  songs: SongType[];
}

const ArtistSongs = ({ songs }: ArtistSongsProps) => {
  if (!songs || songs.length === 0) {
    return <div>No songs found</div>;
  }

  return (
    <div>
      {songs.map((song) => {
        return <div key={song.id}>{song.name}</div>;
      })}
    </div>
  );
};

export default ArtistSongs;
