import { Badge } from "@/features/shared/ui/Badge";
import IconButton from "@/features/shared/ui/IconButton";
import type { SongType } from "@/types/types";
import { Heart, Share2 } from "lucide-react";
import Image from "next/image";
import React from "react";
import { CiImageOff } from "react-icons/ci";

interface SongHeroProps {
  song: SongType;
}

const SongHero = ({ song }: SongHeroProps) => {
  return (
    <>
      <div className="relative flex items-center justify-center overflow-hidden py-12">
        {/* bg */}
        <div
          className="absolute h-full w-full"
          style={
            song.cover_image_url
              ? {
                  backgroundImage: `url(${song.cover_image_url})`,
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
        <div className="flex w-[80dvw] flex-col items-center justify-center gap-8 text-center sm:max-w-[80dvw] lg:max-w-[60dvw] lg:flex-row lg:items-start lg:justify-start lg:text-start">
          {/* img cover */}
          <div className="relative h-60 w-60 flex-shrink-0 overflow-hidden rounded-lg lg:mb-0 lg:h-40 lg:w-80">
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
          {/* song details */}
          <div className="space-y-3">
            {/* song title */}
            <h1 className="text-[3rem] font-semibold text-text-primary">
              {song.name}
            </h1>

            {/* song artist */}
            {song.original_band && (
              <h3 className="text-text-secondary">{song.original_band}</h3>
            )}

            {/* song album */}
            {song.album.name && (
              <p className="text-sm font-light text-text-secondary">
                {song.album.name}
              </p>
            )}

            <div className="space-y-2 py-4">
              {/* tags */}
              <div className="flex flex-wrap justify-center gap-2 lg:justify-start">
                <Badge
                  variant="outline"
                  className="rounded-md border-border px-2 text-text-primary"
                >
                  {song.song_language}
                </Badge>
                {song.tags && (
                  <>
                    {song.tags.map((tag) => (
                      <Badge
                        key={tag.id}
                        variant="outline"
                        className="rounded-md border-border px-2 text-text-primary"
                      >
                        {tag.content}
                      </Badge>
                    ))}
                  </>
                )}
              </div>

              {/* key signatures */}
              <div className="flex justify-center gap-2 lg:justify-start">
                {/* TODO: fix tag bg styling */}
                {song.original_key && (
                  <Badge
                    variant="default"
                    className="rounded-md border-border bg-bg-primary px-2 text-text-primary"
                  >
                    Original Key: {song.original_key}
                  </Badge>
                )}

                {/* TODO: create transposition functions */}
                {false && (
                  <Badge
                    variant="default"
                    className="rounded-md border-border bg-bg-primary px-2 text-text-primary"
                  >
                    Current Key: {song.original_key}
                  </Badge>
                )}
              </div>
            </div>

            {/* buttons */}
            <div className="flex justify-center gap-3 lg:justify-start">
              {/* TODO: fix btn bg styling & create functions for them*/}
              <IconButton
                icon={<Heart className="h-4 w-4" />}
                text="Favourite"
                size="sm"
                className="!gap-3 rounded-md border border-border bg-bg-primary text-text-primary"
                onClick={() => {
                  null;
                }}
              />

              <IconButton
                icon={<Share2 className="h-4 w-4" />}
                text="Share"
                size="sm"
                className="!gap-3 rounded-md border border-border bg-bg-primary text-text-primary"
                onClick={() => {
                  null;
                }}
              />
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default SongHero;
