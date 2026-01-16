import { Badge } from "@/features/shared/ui/Badge";
import type { SongType } from "@/types/types";
import type { SearchSong } from "@/features/search/types";
import Image from "next/image";
import Link from "next/link";
import React from "react";
import { CiImageOff } from "react-icons/ci";
import { FiMusic } from "react-icons/fi";
import slugify from "slugify";

interface SongItemProps {
  song: SongType | SearchSong;
  index: number;
  noIndex?: boolean;
  showArtistName?: boolean;
  showAlbumName?: boolean;
}

const SongItem = ({
  song,
  index,
  noIndex = false,
  showArtistName = true,
  showAlbumName = true,
}: SongItemProps) => {
  return (
    <Link
      href={`/song/${song.id}/${slugify(song.name!, { lower: true })}`}
      className="group"
    >
      <div className="flex w-full justify-between rounded p-4 transition-all duration-200 group-hover:bg-bg-quaternary">
        <div className="flex items-center justify-center gap-7">
          {!noIndex && (
            <div className="text-sm font-semibold text-text-secondary">
              {index + 1}
            </div>
          )}
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
            <div className="flex gap-2">
              {showArtistName && song.artist && (
                <div className="text-sm font-medium text-text-secondary">
                  {song.artist.name}
                </div>
              )}

              {showArtistName && showAlbumName && song.artist && song.album && (
                <div className="text-sm font-medium text-text-secondary">
                  &bull;
                </div>
              )}

              {showAlbumName && song.album && (
                <div className="text-sm font-medium text-text-secondary">
                  {song.album.name}
                </div>
              )}
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
          <Badge variant="secondary" className="rounded-md border-border">
            Key: {song.original_key}
          </Badge>
          <FiMusic className="h-4 w-4 opacity-0 transition-all duration-200 group-hover:opacity-100" />
        </div>
      </div>
    </Link>
  );
};

interface SongListProps {
  songs: (SongType | SearchSong)[];
  showArtistName?: boolean;
  showAlbumName?: boolean;
  noIndex?: boolean;
  className?: string;
  containerClassName?: string;
}

const SongList = ({
  songs,
  showArtistName = true,
  showAlbumName = true,
  noIndex = false,
  className = "",
  containerClassName = "",
}: SongListProps) => {
  if (!songs || songs.length === 0) {
    return <div className="text-text-secondary">No songs found</div>;
  }

  return (
    <div
      className={`rounded-lg border border-border bg-bg-tertiary p-8 ${containerClassName}`}
    >
      <div className={className}>
        {songs.map((song, index) => (
          <SongItem
            key={song.id}
            song={song}
            index={index}
            noIndex={noIndex}
            showArtistName={showArtistName}
            showAlbumName={showAlbumName}
          />
        ))}
      </div>
    </div>
  );
};

export default SongList;
