import React from "react";
import type { AlbumTypeWithSongs, SongType } from "../types/types";
import Image from "next/image";
import { CiImageOff } from "react-icons/ci";
import { Badge } from "@/features/shared/ui/Badge";
import Link from "next/link";
import slugify from "slugify";

interface AlbumSongProps {
  song: SongType;
  index: number;
}

const AlbumSong = ({ song, index }: AlbumSongProps) => {
  // TODO: add hover effect
  return (
    <Link
      href={`/song/${song.id}/${slugify(song.name!, { lower: true })}`}
      className="group flex justify-between p-4 group-hover:bg-bg-quaternary"
    >
      <div className="flex gap-7">
        <div className="text-sm font-semibold text-text-secondary">
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
            <div className="flex h-60 w-60 items-center justify-center rounded-lg bg-bg-secondary text-text-secondary">
              <CiImageOff />
            </div>
          )}
        </div>
        <div>
          <div className="text-text-primary">{song.name}</div>
          <div className="space-x-1">
            <Badge variant="outline" className="rounded-md border-border">
              {song.song_language}
            </Badge>
            {song.tags.map((tag) => {
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
      <div className="text-sm font-semibold text-text-secondary">
        Key: {song.original_key}
      </div>
    </Link>
  );
};

interface AlbumSongListProps {
  album: AlbumTypeWithSongs;
}

const AlbumSongList = ({ album }: AlbumSongListProps) => {
  return (
    <div className="flex items-center justify-center px-4 pb-12">
      <div className="w-full rounded-lg border border-border p-8 md:max-w-[60dvw]">
        {album.Song.map((song, index) => (
          <AlbumSong key={song.id} song={song} index={index} />
        ))}
      </div>
    </div>
  );
};

export default AlbumSongList;
