import type { Song } from "@prisma/client";
import React from "react";
import SongBreadcrumb from "./SongBreadcrumb";
import SongHero from "./SongHero";
import SongTransposition from "./SongTransposition";
import SongLyrics from "./SongLyrics";

interface SongPageProps {
  song?: Song | null;
}

const SongPage = ({ song }: SongPageProps) => {
  // TODO: UI for song not found
  if (!song) return <div>Song not found</div>;

  return (
    <div className="space-y-12 pt-6">
      <SongBreadcrumb song={song} />
      <SongHero song={song} />
      <SongTransposition />
      <SongLyrics lyrics={song.chord_lyrics} />
    </div>
  );
};

export default SongPage;
