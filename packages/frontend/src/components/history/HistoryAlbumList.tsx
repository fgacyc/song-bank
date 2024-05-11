import type { Sequencer, Song, Tag } from "@prisma/client";
import Link from "next/link";
import React from "react";
import { MdAlbum } from "react-icons/md";

type SongType = Song & { tags: Tag[]; file_sequencer: Sequencer[] };

interface SearchHistoryAlbumListProps {
  songList: SongType[] | undefined;
  search_content: string;
}

const SearchHistoryAlbumList: React.FC<SearchHistoryAlbumListProps> = ({
  songList,
  search_content,
}) => {
  return (
    <>
      {songList
        ?.filter((song) => {
          return (
            song.album?.toLowerCase().trim().replace(/ /g, "-") ===
            search_content
          );
        })
        .slice(0, 1)
        .map((song, i) => {
          return (
            <Link
              key={i}
              href={`/album/${song.album
                ?.toLowerCase()
                .trim()
                .replace(/ /g, "-")}`}
              className="flex min-h-[82px] items-center gap-3 rounded-md border-2 p-3 hover:bg-[#f8f8f9] sm:min-h-[102px] md:min-h-[122px] lg:min-h-[142px]"
            >
              <div className="min-w-[60px] sm:min-w-[80px] md:min-w-[100px] lg:min-w-[120px]">
                <MdAlbum className="h-full w-full" />
              </div>
              <div className="flex h-full flex-col">
                <div className="text-sm font-semibold sm:text-base md:text-lg lg:text-2xl">
                  {song.album}
                </div>
                <div className="text-xs text-neutral-500 sm:text-sm md:text-base">
                  {song.original_band}
                </div>
              </div>
            </Link>
          );
        })}
    </>
  );
};

export default SearchHistoryAlbumList;
