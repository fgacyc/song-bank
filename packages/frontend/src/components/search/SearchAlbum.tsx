import Link from "next/link";
import React, { useState } from "react";
import { type Song } from "@prisma/client";

interface SearchAlbumProps {
  showAlbum: boolean | undefined;
  filteredSongList: Song[];
}

const SearchAlbum: React.FC<SearchAlbumProps> = ({
  showAlbum,
  filteredSongList,
}) => {
  const [activeList, setActiveList] = useState(false);
  return (
    <>
      {showAlbum && (
        <>
          <Link
            href={`/album/${filteredSongList[0]!.album
              ?.toLowerCase()
              .replace(/ /g, "-")}`}
            className={`${
              activeList ? "bg-[#f5f5f6] shadow-md" : ""
            } sm:white flex gap-5 rounded-lg border-b px-7 py-5 sm:border-2`}
            onMouseEnter={() => {
              setActiveList(true);
            }}
            onMouseLeave={() => {
              setActiveList(false);
            }}
          >
            <div className="flex w-full items-center justify-between ">
              <div>
                <h1 className="text-lg font-semibold md:text-2xl">
                  {filteredSongList[0]?.album}
                </h1>
                <p className="text-xs text-slate-500 md:text-sm">
                  {filteredSongList[0]?.original_band}
                </p>
              </div>
              <p className="text-xs text-slate-500 md:text-sm">
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

export default SearchAlbum;
