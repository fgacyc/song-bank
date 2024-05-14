import React from "react";
import { type Song } from "@prisma/client";
import Link from "next/link";

interface SongDetailsProps {
  embedUrl: string;
  items: Song;
}

const SongDetails: React.FC<SongDetailsProps> = ({ embedUrl, items }) => {
  return (
    <div className="flex h-fit flex-col rounded-lg border-2 p-5">
      <div className="h-[150px] w-full md:w-[200px] lg:h-[150px] lg:w-[300px]">
        <iframe
          src={embedUrl}
          allowFullScreen
          className="me-5 h-full w-full rounded md:me-0"
        ></iframe>
      </div>
      <div>
        <div className="flex flex-col gap-2 py-3">
          <p className="flex flex-col truncate">
            <span className="font-semibold">Song Name</span>
            <span className="text-sm text-neutral-500">
              {items.name}{" "}
              {items.alt_name &&
                items.alt_name.trim() !== "-" &&
                items.alt_name}
            </span>
          </p>
          {items.album && (
            <p className="flex flex-col truncate">
              <span className="font-semibold">Album</span>
              <Link
                href={`/album/${items.album.toLowerCase().replace(/ /g, "-")}`}
                className="w-fit text-sm text-neutral-500 underline md:no-underline md:hover:underline"
              >
                {items.album}
              </Link>
            </p>
          )}
          <p className="flex flex-col truncate">
            <span className="font-semibold">Band</span>
            <Link
              href={`/band/${items
                .original_band!.toLowerCase()
                .replace(/ /g, "-")}`}
              className="w-fit text-sm text-neutral-500 underline md:no-underline md:hover:underline"
            >
              {items.original_band}
            </Link>
          </p>
        </div>
        <hr />
        <div className="flex flex-col gap-2 py-3">
          <p className="flex flex-col truncate">
            <span className="font-semibold">Original Key</span>
            <span className="text-sm text-neutral-500">
              {items.original_key}
            </span>
          </p>
        </div>
      </div>
      {/* TODO: tags */}
    </div>
  );
};

export default SongDetails;
