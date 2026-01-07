import type { ArtistType } from "@/types/types";
import { Disc3, Music } from "lucide-react";
import Image from "next/image";
import React from "react";
import { CiImageOff } from "react-icons/ci";

interface ArtistHeroProps {
  artist: ArtistType;
}

const ArtistHero = ({ artist }: ArtistHeroProps) => {
  return (
    <div className="relative flex items-center justify-center overflow-hidden px-4 py-12 md:justify-start md:px-12 lg:px-24">
      {/* bg */}
      <div
        className="absolute h-full w-full"
        style={
          artist.image_cover_url
            ? {
                backgroundImage: `url(${artist.image_cover_url})`,
                backgroundSize: "cover",
                backgroundPosition: "center",
                scale: "3",
                filter: "blur(30px)",
                opacity: 0.3,
              }
            : {}
        }
      ></div>

      {/* content */}
      <div className="flex flex-col items-center gap-10 md:flex-row md:items-start">
        {/* img cover */}
        <div className="relative h-56 w-56 flex-shrink-0 overflow-hidden rounded-full border-4 border-bg-primary">
          {artist.image_cover_url ? (
            <Image
              src={artist.image_cover_url}
              alt={artist.name ?? "Untitled"}
              fill
              className="relative object-cover"
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center rounded-full bg-bg-secondary text-text-secondary">
              <CiImageOff />
            </div>
          )}
        </div>

        {/* album details */}
        <div className="flex flex-col items-center justify-center gap-6 text-center md:items-start md:text-start">
          <h1 className="text-[3rem] font-semibold">{artist.name}</h1>
          <p className="text-sm text-text-secondary">{artist.bio}</p>
          <div className="flex gap-4 text-sm">
            <div className="flex items-center justify-center gap-2">
              <Disc3 className="h-4 w-4 text-text-secondary" />
              {artist.album_count}{" "}
              {artist.album_count === 1 ? "Album" : "Albums"}
            </div>
            <div className="flex items-center justify-center gap-2">
              <Music className="h-4 w-4 text-text-secondary" />
              {artist.song_count} {artist.song_count === 1 ? "Song" : "Songs"}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ArtistHero;
