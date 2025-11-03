import type { Song, Tag } from "@prisma/client";
import React from "react";
import SongBreadcrumb from "./SongBreadcrumb";
import SongHero from "./SongHero";
import SongTransposition from "./SongTransposition";
import SongLyrics from "./SongLyrics";
import SongYouTubeLink from "./SongYouTubeLink";

interface SongPageProps {
  song?: (Song & { tags: Tag[] }) | null;
}

const SongPage = ({ song }: SongPageProps) => {
  // TODO: UI for song not found
  if (!song) return <div>Song not found</div>;

  return (
    <div className="space-y-2 pt-6">
      <SongBreadcrumb song={song} />
      <div className="space-y-8 pb-20">
        <SongHero song={song} />
        <SongTransposition />
        <SongLyrics lyrics={song.chord_lyrics} />
        <SongYouTubeLink url={song.original_youtube_url} title={song.name} />
      </div>
    </div>
  );
};

export default SongPage;
