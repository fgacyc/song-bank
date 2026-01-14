import React from "react";
import Link from "next/link";
import Image from "next/image";
import type { SearchArtist } from "../types";
import { UserIcon } from "lucide-react";

interface SearchArtistsProps {
  artists: SearchArtist[];
}

const SearchArtists = ({ artists }: SearchArtistsProps) => {
  if (artists.length === 0) return null;

  return (
    <section className="space-y-4">
      <div className="flex items-center gap-2">
        <UserIcon className="h-5 w-5" />
        <h2 className="text-xl font-semibold text-text-primary">Artists</h2>
      </div>
      {/* <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {artists.map((artist) => (
          <Link
            key={artist.id}
            href={`/artist/${artist.id}`}
            className="hover:border-border-hover group rounded-lg border border-border bg-bg-secondary p-4 transition-all hover:shadow-md"
          >
            <div className="flex items-start gap-4">
              {artist.image_cover_url && (
                <Image
                  src={artist.image_cover_url}
                  alt={artist.name}
                  width={80}
                  height={80}
                  className="h-20 w-20 rounded-full object-cover"
                />
              )}
              <div className="flex-1 space-y-1">
                <h3 className="font-medium text-text-primary group-hover:text-primary">
                  {artist.name}
                </h3>
                {artist.bio && (
                  <p className="line-clamp-2 text-sm text-text-secondary">
                    {artist.bio}
                  </p>
                )}
                {artist._count && (
                  <div className="text-text-tertiary text-xs">
                    {artist._count.Song} songs • {artist._count.Album} albums
                  </div>
                )}
              </div>
            </div>
          </Link>
        ))}
      </div> */}
    </section>
  );
};

export default SearchArtists;
