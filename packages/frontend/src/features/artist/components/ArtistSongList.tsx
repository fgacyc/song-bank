import { Badge } from "@/features/shared/ui/Badge";
import type { SongType } from "@/types/types";
import Image from "next/image";
import Link from "next/link";
import React from "react";
import { CiImageOff } from "react-icons/ci";
import { FiMusic } from "react-icons/fi";
import slugify from "slugify";

interface AlbumSongProps {
  song: SongType;
  index: number;
}

const ArtistSong = ({ song, index }: AlbumSongProps) => {
  return (
    <Link
      href={`/song/${song.id}/${slugify(song.name!, { lower: true })}`}
      className="group"
    >
      <div className="flex justify-between rounded p-4 transition-all duration-200 group-hover:bg-bg-quaternary">
        <div className="flex items-center justify-center gap-7">
          <div className="text-sm font-medium text-text-secondary">
            {index + 1}
          </div>
          <div className="relative h-12 w-20 overflow-hidden rounded-md">
            {song.cover_image_url ? (
              <Image
                src={song.cover_image_url}
                alt={song.name ?? "Untitled"}
                fill
                className="relative object-cover"
              />
            ) : (
              <div className="flex h-full w-full items-center justify-center rounded-md bg-bg-secondary">
                <CiImageOff className="text-sm text-text-secondary" />
              </div>
            )}
          </div>
          <div className="flex flex-col gap-1">
            <div className="text-sm text-text-primary">{song.name}</div>
            <div className="text-sm font-medium text-text-secondary">
              {song.album.name}
            </div>
            <div className="space-x-1">
              {song.song_language && (
                <Badge variant="outline" className="rounded-md border-border">
                  {song.song_language}
                </Badge>
              )}
              {song.tags?.map((tag) => {
                return (
                  <Badge
                    key={tag.id}
                    variant="outline"
                    className="rounded-md border-border"
                  >
                    {tag.content}
                  </Badge>
                );
              })}
            </div>
          </div>
        </div>
        <div className="flex items-center justify-center gap-4 text-text-secondary">
          <div className="text-sm font-medium">Key: {song.original_key}</div>
          <FiMusic className="h-4 w-4 opacity-0 transition-all duration-200 group-hover:opacity-100" />
        </div>
      </div>
    </Link>
  );
};

interface ArtistSongListProps {
  songs: SongType[];
}

const ArtistSongList = ({ songs }: ArtistSongListProps) => {
  if (!songs || songs.length === 0) {
    return <div>No songs found</div>;
  }

  return (
    <div className="flex w-full flex-col rounded-xl border border-border bg-bg-tertiary p-6">
      {songs.map((song) => {
        return (
          <ArtistSong key={song.id} song={song} index={songs.indexOf(song)} />
        );
      })}
    </div>
  );
};

export default ArtistSongList;
