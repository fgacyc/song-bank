import Link from "next/link";
import React from "react";
import { type Song } from "@prisma/client";
import { MdAlbum } from "react-icons/md";

interface SearchAlbumListProps {
  showBand: boolean | undefined;
  searchString: string;
  songList: Song[];
  filteredSongList: Song[];
}

const SearchAlbumList: React.FC<SearchAlbumListProps> = ({
  showBand,
  searchString,
  songList,
  filteredSongList,
}) => {
  return (
    <>
      {showBand && (
        <div className="hidden h-fit w-5/12 flex-col gap-3 lg:flex">
          <h1 className="pl-1 text-lg font-semibold">
            Albums from {filteredSongList[0]?.original_band}
          </h1>
          {[
            ...new Set(
              filteredSongList
                .filter((items) => items.album)
                .map((items) => items.album),
            ),
          ].map((album, i) => (
            <Link
              href={`/album/${album?.toLowerCase().trim().replace(/ /g, "-")}`}
              key={i}
              className="flex items-center rounded-lg border-2 p-3 px-5 hover:bg-[#f5f5f6] hover:shadow-md"
            >
              <div className="h-full pe-4">
                <MdAlbum className="h-full w-[36px]" />
              </div>
              <div>
                <h1 className="font-semibold">{album}</h1>
                <p className="text-sm text-slate-500">
                  {
                    songList.filter((items) => {
                      return (
                        items
                          .original_band!.toLowerCase()
                          .replace(/ /g, "")
                          .includes(
                            searchString.toLowerCase().replace(/ /g, ""),
                          ) &&
                        items.album?.toLowerCase().replace(/ /g, "") ===
                          album?.toLowerCase().replace(/ /g, "")
                      );
                    }).length
                  }{" "}
                  songs
                </p>
              </div>
            </Link>
          ))}
        </div>
      )}
    </>
  );
};

export default SearchAlbumList;
