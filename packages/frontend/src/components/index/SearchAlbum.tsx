import Link from "next/link";
import React from "react";
import { type Song } from "@prisma/client";
import { MdAlbum } from "react-icons/md";

interface SearchAlbumProps {
  showAlbum: boolean | undefined;
  searchString: string;
  songList: Song[];
  filteredSongList: Song[];
}

const SearchAlbum: React.FC<SearchAlbumProps> = ({
  showAlbum,
  searchString,
  songList,
  filteredSongList,
}) => {
  return (
    <>
      {showAlbum && (
        <>
          <Link
            href={`/album/${filteredSongList[0]!.album
              ?.toLowerCase()
              .trim()
              .replace(/ /g, "-")}`}
            className="md:white flex gap-5 rounded-lg border-b px-7 py-5 hover:bg-[#f8f8f9] hover:shadow-md md:border-2"
          >
            <div className="flex w-full items-center justify-between ">
              <div className="item-center flex h-full flex-row justify-center">
                <div className="h-full pe-5">
                  <MdAlbum className="h-full w-[36px]" />
                </div>
                <div>
                  <h1 className="text-lg font-semibold md:text-2xl">
                    {filteredSongList[0]?.album}
                  </h1>
                  <p className="text-xs text-slate-500 md:text-sm">
                    {filteredSongList[0]?.original_band}
                  </p>
                </div>
              </div>
              <p className="text-xs text-slate-500 md:text-sm">
                {
                  [
                    ...songList.filter((items) => {
                      return items.album
                        ?.toLowerCase()
                        .replace(/ /g, "")
                        .includes(searchString.toLowerCase().replace(/ /g, ""));
                    }),
                  ].length
                }{" "}
                songs
              </p>
            </div>
          </Link>
          <hr className="hidden md:block" />
        </>
      )}
    </>
  );
};

export default SearchAlbum;
