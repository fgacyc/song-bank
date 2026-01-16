import SongList from "@/features/shared/ui/SongList";
import type { SongType } from "@/types/types";
import React from "react";

interface ArtistSongListProps {
  songs: SongType[];
}

const ArtistSongList = ({ songs }: ArtistSongListProps) => {
  if (!songs || songs.length === 0) {
    return <div>No songs found</div>;
  }

  return <SongList songs={songs} showArtistName={false} />;
};

export default ArtistSongList;
