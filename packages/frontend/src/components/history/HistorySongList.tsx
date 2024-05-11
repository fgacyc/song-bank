import type { Sequencer, Song, Tag } from "@prisma/client";
import Image from "next/image";
import Link from "next/link";
import React from "react";

type SongType = Song & { tags: Tag[]; file_sequencer: Sequencer[] };

interface SearchHistorySongListProps {
  songList: SongType[] | undefined;
  search_content: string;
  getYoutubeVideoId: (
    youtubeUrl: string | undefined,
  ) => string | null | undefined;
}

const SearchHistorySongList: React.FC<SearchHistorySongListProps> = ({
  songList,
  search_content,
  getYoutubeVideoId,
}) => {
  return (
    <>
      {songList
        ?.filter((song) => {
          return (
            song.name?.toLowerCase().trim().replace(/ /g, "-") ===
            search_content
          );
        })
        .slice(0, 1)
        .map((song, i) => {
          const originalYoutubeUrl = song.original_youtube_url ?? "";
          const youtubeVideoId = getYoutubeVideoId(originalYoutubeUrl);
          const thumbnailUrl = `https://i.ytimg.com/vi/${youtubeVideoId}/hqdefault.jpg`;
          return (
            <Link
              key={i}
              href={`/song/${song
                .name!.toLowerCase()
                .trim()
                .replace(/ /g, "-")}`}
              className="flex gap-3 rounded-md border-2 p-3 hover:bg-[#f8f8f9]"
            >
              <div className="relative min-h-[70px] min-w-[130px] overflow-hidden rounded-md sm:min-h-[90px] sm:min-w-[170px] md:min-h-[110px] md:min-w-[195px] lg:min-h-[130px] lg:min-w-[230px]">
                <Image
                  src={thumbnailUrl}
                  alt={song.name!}
                  fill={true}
                  priority={true}
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  className="object-cover"
                />
              </div>
              <div className="flex flex-col">
                <p className="text-sm font-semibold sm:text-base md:text-lg lg:text-2xl">
                  {song.name}
                </p>
                <p className="text-xs text-neutral-500 sm:text-sm md:text-base">
                  {song.original_band}
                </p>
              </div>
            </Link>
          );
        })}
    </>
  );
};

export default SearchHistorySongList;
