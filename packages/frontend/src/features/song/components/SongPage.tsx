import type { Song } from "@prisma/client";
import React from "react";

interface SongPageProps {
  song?: Song | null;
}

const SongPage = ({ song }: SongPageProps) => {
  if (!song) return <div>Song not found</div>;

  return (
    <div>
      <h1>{song.name}</h1>
      <p>{song.original_band}</p>
      <p>{song.chord_lyrics}</p>
    </div>
  );
};

export default SongPage;
