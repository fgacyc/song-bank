import type { Sequencer, Song, Tag } from "@prisma/client";
import Link from "next/link";
import React from "react";
import { MdHistory } from "react-icons/md";

type SongType = Song & { tags: Tag[]; file_sequencer: Sequencer[] };

interface SearchHistoryAlbumListProps {
  songList: SongType[] | undefined;
  search_content: string;
}

const SearchHistoryAlbumList: React.FC<SearchHistoryAlbumListProps> = ({
  songList,
  search_content,
}) => {
  const filteredAlbum = (songList?.filter((song) => {
    return (
      song.album?.toLowerCase().trim().replace(/ /g, "-") === search_content
    );
  }) ?? [])[0];
  return (
    <>
      {filteredAlbum && (
        <Link
          href={`/album/${filteredAlbum.album
            ?.toLowerCase()
            .trim()
            .replace(
              / /g,
              "-",
            )}?band=${filteredAlbum.original_band?.toLowerCase().trim().replace(/ /g, "-")}`}
          className="flex min-h-[82px] items-center gap-3 rounded-md border-2 p-3 hover:bg-[#f8f8f9]"
        >
          <div className="min-w-[30px] md:min-w-[40px]">
            <MdHistory className="h-full w-full" />
          </div>
          <div className="flex h-full flex-col">
            <div className="text-sm font-semibold md:text-base">
              {filteredAlbum.album}
            </div>
            <div className="text-xs text-neutral-500 md:text-sm">Album</div>
          </div>
        </Link>
      )}
    </>
  );
};

export default SearchHistoryAlbumList;
