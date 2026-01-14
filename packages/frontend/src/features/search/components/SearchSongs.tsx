import React from "react";
import Link from "next/link";
import Image from "next/image";
import type { SearchSong } from "../types";
import { Music } from "lucide-react";

interface SearchSongsProps {
  songs: SearchSong[];
}

const SearchSongs = ({ songs }: SearchSongsProps) => {
  if (songs.length === 0) return null;

  return (
    <section className="space-y-4">
      <div className="flex items-center gap-2">
        <Music className="h-5 w-5" />
        <h2 className="text-xl font-semibold text-text-primary">Songs</h2>
      </div>
      {/* <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {songs.map((song) => (
          <Link
            key={song.id}
            href={`/song/${song.id}`}
            className="hover:border-border-hover group rounded-lg border border-border bg-bg-secondary p-4 transition-all hover:shadow-md"
          >
            <div className="flex items-start gap-4">
              {song.cover_image_url && (
                <Image
                  src={song.cover_image_url}
                  alt={song.name ?? "Song cover"}
                  width={64}
                  height={64}
                  className="h-16 w-16 rounded object-cover"
                />
              )}
              <div className="flex-1 space-y-1">
                <h3 className="font-medium text-text-primary group-hover:text-primary">
                  {song.name ?? "Untitled"}
                </h3>
                {song.alt_name && (
                  <p className="text-sm text-text-secondary">{song.alt_name}</p>
                )}
                {song.artist && (
                  <p className="text-sm text-text-secondary">
                    {song.artist.name}
                  </p>
                )}
                <div className="text-text-tertiary flex flex-wrap gap-2 text-xs">
                  {song.original_key && (
                    <span className="rounded bg-bg-primary px-2 py-0.5">
                      Key: {song.original_key}
                    </span>
                  )}
                  {song.song_language && (
                    <span className="rounded bg-bg-primary px-2 py-0.5">
                      {song.song_language}
                    </span>
                  )}
                </div>
              </div>
            </div>
          </Link>
        ))}
      </div> */}
    </section>
  );
};

export default SearchSongs;
