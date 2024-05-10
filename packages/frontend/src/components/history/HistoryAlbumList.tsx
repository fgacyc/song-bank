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
              className="flex min-h-[82px] items-center gap-3 rounded-md border-2 p-3 hover:bg-[#f8f8f9]"
            >
              <div className="min-h-[60px] min-w-[60px]">
                <MdAlbum className="h-full w-full" />
              </div>
              <div className="flex h-full flex-col">
                <div className="text-sm font-semibold">{song.album}</div>
                <div className="text-xs text-neutral-500">
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
