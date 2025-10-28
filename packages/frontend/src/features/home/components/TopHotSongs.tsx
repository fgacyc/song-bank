import React from "react";
import { HiMiniArrowTrendingUp } from "react-icons/hi2";
import { useHome } from "../hooks/useHome";
import type { Song } from "@prisma/client";
import { Badge } from "@/features/shared/ui/Badge";
import Image from "next/image";

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
      <div className="flex items-center gap-2 pb-4">
        <h2>Top 20 Hot Songs</h2>
        <HiMiniArrowTrendingUp className="text-xl" />
      </div>
      <div className="grid gap-4 md:grid-cols-2">
        {topHotSongs.data?.map((song, index) => {
          return <SongListItem key={song.id} song={song} index={index} />;
        })}
      </div>
    </div>
  );
};

const SongListItem = ({ song, index }: { song: Song; index: number }) => {
  return (
    <div className="group flex gap-4 rounded-lg border border-border bg-bg-tertiary p-4 transition-colors hover:bg-bg-secondary">
      {/* index */}
      <h3 className="flex px-4 pt-2 text-2xl font-semibold text-text-secondary">
        {index + 1}
      </h3>

      {/* image */}
      <div className="h-16 w-16 overflow-hidden rounded-md">
        <div className="relative h-16 w-16 flex-shrink-0 transition group-hover:scale-105">
          <Image
            src={song.cover_image_url ?? "/carousel-3.jpg"}
            alt={`${song.name} cover`}
            fill
            className="object-cover"
          />
        </div>
      </div>

      {/* song info */}
      <div className="min-w-0 flex-1 space-y-1">
        <h3 className="truncate text-base font-semibold text-text-primary">
          {song.name}
        </h3>
        <p className="truncate text-sm text-text-secondary">
          {song.original_band}
        </p>
        {song.album && (
          <p className="truncate text-sm text-text-secondary">{song.album}</p>
        )}
      </div>

      {/* tag */}
      <div className="flex flex-shrink-0 flex-col items-end gap-2">
        {song.original_key && (
          <Badge
            variant="outline"
            className="rounded-md border-border text-xs font-medium"
          >
            {song.original_key}
          </Badge>
        )}
        {song.song_language && (
          <Badge variant="secondary" className="rounded-md text-xs font-medium">
            {song.song_language}
          </Badge>
        )}
      </div>
    </div>
  );
};

export default TopHotSongs;
