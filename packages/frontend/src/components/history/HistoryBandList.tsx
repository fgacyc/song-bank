import type { SearchHistory, Sequencer, Song, Tag } from "@prisma/client";
import Link from "next/link";
import React from "react";
import { MdHistory } from "react-icons/md";

type SongType = Song & { tags: Tag[]; file_sequencer: Sequencer[] };

interface SearchHistoryBandListProps {
  songList: SongType[] | undefined;
  searchHistory: SearchHistory[];
  search_content: string;
  getYoutubeVideoId: (
    youtubeUrl: string | undefined,
  ) => string | null | undefined;
}

const SearchHistoryBandList: React.FC<SearchHistoryBandListProps> = ({
  songList,
  search_content,
}) => {
  return (
    <>
      {songList
        ?.filter((song) => {
          return (
            song.original_band?.toLowerCase().trim().replace(/ /g, "-") ===
            search_content
          );
        })
        .slice(0, 1)
        .map((song, i) => {
          return (
            <Link
              key={i}
              href={`/band/${song.original_band
                ?.toLowerCase()
                .trim()
                .replace(/ /g, "-")}`}
              className="flex min-h-[82px] items-center gap-5 rounded-md border-2 p-5 hover:bg-[#f8f8f9]"
            >
              <div className="min-w-[30px] sm:min-w-[40px]">
                <MdHistory className="h-full w-full" />
              </div>
              <div className="flex h-full flex-col">
                <div className="text-sm font-semibold sm:text-base">
                  {song.original_band}
                </div>
                <div className="text-xs text-neutral-500 sm:text-sm">Band</div>
              </div>
            </Link>
          );
        })}
    </>
  );
};

export default SearchHistoryBandList;