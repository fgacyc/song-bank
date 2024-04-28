import Image from "next/image";
import Link from "next/link";
import React, { useState } from "react";
import { type Song } from "@prisma/client";

interface SearchBandProps {
  showBand: boolean | undefined;
  filteredSongList: Song[];
  channelProfile: string;
}

const SearchBand: React.FC<SearchBandProps> = ({
  showBand,
  filteredSongList,
  channelProfile,
}) => {
  const [activeList, setActiveList] = useState(-1);
  return (
    <>
      {showBand && (
        <>
          <Link
            href={`/band/${filteredSongList[0]!
              .original_band!.toLowerCase()
              .replace(/ /g, "-")}`}
            className={`${
              activeList === -2 ? "bg-[#f5f5f6] shadow-md" : ""
            } flex gap-5 border-b p-5 pl-7 sm:rounded sm:border-2`}
            onMouseEnter={() => {
              setActiveList(-2);
            }}
            onMouseLeave={() => {
              setActiveList(-1);
            }}
          >
            <div className="relative h-[70px] w-[70px] overflow-hidden rounded-full md:h-[100px] md:w-[100px]">
              <Image
                src={channelProfile}
                alt={
                  filteredSongList[0]?.original_band
                    ? filteredSongList[0].original_band
                    : "band"
                }
                fill={true}
                priority={true}
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                className="object-cover"
              />
            </div>
            <div className="flex flex-col justify-center">
              <h1 className="text-lg font-semibold md:text-2xl">
                {filteredSongList[0]?.original_band}
              </h1>
              <p className="text-xs text-slate-500 md:text-sm">
                {
                  [
                    ...new Set(
                      filteredSongList
                        .filter((items) => items.album)
                        .map((items) => items.album),
                    ),
                  ].length
                }{" "}
                albums
              </p>
              <p className="text-sm text-slate-500">
                {filteredSongList.length} songs
              </p>
            </div>
          </Link>
          <hr className="hidden sm:block" />
        </>
      )}
    </>
  );
};

export default SearchBand;
