import React from "react";
import Link from "next/link";
import type { SearchArtist } from "../types";
import { Disc3, Music, UserIcon } from "lucide-react";
import slugify from "slugify";
import Polaroid from "@/features/shared/ui/Polaroid";

interface SearchArtistsProps {
  artists: SearchArtist[];
  selected: string;
}

const SearchArtists = ({ artists, selected }: SearchArtistsProps) => {
  if (artists.length === 0) return null;

  return (
    <section className="space-y-4">
      {selected.startsWith("All") && (
        <div className="flex items-center gap-2">
          <UserIcon className="h-5 w-5" />
          <h2 className="text-xl font-semibold text-text-primary">Artists</h2>
        </div>
      )}
      <div
        className={`${selected.startsWith("All") ? "flex gap-x-6" : "grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4"}  overflow-y-scroll`}
      >
        {artists.map((artist) => {
          return (
            <Link
              key={artist.id}
              href={`/artist/${artist.id}/${slugify(artist.name, { lower: true })}`}
            >
              <Polaroid
                imageSrc={artist.image_cover_url ?? ""}
                imageAlt={artist.name}
                width={300}
                fill={!selected.startsWith("All")}
                height={400}
                imgRatio={0.6}
              >
                <div className="flex h-full w-full flex-col items-center justify-center p-6 text-start">
                  <div className="w-3/4 space-y-2">
                    <h3 className="truncate text-text-primary">
                      {artist.name}
                    </h3>
                    {/* <p className="text-wrap text-sm text-text-secondary">
                      {artist.bio ?? "lorem ipsum dolor sit amet"}
                    </p> */}

                    <div className="flex flex-col items-start justify-center gap-2">
                      {artist.album_count && (
                        <div className="flex items-center justify-center gap-2 text-xs">
                          <Disc3 className="h-4 w-4 text-text-secondary" />
                          {artist.album_count}{" "}
                          {artist.album_count === 1 ? "Album" : "Albums"}
                        </div>
                      )}
                      {artist.song_count > 0 && (
                        <div className="flex items-center justify-center gap-2 text-xs">
                          <Music className="h-4 w-4 text-text-secondary" />
                          {artist.song_count}{" "}
                          {artist.song_count === 1 ? "Song" : "Songs"}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </Polaroid>
            </Link>
          );
        })}
      </div>
    </section>
  );
};

export default SearchArtists;
