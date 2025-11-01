import type { Song } from "@prisma/client";
import Image from "next/image";
import React from "react";
import { CiImageOff } from "react-icons/ci";

interface SongHeroProps {
  song: Song;
}

const SongHero = ({ song }: SongHeroProps) => {
  return (
    <>
      <div className="flex flex-col lg:flex-row">
        <div className="relative mb-6 h-32 w-32 flex-shrink-0 overflow-hidden rounded-md lg:mb-0 lg:mr-6 lg:h-48 lg:w-48">
          {song.cover_image_url ? (
            <Image
              src={song.cover_image_url}
              alt={song.name ?? "unknown"}
              fill
              className="relative "
            />
          ) : (
            <div className="flex h-16 w-16 items-center justify-center rounded-lg bg-bg-secondary text-text-secondary">
              <CiImageOff />
            </div>
          )}
        </div>
        <div className="space-y-3">
          <h1 className="text-[3rem] font-semibold text-text-primary">
            {song.name}
          </h1>
          {song.original_band && (
            <h3 className="text-text-secondary">{song.original_band}</h3>
          )}
          {song.album && (
            <p className="text-sm font-light text-text-secondary">
              {song.album}
            </p>
          )}
        </div>
      </div>
    </>
  );
};

export default SongHero;
