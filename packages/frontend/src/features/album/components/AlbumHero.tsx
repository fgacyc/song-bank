import { Calendar } from "lucide-react";
import Image from "next/image";
import React from "react";
import { CiImageOff } from "react-icons/ci";
import { FiMusic } from "react-icons/fi";
import type { AlbumTypeWithSongs } from "../types/types";

interface AlbumHeroProps {
  album: AlbumTypeWithSongs;
}

const AlbumHero = ({ album }: AlbumHeroProps) => {
  return (
    <div className="relative flex items-center justify-center overflow-hidden px-4 py-12 md:justify-start md:px-12 lg:px-24">
      {/* bg */}
      <div
        className="absolute h-full w-full"
        style={
          album.image_cover_url
            ? {
                backgroundImage: `url(${album.image_cover_url})`,
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
        <div className="relative h-60 w-60 flex-shrink-0 overflow-hidden rounded-lg">
          {album.image_cover_url ? (
            <Image
              src={album.image_cover_url}
              alt={album.name ?? "Untitled"}
              fill
              className="relative object-cover"
            />
          ) : (
            <div className="flex h-60 w-60 items-center justify-center rounded-lg bg-bg-secondary text-text-secondary">
              <CiImageOff />
            </div>
          )}
        </div>

        {/* album details */}
        <div className="flex flex-col items-center justify-center gap-3 text-center md:items-start md:text-start">
          <p className="text-text-secondary">Album</p>
          <h1 className="font-semibold text-text-primary">{album.name}</h1>
          <h3 className="text-2xl text-text-secondary">{album.artist.name}</h3>
          <div className="flex items-center justify-start gap-8">
            {/* released date */}
            <div className="flex items-center justify-center gap-2 text-text-secondary">
              <Calendar className="h-4 w-4" />
              <p className="text-sm">
                {new Date(album.release_date).toLocaleDateString("en-US", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </p>
            </div>

            {/* number of songs */}
            <div className="flex items-center justify-center gap-2 text-text-secondary">
              <FiMusic className="h-4 w-4" />
              <p className="text-sm">{album.song_count ?? 0} </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AlbumHero;
