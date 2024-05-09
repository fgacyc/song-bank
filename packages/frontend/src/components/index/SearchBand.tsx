import Image from "next/image";
import Link from "next/link";
import React from "react";
import { type Song } from "@prisma/client";

interface SearchBandProps {
  showBand: boolean | undefined;
  searchString: string;
  songList: Song[];
  filteredSongList: Song[];
  channelProfile: string;
}

const SearchBand: React.FC<SearchBandProps> = ({
  showBand,
  searchString,
  songList,
  filteredSongList,
  channelProfile,
}) => {
  return (
    <>
      {showBand && (
        <>
          <Link
            href={`/band/${filteredSongList[0]!
              .original_band!.toLowerCase()
              .replace(/ /g, "-")}`}
            className="flex gap-5 border-b p-5 pl-7 hover:bg-[#f5f5f6] hover:shadow-md sm:rounded-lg sm:border-2"
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
                      songList
                        .filter(
                          (items) =>
                            items
                              .original_band!.toLowerCase()
                              .replace(/ /g, "")
                              .includes(
                                searchString.toLowerCase().replace(/ /g, ""),
                              ) && items.album,
                        )
                        .map((items) => items.album),
                    ),
                  ].length
                }{" "}
                albums
              </p>
              <p className="text-xs text-slate-500 md:text-sm">
                {
                  [
                    ...songList.filter((items) =>
                      items
                        .original_band!.toLowerCase()
                        .replace(/ /g, "")
                        .includes(searchString.toLowerCase().replace(/ /g, "")),
                    ),
                  ].length
                }{" "}
                songs
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
