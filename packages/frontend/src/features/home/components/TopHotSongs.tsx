import React from "react";
import { HiMiniArrowTrendingUp } from "react-icons/hi2";
import { useHome } from "../hooks/useHome";
import { Badge } from "@/features/shared/ui/Badge";
import Image from "next/image";
import Link from "next/link";
import { CiImageOff } from "react-icons/ci";
import slugify from "slugify";
import type { SongType } from "@/types/types";

const SongListItem = ({ song, index }: { song: SongType; index: number }) => {
  return (
    <Link
      href={`/song/${song.id}/${slugify(song.name!, { lower: true })}`}
      className="group flex gap-4 rounded-lg border border-border bg-bg-tertiary p-4 transition-colors hover:bg-bg-secondary"
    >
      {/* index */}
      <h3 className="flex w-4 px-0.5 pt-2 text-lg font-semibold text-text-secondary sm:w-12 sm:px-2 sm:text-2xl">
        {index + 1}
      </h3>

      {/* image */}
      <div className="h-12 w-12 overflow-hidden rounded-md max-[300px]:hidden min-[301px]:block sm:h-16 sm:w-16">
        <div className="relative h-16 w-16 flex-shrink-0 transition group-hover:scale-105">
          {song.cover_image_url ? (
            <Image src={song.cover_image_url} alt={`${song.name} cover`} fill />
          ) : (
            <div className="flex h-16 w-16 items-center justify-center rounded-lg bg-bg-secondary text-text-secondary">
              <CiImageOff />
            </div>
          )}
        </div>
      </div>

      {/* song info */}
      <div className="min-w-0 flex-1 space-y-1">
        <h3 className="w-fill text-sm font-semibold text-text-primary sm:truncate sm:text-base">
          {song.name}
        </h3>
        <p className="hidden truncate text-sm text-text-secondary sm:block">
          {song.original_band}
        </p>
        {song.album && (
          <p className="hidden truncate text-sm text-text-secondary sm:block">
            {song.album.name}
          </p>
        )}
      </div>

      {/* tag */}
      <div className="flex flex-shrink-0 flex-col items-end gap-2">
        {song.original_key && (
          <Badge
            variant="outline"
            className="rounded-md border-border text-[10px] font-medium sm:text-xs"
          >
            {song.original_key}
          </Badge>
        )}
        {song.song_language && (
          <Badge
            variant="secondary"
            className="rounded-md text-[10px] font-medium sm:text-xs"
          >
            {song.song_language}
          </Badge>
        )}
      </div>
    </Link>
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
    <div className="space-y-4">
      <div className="flex items-center gap-2">
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

export default TopHotSongs;
