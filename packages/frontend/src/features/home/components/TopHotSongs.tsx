import React from "react";
import { HiMiniArrowTrendingUp } from "react-icons/hi2";
import { useHome } from "../hooks/useHome";
import type { Song } from "@prisma/client";

const SongListItem = ({ song, index }: { song: Song; index: number }) => {
  return (
    <div className="flex justify-between border-b border-border py-2">
      <div className="flex items-center gap-4">
        <span className="w-6 text-right text-text-secondary">{index + 1}</span>
        <div>
          <p className="text-text-primary">{song.name}</p>
        </div>
      </div>
    </div>
  );
};

const TopHotSongs = () => {
  const { topHotSongs, isLoading, error } = useHome();

  // TODO: loading and error ui
  if (isLoading) {
    return <div>loading</div>;
  }

  if (error) {
    return <div>error</div>;
  }

  return (
    <div>
      <div className="flex items-center gap-2">
        <h2>Top 20 Hot Songs</h2>
        <HiMiniArrowTrendingUp className="text-xl" />
      </div>
      <div>
        {topHotSongs.data?.map((song, index) => {
          return <SongListItem key={song.id} song={song} index={index} />;
        })}
      </div>
    </div>
  );
};

export default TopHotSongs;
