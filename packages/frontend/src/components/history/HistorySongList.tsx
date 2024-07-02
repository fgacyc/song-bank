import type { Sequencer, Song, Tag } from "@prisma/client";
import Link from "next/link";
import React from "react";
import { MdHistory } from "react-icons/md";

type SongType = Song & { tags: Tag[]; file_sequencer: Sequencer[] };

interface SearchHistorySongListProps {
  songList: SongType[] | undefined;
  search_content: string;
}

const SearchHistorySongList: React.FC<SearchHistorySongListProps> = ({
  songList,
  search_content,
}) => {
  const filteredSong = songList?.filter((song) => {
    return (
      song.name?.toLowerCase().trim().replace(/ /g, "-") === search_content
    );
  })[0];
  return (
    <>
      {filteredSong && (
        <Link
          href={`/song/${filteredSong
            .name!.toLowerCase()
            .trim()
            .replace(/ /g, "-")}-${filteredSong.id.slice(0, 5)}`}
          className="flex min-h-[82px] items-center gap-5 rounded-md border-2 p-5 hover:bg-[#f8f8f9]"
        >
          <div className="min-w-[30px] sm:min-w-[40px]">
            <MdHistory className="h-full w-full" />
          </div>
          <div className="flex h-full flex-col">
            <div className="text-sm font-semibold sm:text-base">
              {filteredSong.name}
            </div>
            <div className="text-xs text-neutral-500 sm:text-sm">Song</div>
          </div>
        </Link>
      )}
    </>
  );
};

export default SearchHistorySongList;
